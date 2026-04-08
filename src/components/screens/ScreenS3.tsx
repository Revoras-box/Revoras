import React from 'react';

export default function ScreenS3() {
  return (
    <>
      
<div className="fixed inset-0 grain-overlay z-[100]"></div>

<nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-md flex justify-between items-center px-12 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
<div className="text-2xl font-bold tracking-tighter text-[#E5C487] font-headline">SnapCut</div>
<div className="hidden md:flex gap-8 font-headline tracking-tight">
<a className="text-gray-400 font-medium hover:text-[#E5C487] transition-colors duration-300" href="#">Experience</a>
<a className="text-[#E5C487] border-b-2 border-[#E5C487] pb-1" href="#">Services</a>
<a className="text-gray-400 font-medium hover:text-[#E5C487] transition-colors duration-300" href="#">Barbers</a>
<a className="text-gray-400 font-medium hover:text-[#E5C487] transition-colors duration-300" href="#">Locations</a>
</div>
<div className="flex items-center gap-6">
<span className="material-symbols-outlined text-primary-fixed-dim">notifications</span>
<button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-xl font-headline font-bold text-sm hover:scale-105 active:scale-95 transition-all">
                Book Now
            </button>
</div>
</nav>
<main className="pt-20">

<section className="relative h-[614px] w-full overflow-hidden">
<img className="w-full h-full object-cover brightness-50" data-alt="Luxurious dark barbershop interior with leather chairs, warm hanging Edison bulbs, and mahogany wood accents in a cinematic atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzYRgFj4lzw_h3Xv7feWJwRUEn0xT_v9968QsuhYMoDZRUFEgE-h1bzmM_7slrgxPQv5dWdiOQ5Njwe8zDASwsJ0fviH_9v-IvCb4IqtBFRwkMLQJWXYSpbpkmmRZN9D6EAcM5nLKKwdqr_mZ_3DimLFFVgAbNC-zUryvY4VysZQVF2ORwJbpTMNbVwtiGugCqAyuTa6vVaj0wIjfShmp2IYQNwnK7ijh-AW5QF1DC1ghzDVkU1WRznNY-lcFBh5T1D26Rn2OZNTM"/>
<div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
<div className="absolute bottom-0 left-0 w-full px-12 pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
<div className="max-w-3xl">
<div className="flex items-center gap-3 mb-4">
<span className="bg-secondary-container text-secondary px-3 py-1 rounded-full text-xs font-label tracking-widest flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                            ACTIVE NOW
                        </span>
<div className="flex items-center gap-1 text-primary">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">4.9</span>
<span className="text-on-surface-variant text-sm font-normal ml-1">(2.4k reviews)</span>
</div>
</div>
<h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter text-white mb-4">Midnight Razor</h1>
<p className="font-label text-primary uppercase tracking-[0.2em] flex items-center gap-4">
<span>Mayfair, London</span>
<span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
<span>Est. 2012</span>
</p>
</div>
<div className="flex gap-4 mb-2">
<button className="p-4 rounded-full border border-outline-variant/30 backdrop-blur-md hover:bg-surface-variant transition-all">
<span className="material-symbols-outlined">share</span>
</button>
<button className="p-4 rounded-full border border-outline-variant/30 backdrop-blur-md hover:bg-surface-variant transition-all">
<span className="material-symbols-outlined">favorite</span>
</button>
</div>
</div>
</section>

<section className="max-w-7xl mx-auto px-12 py-16 grid grid-cols-12 gap-12">

<div className="col-span-12 lg:col-span-8">

<div className="flex gap-10 border-b border-outline-variant/15 mb-12 overflow-x-auto whitespace-nowrap">
<button className="pb-6 border-b-2 border-primary text-primary font-headline font-bold">Services</button>
<button className="pb-6 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-colors font-headline font-bold">Barbers</button>
<button className="pb-6 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-colors font-headline font-bold">Reviews</button>
<button className="pb-6 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-colors font-headline font-bold">Gallery</button>
</div>

<div className="space-y-12">
<div>
<h3 className="text-2xl font-headline font-bold mb-6 text-primary">Signature Experiences</h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/5 hover:border-primary/20 transition-all group">
<div className="flex justify-between items-start mb-4">
<h4 className="text-xl font-headline font-bold text-on-surface">The Executive Cut</h4>
<span className="text-primary font-label font-bold text-lg">£65</span>
</div>
<p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Precision cut, straight-razor neck shave, and essential oil scalp massage. Includes styling consultation.</p>
<div className="flex justify-between items-center">
<span className="text-xs font-label text-outline uppercase tracking-widest">45 MINS</span>
<button className="text-primary text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                                        ADD SERVICE <span className="material-symbols-outlined text-sm">add_circle</span>
</button>
</div>
</div>

<div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/5 hover:border-primary/20 transition-all group">
<div className="flex justify-between items-start mb-4">
<h4 className="text-xl font-headline font-bold text-on-surface">Midnight Ritual</h4>
<span className="text-primary font-label font-bold text-lg">£85</span>
</div>
<p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Our flagship service. Hot towel treatment, charcoal peel, artisan cut, and cold-brew beard hydration.</p>
<div className="flex justify-between items-center">
<span className="text-xs font-label text-outline uppercase tracking-widest">75 MINS</span>
<button className="text-primary text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                                        ADD SERVICE <span className="material-symbols-outlined text-sm">add_circle</span>
</button>
</div>
</div>
</div>
</div>

<div>
<div className="flex justify-between items-end mb-8">
<h3 className="text-2xl font-headline font-bold text-primary">Elite Artisans</h3>
<a className="text-sm font-label text-primary-fixed-dim hover:underline underline-offset-4" href="#">VIEW ALL</a>
</div>
<div className="flex flex-wrap gap-8">
<div className="flex flex-col items-center gap-4 group cursor-pointer">
<div className="w-24 h-32 asymmetric-clip overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
<img className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500" data-alt="Close up portrait of a stylish male barber with tattoos and professional attire in a dark studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-mlPPQOMtiTZPsM04cpmwqA-NDomhqjuZ8AI_jz4CBtEVcHdYHxsgXQKlV3pIlwMI3viLNQgHPU7PgfU_S-wXXR3TcB7HraTUlF9dJvV6pvjWf6ArUCNlRwd1d3SNn4o5X869wOGsL0N4pBJR-lc2purrkQU1MgD1zWAhpwqRwSWfKxwQHnXidhWAK2UpaLE2Vips6f66BH1P_vAoudNqQ_DoEpzuyqNCinNQCKsiwxhIFVchsY07XbQgt-NDAcePJEeUikohvUU"/>
</div>
<div className="text-center">
<p className="font-headline font-bold text-on-surface">Julian V.</p>
<p className="text-[10px] font-label text-secondary uppercase tracking-widest">Master Barber</p>
</div>
</div>
<div className="flex flex-col items-center gap-4 group cursor-pointer">
<div className="w-24 h-32 asymmetric-clip overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
<img className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500" data-alt="Professional female barber with focused expression cutting hair in a high-end salon with soft golden lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcINzK4Clzk6k2uZtOTcqHZ9aT2BKAWOXCw-nKDHAOaWAU95mk4hQL_ZilA3qmmcd0ls8GdQlfRirVjeH9vU4LJJhaYwWD7s68r_h3EimTmj5YCYAX6vLSuc0Ok5uIGJE3EIuLafcB0FO0KWwtxvTgrNND9VmTKN957__sYRLHZm9keoBXRGnlWMp1LHQjini7nR0SsqoYUylfETPXxRE5Mb1Vw2Y_p0tJ6F59VKG2fcalaFINNnyuLW_yM7HEA_9gGH1xviaMC0Q"/>
</div>
<div className="text-center">
<p className="font-headline font-bold text-on-surface">Elena R.</p>
<p className="text-[10px] font-label text-secondary uppercase tracking-widest">Creative Lead</p>
</div>
</div>
<div className="flex flex-col items-center gap-4 group cursor-pointer">
<div className="w-24 h-32 asymmetric-clip overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
<img className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500" data-alt="Portrait of a young male barber with sharp beard and modern haircut, standing in a sophisticated grooming studio" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuaQw1yL-_Xv6RDAIyoYan5prFtSl4nYuJUnNB-tmIaKqA_xoVyany5akC28uO6TzrSYXlgaXgFuiQzpeRYOtYm7HIWELDgzL-KtamzdI3WnIUD0fXaas1Ke2aAMwhkf8b7ccDwxKO3DZKHZquJ6X94lZrimn7figzpWK_6leZSIo8snO4Rxwe-CQaWrpCgJ9QilRINQ5XY4E7suosRxGFo4kVYpeaS2C4fUHAP92HzgPAdC0CDyPOofGxdFT3cwiopVaNSH93yuc"/>
</div>
<div className="text-center">
<p className="font-headline font-bold text-on-surface">Marcus T.</p>
<p className="text-[10px] font-label text-secondary uppercase tracking-widest">Senior Artisan</p>
</div>
</div>
</div>
</div>

<div className="grid md:grid-cols-2 gap-12 pt-8">
<div>
<h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-3">
<span className="material-symbols-outlined">location_on</span> The Studio
                            </h3>
<div className="aspect-video rounded-3xl overflow-hidden bg-surface-container-high mb-4">
<img className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700" data-alt="Stylized map showing central London Mayfair district with dark aesthetic and gold highlight markers" data-location="London" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCItBntZxW_z-eQGc6cYr_4Y3eq59sZJPuPl5wEGN8fihVz_EX1pdWvZcWTgQg4S4S0ioe2u4s6FZWNf6fGdoOsxhaUto1aqaA_3FxVdCPyQW5HF8x_vjjXiQpfT9ZDvzcTujnxUB-Yh_LR0u2-Xdp1HxKfwAzWTg9pdFFMHP19uftf9663PDC7AgbSmWVTMn_DGN94BkV8TDoDxgLLZRk_VzWlZdp_KjSiey_pK5ikHx68WInt2YZpaHKojgFqz7VMpnXEvoTI19w"/>
</div>
<p className="text-on-surface-variant font-body">14 Bruton Pl, London W1J 6LX, United Kingdom</p>
</div>
<div>
<h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-3">
<span className="material-symbols-outlined">schedule</span> Concierge Hours
                            </h3>
<ul className="space-y-4 font-label text-sm uppercase tracking-widest">
<li className="flex justify-between pb-2 border-b border-outline-variant/10">
<span className="text-on-surface-variant">Monday - Friday</span>
<span className="text-on-surface">09:00 - 21:00</span>
</li>
<li className="flex justify-between pb-2 border-b border-outline-variant/10">
<span className="text-on-surface-variant">Saturday</span>
<span className="text-on-surface">10:00 - 19:00</span>
</li>
<li className="flex justify-between pb-2 border-b border-outline-variant/10 text-primary">
<span className="">Sunday</span>
<span className="">Closed</span>
</li>
</ul>
</div>
</div>
</div>
</div>

<aside className="col-span-12 lg:col-span-4">
<div className="sticky top-32 bg-surface-container-high rounded-[2rem] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-outline-variant/5">
<h3 className="text-2xl font-headline font-bold mb-8 text-on-surface">Your Reservation</h3>
<div className="space-y-6 mb-8">

<div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-highest/50 border border-primary/20">
<div className="p-2 bg-primary/10 rounded-lg">
<span className="material-symbols-outlined text-primary">content_cut</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<p className="font-headline font-bold text-on-surface text-sm">The Executive Cut</p>
<button className="text-on-surface-variant hover:text-error transition-colors">
<span className="material-symbols-outlined text-base">close</span>
</button>
</div>
<p className="text-xs font-label text-outline uppercase tracking-wider mt-1">45 MINS • £65</p>
</div>
</div>

<div className="border-2 border-dashed border-outline-variant/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3">
<span className="material-symbols-outlined text-outline-variant">add_circle</span>
<p className="text-xs font-label text-outline uppercase tracking-widest">Add more services</p>
</div>
</div>
<div className="space-y-4 pt-6 border-t border-outline-variant/15 mb-8">
<div className="flex justify-between items-center text-sm">
<span className="text-on-surface-variant font-label uppercase tracking-widest">Subtotal</span>
<span className="text-on-surface font-bold">£65.00</span>
</div>
<div className="flex justify-between items-center text-sm">
<span className="text-on-surface-variant font-label uppercase tracking-widest">Booking Fee</span>
<span className="text-on-surface font-bold">£2.50</span>
</div>
<div className="flex justify-between items-center pt-4 border-t border-outline-variant/10">
<span className="text-primary font-headline font-bold">Total Estimate</span>
<span className="text-2xl font-headline font-black text-primary tracking-tighter">£67.50</span>
</div>
</div>
<button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-5 rounded-2xl font-headline font-black text-lg tracking-tighter shadow-xl shadow-primary/10 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                        BOOK A SLOT <span className="material-symbols-outlined font-bold">arrow_forward</span>
</button>
<p className="text-[10px] text-center text-outline-variant uppercase font-label tracking-widest mt-6">
                        Cancellation policy applies. Secure checkout powered by SnapCut.
                    </p>
</div>
</aside>
</section>
</main>

<footer className="bg-[#0E0E0E] w-full py-12 px-12 border-t border-[#4D463A]/15 mt-20">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div className="text-[#E5C487] font-black text-xl font-headline tracking-tighter">SnapCut.</div>
<div className="flex gap-8">
<a className="text-gray-500 font-label uppercase text-xs tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a className="text-gray-500 font-label uppercase text-xs tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a className="text-gray-500 font-label uppercase text-xs tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100 text-[#E5C487]" href="#">VIP Access</a>
<a className="text-gray-500 font-label uppercase text-xs tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Careers</a>
</div>
<p className="text-gray-500 font-label uppercase text-xs tracking-widest">© 2024 SnapCut. The Digital Concierge.</p>
</div>
</footer>

    </>
  );
}
