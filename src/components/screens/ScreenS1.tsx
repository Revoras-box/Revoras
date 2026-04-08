import React from 'react';

export default function ScreenS1() {
  return (
    <>
      

<nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.4)] px-12 py-4 flex justify-between items-center">
<div className="flex items-center gap-12">
<span className="text-2xl font-bold tracking-tighter text-[#E5C487] font-headline">SnapCut</span>
<div className="hidden md:flex gap-8">
<a className="text-[#E5C487] border-b-2 border-[#E5C487] pb-1 font-headline tracking-tight transition-colors duration-300" href="#">Experience</a>
<a className="text-gray-400 font-medium font-headline tracking-tight hover:text-[#E5C487] transition-colors duration-300" href="#">Services</a>
<a className="text-gray-400 font-medium font-headline tracking-tight hover:text-[#E5C487] transition-colors duration-300" href="#">Barbers</a>
<a className="text-gray-400 font-medium font-headline tracking-tight hover:text-[#E5C487] transition-colors duration-300" href="#">Locations</a>
</div>
</div>
<div className="flex items-center gap-6">
<button className="material-symbols-outlined text-gray-400 hover:text-[#E5C487] transition-colors">notifications</button>
<div className="w-10 h-10 rounded-full border border-[#4D463A]/30 overflow-hidden">
<img alt="User profile" data-alt="close-up portrait of a well-groomed man with a sharp beard and stylish haircut, studio lighting, professional aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYjVOrO2hH1sGl4BJ_sJr2ofkqM6dPe3pZLMzG96ghfl6sGDLJ9KgMkCn8h2FqSq3QD8YEC4bNYrniiUJcXxOei_do220J68Yaw1tCZBqfRa8FpfIDLSvGtbu5cIAaYFvtvzmgiCCeQizZcQsMzh0j9CRFMYocIVOdVWJ_tjxAqfcan-ooQ93M-mHk15NyGq-D9UIuMrVJ9Q9_sMorNQtwI7GoCkPvC6W_n0a0cuCmOdjJ44iLQorShflm2-PRCELP57dfft1hrZY"/>
</div>
<button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-headline font-bold text-sm tracking-tight active:scale-95 transition-transform">Book Now</button>
</div>
</nav>
<main className="pt-32 pb-20 max-w-7xl mx-auto px-6 lg:px-12">

<header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
<div className="max-w-2xl">
<div className="flex items-center gap-3 mb-4">
<span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
<span className="font-label text-xs tracking-widest text-on-surface-variant uppercase">Greenwich Village, NY • Open Now</span>
</div>
<h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter text-on-surface mb-4">Welcome back, <span className="text-primary italic">James</span></h1>
<p className="text-on-surface-variant text-lg max-w-md font-body leading-relaxed">Your signature look is waiting. We've curated the morning's best availability for you.</p>
</div>
<div className="flex gap-4">
<div className="h-32 w-48 rounded-xl overflow-hidden bg-surface-container-high relative">
<img alt="Barbershop interior" className="object-cover w-full h-full opacity-60" data-alt="modern luxury barbershop interior with dark leather chairs and warm amber lighting, cinematic atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg8OV6thRbI3R0ep4dWoTH2LeZ6E0ji6UW0mtgVUA63c04econPYVqWmLS5FvzzayGp-5YrDJXBPxE-wAQjPzOL_NaUgxO4Ms0UViVRP8__Q1ypJN8gKM14ZSLEz3GMzAxg_Q8M60FmaArWJ8itjbGHRVZd0gdhb2ZIxtRf6rth2q84nZrd325bgkL_E5gT-N9Qw_sVwCEXFx7duO9HY8dRPWkgWZ8HHD0K2MMiyzxxN5-ASufB-ndk6VQEwOfWg5Skg2VgAFEyBU"/>
<div className="absolute inset-0 p-4 flex flex-col justify-end">
<span className="font-label text-[10px] text-primary tracking-widest uppercase">My Profile</span>
<span className="font-headline font-bold text-sm">Platinum Member</span>
</div>
</div>
</div>
</header>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

<div className="lg:col-span-8 space-y-12">

<section>
<div className="flex items-center justify-between mb-6">
<h2 className="font-headline text-2xl font-bold tracking-tight">Upcoming Booking</h2>
<button className="text-primary font-label text-xs tracking-widest uppercase hover:underline">View History</button>
</div>
<div className="bg-surface-container-low rounded-xl p-1 flex flex-col md:flex-row overflow-hidden">
<div className="md:w-1/3 h-64 md:h-auto overflow-hidden rounded-lg">
<img alt="The Heritage Studio" className="w-full h-full object-cover" data-alt="Close up of a professional barber tool set on a dark wood surface with soft focus background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgACWVyeMblqe2812i29W0GWIm8WLnfO9OSzVeKmiNjk6d8TleQVK0cPdK5GBBzW4-1kxX7oe07G_-bG1Lztuw7YF5VisnAnaW-UR-arMh9PH8umMIkRMzsQullPrnplMFppmd6VRfHhgi-ctAQxJBEfUu2euOLKq9iX5ulH1EGCaPJVnqUyw-QnP0HJXAHx29Qjw3cbKwpztEE5tDK1Xqd_WCuUR_WXeU5sZkMhbvHssZnLbvhD9cFGZsCA38P4Q-7-HgYTbC7pM"/>
</div>
<div className="flex-1 p-8 flex flex-col justify-between">
<div>
<div className="flex justify-between items-start mb-2">
<h3 className="font-headline text-2xl font-bold">The Heritage Studio</h3>
<span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-label font-bold tracking-tighter uppercase">Confirmed</span>
</div>
<div className="flex items-center gap-4 text-on-surface-variant font-body mb-6">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-sm">calendar_today</span>
<span className="text-sm">Tomorrow, 10:30 AM</span>
</div>
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-sm">person</span>
<span className="text-sm">with Marcus V.</span>
</div>
</div>
</div>
<div className="flex items-center gap-4">
<button className="flex-1 bg-surface-container-highest text-on-surface px-6 py-3 rounded-xl font-headline font-bold text-xs tracking-tight hover:bg-outline-variant transition-colors">Manage Booking</button>
<button className="p-3 rounded-xl border border-outline-variant/15 text-primary-fixed-dim hover:bg-primary/10 transition-colors">
<span className="material-symbols-outlined">directions</span>
</button>
</div>
</div>
</div>
</section>

<section>
<div className="flex items-center justify-between mb-6">
<h2 className="font-headline text-2xl font-bold tracking-tight">Recommended for You</h2>
<div className="flex gap-2">
<button className="w-8 h-8 rounded-full border border-outline-variant/15 flex items-center justify-center text-primary-fixed-dim"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
<button className="w-8 h-8 rounded-full border border-outline-variant/15 flex items-center justify-center text-primary-fixed-dim"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<div className="group cursor-pointer">
<div className="relative h-64 rounded-xl overflow-hidden mb-4 asymmetric-clip">
<img alt="Iron &amp; Oak" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="overhead view of a high-end grooming kit and razors on a dark stone surface, moody lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKub56liJpr3PLi8hJWePA95eA_mksLAAyqTICkEo2EeBVOGb3gLNFuddmSNMmawrFbI1zZMHFYoWjjjoNVWKe6phXPrx-AbrKy6bbiy78_PX1uVWGhNDkTJTFM-2kLRvT1bORZ2P6z_dudUC1zqmduA8I8HOJH0pVMLZCQfci2cZE7Vl275vuyfp_uqOgsi6iYQXJSTEM5xLjdk1-GE0ufdck4cY5RHQlKzPhe3IYIu-QaZb1St244uyFRjvEj8zpfWTAx4vCo0M"/>
<div className="absolute top-4 left-4 bg-[#131313]/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-primary text-xs" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="text-xs font-bold font-label text-on-surface">4.9</span>
</div>
</div>
<h4 className="font-headline text-xl font-bold mb-1">Iron &amp; Oak Republic</h4>
<div className="flex gap-2 mb-3">
<span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest px-2 py-0.5 rounded border border-outline-variant/15">Classic Cut</span>
<span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest px-2 py-0.5 rounded border border-outline-variant/15">Hot Towel</span>
</div>
</div>

<div className="group cursor-pointer">
<div className="relative h-64 rounded-xl overflow-hidden mb-4 asymmetric-clip">
<img alt="The Refinery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="stylish barber performing a haircut on a client in a modern studio with dramatic light rays" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7W8b8B39gspePAsChrAlOQc6wzjagJ88zy-c5ZnAl8vwCfvOvXlK19p7rMbS2oocol4Bs37YW3Z9jzgaGKbylvH_G9s9aF_KunDIKF1fej-lJh0i6WgduFNeuydU6hiZ3IBOkuPezEcLNiAIFT9Kkwc2cq1xSFnOX9hajKw_29X99M7t6Dx21mGjPBxsMjuhrB8_lFD96ZGpiCOG2zI5KPV_V0w1CGbc5tJOMPWrXdpAFygpdXsjw3NywjaBUlE841RljVxwGdpI"/>
<div className="absolute top-4 left-4 bg-[#131313]/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-primary text-xs" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="text-xs font-bold font-label text-on-surface">4.8</span>
</div>
</div>
<h4 className="font-headline text-xl font-bold mb-1">The Refinery NY</h4>
<div className="flex gap-2 mb-3">
<span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest px-2 py-0.5 rounded border border-outline-variant/15">Luxury Beard</span>
<span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest px-2 py-0.5 rounded border border-outline-variant/15">VIP Lounge</span>
</div>
</div>
</div>
</section>
</div>

<div className="lg:col-span-4 space-y-12">

<section>
<div className="flex items-center justify-between mb-8">
<h2 className="font-headline text-2xl font-bold tracking-tight">Master Artisans</h2>
<span className="text-primary-fixed-dim material-symbols-outlined">auto_awesome</span>
</div>
<div className="space-y-6">

<div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer">
<div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 p-1 group-hover:border-primary transition-colors">
<img alt="Alessandro" className="w-full h-full object-cover rounded-full" data-alt="Portrait of a sophisticated male barber with glasses and a neatly trimmed beard, clean white background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0FTgEH1x0w4QmABXi_3V4gq5KmNQrVMnMM7ZgwovzBo6tow3gz4pw5TSbQKuHHkslfUBYw_xparU5ORrUQU2UDXAEi5cQ4KIdqlSZAubLU358chbavDP6PO-kPyfDP1cRmCRnni2JjxqCVNQzk5mZYALFk92LVg77xblzO6oC9oflD1cXqUxgQj2oMSMvoI4KDbrfrEkYqPwZC0mt6mbDnH57IWotAgz2DkMvcZnOWbstXf0ARQAt_xjPhiC1jsabBo2mMDbfi6k"/>
</div>
<div>
<h4 className="font-headline font-bold">Alessandro Rossi</h4>
<p className="text-on-surface-variant text-xs font-label uppercase tracking-widest mb-1">Creative Director</p>
<div className="flex items-center gap-2">
<span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded">Available Today</span>
</div>
</div>
</div>

<div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer">
<div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 p-1 group-hover:border-primary transition-colors">
<img alt="Lena" className="w-full h-full object-cover rounded-full" data-alt="Professional woman barber with stylish short hair, smiling confidently, workshop background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9kGgJMoZSFVVrsrkzJYrkybg3fbd_hMZKAv15cQ5Q9sWbPFDaOatIn3jy0spdXxIHfYVQ67SGLBJJrzhxHCXTUAoCvIYfILi1fdr4QNVnFPUjkHHtngl19-SPkhQayAu4iVTNAFJwfO8FYtolxB7XU3Gzb8jHRnYczWThjIYXkbf30cxpMKWCBFWfBORaRgECI7wemD05f0T0-On5McoX7-JsnV7GpksGcmLskwqEQtxNUNT82VzHlec_bNyIhtsAzvTwrIcVzDs"/>
</div>
<div>
<h4 className="font-headline font-bold">Lena Schmit</h4>
<p className="text-on-surface-variant text-xs font-label uppercase tracking-widest mb-1">Senior Stylist</p>
<div className="flex items-center gap-2">
<span className="bg-outline-variant/20 text-on-surface-variant text-[10px] px-2 py-0.5 rounded">Booked until Tue</span>
</div>
</div>
</div>

<div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer">
<div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 p-1 group-hover:border-primary transition-colors">
<img alt="David" className="w-full h-full object-cover rounded-full" data-alt="Portrait of an experienced male barber with tattoos and a trendy haircut in a dimly lit studio" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm0LjUBn4w0_3tcw6Zg6BfEWt79V9H0OHWwgQijJAQDlUSXvguJwWTYlA3nDDHZvCF0DWakLnf33B356jMzJPow5R6tQrx92x9IAw0JH-Naj1t0HRKgqVUs37UmZX092mDcr4wNQx0BK7Q7ZrMVH38Im-0IZYhGlSusODWyNrLtfPEsdOZfL_w_4mUQ015NMf0ioGCz6MrpQpkcnMUl8LYzoKEukoFd9wm9PcKb5kJg8DE1RUhOT7HJvQf1gHFu-wBgBK3p-x--ZY"/>
</div>
<div>
<h4 className="font-headline font-bold">David Chen</h4>
<p className="text-on-surface-variant text-xs font-label uppercase tracking-widest mb-1">Master Barber</p>
<div className="flex items-center gap-2">
<span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded">Available Today</span>
</div>
</div>
</div>
</div>
</section>

<div className="glass-card p-8 rounded-2xl border border-outline-variant/15 relative overflow-hidden group">
<div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
<span className="material-symbols-outlined text-6xl text-primary">currency_bitcoin</span>
</div>
<h3 className="font-headline text-xl font-bold mb-4 relative z-10">VIP Priority Access</h3>
<p className="text-on-surface-variant text-sm mb-6 leading-relaxed relative z-10">Unlock last-minute cancellations and exclusive slots at NYC's top-rated studios.</p>
<button className="w-full bg-primary text-on-primary py-3 rounded-xl font-headline font-black text-xs tracking-widest uppercase relative z-10">Go Premium</button>
</div>
</div>
</div>
</main>

<footer className="bg-[#0E0E0E] border-t border-[#4D463A]/15 py-12 px-12">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div className="flex flex-col gap-2">
<span className="text-[#E5C487] font-black font-headline text-xl tracking-tighter">SnapCut</span>
<p className="text-gray-500 font-label text-[10px] tracking-widest uppercase italic">The Digital Concierge.</p>
</div>
<div className="flex gap-8">
<a className="text-gray-500 font-label uppercase text-xs tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a className="text-gray-500 font-label uppercase text-xs tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a className="text-gray-500 font-label uppercase text-xs tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">VIP Access</a>
<a className="text-gray-500 font-label uppercase text-xs tracking-widest hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Careers</a>
</div>
<div className="text-gray-500 font-label uppercase text-[10px] tracking-widest">
                © 2024 SnapCut. All rights reserved.
            </div>
</div>
</footer>

    </>
  );
}
