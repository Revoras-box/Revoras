"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import BarberSidebar from "@/components/barber/BarberSidebar";
import { BarberAuthProvider, useBarberAuth } from "@/lib/barber-auth";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/format";

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

  const formatCurrency = (amount: number) => formatINR(amount);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-fixed-dim/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest text-foreground">
      <BarberSidebar />
      <main className="lg:ml-72 flex-1 min-h-screen flex flex-col">
        <header className="h-20 pl-16 pr-6 lg:px-10 flex justify-between items-center bg-surface-container-low/60 backdrop-blur-xl z-40 sticky top-0">
          <div className="flex items-center gap-8">
            <h2 className="font-headline font-black text-2xl tracking-tight text-foreground">Revenue Hub</h2>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-primary-fixed-dim to-primary-container text-primary-foreground font-headline font-bold rounded-xl active:scale-95 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </header>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto bg-surface-container-lowest">
          {/* Balance Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary-fixed-dim/20 to-surface-container-low rounded-3xl p-6 border border-primary-fixed-dim/20">
              <p className="text-xs text-primary uppercase tracking-widest mb-2">Collected Revenue</p>
              <p className="text-4xl font-headline font-black text-foreground">
                {loading ? '...' : formatCurrency(summary.availableBalance)}
              </p>
              <p className="text-xs text-muted mt-4">From paid bookings</p>
            </div>
            <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
              <p className="text-xs text-muted uppercase tracking-widest mb-2">Pending Payments</p>
              <p className="text-4xl font-headline font-black text-yellow-700 dark:text-yellow-400">
                {loading ? '...' : formatCurrency(summary.pendingClearance)}
              </p>
              <p className="text-xs text-muted mt-4">Awaiting collection</p>
            </div>
            <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
              <p className="text-xs text-muted uppercase tracking-widest mb-2">This Month</p>
              <p className="text-4xl font-headline font-black text-green-600 dark:text-green-400">
                {loading ? '...' : formatCurrency(summary.thisMonth)}
              </p>
              {summary.monthChange !== 0 && (
                <p className={`text-xs mt-4 flex items-center ${summary.monthChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  <span className="material-symbols-outlined text-sm mr-1">
                    {summary.monthChange > 0 ? 'trending_up' : 'trending_down'}
                  </span>
                  {summary.monthChange > 0 ? '+' : ''}{summary.monthChange}% vs last month
                </p>
              )}
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline font-black text-lg text-foreground">Transaction History</h3>
              <div className="flex gap-2">
                {["all", "paid", "pending", "refunded"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                      filter === f
                        ? "bg-primary-fixed-dim text-primary-foreground font-bold"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-fixed-dim/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-muted mb-3">receipt_long</span>
                <p className="text-muted">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-surface-container-highest/30 rounded-xl hover:bg-surface-container-highest/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-outline-variant/30 flex items-center justify-center">
                        {tx.customerImage ? (
                          <img src={tx.customerImage} alt={tx.customerName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            {tx.customerName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{tx.customerName}</p>
                        <p className="text-xs text-muted">{tx.services}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className={`material-symbols-outlined text-lg ${
                          tx.paymentMethod === 'cash' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {tx.paymentMethod === 'cash' ? 'payments' : 'credit_card'}
                        </span>
                        <p className="text-[10px] text-muted uppercase">{tx.paymentMethod || 'card'}</p>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className={`text-lg font-headline font-black ${
                          tx.paymentStatus === 'refunded' ? 'text-red-600 dark:text-red-400' : 'text-primary'
                        }`}>
                          {tx.paymentStatus === 'refunded' ? '-' : '+'}{formatINR(tx.amount)}
                        </p>
                        <p className="text-[10px] text-muted">{formatDate(tx.date)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold ${
                          tx.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                          tx.paymentStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                          'bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}>
                          {tx.paymentStatus}
                        </span>
                        {tx.paymentStatus === 'pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(tx.id)}
                            disabled={updatingPayment === tx.id}
                            className="px-3 py-1 bg-primary-fixed-dim/10 text-primary rounded-full text-[10px] uppercase font-bold hover:bg-primary-fixed-dim/20 transition-all disabled:opacity-50"
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
          <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
            <h3 className="font-headline font-black text-lg text-foreground mb-6">Payment Collection</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-surface-container-highest/30 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">payments</span>
                  <div>
                    <p className="text-sm font-bold text-foreground">Cash Payments</p>
                    <p className="text-xs text-muted">Mark as paid after collection</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-surface-container-highest/30 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">credit_card</span>
                  <div>
                    <p className="text-sm font-bold text-foreground">Card Payments</p>
                    <p className="text-xs text-muted">Process through your terminal</p>
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
