"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import BarberSidebar from "@/components/barber/BarberSidebar";
import { BarberAuthProvider, useBarberAuth } from "@/lib/barber-auth";
import { api } from "@/lib/api";

// Types
interface Transaction {
  id: number;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  bookingStatus: string;
  customerName: string;
  customerImage?: string;
  services: string;
  date: string;
  time: string;
  createdAt: string;
}

interface PaymentSummary {
  availableBalance: number;
  pendingClearance: number;
  thisMonth: number;
  monthChange: number;
}

function PaymentsContent() {
  const [filter, setFilter] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<PaymentSummary>({
    availableBalance: 0,
    pendingClearance: 0,
    thisMonth: 0,
    monthChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [updatingPayment, setUpdatingPayment] = useState<number | null>(null);
  const { loading: authLoading, isAuthenticated } = useBarberAuth();
  const router = useRouter();

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getBarberPayments({ status: filter !== 'all' ? filter : undefined }) as {
        transactions: Transaction[];
        summary: PaymentSummary;
        error?: string;
      };

      if (!('error' in result) || !result.error) {
        setTransactions(result.transactions || []);
        setSummary(result.summary || {
          availableBalance: 0,
          pendingClearance: 0,
          thisMonth: 0,
          monthChange: 0
        });
      }
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login-barber");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPayments();
    }
  }, [isAuthenticated, fetchPayments]);

  const handleMarkAsPaid = async (bookingId: number) => {
    try {
      setUpdatingPayment(bookingId);
      await api.updatePaymentStatus(bookingId, { paymentStatus: 'paid' });
      fetchPayments();
    } catch (err) {
      console.error("Failed to update payment:", err);
    } finally {
      setUpdatingPayment(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <BarberSidebar />
      <main className="ml-72 flex-1 min-h-screen flex flex-col">
        <header className="h-20 px-10 flex justify-between items-center bg-[#1C1B1B]/60 backdrop-blur-xl z-40 sticky top-0">
          <div className="flex items-center gap-8">
            <h2 className="font-headline font-black text-2xl tracking-tight text-white">Revenue Hub</h2>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-headline font-bold rounded-xl active:scale-95 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </header>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto bg-[#0E0E0E]">
          {/* Balance Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#E5C487]/20 to-[#1C1B1B] rounded-3xl p-6 border border-[#E5C487]/20">
              <p className="text-xs text-[#E5C487] uppercase tracking-widest mb-2">Collected Revenue</p>
              <p className="text-4xl font-headline font-black text-white">
                {loading ? '...' : formatCurrency(summary.availableBalance)}
              </p>
              <p className="text-xs text-[#4D463A] mt-4">From paid bookings</p>
            </div>
            <div className="bg-[#1C1B1B] rounded-3xl p-6 border border-[#4D463A]/10">
              <p className="text-xs text-[#4D463A] uppercase tracking-widest mb-2">Pending Payments</p>
              <p className="text-4xl font-headline font-black text-yellow-400">
                {loading ? '...' : formatCurrency(summary.pendingClearance)}
              </p>
              <p className="text-xs text-[#4D463A] mt-4">Awaiting collection</p>
            </div>
            <div className="bg-[#1C1B1B] rounded-3xl p-6 border border-[#4D463A]/10">
              <p className="text-xs text-[#4D463A] uppercase tracking-widest mb-2">This Month</p>
              <p className="text-4xl font-headline font-black text-green-400">
                {loading ? '...' : formatCurrency(summary.thisMonth)}
              </p>
              {summary.monthChange !== 0 && (
                <p className={`text-xs mt-4 flex items-center ${summary.monthChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <span className="material-symbols-outlined text-sm mr-1">
                    {summary.monthChange > 0 ? 'trending_up' : 'trending_down'}
                  </span>
                  {summary.monthChange > 0 ? '+' : ''}{summary.monthChange}% vs last month
                </p>
              )}
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-[#1C1B1B] rounded-3xl p-6 border border-[#4D463A]/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline font-black text-lg text-white">Transaction History</h3>
              <div className="flex gap-2">
                {["all", "paid", "pending", "refunded"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                      filter === f
                        ? "bg-[#E5C487] text-[#402d00] font-bold"
                        : "text-[#4D463A] hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-[#4D463A] mb-3">receipt_long</span>
                <p className="text-[#4D463A]">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-[#353534]/30 rounded-xl hover:bg-[#353534]/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#4D463A]/30 flex items-center justify-center">
                        {tx.customerImage ? (
                          <img src={tx.customerImage} alt={tx.customerName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-[#E5C487]">
                            {tx.customerName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{tx.customerName}</p>
                        <p className="text-xs text-[#4D463A]">{tx.services}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className={`material-symbols-outlined text-lg ${
                          tx.paymentMethod === 'cash' ? 'text-green-400' : 'text-blue-400'
                        }`}>
                          {tx.paymentMethod === 'cash' ? 'payments' : 'credit_card'}
                        </span>
                        <p className="text-[10px] text-[#4D463A] uppercase">{tx.paymentMethod || 'card'}</p>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className={`text-lg font-headline font-black ${
                          tx.paymentStatus === 'refunded' ? 'text-red-400' : 'text-[#E5C487]'
                        }`}>
                          {tx.paymentStatus === 'refunded' ? '-' : '+'}${tx.amount.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-[#4D463A]">{formatDate(tx.date)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold ${
                          tx.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-400' :
                          tx.paymentStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {tx.paymentStatus}
                        </span>
                        {tx.paymentStatus === 'pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(tx.id)}
                            disabled={updatingPayment === tx.id}
                            className="px-3 py-1 bg-[#E5C487]/10 text-[#E5C487] rounded-full text-[10px] uppercase font-bold hover:bg-[#E5C487]/20 transition-all disabled:opacity-50"
                          >
                            {updatingPayment === tx.id ? '...' : 'Mark Paid'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Methods Info */}
          <div className="bg-[#1C1B1B] rounded-3xl p-6 border border-[#4D463A]/10">
            <h3 className="font-headline font-black text-lg text-white mb-6">Payment Collection</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-[#353534]/30 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-green-400 text-2xl">payments</span>
                  <div>
                    <p className="text-sm font-bold text-white">Cash Payments</p>
                    <p className="text-xs text-[#4D463A]">Mark as paid after collection</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-[#353534]/30 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-blue-400 text-2xl">credit_card</span>
                  <div>
                    <p className="text-sm font-bold text-white">Card Payments</p>
                    <p className="text-xs text-[#4D463A]">Process through your terminal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <BarberAuthProvider>
      <PaymentsContent />
    </BarberAuthProvider>
  );
}
