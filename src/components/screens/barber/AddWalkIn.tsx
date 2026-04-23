export default function AddWalkIn() {
  return (
    <>

<style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .grain-overlay {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.03;
            pointer-events: none;
        }
    ` }} />

<div className="grain-overlay fixed inset-0 z-50"></div>
{/* SideNavBar Anchor */}
<aside className="h-screen w-72 flex flex-col fixed left-0 top-0 z-50 bg-[#0E0E0E] bg-[#1C1B1B] border-r border-[#4D463A]/15">
<div className="flex flex-col h-full py-8">
<div className="px-8 mb-12">
<h1 className="font-['Epilogue'] font-black text-[#E5C487] text-2xl tracking-tight">The Gilded Groom</h1>
<p className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px] text-[#4D463A] mt-1">Elite Management</p>
</div>
<nav className="flex-1 space-y-2">
<a className="flex items-center text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300 py-3" href="#">
<span className="material-symbols-outlined mr-4" data-icon="dashboard">dashboard</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Dashboard</span>
</a>
<a className="flex items-center text-[#E5C487] font-bold border-l-4 border-[#E5C487] pl-4 bg-gradient-to-r from-[#E5C487]/10 to-transparent hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300 py-3" href="#">
<span className="material-symbols-outlined mr-4" data-icon="calendar_today">calendar_today</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Appointments</span>
</a>
<a className="flex items-center text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300 py-3" href="#">
<span className="material-symbols-outlined mr-4" data-icon="content_cut">content_cut</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Barbers</span>
</a>
<a className="flex items-center text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300 py-3" href="#">
<span className="material-symbols-outlined mr-4" data-icon="dry_cleaning">dry_cleaning</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Services</span>
</a>
<a className="flex items-center text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300 py-3" href="#">
<span className="material-symbols-outlined mr-4" data-icon="inventory_2">inventory_2</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Inventory</span>
</a>
<a className="flex items-center text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300 py-3" href="#">
<span className="material-symbols-outlined mr-4" data-icon="payments">payments</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Revenue</span>
</a>
</nav>
<div className="px-6 mt-auto space-y-4">
<button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-headline font-bold text-sm shadow-xl active:scale-95 transition-all">
                    New Appointment
                </button>
<div className="pt-6 space-y-2 border-t border-[#4D463A]/15">
<a className="flex items-center text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all py-2" href="#">
<span className="material-symbols-outlined mr-3 text-sm" data-icon="help_outline">help_outline</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px]">Support</span>
</a>
<a className="flex items-center text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all py-2" href="#">
<span className="material-symbols-outlined mr-3 text-sm" data-icon="logout">logout</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px]">Logout</span>
</a>
</div>
</div>
</div>
</aside>
<main className="ml-72 min-h-screen p-12 bg-surface">
{/* Header */}
<header className="flex justify-between items-start mb-12">
<div className="max-w-2xl">
<h2 className="text-5xl font-headline font-black text-on-surface tracking-tighter mb-4">Add Walk-In</h2>
<p className="text-on-surface-variant font-body text-lg">Secure a spot for a visiting client in seconds. High-precision manual booking.</p>
</div>
<div className="flex gap-4">
<div className="bg-secondary-container px-4 py-2 rounded-full flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
<span className="text-on-secondary-container font-label text-xs font-bold uppercase tracking-widest">Live Queue Active</span>
</div>
</div>
</header>
{/* Booking Form Bento Grid */}
<div className="grid grid-cols-12 gap-8">
{/* Left Column: Client & Barber */}
<div className="col-span-12 lg:col-span-5 space-y-8">
{/* Customer Section */}
<section className="bg-surface-container-low p-8 rounded-3xl relative overflow-hidden group">
<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8"></div>
<h3 className="font-label uppercase text-xs tracking-[0.2em] text-primary mb-8 flex items-center gap-2">
<span className="material-symbols-outlined text-sm" data-icon="person_search">person_search</span>
                        Client Identity
                    </h3>
<div className="space-y-6">
<div className="relative">
<label className="block text-[10px] font-label uppercase tracking-widest text-outline mb-2">Customer Phone</label>
<div className="flex gap-3">
<input className="flex-1 bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 text-xl font-headline py-2 outline-none transition-all placeholder:text-outline/30" placeholder="+1 (555) 000-0000" type="tel"/>
<button className="bg-surface-container-highest p-3 rounded-xl hover:bg-surface-bright transition-colors">
<span className="material-symbols-outlined text-primary" data-icon="search">search</span>
</button>
</div>
</div>
<div className="relative">
<label className="block text-[10px] font-label uppercase tracking-widest text-outline mb-2">Full Name</label>
<input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 text-xl font-headline py-2 outline-none transition-all placeholder:text-outline/30" placeholder="e.g. Julian Vane" type="text"/>
</div>
</div>
</section>
{/* Barber Assignment */}
<section className="bg-surface-container-low p-8 rounded-3xl">
<h3 className="font-label uppercase text-xs tracking-[0.2em] text-primary mb-8 flex items-center gap-2">
<span className="material-symbols-outlined text-sm" data-icon="content_cut">content_cut</span>
                        Master Barber
                    </h3>
<div className="grid grid-cols-2 gap-4">
{/* Barber Card 1 */}
<div className="bg-surface-container-highest p-4 rounded-2xl border border-transparent hover:border-primary/30 cursor-pointer transition-all flex items-center gap-4 group">
<div className="w-12 h-12 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
<img className="w-full h-full object-cover" data-alt="professional barber with beard in workshop lighting, cinematic portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo1p7dXPPVDfQPEdqdj_d-8Wvha4iPJMXZjw8xeaZ66fZ0_dKmydkcMTbzk7nqaNCNhjSzVczR1xmJgLoZZCZ6lBLsKhoTsEQGEtwmstItXX0P2jl_gPLTVvGiJZZT_4x07yMFD-HO2xxUSknfMIEvSzXJZzWLd-X2HuHNmKioeJKrv2vP2CQ1MaU51SicaWF2RgWXM1KXQpRde7aaqrJr29DwefUu-kBon6vJPxdJKRQbM4qnEPAvjsakgrPpn53hvgyXJ8MKN1o"/>
</div>
<div>
<p className="font-headline font-bold text-sm">Marcus K.</p>
<p className="text-[10px] font-label text-secondary uppercase">Available</p>
</div>
</div>
{/* Barber Card 2 */}
<div className="bg-surface-container-lowest/50 p-4 rounded-2xl border-2 border-primary cursor-pointer transition-all flex items-center gap-4 group relative">
<div className="absolute -top-2 -right-2 bg-primary text-on-primary p-1 rounded-full">
<span className="material-symbols-outlined text-xs icon-filled" data-icon="check">check</span>
</div>
<div className="w-12 h-12 rounded-xl overflow-hidden">
<img className="w-full h-full object-cover" data-alt="sharp dressed barber in modern studio setting, golden hour lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD66Nko3h0DOR65vyABSv7s6fhxVhO81o_EyCZfU73dchUhOOO4LVnrp4lFmt96bayp5UqKUCqdfxM7TGQ5N3eub0TRsxu-dWEkB14TCrlqiKddMmIpFh8td7JpGiH3sF-LpnSAv8OHm8v9cQhTxQ91LfZv870t0lH4eyJQcBMEouSi6rk03nz2hMs7Pwa3JT-91MiBMlcU7YjihGtlAIrLas2VgPVuSjujBkz-JtbKLonEGWy8vEOiqA9rCY-NNumDOPbxF-7pN1k"/>
</div>
<div>
<p className="font-headline font-bold text-sm text-primary">Julian R.</p>
<p className="text-[10px] font-label text-secondary uppercase">Selected</p>
</div>
</div>
{/* Barber Card 3 */}
<div className="bg-surface-container-highest p-4 rounded-2xl border border-transparent hover:border-primary/30 cursor-pointer transition-all flex items-center gap-4 group opacity-50">
<div className="w-12 h-12 rounded-xl overflow-hidden grayscale">
<img className="w-full h-full object-cover" data-alt="close up portrait of a barber in a stylish shop with leather accents" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSHVLk8hfkIb8uXFPkGiHq71_bLVHvJGfFNwwMzZSugQ0eojv9OxGh4325nZp9fdL8jIkHi2IraJrOL1PYiZLOxOLvnhb4L7kunEISMsBwX8woqXy1mDFuz0peAmpYz4QtTtxr-1TqsJP_ZONxPrstnzVn0ppxfsZZN6di2Ho6pShjG67unVKVEQ1m5-Zmppm9xLiOTYttwvEOoKRY81UCPMDZ2DEBZ8bCyaXN4rw8ntOmrDmhXlruriNs-cHSvSsi3LuTUBMg4jg"/>
</div>
<div>
<p className="font-headline font-bold text-sm">Sasha V.</p>
<p className="text-[10px] font-label text-error uppercase">In Session</p>
</div>
</div>
{/* Barber Card 4 (Auto) */}
<div className="bg-surface-container-highest p-4 rounded-2xl border border-dashed border-outline-variant hover:border-primary/50 cursor-pointer transition-all flex flex-col items-center justify-center text-center">
<span className="material-symbols-outlined text-outline mb-1" data-icon="shuffle">shuffle</span>
<p className="font-label text-[10px] uppercase tracking-widest text-outline">Next Available</p>
</div>
</div>
</section>
</div>
{/* Right Column: Services & Payment */}
<div className="col-span-12 lg:col-span-7 space-y-8">
{/* Service Grid */}
<section className="bg-surface-container-low p-8 rounded-3xl">
<div className="flex justify-between items-center mb-8">
<h3 className="font-label uppercase text-xs tracking-[0.2em] text-primary flex items-center gap-2">
<span className="material-symbols-outlined text-sm" data-icon="category">category</span>
                            Service Selection
                        </h3>
<span className="text-[10px] font-label text-outline uppercase tracking-widest">Multi-select enabled</span>
</div>
<div className="grid grid-cols-2 gap-4">
{/* Service 1 */}
<button className="text-left bg-surface-container-lowest p-6 rounded-2xl border-2 border-primary relative overflow-hidden transition-all shadow-lg">
<div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 scale-150">
<span className="material-symbols-outlined text-9xl" data-icon="content_cut">content_cut</span>
</div>
<div className="flex justify-between items-start mb-4 relative z-10">
<div className="bg-primary/20 p-2 rounded-lg">
<span className="material-symbols-outlined text-primary" data-icon="content_cut">content_cut</span>
</div>
<span className="font-headline font-bold text-primary text-lg">$45</span>
</div>
<p className="font-headline font-black text-xl mb-1 text-primary">Executive Cut</p>
<p className="font-body text-xs text-on-surface-variant">45 mins • Signature fade &amp; style</p>
</button>
{/* Service 2 */}
<button className="text-left bg-surface-container-highest p-6 rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all">
<div className="flex justify-between items-start mb-4">
<div className="bg-outline-variant/30 p-2 rounded-lg text-outline">
<span className="material-symbols-outlined" data-icon="skillet">skillet</span>
</div>
<span className="font-headline font-bold text-on-surface-variant text-lg">$35</span>
</div>
<p className="font-headline font-bold text-xl mb-1">Hot Towel Shave</p>
<p className="font-body text-xs text-on-surface-variant">30 mins • Traditional straight razor</p>
</button>
{/* Service 3 */}
<button className="text-left bg-surface-container-highest p-6 rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all">
<div className="flex justify-between items-start mb-4">
<div className="bg-outline-variant/30 p-2 rounded-lg text-outline">
<span className="material-symbols-outlined" data-icon="face">face</span>
</div>
<span className="font-headline font-bold text-on-surface-variant text-lg">$65</span>
</div>
<p className="font-headline font-bold text-xl mb-1">The Gilded Ritual</p>
<p className="font-body text-xs text-on-surface-variant">75 mins • Full service &amp; treatment</p>
</button>
{/* Service 4 */}
<button className="text-left bg-surface-container-highest p-6 rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all">
<div className="flex justify-between items-start mb-4">
<div className="bg-outline-variant/30 p-2 rounded-lg text-outline">
<span className="material-symbols-outlined" data-icon="brush">brush</span>
</div>
<span className="font-headline font-bold text-on-surface-variant text-lg">$25</span>
</div>
<p className="font-headline font-bold text-xl mb-1">Beard Sculpt</p>
<p className="font-body text-xs text-on-surface-variant">20 mins • Precision line up</p>
</button>
</div>
</section>
<div className="grid grid-cols-2 gap-8">
{/* Time Picker */}
<section className="bg-surface-container-low p-8 rounded-3xl">
<h3 className="font-label uppercase text-xs tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-sm" data-icon="schedule">schedule</span>
                            Slot Assignment
                        </h3>
<div className="space-y-4">
<div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-xl cursor-pointer hover:bg-surface-bright transition-all">
<span className="font-headline font-bold">ASAP (Immediate)</span>
<span className="text-secondary font-label text-[10px] uppercase font-bold">Recommended</span>
</div>
<div className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl">
<input className="bg-transparent border-none focus:ring-0 text-xl font-headline w-full p-0" type="time" value="14:30"/>
</div>
</div>
</section>
{/* Summary & Final Action */}
<section className="bg-surface-container-low p-8 rounded-3xl flex flex-col justify-between">
<div className="space-y-4">
<div className="flex justify-between items-center">
<span className="text-outline font-label text-[10px] uppercase tracking-widest">Total Due</span>
<span className="text-2xl font-headline font-black text-primary">$45.00</span>
</div>
<div className="flex items-center justify-between bg-surface-container-highest p-4 rounded-xl">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-outline" data-icon="payments">payments</span>
<span className="font-body font-bold text-sm">Paid in Cash</span>
</div>
<button className="w-12 h-6 bg-secondary-container rounded-full relative flex items-center px-1 transition-all">
<div className="w-4 h-4 bg-secondary rounded-full ml-auto"></div>
</button>
</div>
</div>
<button className="mt-8 w-full py-6 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-2xl font-headline font-black text-lg shadow-[0_20px_40px_rgba(229,196,135,0.2)] hover:shadow-[0_20px_50px_rgba(229,196,135,0.4)] active:scale-95 transition-all">
                            Add Booking
                        </button>
</section>
</div>
</div>
</div>
{/* Recent Walk-ins Section (Asymmetric) */}
<section className="mt-16">
<div className="flex items-end gap-8 mb-8">
<h3 className="text-3xl font-headline font-black text-on-surface">Recent Arrivals</h3>
<div className="h-px flex-1 bg-outline-variant/10 mb-4"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/* Entry 1 */}
<div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-secondary flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center font-headline font-bold text-primary">TL</div>
<div>
<p className="font-headline font-bold">Thomas Low</p>
<p className="font-label text-[10px] text-outline uppercase">Fade &amp; Wash • Marcus K.</p>
</div>
</div>
<span className="text-secondary font-label text-[10px] font-bold uppercase tracking-widest">Checked In</span>
</div>
{/* Entry 2 */}
<div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-primary flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center font-headline font-bold text-primary">RJ</div>
<div>
<p className="font-headline font-bold">Ray Jones</p>
<p className="font-label text-[10px] text-outline uppercase">Beard Trim • Julian R.</p>
</div>
</div>
<span className="text-primary font-label text-[10px] font-bold uppercase tracking-widest">In Chair</span>
</div>
{/* Entry 3 */}
<div className="bg-surface-container-low/40 p-6 rounded-2xl border-l-4 border-outline-variant/30 flex items-center justify-between opacity-60">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center font-headline font-bold text-outline">MP</div>
<div>
<p className="font-headline font-bold">Mike P.</p>
<p className="font-label text-[10px] text-outline uppercase">Buzz Cut • Sasha V.</p>
</div>
</div>
<span className="text-outline font-label text-[10px] font-bold uppercase tracking-widest">Completed</span>
</div>
</div>
</section>
</main>
{/* Global Search Bar Anchor (JSON Logic) */}
<div className="hidden md:flex fixed top-0 left-72 right-0 h-20 px-8 items-center justify-between bg-[#131313]/60 backdrop-blur-xl z-40">
<div className="flex items-center gap-4 bg-[#1C1B1B] px-4 py-2 rounded-xl w-96 border border-[#4D463A]/15 transition-all focus-within:border-[#E5C487]/50">
<span className="material-symbols-outlined text-[#4D463A]" data-icon="search">search</span>
<input className="bg-transparent border-none focus:ring-0 text-sm font-['Manrope'] w-full" placeholder="Quick search appointments..." type="text"/>
</div>
<div className="flex items-center gap-6">
<button className="relative text-[#4D463A] hover:text-[#E5C487] transition-colors">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
</button>
<button className="text-[#4D463A] hover:text-[#E5C487] transition-colors">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
</button>
<div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#C8A96E]">
<img alt="Manager Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmmtV4hTzHRPzb3KED_Gn2-98QRMPEjSJdbdqXlzZYD3q0IXUs--s5aKLWX98-yPDHw1yK0u1vp8NAvh4Z3cq7hw35btWgrkDiPsVEPSmUqYq_ubiVJJuItA90SbjSEiZvOInpTavA91RNg1UW91YEH0vmlBy4rZjlJmvjQkHppkHr9qKt_oXjxk2Bj6jvO-0u-jOdt_kfimztHR6-lVFq3rXt-AwjCTYid0MLhUgXljz8PqsML8_-3gcz8DFzX5rqGAtz5eqtgXA"/>
</div>
</div>
</div>

    </>
  );
}
