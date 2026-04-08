"use client";

import Link from "next/link";
import { useState } from "react";

const paymentMethods = [
  { id: "upi", name: "UPI Transfer", description: "Google Pay, PhonePe, Paytm", icon: "contactless" },
  { id: "card", name: "Debit / Credit Cards", description: "Visa, Mastercard, Amex", icon: "credit_card" },
  { id: "wallet", name: "Digital Wallets", description: "Apple Pay, PayPal", icon: "account_balance" },
];

export default function CheckoutPage() {
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    promoCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-[#E5C487] mb-2">Secure Checkout</h1>
        <p className="font-label text-xs tracking-widest text-gray-400 uppercase">Finalize your premium experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Payment Form */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-[#1a1a1a] p-8 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="material-symbols-outlined text-[#E5C487]/20 scale-150">shield_lock</span>
            </div>
            <h2 className="font-headline text-xl font-bold mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
              Payment Method
            </h2>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`group cursor-pointer p-5 rounded-xl border flex items-center justify-between transition-all ${
                    selectedPayment === method.id
                      ? "border-[#E5C487] bg-[#E5C487]/5"
                      : "border-[#4D463A]/30 bg-[#1e1e1e] hover:border-[#E5C487]/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        selectedPayment === method.id ? "bg-[#E5C487]/20" : "bg-[#2a2a2a]"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${
                          selectedPayment === method.id ? "text-[#E5C487]" : "text-gray-400"
                        }`}
                      >
                        {method.icon}
                      </span>
                    </div>
                    <div>
                      <p className={`font-bold ${selectedPayment === method.id ? "text-[#E5C487]" : "text-white"}`}>
                        {method.name}
                      </p>
                      <p className="text-xs text-gray-400 font-label">{method.description}</p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === method.id ? "border-[#E5C487]" : "border-[#4D463A]/50"
                    }`}
                  >
                    {selectedPayment === method.id && <div className="w-3 h-3 rounded-full bg-[#E5C487]"></div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Form */}
            <div className="mt-12 pt-12 border-t border-[#4D463A]/30 space-y-6">
              <h3 className="font-headline text-lg font-bold">Quick Verification</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="font-label text-[10px] tracking-widest uppercase text-gray-400 mb-1 block">Full Name</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[#4D463A]/50 focus:border-[#E5C487] focus:ring-0 px-0 py-2 font-headline tracking-wide outline-none transition-colors text-white"
                    placeholder="ALEXANDER VANCE"
                    type="text"
                  />
                </div>
                <div>
                  <label className="font-label text-[10px] tracking-widest uppercase text-gray-400 mb-1 block">Mobile Number</label>
                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[#4D463A]/50 focus:border-[#E5C487] focus:ring-0 px-0 py-2 font-headline tracking-wide outline-none transition-colors text-white"
                    placeholder="+1 (555) 000-0000"
                    type="text"
                  />
                </div>
                <div>
                  <label className="font-label text-[10px] tracking-widest uppercase text-gray-400 mb-1 block">Promo Code</label>
                  <input
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[#4D463A]/50 focus:border-[#E5C487] focus:ring-0 px-0 py-2 font-headline tracking-wide outline-none transition-colors text-white"
                    placeholder="Optional"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="font-label text-[10px] tracking-widest uppercase">SSL Secured 256-bit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">payments</span>
              <span className="font-label text-[10px] tracking-widest uppercase">Razorpay Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="font-label text-[10px] tracking-widest uppercase">PCI-DSS Compliant</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 sticky top-32">
          <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl">
            {/* Header Image */}
            <div className="h-32 relative">
              <img
                className="w-full h-full object-cover opacity-40"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAon_D8YwnccdagcfN8GKTlaftDGliRUbapMLbGjIJibLU1adbj1znvn3WPUF3fwDAsyeOHH-Jv32N4RtV4Uw6lB-X3BjukCLsoZHrPijbGWzZ5vrks86DSBJZefeJ3IBQkWT8CWgUy2oQs-6qpnUqTYwzgxb-8JCybKHS7hkiLGbVGDCiARUNHKOF3VQRAjTD8SEpaIa5cSktDKOe44SYM-Plg1A8rFqD83u4Mz57A4CNEHNH_F5wwPhtc8pZfRSw_uhk2HxHseH4"
                alt="Studio"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent"></div>
              <div className="absolute bottom-4 left-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#0e0e0e] border border-[#E5C487]/30 flex items-center justify-center p-2">
                  <span className="font-headline font-black text-[#E5C487] text-2xl tracking-tighter">SC</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg">Revoras Flagship</h3>
                  <p className="text-xs text-gray-400 font-label">Manhattan District, NY</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-headline font-bold">The Royal Signature Cut</h4>
                  <p className="text-sm text-gray-400">Includes wash, hot towel, & grooming</p>
                </div>
                <span className="font-headline font-bold text-[#E5C487]">$85.00</span>
              </div>

              {/* Booking Details */}
              <div className="bg-[#1a1a1a]/50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#E5C487] text-lg">event</span>
                  <span className="text-gray-400 font-medium">October 24, 2024</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#E5C487] text-lg">schedule</span>
                  <span className="text-gray-400 font-medium">04:30 PM (45 Mins)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#E5C487] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    person
                  </span>
                  <span className="text-gray-400 font-medium">Senior Barber: Julian V.</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-6 border-t border-[#4D463A]/30">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Service Subtotal</span>
                  <span className="font-medium">$85.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Concierge Fee</span>
                  <span className="font-medium">$4.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">GST / Luxury Tax</span>
                  <span className="font-medium">$7.20</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t border-[#4D463A]/30">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="font-label text-[10px] tracking-widest uppercase text-gray-400">Total Amount Due</p>
                    <p className="font-headline text-3xl font-black text-[#E5C487]">$96.70</p>
                  </div>
                  <div className="bg-green-900/20 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="font-label text-[10px] tracking-widest text-green-400 font-bold uppercase">Locked Rate</span>
                  </div>
                </div>

                <Link
                  href="/user/confirmation"
                  className="w-full bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-headline font-bold py-4 rounded-xl shadow-lg shadow-[#E5C487]/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  PAY & CONFIRM BOOKING
                  <span className="material-symbols-outlined text-[#402d00]">arrow_forward</span>
                </Link>
                <p className="text-[10px] text-center text-gray-400 font-label mt-4 tracking-tight">
                  By clicking, you agree to our 24h Cancellation Policy.
                </p>
              </div>
            </div>
          </div>

          {/* Queue Position */}
          <div className="mt-6 flex justify-end">
            <div className="bg-[#1e1e1e]/50 backdrop-blur-sm border border-[#4D463A]/20 px-4 py-2 rounded-full flex items-center gap-3">
              <span className="font-label text-[10px] tracking-widest text-gray-400 uppercase">Current Queue</span>
              <div className="bg-green-900/30 text-green-400 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                Pos: #02
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
