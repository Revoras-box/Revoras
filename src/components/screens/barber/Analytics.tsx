export default function Analytics() {
  return (
    <>

<style dangerouslySetInnerHTML={{ __html: `.material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24
    }
.grain-overlay {
    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuBQqVJRIQCClKKw8NBrzXWLcYcokRD9pVJmRBhOQz61VuX7Om7OALg26qWDBEmoaVH0GdmgzRnIV6kny9CBCK2po6nsSj-cdu3_3wNNrY3l2OqO0XriVpBgMRm09KEHjXezK1yCupzV43dcu0AqwNLFHsYgTRHm387KGA68iBC2Ug8EqLmPtD4OcdlXg3n94GDn0sXjDgmr1aedN7-KpkczUjlyidzh7EEGR3oasjCg3ihVCnKRZxqTM1T-9yZpN5SJtf8vm4tFouQ);
    opacity: 0.03
    }` }} />

{/* SideNavBar Anchor */}
<aside className="h-screen w-72 flex flex-col fixed left-0 top-0 z-50 bg-[#0E0E0E] bg-[#1C1B1B] border-r border-[#4D463A]/15">
<div className="flex flex-col h-full py-8">
{/* Brand Header */}
<div className="px-8 mb-12">
<h1 className="font-['Epilogue'] font-black text-[#E5C487] text-2xl tracking-tight">The Gilded Groom</h1>
<p className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px] text-[#4D463A] mt-1">Elite Management</p>
</div>
{/* Primary Navigation */}
<nav className="flex-1 space-y-2">
<a className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined mr-4">dashboard</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Dashboard</span>
</a>
<a className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined mr-4">calendar_today</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Appointments</span>
</a>
<a className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined mr-4">content_cut</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Barbers</span>
</a>
<a className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined mr-4">dry_cleaning</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Services</span>
</a>
<a className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group duration-300 hover:translate-x-1" href="#">
<span className="material-symbols-outlined mr-4">inventory_2</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Inventory</span>
</a>
<a className="flex items-center h-12 text-[#E5C487] font-bold border-l-4 border-[#E5C487] pl-4 bg-gradient-to-r from-[#E5C487]/10 to-transparent transition-all duration-300" href="#">
<span className="material-symbols-outlined mr-4">payments</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Revenue</span>
</a>
</nav>
{/* CTA & Footer */}
<div className="px-6 mt-auto space-y-6">
<button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402D00] font-headline font-bold text-sm tracking-tight active:scale-95 transition-all">
                    New Appointment
                </button>
<div className="pt-6 border-t border-[#4D463A]/15 space-y-2">
<a className="flex items-center text-[#4D463A] hover:text-[#E5C487] transition-colors py-2" href="#">
<span className="material-symbols-outlined mr-4 text-sm">help_outline</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px]">Support</span>
</a>
<a className="flex items-center text-[#4D463A] hover:text-error transition-colors py-2" href="#">
<span className="material-symbols-outlined mr-4 text-sm">logout</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px]">Logout</span>
</a>
</div>
</div>
</div>
</aside>
{/* Main Content Canvas */}
<main className="ml-72 min-h-screen relative">
<div className="grain-overlay absolute inset-0 pointer-events-none"></div>
{/* TopAppBar Anchor */}
<header className="bg-[#131313]/60 backdrop-blur-xl text-[#E5C487] font-['Epilogue'] tracking-tight sticky top-0 z-40 transition-all duration-300 px-8 h-20 flex justify-between items-center w-full">
<div className="flex items-center gap-8">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
<input className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-1 focus:ring-primary placeholder-outline-variant transition-all" placeholder="Search analytics..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-2">
<button className="p-2 text-outline hover:text-primary hover:bg-[#353534]/50 rounded-full transition-all duration-300">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="p-2 text-outline hover:text-primary hover:bg-[#353534]/50 rounded-full transition-all duration-300">
<span className="material-symbols-outlined">settings</span>
</button>
</div>
<div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-container p-[1px]">
<img alt="Manager Profile" className="h-full w-full rounded-full object-cover" data-alt="Close-up portrait of a professional man in a tailored dark suit, soft warm studio lighting, elite business aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwc5FfA-eXx_I5S09Wln4rqdobh6hkoNOJko_3fRj9GAYNyDZg3NLZwYy8H-AHkrcrZNUyue_51dM9UVDSGpF1s5frAj9JbvwuKeBDOAuTry6Qu-u3HKZBCKu3G2cQgx6K0kaaPt_2iZHM3tS2SxTkKPtY_W7SLsXsLBekue-xBaE3SXvUSSyfVmpuqM_TR8daZtGdv-w-yc4VAEZZrNYjmfuYRqGtis3h1BhZ1InYWLFU49T2yjbDAmy4aS53pzSzhQ9OXtXVLOo"/>
</div>
</div>
</header>
{/* Dashboard Content */}
<div className="p-8 max-w-7xl mx-auto space-y-8">
{/* Header Section */}
<div className="flex justify-between items-end">
<div>
<h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight mb-2">Revenue Intelligence</h2>
<p className="text-on-surface-variant font-body">Real-time performance metrics and predictive growth data.</p>
</div>
<div className="flex gap-4">
<div className="bg-surface-container-low rounded-xl px-4 py-2 flex items-center gap-3">
<span className="font-label text-xs text-outline-variant uppercase tracking-widest">Period:</span>
<span className="font-body font-semibold text-primary">Last 30 Days</span>
<span className="material-symbols-outlined text-sm text-outline">expand_more</span>
</div>
<button className="bg-surface-container-highest hover:bg-surface-bright text-on-surface px-6 py-2 rounded-xl flex items-center gap-2 transition-all">
<span className="material-symbols-outlined text-sm">download</span>
<span className="font-label text-xs uppercase tracking-widest font-bold">Export Report</span>
</button>
</div>
</div>
{/* Bento Grid - KPIs */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
<div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-primary">
<p className="font-label text-[10px] uppercase tracking-[0.2em] text-outline-variant mb-1">Total Revenue</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-headline font-bold text-on-surface">$54,290</h3>
<span className="text-secondary text-xs font-bold font-label">+12.4%</span>
</div>
</div>
<div className="bg-surface-container-low p-6 rounded-xl">
<p className="font-label text-[10px] uppercase tracking-[0.2em] text-outline-variant mb-1">Avg Ticket</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-headline font-bold text-on-surface">$85.00</h3>
<span className="text-secondary text-xs font-bold font-label">+3.1%</span>
</div>
</div>
<div className="bg-surface-container-low p-6 rounded-xl">
<p className="font-label text-[10px] uppercase tracking-[0.2em] text-outline-variant mb-1">New Clients</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-headline font-bold text-on-surface">142</h3>
<span className="text-secondary text-xs font-bold font-label">+8.2%</span>
</div>
</div>
<div className="bg-surface-container-low p-6 rounded-xl">
<p className="font-label text-[10px] uppercase tracking-[0.2em] text-outline-variant mb-1">Retention</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-headline font-bold text-on-surface">78%</h3>
<span className="text-error text-xs font-bold font-label">-1.5%</span>
</div>
</div>
</div>
{/* Main Chart Area */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/* Revenue Line Chart */}
<div className="lg:col-span-2 bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
<div className="flex justify-between items-start mb-12">
<div>
<h4 className="font-headline font-bold text-xl text-on-surface">Revenue Growth</h4>
<p className="text-outline-variant text-sm font-body">Daily earnings vs predictive trend line</p>
</div>
<div className="flex gap-4 text-[10px] font-label uppercase tracking-widest text-outline">
<span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Revenue</span>
<span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-outline-variant"></span> Prediction</span>
</div>
</div>
{/* Chart Placeholder Simulation */}
<div className="h-64 relative flex items-end justify-between px-2">
<div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent"></div>
<svg className="absolute bottom-0 left-0 w-full h-48 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
<defs>
<linearGradient id="goldGrad" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" stopColor="#E5C487" stopOpacity="0.8"></stop>
<stop offset="100%" stopColor="#E5C487" stopOpacity="0"></stop>
</linearGradient>
</defs>
<path d="M0,80 Q10,75 20,85 T40,60 T60,70 T80,30 T100,45 V100 H0 Z" fill="url(#goldGrad)"></path>
<path d="M0,80 Q10,75 20,85 T40,60 T60,70 T80,30 T100,45" fill="none" stroke="#E5C487" strokeWidth="2"></path>
</svg>
{/* Grid Lines */}
<div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
<div className="border-t border-on-surface w-full"></div>
<div className="border-t border-on-surface w-full"></div>
<div className="border-t border-on-surface w-full"></div>
<div className="border-t border-on-surface w-full"></div>
</div>
</div>
<div className="flex justify-between mt-6 text-[10px] font-label text-outline-variant uppercase tracking-widest">
<span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
</div>
</div>
{/* Service Distribution Donut */}
<div className="bg-surface-container-low p-8 rounded-xl flex flex-col items-center">
<h4 className="font-headline font-bold text-xl text-on-surface self-start mb-8">Service Mix</h4>
<div className="relative w-48 h-48 mb-8">
<svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
<path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="transparent" stroke="currentColor" strokeWidth="3"></path>
<path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="transparent" stroke="currentColor" strokeDasharray="65, 100" strokeLinecap="round" strokeWidth="3"></path>
<path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="transparent" stroke="currentColor" strokeDasharray="20, 100" strokeDashoffset="-65" strokeLinecap="round" strokeWidth="3"></path>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="text-3xl font-headline font-bold text-on-surface">65%</span>
<span className="text-[10px] font-label text-outline uppercase tracking-widest">Haircuts</span>
</div>
</div>
<div className="w-full space-y-3">
<div className="flex justify-between items-center text-sm font-body">
<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Premium Cuts</div>
<span className="font-bold">$35,288</span>
</div>
<div className="flex justify-between items-center text-sm font-body">
<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary"></span> Shave &amp; Sculpt</div>
<span className="font-bold">$10,858</span>
</div>
<div className="flex justify-between items-center text-sm font-body">
<div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-surface-container-highest"></span> Retail Products</div>
<span className="font-bold">$8,144</span>
</div>
</div>
</div>
</div>
{/* Bottom Row Bento */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
{/* Barber Performance Bars */}
<div className="bg-surface-container-low p-8 rounded-xl">
<div className="flex justify-between items-center mb-10">
<h4 className="font-headline font-bold text-xl text-on-surface">Top Performers</h4>
<span className="text-[10px] font-label text-outline uppercase tracking-widest">Monthly Bookings</span>
</div>
<div className="space-y-6">
<div className="space-y-2">
<div className="flex justify-between text-sm">
<span className="font-body font-semibold">Julian V.</span>
<span className="text-primary font-bold">148 Bookings</span>
</div>
<div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-primary to-primary-container w-[92%] rounded-full"></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-sm">
<span className="font-body font-semibold">Marcus T.</span>
<span className="text-primary font-bold">124 Bookings</span>
</div>
<div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-primary to-primary-container w-[80%] rounded-full"></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-sm">
<span className="font-body font-semibold">Silas R.</span>
<span className="text-primary font-bold">115 Bookings</span>
</div>
<div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-primary to-primary-container w-[72%] rounded-full"></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-sm">
<span className="font-body font-semibold">Dominic L.</span>
<span className="text-primary font-bold">98 Bookings</span>
</div>
<div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-primary to-primary-container w-[60%] rounded-full"></div>
</div>
</div>
</div>
</div>
{/* Peak Booking Heatmap */}
<div className="bg-surface-container-low p-8 rounded-xl">
<div className="flex justify-between items-center mb-8">
<h4 className="font-headline font-bold text-xl text-on-surface">Booking Velocity</h4>
<div className="flex items-center gap-2">
<span className="text-[8px] font-label text-outline uppercase tracking-tighter">Quiet</span>
<div className="flex gap-1">
<div className="w-3 h-3 bg-primary/20 rounded-sm"></div>
<div className="w-3 h-3 bg-primary/40 rounded-sm"></div>
<div className="w-3 h-3 bg-primary/70 rounded-sm"></div>
<div className="w-3 h-3 bg-primary rounded-sm"></div>
</div>
<span className="text-[8px] font-label text-outline uppercase tracking-tighter">Peak</span>
</div>
</div>
<div className="grid grid-cols-8 gap-1">
{/* Header Hours */}
<div className="h-6"></div>
<div className="text-[8px] font-label text-outline uppercase text-center">9a</div>
<div className="text-[8px] font-label text-outline uppercase text-center">11a</div>
<div className="text-[8px] font-label text-outline uppercase text-center">1p</div>
<div className="text-[8px] font-label text-outline uppercase text-center">3p</div>
<div className="text-[8px] font-label text-outline uppercase text-center">5p</div>
<div className="text-[8px] font-label text-outline uppercase text-center">7p</div>
<div className="text-[8px] font-label text-outline uppercase text-center">9p</div>
{/* Heatmap Rows */}
<div className="text-[8px] font-label text-outline uppercase flex items-center pr-2">Mon</div>
<div className="h-8 bg-primary/20 rounded-sm"></div><div className="h-8 bg-primary/40 rounded-sm"></div><div className="h-8 bg-primary/40 rounded-sm"></div><div className="h-8 bg-primary/70 rounded-sm"></div><div className="h-8 bg-primary rounded-sm"></div><div className="h-8 bg-primary/70 rounded-sm"></div><div className="h-8 bg-primary/20 rounded-sm"></div>
<div className="text-[8px] font-label text-outline uppercase flex items-center pr-2">Tue</div>
<div className="h-8 bg-primary/40 rounded-sm"></div><div className="h-8 bg-primary/20 rounded-sm"></div><div className="h-8 bg-primary/40 rounded-sm"></div><div className="h-8 bg-primary/40 rounded-sm"></div><div className="h-8 bg-primary/70 rounded-sm"></div><div className="h-8 bg-primary/70 rounded-sm"></div><div className="h-8 bg-primary/40 rounded-sm"></div>
<div className="text-[8px] font-label text-outline uppercase flex items-center pr-2">Wed</div>
<div className="h-8 bg-primary/20 rounded-sm"></div><div className="h-8 bg-primary/40 rounded-sm"></div><div className="h-8 bg-primary/70 rounded-sm"></div><div className="h-8 bg-primary/70 rounded-sm"></div><div className="h-8 bg-primary/40 rounded-sm"></div><div className="h-8 bg-primary/40 rounded-sm"></div><div className="h-8 bg-primary/20 rounded-sm"></div>
<div className="text-[8px] font-label text-outline uppercase flex items-center pr-2">Thu</div>
<div className="h-8 bg-primary/40 rounded-sm"></div><div className="h-8 bg-primary/70 rounded-sm"></div><div className="h-8 bg-primary/70 rounded-sm"></div><div className="h-8 bg-primary rounded-sm"></div><div className="h-8 bg-primary rounded-sm"></div><div className="h-8 bg-primary/70 rounded-sm"></div><div className="h-8 bg-primary/40 rounded-sm"></div>
<div className="text-[8px] font-label text-outline uppercase flex items-center pr-2">Fri</div>
<div className="h-8 bg-primary/70 rounded-sm"></div><div className="h-8 bg-primary rounded-sm"></div><div className="h-8 bg-primary rounded-sm"></div><div className="h-8 bg-primary rounded-sm"></div><div className="h-8 bg-primary rounded-sm"></div><div className="h-8 bg-primary/70 rounded-sm"></div><div className="h-8 bg-primary/70 rounded-sm"></div>
</div>
</div>
</div>
{/* Bottom Analytics Summary */}
<div className="bg-surface-container-highest/30 p-6 rounded-2xl flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined font-bold">trending_up</span>
</div>
<div>
<h5 className="font-headline font-bold text-on-surface">Growth Projection</h5>
<p className="text-sm text-on-surface-variant font-body">Current trends suggest a <span className="text-secondary font-bold">15% increase</span> in premium bookings for next month.</p>
</div>
</div>
<button className="text-primary hover:text-primary-fixed-dim font-label text-xs uppercase tracking-[0.2em] font-bold border-b border-primary/30 pb-1 transition-all">
                    View Optimization Strategy
                </button>
</div>
</div>
{/* FAB Suppression Check: Analytics page, no FAB rendered per protocol */}
</main>

    </>
  );
}
