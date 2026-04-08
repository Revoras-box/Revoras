import React from 'react';

export default function ScreenS7() {
  return (
    <>
      

<div className="fixed inset-0 grain-overlay z-[100]"></div>

<main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 max-w-7xl mx-auto min-h-screen">

<div className="text-center mb-12">
<div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary-container/20 mb-8 border border-secondary/20 relative">
<span className="material-symbols-outlined text-secondary text-6xl" data-icon="check_circle" style={{"fontVariationSettings":"'FILL' 0"}}>check_circle</span>
<div className="absolute inset-0 rounded-full border-2 border-secondary animate-ping opacity-20"></div>
</div>
<h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-primary mb-4">
                Booking Confirmed
            </h1>
<p className="font-label text-on-surface-variant tracking-widest uppercase text-sm">
                Reservation ID: <span className="font-mono text-primary-fixed-dim">#SC-992-LX</span>
</p>
</div>

<div className="w-full max-w-4xl grid md:grid-cols-12 gap-0 bg-surface-container-low rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-outline-variant/10">

<div className="md:col-span-7 p-10 md:p-12 space-y-10">
<div className="flex justify-between items-start">
<div>
<h2 className="font-headline text-3xl font-bold mb-2">The Royal Treatment</h2>
<p className="text-on-surface-variant font-medium">with Master Barber <span className="text-primary font-bold">Julian Vane</span></p>
</div>
<div className="flex flex-col items-end">
<span className="bg-secondary-container text-secondary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            ACTIVE
                        </span>
</div>
</div>
<div className="grid grid-cols-2 gap-8">
<div className="space-y-1">
<p className="font-label text-[10px] uppercase tracking-widest text-outline">Date &amp; Time</p>
<p className="font-semibold text-lg">Oct 24, 2024</p>
<p className="text-on-surface-variant">10:30 AM — 11:45 AM</p>
</div>
<div className="space-y-1">
<p className="font-label text-[10px] uppercase tracking-widest text-outline">Location</p>
<p className="font-semibold text-lg">Mayfair Studio</p>
<p className="text-on-surface-variant">22 Savile Row, London</p>
</div>
</div>
<div className="pt-8 border-t border-outline-variant/15 flex items-center gap-6">
<img alt="Master Barber" className="w-16 h-16 asymmetric-clip object-cover grayscale hover:grayscale-0 transition-all duration-500" data-alt="Close-up portrait of a professional male barber in a clean white shirt against a moody dark studio background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFRTw09ATzddkEkZPI--dLiP7oV5j7rS6xDTVEpHl6XZ3mJ1HVa7mnjjO2KLA72RxuUJhNEjXYoDUtIduvgahBsaLOjHgLgIkea6pwZqQGcdxtHp8Z86QtlJRHXI4r3ZkzPeo-w50UE817K6gKt2q-RJ0VwilKqQwOHg7K2E6xc-2XdtuyeZh3GpDxcaK9mBNkpQ4z5NhHAS0f9OYJYdzlsQxXJH1QMtrV6DhCpQ-kSMoya0E_LLoteq0bVEMchsotHVKij9qwxv8"/>
<div>
<p className="font-label text-[10px] uppercase tracking-widest text-outline mb-1">Your Professional</p>
<p className="font-bold text-primary">Julian Vane</p>
<div className="flex items-center gap-1 mt-1">
<span className="material-symbols-outlined text-primary text-sm" data-icon="star" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="text-xs text-on-surface-variant">4.9 Senior Specialist</span>
</div>
</div>
</div>
</div>

<div className="md:col-span-5 bg-surface-container-highest relative flex flex-col items-center justify-center p-12 overflow-hidden">

<div className="absolute top-0 right-0 w-32 h-32 gilded-gradient opacity-10 blur-3xl -mr-16 -mt-16"></div>
<div className="absolute bottom-0 left-0 w-32 h-32 gilded-gradient opacity-10 blur-3xl -ml-16 -mb-16"></div>
<div className="relative z-10 text-center">
<div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-xl transform hover:rotate-2 transition-transform cursor-pointer">
<img alt="Booking QR Code" className="w-40 h-40" data-alt="Minimalist geometric QR code in black and white on a clean paper textured background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJBxkH82VhSYh8kyQSZyFgF4FdG0sA-pKutNjw708RJwtzHsyh5IEzbfQPzicx7IXCewu5Ojn6xbOpZfVnPg1Qzbb1gwrkL9NrS51N3IlnSy0bBzTzrBKKnwqJm1tsECqG5MkJzxGmKXPYuJySF7Yn-VEeDV1-ZJoDocKnHMmN_PgWFIxilq5ahSjAtC3IaLWSfaQctQsR9sgPVBEQkX8MTF3r20GA4cYQ1gTgUCKGurSrdOlTAl6PrDTyguDxnIqxDFSd-VIZeuQ"/>
</div>
<p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Scan at Concierge</p>
<p className="text-xs text-outline italic">Check-in opens 10 mins prior</p>
</div>

<div className="absolute inset-x-0 bottom-0 h-32 overflow-hidden">
<div className="w-full h-full opacity-30 grayscale contrast-125">
<img alt="Location preview" className="w-full h-full object-cover" data-alt="Stylized dark architectural map of London streets with soft highlights on main boulevards" data-location="London" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5Ly9TO7G9ibQSfewG42Wsh11vGVf2vkyLdmN-hu5owa50sVXw_h85b4UaJFuFA5d0i5cHFZfYW9kuHPTnYmjJpbBxrpeMpLeNSdttLayogmsBwVU9imEMGntghlMj7ybfpmvNariTDUB4ef0KKO45XyR9932g4nnEjFxzI_h4_AU_3NPDkTFwu-E70G7SmMnNhAGGX6Du0vRmFXnyVSz1z9i0DOEI94OHeKc9jRHJplvgdgD5briAXR3JBMeVeBuPgqGIaO3xWyo"/>
</div>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest via-transparent to-transparent"></div>
</div>
</div>
</div>

<div className="mt-12 w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-6">
<button className="w-full md:w-auto px-8 py-4 gilded-gradient text-on-primary font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform hover:shadow-[0_10px_30px_rgba(229,196,135,0.3)] group">
<span className="material-symbols-outlined group-hover:rotate-12 transition-transform" data-icon="calendar_add_on">calendar_add_on</span>
                Add to Calendar
            </button>
<button className="w-full md:w-auto px-8 py-4 bg-surface-container-high border border-outline-variant/20 text-on-surface font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform hover:border-primary/40 group">
<span className="material-symbols-outlined group-hover:scale-110 transition-transform" data-icon="share">share</span>
                Share Details
            </button>
<button className="w-full md:w-auto px-8 py-4 text-primary font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform hover:bg-primary/5 group">
<span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform" data-icon="arrow_back">arrow_back</span>
                Back to Home
            </button>
</div>

<p className="mt-16 font-label text-[11px] tracking-widest text-outline uppercase flex items-center gap-2">
<span className="material-symbols-outlined text-xs" data-icon="help_outline">help_outline</span>
            Need assistance? Our concierge is available at <span className="text-primary-fixed-dim border-b border-primary-fixed-dim/20 cursor-pointer">+44 20 7946 0123</span>
</p>
</main>

<footer className="bg-[#0E0E0E] w-full py-12 px-12 border-t border-[#4D463A]/15">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div className="flex flex-col items-center md:items-start gap-4">
<span className="text-[#E5C487] font-black text-2xl tracking-tighter">SnapCut</span>
<p className="text-gray-500 font-['Space_Grotesk'] uppercase text-xs tracking-widest">© 2024 SnapCut. The Digital Concierge.</p>
</div>
<div className="flex flex-wrap justify-center gap-8">
<a className="text-gray-500 font-['Space_Grotesk'] uppercase text-xs tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a className="text-gray-500 font-['Space_Grotesk'] uppercase text-xs tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a className="text-gray-500 font-['Space_Grotesk'] uppercase text-xs tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">VIP Access</a>
<a className="text-gray-500 font-['Space_Grotesk'] uppercase text-xs tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Careers</a>
</div>
</div>
</footer>

    </>
  );
}
