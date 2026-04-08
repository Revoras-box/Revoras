import React from 'react';

export default function ScreenS2() {
  return (
    <>
      
<div className="grain-overlay fixed inset-0 z-[100]"></div>

<nav className="fixed top-0 w-full z-50 flex justify-between items-center px-12 py-4 w-full bg-[#131313]/60 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
<div className="flex items-center gap-12">
<span className="text-2xl font-bold tracking-tighter text-[#E5C487] font-headline">SnapCut</span>
<div className="hidden md:flex gap-8 items-center">
<a className="text-[#E5C487] border-b-2 border-[#E5C487] pb-1 font-headline tracking-tight transition-colors duration-300" href="#">Experience</a>
<a className="text-gray-400 font-medium font-headline tracking-tight hover:text-[#E5C487] transition-colors duration-300" href="#">Services</a>
<a className="text-gray-400 font-medium font-headline tracking-tight hover:text-[#E5C487] transition-colors duration-300" href="#">Barbers</a>
<a className="text-gray-400 font-medium font-headline tracking-tight hover:text-[#E5C487] transition-colors duration-300" href="#">Locations</a>
</div>
</div>
<div className="flex items-center gap-6">
<button className="text-gray-400 hover:text-[#E5C487] transition-colors duration-300 active:scale-95 transition-transform">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/15">
<img alt="User premium profile" className="w-full h-full object-cover" data-alt="close-up portrait of a sharp-dressed man with a clean beard and stylish haircut in a dark studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANToCI7LFcmFQ480DPc_tXviTyv7GGC7BlTWo8hJqwM-0sZen3R3pIxV3PdhHPSdAXEohsR0IiXzOLcKCKwA_Y22pFZlY4fVANr2REx3r5MpGk4tSrh6QFpAcVQ0DjCofPtLB-3-IwozfrUQbtnMwsxlf8yfZkXfRVrwjq5aJZtJu5XQD8SrYs-tBYBOn9r6dKq1PETA1jIBFxW4nsLoHlYnMtBUlZtTYuuj0avd7S1rz9qOBuD9-_Ar9MEdZ50SPtElBWq3lZOpc"/>
</div>
<button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-bold font-headline tracking-tight active:scale-95 transition-transform">
                Book Now
            </button>
</div>
</nav>
<main className="relative h-screen w-full pt-20 overflow-hidden flex">

<aside className="w-[420px] h-full bg-surface-container-low z-20 flex flex-col shadow-2xl">
<div className="p-8 pb-4">
<h1 className="text-3xl font-black font-headline tracking-tighter mb-2 text-on-surface">Curated Studios</h1>
<p className="text-sm font-label uppercase tracking-widest text-outline">London, United Kingdom</p>
</div>
<div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar space-y-6">

<div className="bg-surface-container-highest rounded-xl p-5 border-l-4 border-primary transition-all cursor-pointer group">
<div className="flex gap-4 mb-4">
<img className="w-24 h-24 object-cover asymmetric-crop shadow-lg" data-alt="interior of a luxury dark barber shop with vintage leather chairs and warm amber atmospheric lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBtrrh06I1CDUMH2oZgzNs8zgpPZez-qS8WePEUWlVbk4xuNT3PaqE2T2EQgcbK1Gl7GCV0O0PJL1U5nSTzbEkXXx1_YV5iU2O1NZHcpQkR08o0aq22hPgRlnHCqkXzqCNMkgkaC69FmU1Yl0gPYqbNbmTU2kO1AIGYrZJ-l4inNowKbgkQErbNhS0GqXEOCGtCGrWmJH213B-BRKaVlqt4hEIGEHEB7J2qrglu_yqhRFP1-g9MrvxyH7J_JIdtX1v8_VMoqnua5U"/>
<div className="flex-1">
<div className="flex justify-between items-start">
<h3 className="font-headline font-bold text-lg leading-tight group-hover:text-primary transition-colors">The Gilded Razor</h3>
<span className="bg-secondary-container text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full font-label tracking-tighter">OPEN NOW</span>
</div>
<p className="text-sm text-on-surface-variant font-medium mt-1">Mayfair, W1K</p>
<div className="flex items-center gap-4 mt-3">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-primary text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="text-xs font-label font-bold">4.9</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-outline text-sm">distance</span>
<span className="text-xs font-label text-outline">0.4 miles</span>
</div>
</div>
</div>
</div>
<div className="flex gap-2">
<span className="px-3 py-1 bg-surface-container-low text-[10px] font-label text-on-surface-variant rounded-full border border-outline-variant/10">Fade Expert</span>
<span className="px-3 py-1 bg-surface-container-low text-[10px] font-label text-on-surface-variant rounded-full border border-outline-variant/10">Straight Razor</span>
</div>
</div>

<div className="bg-surface-container-low rounded-xl p-5 hover:bg-surface-container-high transition-all cursor-pointer border border-outline-variant/5 group">
<div className="flex gap-4 mb-4">
<img className="w-24 h-24 object-cover asymmetric-crop" data-alt="modern minimalist barbershop with concrete walls, linear lighting, and sleek black equipment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6LATClHOV09Sb9JGKC5nwtU7pgk4ysJgbUjZaDTT9vx1vy43MRNRRtIGiCOFN34JHyRoDHDPK3Fj8o1zAZZJTBKrVxKdaBIXv2Zj9z5azGnIT00_KCM2akkbWDUPHhBreXtwOldpMvHnZQdpI2QwlLrxJuCA2Tk-hAhTqStzziqF1MxEzy-TFKK9izsbU-YoWr3OsGijhZ8oDQKdxHsbB33xAszOy3Ct4LzdlH5lct-vafvpC41FgVkT44q3C-rbLNkbkHUqq_ZI"/>
<div className="flex-1">
<div className="flex justify-between items-start">
<h3 className="font-headline font-bold text-lg leading-tight group-hover:text-primary transition-colors">Obsidian Collective</h3>
<span className="bg-surface-container-highest text-outline text-[10px] font-bold px-2 py-0.5 rounded-full font-label tracking-tighter">CLOSES 8PM</span>
</div>
<p className="text-sm text-on-surface-variant font-medium mt-1">Soho, W1D</p>
<div className="flex items-center gap-4 mt-3">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-primary text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="text-xs font-label font-bold">4.8</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-outline text-sm">distance</span>
<span className="text-xs font-label text-outline">0.9 miles</span>
</div>
</div>
</div>
</div>
<div className="flex gap-2">
<span className="px-3 py-1 bg-surface-container-low text-[10px] font-label text-on-surface-variant rounded-full border border-outline-variant/10">Bespoke Styling</span>
</div>
</div>

<div className="bg-surface-container-low rounded-xl p-5 hover:bg-surface-container-high transition-all cursor-pointer border border-outline-variant/5 group">
<div className="flex gap-4 mb-4">
<img className="w-24 h-24 object-cover asymmetric-crop" data-alt="classic london barber shop facade with gold lettering on black wood at night" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfFIIUwW3-7C8JgJRfGMhibDdEEVWdF6mtni9OEacyTA8hAVusQ2i7mJ2umRR8k2wL4vzwVOd-fOucf4ULI7Az0VjCdaOBeAy-grdHY-p9e5v24ov8E-BDbz36PRUYrPvhS1dzq-TIXMAp0QDtCU8YiDZ0EywBZfoS9pfiHJV1f3v92PbEIIRcyVZt8PD52zYSbbLDnU7fvr-zJarkVr_pSzfrtNxPQ80iRjki7jjJjNop4Ch-_X1lS7ujLLLiBswI3dotRtnIz9k"/>
<div className="flex-1">
<div className="flex justify-between items-start">
<h3 className="font-headline font-bold text-lg leading-tight group-hover:text-primary transition-colors">Regent Cut &amp; Shave</h3>
<span className="bg-secondary-container text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full font-label tracking-tighter">OPEN NOW</span>
</div>
<p className="text-sm text-on-surface-variant font-medium mt-1">Marylebone, NW1</p>
<div className="flex items-center gap-4 mt-3">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-primary text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="text-xs font-label font-bold">5.0</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-outline text-sm">distance</span>
<span className="text-xs font-label text-outline">1.2 miles</span>
</div>
</div>
</div>
</div>
</div>
</div>
</aside>

<div className="flex-1 relative bg-[#0e0e0e]">

<div className="absolute inset-0 grayscale contrast-125 brightness-75 opacity-40 mix-blend-overlay">
<img className="w-full h-full object-cover" data-alt="highly detailed dark cinematic city map of London with glowing gold arteries and subtle street details" data-location="London" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChEluSNu1DpxF74kftC9ILh-IZV_QxnFGv1riDHKXhfh3vOsAZ8hFDq9CHZ0vfAMKbQyR5N0b9DMT5K7My3pIPA3axBRZygx_aC3BztFMsdDjUoXpuRaC0JaeXZu9TtuZOP7lESam83cXR3qyZ3t-GBVwd3acVymqZtjgTEw-V_eAgPtLVEjd-Fz5DaH-XGI_j_2bHKOGFCtu7f-wUoTLMYBix9PNn4cXsu2B0G-tdxsw3VZfPgPZPFaZU8kX7LNOf7pwjlLPkqqY"/>
</div>

<div className="absolute inset-0 pointer-events-none">


<div className="absolute top-[40%] left-[35%] flex flex-col items-center pointer-events-auto cursor-pointer">
<div className="relative flex items-center justify-center">
<div className="absolute w-12 h-12 bg-primary/20 rounded-full animate-ping"></div>
<div className="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(229,196,135,0.6)] border-2 border-on-primary">
<span className="material-symbols-outlined text-on-primary text-lg" style={{"fontVariationSettings":"'FILL' 1"}}>content_cut</span>
</div>
</div>
<div className="mt-2 bg-surface-container-highest/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-primary/30 shadow-xl">
<p className="text-xs font-headline font-bold text-primary">The Gilded Razor</p>
</div>
</div>

<div className="absolute top-[60%] left-[55%] flex flex-col items-center pointer-events-auto cursor-pointer group">
<div className="w-6 h-6 bg-surface-container-high rounded-full flex items-center justify-center border border-primary/50 group-hover:bg-primary transition-colors">
<span className="material-symbols-outlined text-primary text-sm group-hover:text-on-primary" style={{"fontVariationSettings":"'FILL' 1"}}>content_cut</span>
</div>
</div>

<div className="absolute top-[25%] left-[70%] flex flex-col items-center pointer-events-auto cursor-pointer group">
<div className="w-6 h-6 bg-surface-container-high rounded-full flex items-center justify-center border border-primary/50 group-hover:bg-primary transition-colors">
<span className="material-symbols-outlined text-primary text-sm group-hover:text-on-primary" style={{"fontVariationSettings":"'FILL' 1"}}>content_cut</span>
</div>
</div>
</div>

<div className="absolute top-8 left-1/2 -translate-x-1/2 w-[600px] z-30 space-y-4">

<div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-2xl p-2 shadow-2xl flex items-center gap-4 border border-outline-variant/10">
<div className="flex-1 flex items-center px-4 gap-3">
<span className="material-symbols-outlined text-outline" data-icon="search">search</span>
<input className="bg-transparent border-none focus:ring-0 w-full text-on-surface font-body placeholder:text-outline/60" placeholder="Search studios, barbers, or styles..." type="text"/>
</div>
<div className="h-8 w-[1px] bg-outline-variant/20"></div>
<button className="flex items-center gap-2 px-4 py-2 hover:bg-surface-container-highest rounded-xl transition-colors text-on-surface">
<span className="material-symbols-outlined text-sm" data-icon="tune">tune</span>
<span className="text-xs font-label uppercase tracking-widest">Filters</span>
</button>
</div>

<div className="flex justify-center gap-3">
<button className="bg-primary text-on-primary px-5 py-1.5 rounded-full text-xs font-label uppercase tracking-widest font-bold shadow-lg shadow-primary/20 flex items-center gap-2">
<span className="material-symbols-outlined text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>near_me</span>
                        Near Me
                    </button>
<button className="bg-surface-container-lowest/80 backdrop-blur-xl text-on-surface border border-outline-variant/15 px-5 py-1.5 rounded-full text-xs font-label uppercase tracking-widest font-medium hover:bg-primary/10 transition-colors flex items-center gap-2">
                        Open Now
                    </button>
<button className="bg-surface-container-lowest/80 backdrop-blur-xl text-on-surface border border-outline-variant/15 px-5 py-1.5 rounded-full text-xs font-label uppercase tracking-widest font-medium hover:bg-primary/10 transition-colors flex items-center gap-2">
                        Top Rated
                    </button>
<button className="bg-surface-container-lowest/80 backdrop-blur-xl text-on-surface border border-outline-variant/15 px-5 py-1.5 rounded-full text-xs font-label uppercase tracking-widest font-medium hover:bg-primary/10 transition-colors flex items-center gap-2">
                        VIP Only
                    </button>
</div>
</div>

<div className="absolute bottom-12 right-12 flex flex-col gap-3">
<button className="w-12 h-12 bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/15 rounded-xl flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all group">
<span className="material-symbols-outlined" data-icon="my_location">my_location</span>
</button>
<div className="flex flex-col bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/15 rounded-xl divide-y divide-outline-variant/10">
<button className="w-12 h-12 flex items-center justify-center hover:bg-primary/20 transition-all">
<span className="material-symbols-outlined" data-icon="add">add</span>
</button>
<button className="w-12 h-12 flex items-center justify-center hover:bg-primary/20 transition-all">
<span className="material-symbols-outlined" data-icon="remove">remove</span>
</button>
</div>
</div>
</div>
</main>

<footer className="fixed bottom-0 w-full z-40 bg-[#0E0E0E] py-4 px-12 border-t border-[#4D463A]/15 hidden md:block">
<div className="max-w-7xl mx-auto flex justify-between items-center">
<span className="text-[#E5C487] font-black font-headline uppercase text-xs tracking-widest">SnapCut. The Digital Concierge.</span>
<div className="flex gap-8">
<a className="text-gray-500 font-label uppercase text-[10px] tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a className="text-gray-500 font-label uppercase text-[10px] tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a className="text-gray-500 font-label uppercase text-[10px] tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">VIP Access</a>
<a className="text-gray-500 font-label uppercase text-[10px] tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Careers</a>
</div>
<span className="text-gray-500 font-label uppercase text-[10px] tracking-widest">© 2024</span>
</div>
</footer>

    </>
  );
}
