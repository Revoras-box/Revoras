export default function OwnerDashboard() {
  return (
    <>

<style dangerouslySetInnerHTML={{ __html: `.material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
    color: #e5c487
    }
.grain-overlay {
    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuAox2kzNVZGWz4xywSzCyEJvh6sYel41cOJbvXX92qdqI8lxE3GXg8GGc_8wz-7cJ0bW_tsF0EzpzKUg1xxVDHGj0cXAJSpr6_TAZAOeye2HhV5S12VbOxjTr80QtE8PIQUu8DEqMSNOq7sYBdMbK1BwOBqF3snIGmF9tQM7gr9qAmx0kv73oahUQnnq5cPXpN8n01roY1rdKmRF1AOP1XjzfU7zFg5wJVWD4Tie028Kpgf1RKdNA8cVZBxL9vpsEJAMpp64M-NRrE);
    opacity: 0.03;
    pointer-events: none
    }` }} />

<div className="grain-overlay fixed inset-0 z-50"></div>
{/* SideNavBar */}
<nav className="h-screen w-72 flex flex-col fixed left-0 top-0 z-50 bg-[#0E0E0E] bg-[#1C1B1B] border-r border-[#4D463A]/15 py-8">
<div className="px-8 mb-12">
<h1 className="font-['Epilogue'] font-black text-[#E5C487] text-2xl tracking-tight">The Gilded Groom</h1>
<p className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px] text-outline mt-1">Elite Management</p>
</div>
<div className="flex-1 flex flex-col space-y-2 overflow-y-auto">
{/* Active Tab: Dashboard */}
<a className="flex items-center py-3 text-[#E5C487] font-bold border-l-4 border-[#E5C487] pl-4 bg-gradient-to-r from-[#E5C487]/10 to-transparent group transition-all duration-300" href="#">
<span className="material-symbols-outlined mr-4" data-icon="dashboard">dashboard</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Dashboard</span>
</a>
<a className="flex items-center py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] hover:bg-[#1C1B1B] group transition-all duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined mr-4 opacity-70 group-hover:opacity-100" data-icon="calendar_today">calendar_today</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Appointments</span>
</a>
<a className="flex items-center py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] hover:bg-[#1C1B1B] group transition-all duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined mr-4 opacity-70 group-hover:opacity-100" data-icon="content_cut">content_cut</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Barbers</span>
</a>
<a className="flex items-center py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] hover:bg-[#1C1B1B] group transition-all duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined mr-4 opacity-70 group-hover:opacity-100" data-icon="dry_cleaning">dry_cleaning</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Services</span>
</a>
<a className="flex items-center py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] hover:bg-[#1C1B1B] group transition-all duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined mr-4 opacity-70 group-hover:opacity-100" data-icon="inventory_2">inventory_2</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Inventory</span>
</a>
<a className="flex items-center py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] hover:bg-[#1C1B1B] group transition-all duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined mr-4 opacity-70 group-hover:opacity-100" data-icon="payments">payments</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Revenue</span>
</a>
</div>
<div className="px-8 mt-auto flex flex-col space-y-6">
<button className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold py-3 px-4 rounded-xl shadow-lg active:scale-95 transition-all duration-200">
                New Appointment
            </button>
<div className="pt-6 border-t border-outline-variant/20 flex flex-col space-y-4">
<a className="flex items-center text-[#4D463A] hover:text-[#E5C487] transition-all" href="#">
<span className="material-symbols-outlined mr-3 text-sm" data-icon="help_outline">help_outline</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px]">Support</span>
</a>
<a className="flex items-center text-[#4D463A] hover:text-error transition-all" href="#">
<span className="material-symbols-outlined mr-3 text-sm" data-icon="logout">logout</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px]">Logout</span>
</a>
</div>
</div>
</nav>
{/* Main Canvas */}
<main className="ml-72 flex-1 min-h-screen flex flex-col relative">
{/* TopAppBar */}
<header className="bg-[#131313]/60 backdrop-blur-xl docked full-width top-0 z-40 tonal-transition bg-[#1C1B1B] shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex justify-between items-center w-full px-8 h-20">
<div className="flex items-center">
<div className="relative">
<input className="bg-[#353534]/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm text-on-surface-variant focus:ring-1 focus:ring-primary w-64 transition-all" placeholder="Search appointments..." type="text"/>
<span className="material-symbols-outlined absolute left-3 top-2.5 text-lg" data-icon="search">search</span>
</div>
</div>
<div className="flex items-center space-x-6">
<button className="text-[#4D463A] hover:text-[#E5C487] hover:bg-[#353534]/50 p-2 rounded-full transition-all duration-300">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="text-[#4D463A] hover:text-[#E5C487] hover:bg-[#353534]/50 p-2 rounded-full transition-all duration-300">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
</button>
<div className="flex items-center pl-6 border-l border-outline-variant/20">
<div className="text-right mr-4">
<p className="text-sm font-headline font-bold text-primary">Julian Thorne</p>
<p className="text-[10px] font-label uppercase text-outline">Master Barber</p>
</div>
<div className="h-10 w-10 rounded-xl overflow-hidden border border-primary/20">
<img alt="Manager Profile" className="w-full h-full object-cover" data-alt="Close-up portrait of a professional barber with a well-groomed beard and stylish hair in a high-end studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0zY0OsCWqp_Yw84y2mmEEtryeUM6nOaRC2RT73qnqpORWqYo8c8hPqU0-zrlZU80b3qd1MYum0_jwc3Iolabo2koqHjefoVcRyscoQzJCV3wHV9n2W4Lvxj46G07T39TtdRTTdLDd1whCu9A_wophogi54vrJcee2s5lQTAtov2zbdBQJS4BxSNkYjjmlRtr1QDU3hYjsSxqV--cuefLglXx25UszISZpxSkIoGBGsCndhojdJj793turLZkGCTTpD1lMUKZEbjg"/>
</div>
</div>
</div>
</header>
{/* Dashboard Content */}
<div className="p-8 space-y-8 flex-1 overflow-y-auto bg-surface-dim">
{/* Hero Stats Bento Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/* Today's Bookings */}
<div className="surface-container-low p-6 rounded-2xl relative overflow-hidden group border border-outline-variant/10">
<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8"></div>
<div className="flex flex-col h-full justify-between relative z-10">
<div>
<p className="font-label uppercase tracking-widest text-xs text-outline mb-2">Today's Appointments</p>
<h3 className="text-4xl font-headline font-black text-on-surface">14</h3>
</div>
<div className="mt-4 flex items-center space-x-2">
<span className="px-2 py-0.5 bg-secondary-container rounded text-[10px] font-bold text-secondary flex items-center">
<span className="material-symbols-outlined text-[10px] mr-1" data-icon="trending_up">trending_up</span>
                                +12% vs last week
                            </span>
</div>
</div>
<div className="absolute bottom-4 right-6 opacity-10">
<span className="material-symbols-outlined text-6xl" data-icon="calendar_today">calendar_today</span>
</div>
</div>
{/* Revenue Card */}
<div className="bg-[#1C1B1B] p-6 rounded-2xl relative overflow-hidden group border border-outline-variant/10 shadow-xl">
<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
<div className="flex flex-col h-full justify-between relative z-10">
<div>
<p className="font-label uppercase tracking-widest text-xs text-outline mb-2">Projected Revenue</p>
<h3 className="text-4xl font-headline font-black text-primary">$1,240.00</h3>
</div>
<div className="mt-4">
<p className="text-[10px] text-outline uppercase font-label">Top Performer: <span className="text-on-surface">Fade + Beard Trim</span></p>
</div>
</div>
<div className="absolute bottom-4 right-6 opacity-10">
<span className="material-symbols-outlined text-6xl" data-icon="payments">payments</span>
</div>
</div>
{/* Slots Card */}
<div className="surface-container-low p-6 rounded-2xl border border-outline-variant/10">
<div className="flex flex-col h-full justify-between">
<div>
<p className="font-label uppercase tracking-widest text-xs text-outline mb-2">Available Slots</p>
<div className="flex items-end space-x-2">
<h3 className="text-4xl font-headline font-black text-secondary">3</h3>
<p className="text-outline text-sm pb-1">/ 18 total</p>
</div>
</div>
<div className="mt-4">
<div className="w-full bg-[#353534] h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary h-full rounded-full w-[83%]"></div>
</div>
<p className="text-[10px] text-secondary mt-2 font-bold flex items-center">
<span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2 animate-pulse"></span>
                                High Demand Today
                            </p>
</div>
</div>
</div>
</div>
{/* Schedule Timeline Section */}
<section className="grid grid-cols-12 gap-8">
{/* Timeline */}
<div className="col-span-8 surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-2xl relative overflow-hidden">
{/* Subtle Glassy Texture */}
<div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-[0.02]" style={{ backgroundImage: "linear-gradient(45deg, #e5c487 25%, transparent 25%, transparent 50%, #e5c487 50%, #e5c487 75%, transparent 75%, transparent)", backgroundSize: "20px 20px" }}></div>
<div className="flex justify-between items-center mb-10 relative z-10">
<h2 className="text-2xl font-headline font-black text-on-surface flex items-center">
                            Daily Schedule
                            <span className="ml-4 px-3 py-1 bg-[#353534] text-xs font-label uppercase tracking-widest text-primary rounded-full">October 24, 2023</span>
</h2>
<div className="flex space-x-2">
<button className="p-2 hover:bg-[#353534] rounded-lg transition-colors border border-outline-variant/20"><span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span></button>
<button className="p-2 hover:bg-[#353534] rounded-lg transition-colors border border-outline-variant/20"><span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span></button>
</div>
</div>
<div className="space-y-1 relative z-10">
{/* Timeline Row: 09:00 AM */}
<div className="grid grid-cols-12 group cursor-pointer border-l-2 border-outline-variant/20 hover:border-primary transition-all py-6 items-center">
<div className="col-span-2 px-6">
<p className="font-label text-sm text-outline group-hover:text-primary transition-colors">09:00 AM</p>
</div>
<div className="col-span-10 flex items-center bg-[#201F1F] rounded-2xl p-4 ml-4 group-hover:bg-[#2A2A2A] transition-all border border-transparent hover:border-primary/20">
<div className="w-12 h-12 rounded-xl overflow-hidden bg-[#353534]">
<img alt="Customer" className="w-full h-full object-cover" data-alt="Headshot of a modern gentleman with glasses and a friendly expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCDKp0uTEs5f1YaCy5mu1lCOZL7Vv39WH6g_8Cq22HVbDul3nx9k1aCZbboAHXlg2bkWOlIhIGWme8IXhNlyNENOwbRiqT3_p67ULZ8ZEG331XIrlvRFsKyjDdiielw1TmH9vctkcBJTg5Z7jxtixTSyhSUdOfF2f5GWzgORFra6MdXVeD9JopdwCcS97CDzZ2rdVE_MULNMOIxcuHuDIEdKm1ifGo458PdxPY-8GyXvPdefND9ILc0IOvSbBWzFhG2ltIxm71dHA"/>
</div>
<div className="ml-4 flex-1">
<h4 className="font-bold text-on-surface">Harrison Wells</h4>
<p className="text-xs text-outline">Signature Fade &amp; Sculpt</p>
</div>
<div className="text-right">
<span className="text-xs font-label text-primary-container px-3 py-1 rounded-full border border-primary/20">45 MIN</span>
</div>
<button className="ml-6 text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
</div>
{/* Timeline Row: 10:30 AM (Live Queue Chip) */}
<div className="grid grid-cols-12 group cursor-pointer border-l-2 border-secondary transition-all py-6 items-center">
<div className="col-span-2 px-6">
<p className="font-label text-sm text-secondary font-bold">10:30 AM</p>
</div>
<div className="col-span-10 flex items-center bg-secondary-container/20 rounded-2xl p-4 ml-4 border border-secondary/20 shadow-lg shadow-secondary/5">
<div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-secondary shadow-lg">
<img alt="Customer" className="w-full h-full object-cover" data-alt="Stylish man with textured hair and a modern aesthetic sitting in a barbershop chair" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTXx50kgVmH8uQXvS6k2TMy4RywutnR7odHhmXWuaqEcY_ropdBtP3-j9W63l8YLcXEo_Wl-JPaBpV6kXGBgju8gvDlNH63zhWY357KM-r_Mr0J8nxpza0DSuDcKwg8SpEgT9AG2F4h-GCkqTLeYw6DdIzMqYBAJaA-o2HhT5i9JKTVy10zV4yOcIe3bVxmPBsWQp2GfBZn7n3TDpC9wv_WjInWC8XqBKR1PnMfjPJvnC0S_XDJNkV57j20PrWLACtaxyqR7X5bmI"/>
</div>
<div className="ml-4 flex-1">
<div className="flex items-center">
<h4 className="font-bold text-on-surface">Elias Vance</h4>
<span className="ml-3 px-2 py-0.5 bg-secondary text-[8px] font-black uppercase text-on-secondary rounded flex items-center animate-pulse">
                                            ACTIVE NOW
                                        </span>
</div>
<p className="text-xs text-on-secondary-container">The Royal Treatment (Full Service)</p>
</div>
<div className="text-right">
<p className="text-[10px] text-outline uppercase font-label">Time Remaining</p>
<p className="text-secondary font-headline font-bold">18:42</p>
</div>
</div>
</div>
{/* Timeline Row: 12:00 PM */}
<div className="grid grid-cols-12 group cursor-pointer border-l-2 border-outline-variant/20 hover:border-primary transition-all py-6 items-center">
<div className="col-span-2 px-6">
<p className="font-label text-sm text-outline group-hover:text-primary transition-colors">12:00 PM</p>
</div>
<div className="col-span-10 flex items-center bg-[#201F1F] rounded-2xl p-4 ml-4 group-hover:bg-[#2A2A2A] transition-all">
<div className="w-12 h-12 rounded-xl overflow-hidden bg-[#353534]">
<img alt="Customer" className="w-full h-full object-cover" data-alt="Portrait of a distinguished older man with graying hair and beard in a sophisticated outfit" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAl9WU7Jhqbk6jDlGJ9A2ustLpyfAXe1CFf0piZeEezjorT0GSgmEmtQBEtLVcYmBzsnNpvKuug-HRswFH1Z98pB_uKMDeaxLkw5-2BW2Ad7dRGDvQNsE4NoZD7gd5DHsi2gHSqVkywbv561dM9IW6pQEwoZEXnidgbeSCltBaYmatThHs1_vgm75Y1PomQ4sLB8DHwyT7g0PCsU-diXf5TBCC85miWWi7Kzch0SJdNRKdtCr07cHgyba-nXRr-HbfPjNGZuAf7f0"/>
</div>
<div className="ml-4 flex-1">
<h4 className="font-bold text-on-surface">Arthur Sterling</h4>
<p className="text-xs text-outline">Classic Razor Shave</p>
</div>
<div className="text-right flex flex-col items-end">
<span className="bg-primary-container/10 text-primary-container text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20 mb-1">VIP MEMBER</span>
<span className="text-xs font-label text-outline">30 MIN</span>
</div>
<button className="ml-6 text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
</div>
</div>
</div>
{/* Right Sidebar: Staff Status & Quick Actions */}
<div className="col-span-4 space-y-8">
{/* Staff Status Card */}
<div className="surface-container rounded-3xl p-6 border border-outline-variant/10">
<h3 className="font-headline font-black text-lg text-on-surface mb-6">Staff Availability</h3>
<div className="space-y-6">
<div className="flex items-center justify-between">
<div className="flex items-center">
<div className="relative">
<div className="w-10 h-10 rounded-full border border-primary/30 overflow-hidden">
<img alt="Barber" className="w-full h-full object-cover" data-alt="Professional barber with styled hair and focused look" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMCzqHZc7lqksH56pKUtmgLF13lxEvrwEsJgZH_FYqWg1leB-PiVA4__XuXIWLojdtmOYmbhDvvsH_ryPCDwF0RqLp8_1M2-N15SbeWpiFn3uqapUP3KO0dTBAkL0w1MveOKPeoE0hMaEwl65OYnVOdf1y9nCmF_aBFd0YZtPaGa_LTJc8ERpk1cxFYu0rw7-GOI1xZV496PkbhU-kq7TdK1W0XGcayj7bqkjWkQaUkDI3w7gwjiLf6zbiWZ4xhPk75Ax3CSCgNzA"/>
</div>
<span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface-container"></span>
</div>
<div className="ml-3">
<p className="text-sm font-bold text-on-surface">Marcus F.</p>
<p className="text-[10px] text-secondary font-bold uppercase font-label">Busy</p>
</div>
</div>
<div className="text-right">
<p className="text-[10px] text-outline uppercase font-label">Next Free</p>
<p className="text-xs text-on-surface">11:15 AM</p>
</div>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center">
<div className="relative">
<div className="w-10 h-10 rounded-full border border-primary/30 overflow-hidden">
<img alt="Barber" className="w-full h-full object-cover" data-alt="Young energetic barber with sharp features" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8RolPVke-jNY9KpNuTsLD0wk7pVkEHIczjxHq9RaA6WmeaDKIqV2mSkybFzkom6Avbix3aO2gWyGF5PB4ag9ifx5bGvHDlbCCbcSqMBTOXlAaokUjpKnbRvAo6TjfKhmLEILURviIjn0YwMnPyUXUTE72PHoyQCRNSm10IJkdZKFAO_b-6WaeGe9m_6mHn4pJWDiMmyKhlstsTuoSxrYuCT2i82aF06i2DU-ZKS0FSiEg7DzD8AqUTLbn617afOESe1X4NuNi5-M"/>
</div>
<span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface-container"></span>
</div>
<div className="ml-3">
<p className="text-sm font-bold text-on-surface">Lee Jun</p>
<p className="text-[10px] text-secondary font-bold uppercase font-label">Available</p>
</div>
</div>
<div className="text-right">
<p className="text-[10px] text-outline uppercase font-label">Current Task</p>
<p className="text-xs text-on-surface">—</p>
</div>
</div>
</div>
</div>
{/* Inventory Alert (Bento-style minor card) */}
<div className="bg-gradient-to-br from-error-container/20 to-transparent rounded-3xl p-6 border border-error/20">
<div className="flex items-start justify-between">
<div>
<h3 className="text-error font-headline font-bold mb-1">Low Inventory</h3>
<p className="text-xs text-on-surface-variant">2 items need restock</p>
</div>
<span className="material-symbols-outlined text-error" data-icon="inventory_2">inventory_2</span>
</div>
<div className="mt-4 space-y-2">
<div className="flex justify-between items-center text-xs">
<span className="text-on-surface">Gold Wax Pomade</span>
<span className="text-error font-bold">2 Left</span>
</div>
<div className="w-full bg-[#353534] h-1 rounded-full">
<div className="bg-error h-full rounded-full w-1/5"></div>
</div>
</div>
<button className="mt-6 w-full py-2 bg-error/10 hover:bg-error/20 text-error text-[10px] uppercase font-black tracking-widest rounded-lg transition-colors border border-error/20">
                            Order Now
                        </button>
</div>
{/* Marketing Insight */}
<div className="bg-[#2A2A2A] rounded-3xl p-6 relative overflow-hidden group">
<div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1512690196236-4d9220974640?auto=format&amp;fit=crop&amp;q=80&amp;w=400')] bg-cover bg-center transition-transform group-hover:scale-110 duration-700" data-alt="Close-up of luxury barber tools like gold scissors and straight razors on a dark leather mat"></div>
<div className="relative z-10">
<h3 className="text-primary font-headline font-black mb-2">Insight</h3>
<p className="text-sm text-on-surface-variant leading-relaxed">Most clients book their next appointment 4.2 weeks after their visit.</p>
<button className="mt-4 text-xs font-bold text-primary flex items-center hover:translate-x-1 transition-transform">
                                VIEW ANALYTICS <span className="material-symbols-outlined text-sm ml-2" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
</div>
</section>
</div>
</main>

    </>
  );
}
