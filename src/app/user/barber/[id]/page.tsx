"use client";

import Link from "next/link";
import { useState } from "react";

const barberData: Record<string, {
  name: string;
  role: string;
  bio: string;
  cuts: string;
  rating: string;
  experience: string;
  image: string;
  portfolio: string[];
}> = {
  "barber-1": {
    name: "Alessandro Rossi",
    role: "Creative Director",
    bio: "Alessandro's philosophy is rooted in the 'Digital Concierge' ethos—service that transcends the physical cut. Every appointment begins with an anatomical consultation, analyzing facial structure and hair growth patterns to ensure a silhouette that matures perfectly between visits.",
    cuts: "4,820+",
    rating: "5.0",
    experience: "12y",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8WwHhN0BlAXGOISYlsqU3YD58RRaERFVdBWPAHRm8AWkU_NT4MznPaEmdLSDPFD63ZpwTdLIArr7FwFaoAz8ielY-8l07rXe9iXaf25gb3KyTDm_cPxI_QCsgZ4kTq04skPE57NvtXPjDR4zGuj4njh3lKcmMi3q2MxcNSbbzNXClpqTJmlzQmiqOpc4xXd9QMgt2sZx-xodSGWW_bJzuGWj8tLTmWPAHbS-xNemIDUihJ7wSGHR4nLzDRNcY3li6_X8OjCJz_NU",
    portfolio: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCCFiKaDCcpvQ6VmK0mA_xQBYYjla6Gy0Nbnk6tUpOs8O2sT-inFYANaov_8sQVVTWaMmsXkTNlDDBnnS6x9BQXuXQSaUf9KQRmAxLtFPPcPIlNOJ7p0T72UPB1YuvQfohHYep0E5orLZNW6-IcYrWlQsyEGrk1wR2iGbcc3BSMyoCaK_zk3iZX2AGYBXR83Vf7XAn1grWLagZd_UKkmQbSGbSbX-cSjGpH9mAU-nOCidU_xa6YSF9ObpKKPehJpscyL4QV-7Rn1a8",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrxfz_5i69oBYB-Z7Qyxtw-qXLXoOob5nX5LrLAVI8nFiLffCNNQQ_6tDePkFYpjqaBGOvDAvdxYJNdh8XndsCZ2TUtr-IujXJIhWhQKgnbkuRaFvBpZZJoWNxUxfzbUsh4VOxaaqdapW-QrL4J-5JprFMLH4TCladXNUTCCa37gMURTSFHN7rCQOWtOrtVv8rDP_aVik3TvNq3ZZtDzYh2p0BmT5k1GfznHI2HWGbRD4XsxJiKBhGKFkN0ekdWP-iFRbjIfkPhq8",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA4IDeJQGmLl9wdywO_K6LrGCP6jBDkUdUOPmbQQ3KfcxhCJW45JdXncuF3voSdGJPwGuds-GGSbyHhxp5rZXCBhkV-BBIn56k2iCXWRcdI60rDSLM9lrBdUqEdy3AZQx7RIuGE2Rs40T8FvZx4DixZEm3lvj2tXiUS_H5bW29qiJ3r-PVyyNpYefxvaaOD28bJWt7Ug1MMdpjAlqsKUKFMGI5nnpS31pg6p1mplzCDY1aX8ElkwvJWiV10JHuCXzUPeAmWMCAqj_c",
    ],
  },
  "barber-2": {
    name: "Lena Schmit",
    role: "Senior Stylist",
    bio: "Lena brings a unique blend of European precision and contemporary creativity. Known for her transformative consultations and ability to create looks that complement individual lifestyles.",
    cuts: "3,200+",
    rating: "4.9",
    experience: "8y",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9kGgJMoZSFVVrsrkzJYrkybg3fbd_hMZKAv15cQ5Q9sWbPFDaOatIn3jy0spdXxIHfYVQ67SGLBJJrzhxHCXTUAoCvIYfILi1fdr4QNVnFPUjkHHtngl19-SPkhQayAu4iVTNAFJwfO8FYtolxB7XU3Gzb8jHRnYczWThjIYXkbf30cxpMKWCBFWfBORaRgECI7wemD05f0T0-On5McoX7-JsnV7GpksGcmLskwqEQtxNUNT82VzHlec_bNyIhtsAzvTwrIcVzDs",
    portfolio: [],
  },
  "barber-3": {
    name: "David Chen",
    role: "Master Barber",
    bio: "David specializes in classic cuts with a modern twist. His attention to detail and understanding of hair texture makes him the go-to for precision fades and executive styles.",
    cuts: "5,100+",
    rating: "5.0",
    experience: "15y",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAm0LjUBn4w0_3tcw6Zg6BfEWt79V9H0OHWwgQijJAQDlUSXvguJwWTYlA3nDDHZvCF0DWakLnf33B356jMzJPow5R6tQrx92x9IAw0JH-Naj1t0HRKgqVUs37UmZX092mDcr4wNQx0BK7Q7ZrMVH38Im-0IZYhGlSusODWyNrLtfPEsdOZfL_w_4mUQ015NMf0ioGCz6MrpQpkcnMUl8LYzoKEukoFd9wm9PcKb5kJg8DE1RUhOT7HJvQf1gHFu-wBgBK3p-x--ZY",
    portfolio: [],
  },
};

const availableDates = [
  { day: "MON", date: 12, selected: true },
  { day: "TUE", date: 13 },
  { day: "WED", date: 14 },
  { day: "THU", date: 15 },
];

const availableSlots = ["09:00 AM", "10:30 AM", "01:15 PM", "04:45 PM"];

export default function BarberProfilePage({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState(12);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const barber = barberData[params.id as keyof typeof barberData] || barberData["barber-1"];

  return (
    <main className="pt-24 pb-20 relative">
      <div className="max-w-7xl mx-auto px-12 grid grid-cols-12 gap-12 relative z-10">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
          {/* Hero Section */}
          <section className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="order-2 md:order-1">
                <span className="font-label text-xs tracking-widest text-[#E5C487] uppercase mb-4 block">Master Artisan</span>
                <h1 className="font-headline text-7xl font-extrabold tracking-tighter text-white leading-none mb-6">
                  {barber.name}
                </h1>
                <p className="text-gray-400 text-lg max-w-md leading-relaxed font-light">{barber.bio}</p>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-[#E5C487]/10 rounded-[2rem] blur-2xl group-hover:bg-[#E5C487]/20 transition-all"></div>
                  <div className="relative h-[500px] w-full overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] bg-[#1a1a1a] border border-[#4D463A]/20">
                    <img
                      alt={barber.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={barber.image}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-3 gap-1 bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#4D463A]/20">
            <div className="bg-[#1e1e1e] p-8 text-center flex flex-col items-center">
              <span className="font-label text-[10px] tracking-widest text-gray-400 uppercase mb-2">Cuts Completed</span>
              <span className="font-headline text-4xl font-bold text-[#E5C487]">{barber.cuts}</span>
            </div>
            <div className="bg-[#1e1e1e] p-8 text-center flex flex-col items-center">
              <span className="font-label text-[10px] tracking-widest text-gray-400 uppercase mb-2">Client Rating</span>
              <div className="flex items-center gap-2">
                <span className="font-headline text-4xl font-bold text-[#E5C487]">{barber.rating}</span>
                <span className="material-symbols-outlined text-[#E5C487] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              </div>
            </div>
            <div className="bg-[#1e1e1e] p-8 text-center flex flex-col items-center">
              <span className="font-label text-[10px] tracking-widest text-gray-400 uppercase mb-2">Experience</span>
              <span className="font-headline text-4xl font-bold text-[#E5C487]">{barber.experience}</span>
            </div>
          </section>

          {/* The Vision */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-headline text-3xl font-bold tracking-tight">The Vision</h2>
              <div className="h-[1px] flex-grow bg-[#4D463A]/30"></div>
            </div>
            <div className="columns-1 md:columns-2 gap-8 text-gray-400 leading-relaxed">
              <p className="mb-4">
                {barber.name}'s philosophy is rooted in the "Digital Concierge" ethos—service that transcends the physical cut.
                Every appointment begins with an anatomical consultation, analyzing facial structure and hair growth patterns to
                ensure a silhouette that matures perfectly between visits.
              </p>
              <p>
                Their signature style has become a benchmark in luxury grooming, utilizing Japanese steel and bespoke oils curated
                specifically for the Revoras ecosystem. {barber.name.split(" ")[0]} doesn't just cut hair; they engineer confidence.
              </p>
            </div>
          </section>

          {/* Portfolio */}
          {barber.portfolio.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-headline text-3xl font-bold tracking-tight">Recent Masterpieces</h2>
                <div className="h-[1px] flex-grow bg-[#4D463A]/30"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {barber.portfolio.map((img, index) => (
                  <div key={index} className="aspect-[3/4] overflow-hidden rounded-xl border border-[#4D463A]/20">
                    <img
                      alt={`Work ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      src={img}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar - Quick Booking */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#4D463A]/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="flex items-center gap-2 bg-green-900/20 px-3 py-1 rounded-full border border-green-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="font-label text-[10px] text-green-400 font-bold uppercase tracking-widest">Active Now</span>
                </div>
              </div>
              <h3 className="font-headline text-2xl font-bold mb-6">Quick Booking</h3>

              {/* Date Selection */}
              <div className="space-y-4 mb-8">
                <label className="font-label text-xs tracking-widest text-gray-400 uppercase">Select Date</label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {availableDates.map((d) => (
                    <button
                      key={d.date}
                      onClick={() => setSelectedDate(d.date)}
                      className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border transition-colors ${
                        selectedDate === d.date
                          ? "bg-[#E5C487]/20 text-[#E5C487] border-[#E5C487]/40"
                          : "bg-[#2a2a2a] text-white border-[#4D463A]/20 hover:border-[#E5C487]/40"
                      }`}
                    >
                      <span className="text-xs font-bold">{d.day}</span>
                      <span className="text-2xl font-black">{d.date}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-4 mb-10">
                <label className="font-label text-xs tracking-widest text-gray-400 uppercase">Available Slots</label>
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 px-4 rounded-lg text-sm font-medium border transition-all text-center ${
                        selectedSlot === slot
                          ? "bg-[#E5C487]/20 text-[#E5C487] border-[#E5C487]/40"
                          : "bg-[#2a2a2a] border-[#4D463A]/20 hover:border-[#E5C487]/40"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="flex justify-between items-center mb-8 px-2">
                <div>
                  <span className="text-xs text-gray-400 block">Consultation + Cut</span>
                  <span className="text-xl font-bold font-headline">$125.00</span>
                </div>
                <span className="material-symbols-outlined text-[#E5C487]">info</span>
              </div>

              <Link
                href={selectedSlot ? "/user/book" : "#"}
                className={`w-full py-4 rounded-xl font-headline font-extrabold text-lg shadow-lg transition-all block text-center ${
                  selectedSlot
                    ? "bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] active:scale-95"
                    : "bg-[#2a2a2a] text-gray-500 cursor-not-allowed"
                }`}
              >
                Confirm Appointment
              </Link>
            </div>

            {/* VIP Suite */}
            <div className="relative p-6 rounded-2xl overflow-hidden group bg-[#1a1a1a]">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "repeating-linear-gradient(45deg, #e5c487 0, #e5c487 1px, transparent 0, transparent 50%)",
                  backgroundSize: "10px 10px",
                }}
              ></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h4 className="font-headline font-bold text-[#E5C487]">VIP Suite Access</h4>
                  <p className="text-xs text-gray-400">Private room & complimentary spirits</p>
                </div>
                <span className="material-symbols-outlined text-[#E5C487] text-3xl">workspace_premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
