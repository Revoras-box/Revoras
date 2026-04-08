"use client";

import Link from "next/link";
import { useState } from "react";

const studioData = {
  "studio-1": {
    name: "The Gilded Razor",
    location: "14 Bruton Pl, London W1J 6LX",
    rating: 4.9,
    reviews: "2.4k",
    status: "ACTIVE NOW",
    established: "2012",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzYRgFj4lzw_h3Xv7feWJwRUEn0xT_v9968QsuhYMoDZRUFEgE-h1bzmM_7slrgxPQv5dWdiOQ5Njwe8zDASwsJ0fviH_9v-IvCb4IqtBFRwkMLQJWXYSpbpkmmRZN9D6EAcM5nLKKwdqr_mZ_3DimLFFVgAbNC-zUryvY4VysZQVF2ORwJbpTMNbVwtiGugCqAyuTa6vVaj0wIjfShmp2IYQNwnK7ijh-AW5QF1DC1ghzDVkU1WRznNY-lcFBh5T1D26Rn2OZNTM",
  },
  "studio-2": {
    name: "Obsidian Collective",
    location: "42 Dean St, London W1D 4PZ",
    rating: 4.8,
    reviews: "1.8k",
    status: "ACTIVE NOW",
    established: "2018",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6LATClHOV09Sb9JGKC5nwtU7pgk4ysJgbUjZaDTT9vx1vy43MRNRRtIGiCOFN34JHyRoDHDPK3Fj8o1zAZZJTBKrVxKdaBIXv2Zj9z5azGnIT00_KCM2akkbWDUPHhBreXtwOldpMvHnZQdpI2QwlLrxJuCA2Tk-hAhTqStzziqF1MxEzy-TFKK9izsbU-YoWr3OsGijhZ8oDQKdxHsbB33xAszOy3Ct4LzdlH5lct-vafvpC41FgVkT44q3C-rbLNkbkHUqq_ZI",
  },
};

const services = [
  { id: "svc-1", name: "The Executive Cut", description: "Precision cut, straight-razor neck shave, and essential oil scalp massage. Includes styling consultation.", duration: "45 MINS", price: 65 },
  { id: "svc-2", name: "Midnight Ritual", description: "Our flagship service. Hot towel treatment, charcoal peel, artisan cut, and cold-brew beard hydration.", duration: "75 MINS", price: 85 },
  { id: "svc-3", name: "Classic Beard Trim", description: "Precision beard shaping with straight razor edge work and conditioning treatment.", duration: "30 MINS", price: 35 },
];

const barbers = [
  { id: "barber-1", name: "Julian V.", role: "Master Barber", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-mlPPQOMtiTZPsM04cpmwqA-NDomhqjuZ8AI_jz4CBtEVcHdYHxsgXQKlV3pIlwMI3viLNQgHPU7PgfU_S-wXXR3TcB7HraTUlF9dJvV6pvjWf6ArUCNlRwd1d3SNn4o5X869wOGsL0N4pBJR-lc2purrkQU1MgD1zWAhpwqRwSWfKxwQHnXidhWAK2UpaLE2Vips6f66BH1P_vAoudNqQ_DoEpzuyqNCinNQCKsiwxhIFVchsY07XbQgt-NDAcePJEeUikohvUU" },
  { id: "barber-2", name: "Elena R.", role: "Creative Lead", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcINzK4Clzk6k2uZtOTcqHZ9aT2BKAWOXCw-nKDHAOaWAU95mk4hQL_ZilA3qmmcd0ls8GdQlfRirVjeH9vU4LJJhaYwWD7s68r_h3EimTmj5YCYAX6vLSuc0Ok5uIGJE3EIuLafcB0FO0KWwtxvTgrNND9VmTKN957__sYRLHZm9keoBXRGnlWMp1LHQjini7nR0SsqoYUylfETPXxRE5Mb1Vw2Y_p0tJ6F59VKG2fcalaFINNnyuLW_yM7HEA_9gGH1xviaMC0Q" },
  { id: "barber-3", name: "Marcus T.", role: "Senior Artisan", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuaQw1yL-_Xv6RDAIyoYan5prFtSl4nYuJUnNB-tmIaKqA_xoVyany5akC28uO6TzrSYXlgaXgFuiQzpeRYOtYm7HIWELDgzL-KtamzdI3WnIUD0fXaas1Ke2aAMwhkf8b7ccDwxKO3DZKHZquJ6X94lZrimn7figzpWK_6leZSIo8snO4Rxwe-CQaWrpCgJ9QilRINQ5XY4E7suosRxGFo4kVYpeaS2C4fUHAP92HzgPAdC0CDyPOofGxdFT3cwiopVaNSH93yuc" },
];

const hours = [
  { days: "Monday - Friday", hours: "09:00 - 21:00" },
  { days: "Saturday", hours: "10:00 - 19:00" },
  { days: "Sunday", hours: "Closed", closed: true },
];

export default function StudioDetailPage({ params }: { params: { id: string } }) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Services");
  
  const studio = studioData[params.id as keyof typeof studioData] || studioData["studio-1"];

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const selectedServiceDetails = services.filter((s) => selectedServices.includes(s.id));
  const subtotal = selectedServiceDetails.reduce((sum, s) => sum + s.price, 0);
  const bookingFee = 2.5;
  const total = subtotal + bookingFee;

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[614px] w-full overflow-hidden">
        <img className="w-full h-full object-cover brightness-50" src={studio.image} alt={studio.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full px-12 pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs font-label tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                {studio.status}
              </span>
              <div className="flex items-center gap-1 text-[#E5C487]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-bold">{studio.rating}</span>
                <span className="text-gray-400 text-sm font-normal ml-1">({studio.reviews} reviews)</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter text-white mb-4">{studio.name}</h1>
            <p className="font-label text-[#E5C487] uppercase tracking-[0.2em] flex items-center gap-4">
              <span>{studio.location.split(",")[0]}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              <span>Est. {studio.established}</span>
            </p>
          </div>
          <div className="flex gap-4 mb-2">
            <button className="p-4 rounded-full border border-[#4D463A]/50 backdrop-blur-md hover:bg-[#2a2a2a] transition-all">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="p-4 rounded-full border border-[#4D463A]/50 backdrop-blur-md hover:bg-[#2a2a2a] transition-all">
              <span className="material-symbols-outlined">favorite</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-12 py-16 grid grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8">
          {/* Tabs */}
          <div className="flex gap-10 border-b border-[#4D463A]/30 mb-12 overflow-x-auto whitespace-nowrap">
            {["Services", "Barbers", "Reviews", "Gallery"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-6 border-b-2 font-headline font-bold transition-colors ${
                  activeTab === tab
                    ? "border-[#E5C487] text-[#E5C487]"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Services */}
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-headline font-bold mb-6 text-[#E5C487]">Signature Experiences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`bg-[#1a1a1a] p-6 rounded-2xl border transition-all group cursor-pointer ${
                      selectedServices.includes(service.id)
                        ? "border-[#E5C487]/50 bg-[#E5C487]/5"
                        : "border-[#4D463A]/10 hover:border-[#E5C487]/30"
                    }`}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-headline font-bold text-white">{service.name}</h4>
                      <span className="text-[#E5C487] font-label font-bold text-lg">£{service.price}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-label text-gray-500 uppercase tracking-widest">{service.duration}</span>
                      <button className="text-[#E5C487] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                        {selectedServices.includes(service.id) ? "REMOVE" : "ADD SERVICE"}
                        <span className="material-symbols-outlined text-sm">
                          {selectedServices.includes(service.id) ? "remove_circle" : "add_circle"}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Barbers */}
            <div>
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-2xl font-headline font-bold text-[#E5C487]">Elite Artisans</h3>
                <Link href="/user/discover" className="text-sm font-label text-gray-400 hover:underline underline-offset-4">
                  VIEW ALL
                </Link>
              </div>
              <div className="flex flex-wrap gap-8">
                {barbers.map((barber) => (
                  <Link key={barber.id} href={`/user/barber/${barber.id}`} className="flex flex-col items-center gap-4 group cursor-pointer">
                    <div className="w-24 h-32 rounded-tl-3xl rounded-br-3xl overflow-hidden border-2 border-transparent group-hover:border-[#E5C487] transition-all">
                      <img className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500" src={barber.image} alt={barber.name} />
                    </div>
                    <div className="text-center">
                      <p className="font-headline font-bold text-white">{barber.name}</p>
                      <p className="text-[10px] font-label text-green-400 uppercase tracking-widest">{barber.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Location & Hours */}
            <div className="grid md:grid-cols-2 gap-12 pt-8">
              <div>
                <h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined">location_on</span> The Studio
                </h3>
                <div className="aspect-video rounded-3xl overflow-hidden bg-[#1a1a1a] mb-4">
                  <img
                    className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCItBntZxW_z-eQGc6cYr_4Y3eq59sZJPuPl5wEGN8fihVz_EX1pdWvZcWTgQg4S4S0ioe2u4s6FZWNf6fGdoOsxhaUto1aqaA_3FxVdCPyQW5HF8x_vjjXiQpfT9ZDvzcTujnxUB-Yh_LR0u2-Xdp1HxKfwAzWTg9pdFFMHP19uftf9663PDC7AgbSmWVTMn_DGN94BkV8TDoDxgLLZRk_VzWlZdp_KjSiey_pK5ikHx68WInt2YZpaHKojgFqz7VMpnXEvoTI19w"
                    alt="Map"
                  />
                </div>
                <p className="text-gray-400 font-body">{studio.location}</p>
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined">schedule</span> Concierge Hours
                </h3>
                <ul className="space-y-4 font-label text-sm uppercase tracking-widest">
                  {hours.map((item) => (
                    <li key={item.days} className={`flex justify-between pb-2 border-b border-[#4D463A]/20 ${item.closed ? "text-[#E5C487]" : ""}`}>
                      <span className={item.closed ? "" : "text-gray-400"}>{item.days}</span>
                      <span className={item.closed ? "" : "text-white"}>{item.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Reservation */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="sticky top-32 bg-[#1e1e1e] rounded-[2rem] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-[#4D463A]/10">
            <h3 className="text-2xl font-headline font-bold mb-8 text-white">Your Reservation</h3>
            <div className="space-y-6 mb-8">
              {selectedServiceDetails.length > 0 ? (
                selectedServiceDetails.map((service) => (
                  <div key={service.id} className="flex items-start gap-4 p-4 rounded-2xl bg-[#2a2a2a]/50 border border-[#E5C487]/20">
                    <div className="p-2 bg-[#E5C487]/10 rounded-lg">
                      <span className="material-symbols-outlined text-[#E5C487]">content_cut</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-headline font-bold text-white text-sm">{service.name}</p>
                        <button onClick={() => toggleService(service.id)} className="text-gray-400 hover:text-red-400 transition-colors">
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      </div>
                      <p className="text-xs font-label text-gray-500 uppercase tracking-wider mt-1">
                        {service.duration} • £{service.price}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border-2 border-dashed border-[#4D463A]/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3">
                  <span className="material-symbols-outlined text-gray-500">add_circle</span>
                  <p className="text-xs font-label text-gray-500 uppercase tracking-widest">Select services above</p>
                </div>
              )}
            </div>

            {selectedServices.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-[#4D463A]/30 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-label uppercase tracking-widest">Subtotal</span>
                  <span className="text-white font-bold">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-label uppercase tracking-widest">Booking Fee</span>
                  <span className="text-white font-bold">£{bookingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#4D463A]/20">
                  <span className="text-[#E5C487] font-headline font-bold">Total Estimate</span>
                  <span className="text-2xl font-headline font-black text-[#E5C487] tracking-tighter">£{total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <Link
              href={selectedServices.length > 0 ? "/user/book" : "#"}
              className={`w-full py-5 rounded-2xl font-headline font-black text-lg tracking-tighter shadow-xl flex items-center justify-center gap-3 transition-all ${
                selectedServices.length > 0
                  ? "bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] hover:brightness-110 active:scale-[0.98]"
                  : "bg-[#2a2a2a] text-gray-500 cursor-not-allowed"
              }`}
            >
              BOOK A SLOT <span className="material-symbols-outlined font-bold">arrow_forward</span>
            </Link>
            <p className="text-[10px] text-center text-gray-500 uppercase font-label tracking-widest mt-6">
              Cancellation policy applies. Secure checkout powered by Revoras.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
