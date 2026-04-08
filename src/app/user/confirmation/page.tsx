import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 max-w-7xl mx-auto min-h-screen">
      {/* Success Icon */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-900/20 mb-8 border border-green-500/30 relative">
          <span className="material-symbols-outlined text-green-400 text-6xl" style={{ fontVariationSettings: "'FILL' 0" }}>
            check_circle
          </span>
          <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-20"></div>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-[#E5C487] mb-4">Booking Confirmed</h1>
        <p className="font-label text-gray-400 tracking-widest uppercase text-sm">
          Reservation ID: <span className="font-mono text-[#E5C487]/80">#SC-992-LX</span>
        </p>
      </div>

      {/* Booking Card */}
      <div className="w-full max-w-4xl grid md:grid-cols-12 gap-0 bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-[#4D463A]/20">
        {/* Details */}
        <div className="md:col-span-7 p-10 md:p-12 space-y-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-headline text-3xl font-bold mb-2">The Royal Treatment</h2>
              <p className="text-gray-400 font-medium">
                with Master Barber <span className="text-[#E5C487] font-bold">Julian Vane</span>
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="bg-green-900/30 text-green-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                ACTIVE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="font-label text-[10px] uppercase tracking-widest text-gray-500">Date & Time</p>
              <p className="font-semibold text-lg">Oct 24, 2024</p>
              <p className="text-gray-400">10:30 AM — 11:45 AM</p>
            </div>
            <div className="space-y-1">
              <p className="font-label text-[10px] uppercase tracking-widest text-gray-500">Location</p>
              <p className="font-semibold text-lg">Mayfair Studio</p>
              <p className="text-gray-400">22 Savile Row, London</p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#4D463A]/30 flex items-center gap-6">
            <img
              alt="Master Barber"
              className="w-16 h-16 rounded-tl-2xl rounded-br-2xl object-cover grayscale hover:grayscale-0 transition-all duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFRTw09ATzddkEkZPI--dLiP7oV5j7rS6xDTVEpHl6XZ3mJ1HVa7mnjjO2KLA72RxuUJhNEjXYoDUtIduvgahBsaLOjHgLgIkea6pwZqQGcdxtHp8Z86QtlJRHXI4r3ZkzPeo-w50UE817K6gKt2q-RJ0VwilKqQwOHg7K2E6xc-2XdtuyeZh3GpDxcaK9mBNkpQ4z5NhHAS0f9OYJYdzlsQxXJH1QMtrV6DhCpQ-kSMoya0E_LLoteq0bVEMchsotHVKij9qwxv8"
            />
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-gray-500 mb-1">Your Professional</p>
              <p className="font-bold text-[#E5C487]">Julian Vane</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[#E5C487] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="text-xs text-gray-400">4.9 Senior Specialist</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="md:col-span-5 bg-[#2a2a2a] relative flex flex-col items-center justify-center p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E5C487] to-[#C8A96E] opacity-10 blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-[#E5C487] to-[#C8A96E] opacity-10 blur-3xl -ml-16 -mb-16"></div>

          <div className="relative z-10 text-center">
            <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-xl transform hover:rotate-2 transition-transform cursor-pointer">
              <img
                alt="Booking QR Code"
                className="w-40 h-40"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJBxkH82VhSYh8kyQSZyFgF4FdG0sA-pKutNjw708RJwtzHsyh5IEzbfQPzicx7IXCewu5Ojn6xbOpZfVnPg1Qzbb1gwrkL9NrS51N3IlnSy0bBzTzrBKKnwqJm1tsECqG5MkJzxGmKXPYuJySF7Yn-VEeDV1-ZJoDocKnHMmN_PgWFIxilq5ahSjAtC3IaLWSfaQctQsR9sgPVBEQkX8MTF3r20GA4cYQ1gTgUCKGurSrdOlTAl6PrDTyguDxnIqxDFSd-VIZeuQ"
              />
            </div>
            <p className="font-label text-[10px] uppercase tracking-widest text-gray-400 mb-1">Scan at Concierge</p>
            <p className="text-xs text-gray-500 italic">Check-in opens 10 mins prior</p>
          </div>

          {/* Map Preview */}
          <div className="absolute inset-x-0 bottom-0 h-32 overflow-hidden">
            <div className="w-full h-full opacity-30 grayscale contrast-125">
              <img
                alt="Location preview"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5Ly9TO7G9ibQSfewG42Wsh11vGVf2vkyLdmN-hu5owa50sVXw_h85b4UaJFuFA5d0i5cHFZfYW9kuHPTnYmjJpbBxrpeMpLeNSdttLayogmsBwVU9imEMGntghlMj7ybfpmvNariTDUB4ef0KKO45XyR9932g4nnEjFxzI_h4_AU_3NPDkTFwu-E70G7SmMnNhAGGX6Du0vRmFXnyVSz1z9i0DOEI94OHeKc9jRHJplvgdgD5briAXR3JBMeVeBuPgqGIaO3xWyo"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a] via-transparent to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-6">
        <button className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform hover:shadow-[0_10px_30px_rgba(229,196,135,0.3)] group">
          <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">calendar_add_on</span>
          Add to Calendar
        </button>
        <button className="w-full md:w-auto px-8 py-4 bg-[#1e1e1e] border border-[#4D463A]/30 text-white font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform hover:border-[#E5C487]/40 group">
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">share</span>
          Share Details
        </button>
        <Link
          href="/user"
          className="w-full md:w-auto px-8 py-4 text-[#E5C487] font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform hover:bg-[#E5C487]/5 group"
        >
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Home
        </Link>
      </div>

      {/* Help */}
      <p className="mt-16 font-label text-[11px] tracking-widest text-gray-500 uppercase flex items-center gap-2">
        <span className="material-symbols-outlined text-xs">help_outline</span>
        Need assistance? Our concierge is available at{" "}
        <span className="text-[#E5C487]/80 border-b border-[#E5C487]/30 cursor-pointer">+44 20 7946 0123</span>
      </p>
    </main>
  );
}
