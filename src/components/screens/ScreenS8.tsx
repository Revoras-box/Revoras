import React from 'react';

export default function ScreenS8() {
  return (
    <>
      
<div className="fixed inset-0 premium-grain pointer-events-none"></div>

<nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-md flex justify-between items-center px-12 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
<div className="text-2xl font-bold tracking-tighter text-[#E5C487] font-headline">SnapCut</div>
<div className="hidden md:flex items-center gap-8">
<a className="text-gray-400 font-medium font-headline tracking-tight hover:text-[#E5C487] transition-colors duration-300" href="#">Experience</a>
<a className="text-gray-400 font-medium font-headline tracking-tight hover:text-[#E5C487] transition-colors duration-300" href="#">Services</a>
<a className="text-gray-400 font-medium font-headline tracking-tight hover:text-[#E5C487] transition-colors duration-300" href="#">Barbers</a>
<a className="text-[#E5C487] border-b-2 border-[#E5C487] pb-1 font-headline tracking-tight" href="#">Locations</a>
</div>
<div className="flex items-center gap-6">
<button className="material-symbols-outlined text-[#C8A96E] transition-transform active:scale-95">notifications</button>
<div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/15">
<img alt="User profile" data-alt="Close-up portrait of a stylish man with a well-groomed beard and undercut hairstyle in warm cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSYidbdgJ5fY2zhR8kkcLQQ_7NGe01Pno_MqdmJVex34sw9IGSe5Poi_oUpeefMcQbQm4CzQdLfXWrfiU344JQiR_FLS3bYBbACaiCy_GNNy6ko75fZUVy2-bX4gQVjg26HxqzX4jgcilds__t5wrZ5HS5BG6m191RAh6DmHmJVN2QYIpVw7GKOeJIgG5HbE07rgMyj0G1b-s5lP7Va86y9ABtG4RlbidDVDAeNGqFGFWF7uDebeIiWKprn8h68wMFIWP0PRp0QRA"/>
</div>
<button className="gold-gradient text-on-primary font-headline font-bold px-6 py-2 rounded-xl transition-transform active:scale-95">Book Now</button>
</div>
</nav>
<main className="pt-32 pb-20 px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">

<aside className="w-full md:w-80 shrink-0 space-y-8">
<div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/15 relative overflow-hidden group">
<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-primary/10"></div>
<h3 className="font-label text-xs tracking-widest uppercase text-primary mb-6">Grooming Stats</h3>
<div className="space-y-6">
<div className="flex justify-between items-end">
<div>
<p className="text-on-surface-variant text-sm font-label uppercase">Total Sessions</p>
<p className="text-4xl font-headline font-extrabold text-on-surface mt-1">24</p>
</div>
<span className="material-symbols-outlined text-4xl opacity-20">content_cut</span>
</div>
<div className="h-px bg-outline-variant/10 w-full"></div>
<div className="flex justify-between items-end">
<div>
<p className="text-on-surface-variant text-sm font-label uppercase">Loyalty Points</p>
<p className="text-4xl font-headline font-extrabold text-primary mt-1">1,250</p>
</div>
<span className="material-symbols-outlined text-4xl opacity-20">military_tech</span>
</div>
<div className="mt-8 p-4 bg-surface-container-highest/40 rounded-2xl border border-outline-variant/10">
<div className="flex justify-between text-xs font-label uppercase mb-2">
<span>VIP Progress</span>
<span className="text-primary">85%</span>
</div>
<div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
<div className="h-full gold-gradient w-[85%]"></div>
</div>
<p className="text-[10px] text-on-surface-variant mt-3 leading-relaxed">3 more visits until your complimentary Royal Shave treatment.</p>
</div>
</div>
</div>
<div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/5">
<h4 className="font-headline font-bold text-lg mb-4 text-on-surface">Member Perks</h4>
<ul className="space-y-4">
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
<span className="text-sm text-on-surface-variant">Priority queue access at all locations</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
<span className="text-sm text-on-surface-variant">Complimentary beverage service</span>
</li>
</ul>
</div>
</aside>

<section className="flex-grow">
<header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<h1 className="text-5xl font-headline font-black tracking-tighter text-on-surface mb-2">My Bookings</h1>
<p className="text-on-surface-variant font-body">Manage your upcoming and past sanctuary sessions.</p>
</div>
<div className="flex bg-surface-container-low p-1 rounded-2xl border border-outline-variant/10">
<button className="px-6 py-2 rounded-xl text-sm font-headline font-bold bg-surface-container-highest text-primary shadow-lg">Upcoming</button>
<button className="px-6 py-2 rounded-xl text-sm font-headline font-medium text-on-surface-variant hover:text-on-surface transition-colors">Past</button>
<button className="px-6 py-2 rounded-xl text-sm font-headline font-medium text-on-surface-variant hover:text-on-surface transition-colors">Cancelled</button>
</div>
</header>

<div className="grid grid-cols-1 gap-6">

<div className="group bg-surface-container-low rounded-[2rem] overflow-hidden flex flex-col lg:flex-row border border-outline-variant/5 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
<div className="lg:w-64 h-48 lg:h-auto overflow-hidden relative">
<img alt="Luxury barbershop interior" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Modern high-end barbershop interior with black leather chairs, dark wood accents, and warm amber atmospheric lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnjwMcCU_rbvMJWmRJeod3hqpFBGDi54JuB5GNQWF2-ivUSjVsvHoZeIfcc2-_FFlc2ULOqTfhv16eGtgo5two27LLOvE4h2E5I_yk5IddOq_sAiBOd7mSqJrwuOWQMipthmK6C-4KPAX7ZMexczkEs8KExRHz7WGXw1pT9DthohQJ8srNER9zu7GJcsCncLH81RkgASlMi_Ysk33uKbsKEwEk7x67koYsSiDEPHlTx19aQNlEMUbvFqU02_cJxKFkcCnTsX-FF1M"/>
<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent lg:hidden"></div>
</div>
<div className="flex-grow p-8 flex flex-col justify-between">
<div className="flex justify-between items-start mb-4">
<div>
<div className="flex items-center gap-3 mb-1">
<h3 className="text-2xl font-headline font-bold">The Executive Cut</h3>
<span className="px-3 py-1 bg-secondary-container/20 text-secondary text-[10px] font-label uppercase tracking-widest rounded-full flex items-center gap-1.5 animate-pulse">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                        Confirmed
                                    </span>
</div>
<p className="text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-sm">location_on</span>
                                    Mayfair Flagship Studio
                                </p>
</div>
<div className="text-right">
<p className="text-xs font-label uppercase tracking-tighter text-on-surface-variant mb-1">Appointment Date</p>
<p className="text-xl font-headline font-bold text-primary">Oct 24, 14:30</p>
</div>
</div>
<div className="flex items-center gap-4 py-4 border-y border-outline-variant/10">
<div className="flex -space-x-2">
<img alt="Barber" className="w-10 h-10 rounded-full border-2 border-surface-container-low" data-alt="Portrait of a professional barber with a focused expression in a dimly lit studio environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCQOGZyIFqhZgJT2NRzgxUIDfQ8mXcan4gXp7FIzGuyqwlM0brDyeXj_EG7TDv4Jw09w44gTgMoh7Pys-g_PQQtXASuJN-98XY4Y2Eltjbbk04j5WhntK9DHjpitHbH5Svtda1YabZAjGYmNwioRtVFdmCeGnOIybsX3WsCOCkS8npfkkMFSTbYFyi4MRJgDhHW9GFy8TJusos_B0K7Xh7aWDYFC0Q-Gl80rhOlYqAYplsP0jJUCqT9xlhbBRAnkCtCT2PLxe4_KY"/>
</div>
<div>
<p className="text-xs text-on-surface-variant font-label uppercase">Master Barber</p>
<p className="font-medium text-on-surface">Julian Rossi</p>
</div>
<div className="ml-auto flex gap-4">
<div className="text-right">
<p className="text-xs text-on-surface-variant font-label uppercase">Service Time</p>
<p className="font-medium text-on-surface">45 Mins</p>
</div>
<div className="text-right">
<p className="text-xs text-on-surface-variant font-label uppercase">Price</p>
<p className="font-medium text-on-surface">£65.00</p>
</div>
</div>
</div>
<div className="flex items-center gap-4 mt-6">
<button className="flex-grow bg-surface-container-highest text-on-surface font-headline font-bold py-3 rounded-xl hover:bg-primary hover:text-on-primary transition-all active:scale-[0.98]">
                                Manage Booking
                            </button>
<button className="aspect-square bg-surface-container-highest/50 text-primary p-3 rounded-xl hover:bg-surface-container-highest transition-all">
<span className="material-symbols-outlined">calendar_add_on</span>
</button>
</div>
</div>
</div>

<div className="group bg-surface-container-low rounded-[2rem] overflow-hidden flex flex-col lg:flex-row border border-outline-variant/5 hover:border-primary/20 transition-all duration-500">
<div className="lg:w-64 h-48 lg:h-auto overflow-hidden relative">
<img alt="Luxury beard grooming" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Extreme close-up of high-quality grooming tools like a straight razor and brush on a dark marble surface with dramatic shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4ksLCrMPV5wE3-cj_wOigPdThaMM9V0lXyBOCoHKw4w-eRaZ7xZgHW8mZonqOy44XbEZHANRMJZjPmC15lsjrYW8T6beutd0XMm7cfdqkA69c1VlXe51-yD8XruyGhlg2LnF45JU6d-VZF3XL4ooFa2_yE8GdXrLIaCMBx8hZmN2dC2yM-izgezjpvbDP58GLydQ_Wm46KMY9EBQGTPdedy0TrRjx1cvEN06wSkwJk0xSoOMElGg0TH_l282uaqSdozTcQZP45eo"/>
<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent lg:hidden"></div>
</div>
<div className="flex-grow p-8 flex flex-col justify-between opacity-80 group-hover:opacity-100">
<div className="flex justify-between items-start mb-4">
<div>
<div className="flex items-center gap-3 mb-1">
<h3 className="text-2xl font-headline font-bold">Signature Shave</h3>
<span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-[10px] font-label uppercase tracking-widest rounded-full">
                                        Pending
                                    </span>
</div>
<p className="text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-sm">location_on</span>
                                    Soho Heritage House
                                </p>
</div>
<div className="text-right">
<p className="text-xs font-label uppercase tracking-tighter text-on-surface-variant mb-1">Appointment Date</p>
<p className="text-xl font-headline font-bold text-on-surface">Nov 02, 11:00</p>
</div>
</div>
<div className="flex items-center gap-4 py-4 border-y border-outline-variant/10">
<div className="flex -space-x-2">
<img alt="Barber" className="w-10 h-10 rounded-full border-2 border-surface-container-low" data-alt="Portrait of a young barber with tattoos wearing a black apron in a vintage style barber shop" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHv7Mm4gF3gUsvgBFITvklkHF3N4cILekzJHSkUBfBDWa7Liqo0t-X7t8o8LTWJdy04wRcmoVCXF0RWZ6dMbeLQ0fsUK2nfRY0fNXV1MaEKAGa2eDWvbZkUdy5CShFY9qdpB6GVkZL0vrisbWOrpxHIokN-9CfG9gUtOyNf781xgUxdDgmu-6Cqz1w19-wapODtss3xM6ChkdkhXbN7U743IPkNZJQxpgJoP6LQMkl8geP0xNJpZV3Lm7LOsSkNYn7ZtPIBoTH1Iw"/>
</div>
<div>
<p className="text-xs text-on-surface-variant font-label uppercase">Barber</p>
<p className="font-medium text-on-surface">Marcus Thorne</p>
</div>
<div className="ml-auto flex gap-4">
<div className="text-right">
<p className="text-xs text-on-surface-variant font-label uppercase">Price</p>
<p className="font-medium text-on-surface">£45.00</p>
</div>
</div>
</div>
<div className="flex items-center gap-4 mt-6">
<button className="flex-grow bg-surface-container-highest/30 text-on-surface font-headline font-bold py-3 rounded-xl border border-outline-variant/10 hover:border-primary/40 transition-all active:scale-[0.98]">
                                View Details
                            </button>
<button className="px-6 bg-error-container/10 text-error font-headline font-bold py-3 rounded-xl hover:bg-error-container/20 transition-all">
                                Reschedule
                            </button>
</div>
</div>
</div>
</div>
</section>
</main>

<footer className="bg-surface-container-lowest w-full py-12 px-12 border-t border-[#4D463A]/15 mt-20">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div className="text-[#E5C487] font-black font-headline text-xl">SnapCut</div>
<div className="flex gap-8">
<a className="font-label uppercase text-xs tracking-widest text-gray-500 hover:text-[#E5C487] transition-all" href="#">Privacy Policy</a>
<a className="font-label uppercase text-xs tracking-widest text-gray-500 hover:text-[#E5C487] transition-all" href="#">Terms of Service</a>
<a className="font-label uppercase text-xs tracking-widest text-gray-500 hover:text-[#E5C487] transition-all" href="#">VIP Access</a>
<a className="font-label uppercase text-xs tracking-widest text-gray-500 hover:text-[#E5C487] transition-all" href="#">Careers</a>
</div>
<p className="font-label uppercase text-xs tracking-widest text-gray-500">© 2024 SnapCut. The Digital Concierge.</p>
</div>
</footer>

<div className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-low/90 backdrop-blur-xl border-t border-outline-variant/10 px-8 py-4 flex justify-between items-center z-50">
<button className="flex flex-col items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined">explore</span>
<span className="text-[10px] font-label">EXPLORE</span>
</button>
<button className="flex flex-col items-center gap-1 text-primary">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>calendar_month</span>
<span className="text-[10px] font-label">BOOKINGS</span>
</button>
<button className="flex flex-col items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined">person</span>
<span className="text-[10px] font-label">PROFILE</span>
</button>
</div>

    </>
  );
}
