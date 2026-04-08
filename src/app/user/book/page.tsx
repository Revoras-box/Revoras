"use client";

import Link from "next/link";
import { useState } from "react";

const barbers = [
  {
    id: "barber-1",
    name: "Julian",
    role: "Master",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJksxkjV0RX2pjj_yVu2IbxTHK35TMIRFCM1bltkZUmtVI3dMlAaj2seJbXWZ_OElQxH8F7jE51FWbTR2mD1udZw8FX9IKG064ZfvCN3yzHEVeegXB48wvehlpP2_vO_GAzvb5U2y3lqBTGfIlNUa7yKLp7jZlYpRooKBSIMRTdcGIW2GhZR2Ca1UbmgSfGhRsw-JRAG1ODedMwg6ITO-oo5usFNvmXK_YpoVgXacp9eNEYEUso-k2fbd-1eTWSnXrHJZnUvF_beg",
  },
  {
    id: "barber-2",
    name: "Marcus",
    role: "Senior",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuACxQo9maj1UrnHUzksFVttYjvYG25y7dOig6oYchjpwxHcM2TFnk342j1Die1dXpC3BrFLMSyEbrtWzWUdotqiTCsfSmxSZa8lZon9A2Y0Kn43UEt12bCeI0uewVysXfz9beBgALruij_FYngfbtx4-JjtTQ6ou_bXm00kIZBduyHODboO2DQOdwTMDxuZXZ13ElEOutiBlTfjnkbFHND-Dd06GmgDx7ca3YjfwYl3AvYdxTu-R9GTyUDrEpIzau98KaMJ17VVTaM",
  },
  {
    id: "barber-3",
    name: "Elena",
    role: "Executive",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBMSS5AAjgbpYoDQouNGPnCk3ng1AOHBey2lhNQ1XIlv5c_yPrrx5XPoljTBQeitwzcpdWGLgah6ZxA75jmv6I86rliVa4shOMGlZhd-XAk1vcE-udTMkRevlleILWRjhvXjKjgFiydeIVXLbmvBCkAaHiTkJlE8m7nMFllR5plx8Omq98G1IHvmSPGVj3CV3bouLjaeuzNf5OenUKKIdG_N_ScAWlYlndTpWlsnOPoL_tKEwIleC96mOo_FLitxIRILIHc8HQV4",
  },
];

const dates = [
  { day: "THU", date: 24, month: "Oct", selected: true },
  { day: "FRI", date: 25, month: "Oct" },
  { day: "SAT", date: 26, month: "Oct" },
  { day: "SUN", date: 27, month: "Oct", disabled: true },
  { day: "MON", date: 28, month: "Oct" },
  { day: "TUE", date: 29, month: "Oct" },
];

const timeSlots = [
  { time: "09:00 AM", available: true },
  { time: "09:45 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:15 AM", available: false },
  { time: "12:00 PM", available: true },
  { time: "02:30 PM", available: true },
  { time: "03:15 PM", available: true },
  { time: "04:00 PM", available: true },
  { time: "05:30 PM", available: true },
];

export default function BookPage() {
  const [selectedBarber, setSelectedBarber] = useState("barber-1");
  const [selectedDate, setSelectedDate] = useState(24);
  const [selectedTime, setSelectedTime] = useState("09:00 AM");

  const selectedBarberData = barbers.find((b) => b.id === selectedBarber);

  return (
    <main className="pt-32 pb-20 px-12 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-16">
          {/* Step 1: Select Professional */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-label text-[#E5C487] bg-[#E5C487]/10 px-3 py-1 rounded text-sm tracking-widest">STEP 01</span>
              <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Select Professional</h2>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {barbers.map((barber) => (
                <div
                  key={barber.id}
                  onClick={() => setSelectedBarber(barber.id)}
                  className={`flex-shrink-0 group cursor-pointer text-center ${
                    selectedBarber !== barber.id ? "opacity-60 hover:opacity-100" : ""
                  } transition-opacity`}
                >
                  <div className="relative mb-3">
                    <img
                      alt={barber.name}
                      className={`w-24 h-32 object-cover rounded-tl-3xl rounded-br-3xl border-2 transition-all duration-500 ${
                        selectedBarber === barber.id
                          ? "border-[#E5C487] grayscale-0"
                          : "border-[#4D463A]/50 grayscale group-hover:grayscale-0"
                      }`}
                      src={barber.image}
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-tl-3xl rounded-br-3xl"></div>
                  </div>
                  <p className={`font-headline font-bold ${selectedBarber === barber.id ? "text-[#E5C487]" : "text-white"}`}>
                    {barber.name}
                  </p>
                  <p className="font-label text-[10px] text-gray-400 uppercase tracking-widest">{barber.role}</p>
                </div>
              ))}
              <div
                onClick={() => setSelectedBarber("any")}
                className={`flex-shrink-0 group cursor-pointer text-center ${
                  selectedBarber !== "any" ? "opacity-60 hover:opacity-100" : ""
                } transition-opacity`}
              >
                <div className="w-24 h-32 flex flex-col items-center justify-center bg-[#1a1a1a] rounded-tl-3xl rounded-br-3xl border-2 border-dashed border-[#4D463A]/70 mb-3">
                  <span className="material-symbols-outlined text-[#E5C487] text-3xl">groups</span>
                </div>
                <p className={`font-headline font-bold ${selectedBarber === "any" ? "text-[#E5C487]" : "text-white"}`}>Any</p>
                <p className="font-label text-[10px] text-gray-400 uppercase tracking-widest">Available</p>
              </div>
            </div>
          </section>

          {/* Step 2: Select Date */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-label text-[#E5C487] bg-[#E5C487]/10 px-3 py-1 rounded text-sm tracking-widest">STEP 02</span>
              <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Select Date</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {dates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => !d.disabled && setSelectedDate(d.date)}
                  disabled={d.disabled}
                  className={`flex-shrink-0 w-20 py-6 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    selectedDate === d.date
                      ? "bg-gradient-to-b from-[#E5C487] to-[#C8A96E] text-[#402d00] shadow-xl transform scale-105"
                      : d.disabled
                      ? "bg-[#1a1a1a] border border-[#4D463A]/20 opacity-50 cursor-not-allowed"
                      : "bg-[#1a1a1a] border border-[#4D463A]/20 text-white hover:border-[#E5C487]/50 cursor-pointer"
                  }`}
                >
                  <span className={`font-label text-xs uppercase ${selectedDate === d.date ? "font-bold" : "text-gray-400"}`}>
                    {d.month}
                  </span>
                  <span className={`font-headline text-3xl font-bold ${d.disabled ? "text-red-500/50" : ""}`}>{d.date}</span>
                  <span className={`font-label text-[10px] tracking-tighter ${selectedDate === d.date ? "" : "text-gray-400"}`}>
                    {d.day}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Step 3: Pick Time */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-label text-[#E5C487] bg-[#E5C487]/10 px-3 py-1 rounded text-sm tracking-widest">STEP 03</span>
              <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Pick Time</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`py-4 px-6 rounded-xl border font-headline font-bold flex items-center justify-between transition-all ${
                    selectedTime === slot.time
                      ? "border-[#E5C487]/60 bg-[#E5C487]/5 text-[#E5C487]"
                      : slot.available
                      ? "border-[#4D463A]/30 bg-[#1a1a1a] text-gray-400 hover:border-[#E5C487]/40"
                      : "border-[#4D463A]/30 bg-[#1a1a1a] opacity-40 cursor-not-allowed"
                  }`}
                >
                  <span className={!slot.available ? "line-through" : ""}>{slot.time}</span>
                  {selectedTime === slot.time && (
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      check_circle
                    </span>
                  )}
                  {!slot.available && <span className="material-symbols-outlined text-sm">lock</span>}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar - Summary */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 bg-[#1a1a1a] p-8 rounded-3xl border border-[#4D463A]/20 shadow-2xl space-y-8">
            <div>
              <h3 className="font-headline text-xl font-bold text-white mb-1">Reservation Summary</h3>
              <p className="font-label text-[10px] text-gray-400 tracking-widest uppercase">The Digital Concierge</p>
            </div>

            <div className="space-y-6">
              {/* Selected Barber */}
              {selectedBarberData && (
                <div className="flex items-center gap-4 p-4 bg-[#2a2a2a] rounded-2xl">
                  <img
                    alt={selectedBarberData.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#E5C487]/30"
                    src={selectedBarberData.image}
                  />
                  <div>
                    <p className="text-[10px] font-label text-gray-400 tracking-widest uppercase">Professional</p>
                    <p className="font-headline font-bold text-white">
                      {selectedBarberData.name} ({selectedBarberData.role})
                    </p>
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#E5C487] text-xl">calendar_today</span>
                    <span className="text-sm font-medium text-gray-400">Date</span>
                  </div>
                  <span className="font-headline font-bold text-white">
                    {dates.find((d) => d.date === selectedDate)?.day}, {dates.find((d) => d.date === selectedDate)?.month}{" "}
                    {selectedDate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#E5C487] text-xl">schedule</span>
                    <span className="text-sm font-medium text-gray-400">Time</span>
                  </div>
                  <span className="font-headline font-bold text-white">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#E5C487] text-xl">content_cut</span>
                    <span className="text-sm font-medium text-gray-400">Service</span>
                  </div>
                  <span className="font-headline font-bold text-white">Executive Fade</span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-6 border-t border-[#4D463A]/30">
                <div className="flex justify-between items-end mb-8">
                  <p className="font-headline font-bold text-white">Total Price</p>
                  <div className="text-right">
                    <p className="text-3xl font-headline font-black text-[#E5C487]">$75.00</p>
                    <p className="text-[10px] font-label text-gray-400 tracking-widest">INC. TAX</p>
                  </div>
                </div>
                <Link
                  href="/user/checkout"
                  className="w-full bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-headline font-black py-5 rounded-2xl shadow-lg shadow-[#E5C487]/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  CONFIRM BOOKING
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <p className="text-[10px] text-center mt-6 text-gray-400 font-label leading-relaxed">
                  SECURE CHECKOUT ENABLED. <br /> FREE CANCELLATION UP TO 24H BEFORE.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
