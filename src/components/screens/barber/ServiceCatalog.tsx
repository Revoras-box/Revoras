export default function ServiceCatalog() {
  return (
    <>

<style dangerouslySetInnerHTML={{ __html: `
        body {
            background-color: #131313;
            color: #e5e2e1;
            font-family: 'Manrope', sans-serif;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .luxury-gradient {
            background: linear-gradient(45deg, #E5C487, #C8A96E);
        }
        .glass-panel {
            background: rgba(53, 53, 52, 0.6);
            backdrop-filter: blur(24px);
        }
        .grain-overlay {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.03;
            pointer-events: none;
        }
        .asymmetric-clip {
            border-top-left-radius: 1.5rem;
            border-bottom-right-radius: 0.75rem;
        }
    ` }} />

<div className="grain-overlay fixed inset-0 z-50"></div>
{/* Side Navigation Bar */}
<aside className="h-screen w-72 flex flex-col fixed left-0 top-0 z-50 bg-[#0E0E0E] bg-[#1C1B1B] border-r border-[#4D463A]/15 h-full py-8">
<div className="px-8 mb-12">
<h1 className="font-['Epilogue'] font-black text-[#E5C487] text-2xl tracking-tight">The Gilded Groom</h1>
<p className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px] text-outline mt-1">Elite Management</p>
</div>
<nav className="flex-1 space-y-2">
<a className="flex items-center py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined mr-4" data-icon="dashboard">dashboard</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Dashboard</span>
</a>
<a className="flex items-center py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined mr-4" data-icon="calendar_today">calendar_today</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Appointments</span>
</a>
<a className="flex items-center py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined mr-4" data-icon="content_cut">content_cut</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Barbers</span>
</a>
<a className="flex items-center py-3 text-[#E5C487] font-bold border-l-4 border-[#E5C487] pl-4 bg-gradient-to-r from-[#E5C487]/10 to-transparent transition-all group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined mr-4" data-icon="dry_cleaning">dry_cleaning</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Services</span>
</a>
<a className="flex items-center py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined mr-4" data-icon="inventory_2">inventory_2</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Inventory</span>
</a>
<a className="flex items-center py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined mr-4" data-icon="payments">payments</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Revenue</span>
</a>
</nav>
<div className="mt-auto px-8 space-y-4">
<button className="w-full luxury-gradient text-on-primary font-bold py-4 rounded-xl shadow-lg active:scale-95 duration-200 font-['Space_Grotesk'] uppercase tracking-widest text-[10px]">
                New Appointment
            </button>
<div className="pt-6 space-y-2 border-t border-[#4D463A]/15">
<a className="flex items-center text-[#4D463A] hover:text-[#E5C487] transition-all text-xs font-['Space_Grotesk'] uppercase tracking-widest" href="#">
<span className="material-symbols-outlined text-sm mr-3" data-icon="help_outline">help_outline</span>
                    Support
                </a>
<a className="flex items-center text-[#4D463A] hover:text-[#E5C487] transition-all text-xs font-['Space_Grotesk'] uppercase tracking-widest" href="#">
<span className="material-symbols-outlined text-sm mr-3" data-icon="logout">logout</span>
                    Logout
                </a>
</div>
</div>
</aside>
{/* Main Content Canvas */}
<main className="ml-72 p-12 min-h-screen bg-surface">
{/* Header Section */}
<header className="mb-16 flex justify-between items-end">
<div className="max-w-2xl">
<span className="font-['Space_Grotesk'] text-primary uppercase tracking-[0.3em] text-xs mb-4 block">Service Catalog</span>
<h2 className="font-['Epilogue'] text-5xl font-extrabold text-on-surface leading-tight">Master the Art of the Cut</h2>
<p className="text-on-surface-variant mt-4 text-lg max-w-lg">Manage your elite menu of services. Define pricing, duration, and the premium experience for every client.</p>
</div>
<div className="flex gap-4">
<div className="bg-surface-container-low px-6 py-4 rounded-xl border border-outline-variant/10 text-right">
<p className="font-['Space_Grotesk'] text-[10px] text-outline uppercase tracking-widest">Total Services</p>
<p className="font-['Epilogue'] text-2xl font-bold text-primary">14 Active</p>
</div>
</div>
</header>
<div className="grid grid-cols-12 gap-8">
{/* Services Grid */}
<div className="col-span-8 grid grid-cols-2 gap-6">
{/* Service Card 1 */}
<div className="bg-surface-container-low p-6 rounded-xl hover:bg-surface-container-high transition-all duration-300 group relative border border-outline-variant/5">
<div className="flex justify-between items-start mb-6">
<div className="w-16 h-16 bg-surface-container-highest asymmetric-clip flex items-center justify-center">
<span className="material-symbols-outlined text-primary-fixed-dim text-3xl" data-icon="content_cut">content_cut</span>
</div>
<button className="text-outline-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="edit">edit</span>
</button>
</div>
<h3 className="font-['Epilogue'] text-xl font-bold text-on-surface mb-2">Signature Haircut</h3>
<p className="text-sm text-on-surface-variant mb-6 line-clamp-2">Precision fade, shear work, and styling including a premium hot towel finish.</p>
<div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-outline" data-icon="schedule">schedule</span>
<span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-outline">45 MIN</span>
</div>
<span className="font-['Epilogue'] font-bold text-primary text-xl">$55.00</span>
</div>
</div>
{/* Service Card 2 */}
<div className="bg-surface-container-low p-6 rounded-xl hover:bg-surface-container-high transition-all duration-300 group relative border border-outline-variant/5">
<div className="flex justify-between items-start mb-6">
<div className="w-16 h-16 bg-surface-container-highest asymmetric-clip flex items-center justify-center">
<span className="material-symbols-outlined text-primary-fixed-dim text-3xl" data-icon="face">face</span>
</div>
<button className="text-outline-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="edit">edit</span>
</button>
</div>
<h3 className="font-['Epilogue'] text-xl font-bold text-on-surface mb-2">Royal Beard Trim</h3>
<p className="text-sm text-on-surface-variant mb-6 line-clamp-2">Detailed shaping with straight razor line-up and organic beard oil treatment.</p>
<div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-outline" data-icon="schedule">schedule</span>
<span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-outline">30 MIN</span>
</div>
<span className="font-['Epilogue'] font-bold text-primary text-xl">$35.00</span>
</div>
</div>
{/* Service Card 3 */}
<div className="bg-surface-container-low p-6 rounded-xl hover:bg-surface-container-high transition-all duration-300 group relative border border-outline-variant/5">
<div className="flex justify-between items-start mb-6">
<div className="w-16 h-16 bg-surface-container-highest asymmetric-clip flex items-center justify-center">
<span className="material-symbols-outlined text-primary-fixed-dim text-3xl" data-icon="flare">flare</span>
</div>
<button className="text-outline-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="edit">edit</span>
</button>
</div>
<h3 className="font-['Epilogue'] text-xl font-bold text-on-surface mb-2">The Golden Ritual</h3>
<p className="text-sm text-on-surface-variant mb-6 line-clamp-2">Haircut, beard trim, facial scrub, and a cooling charcoal mask.</p>
<div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-outline" data-icon="schedule">schedule</span>
<span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-outline">90 MIN</span>
</div>
<span className="font-['Epilogue'] font-bold text-primary text-xl">$120.00</span>
</div>
</div>
{/* Service Card 4 */}
<div className="bg-surface-container-low p-6 rounded-xl hover:bg-surface-container-high transition-all duration-300 group relative border border-outline-variant/5">
<div className="flex justify-between items-start mb-6">
<div className="w-16 h-16 bg-surface-container-highest asymmetric-clip flex items-center justify-center">
<span className="material-symbols-outlined text-primary-fixed-dim text-3xl" data-icon="child_care">child_care</span>
</div>
<button className="text-outline-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="edit">edit</span>
</button>
</div>
<h3 className="font-['Epilogue'] text-xl font-bold text-on-surface mb-2">Young Groom Cut</h3>
<p className="text-sm text-on-surface-variant mb-6 line-clamp-2">A premium experience for the next generation. Ages 12 and under.</p>
<div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm text-outline" data-icon="schedule">schedule</span>
<span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-outline">30 MIN</span>
</div>
<span className="font-['Epilogue'] font-bold text-primary text-xl">$30.00</span>
</div>
</div>
</div>
{/* Add Service Form */}
<div className="col-span-4">
<div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 sticky top-12">
<h4 className="font-['Epilogue'] text-2xl font-bold text-on-surface mb-8">Add New Service</h4>
<form className="space-y-8">
<div>
<label className="font-['Space_Grotesk'] text-[10px] text-outline uppercase tracking-widest block mb-2">Service Name</label>
<input className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-primary text-on-surface placeholder:text-outline-variant/50 px-0 pb-3 font-['Manrope']" placeholder="e.g. Luxury Hot Shave" type="text"/>
</div>
<div>
<label className="font-['Space_Grotesk'] text-[10px] text-outline uppercase tracking-widest block mb-2">Description</label>
<textarea className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-primary text-on-surface placeholder:text-outline-variant/50 px-0 pb-3 font-['Manrope'] resize-none" placeholder="Briefly describe the experience..." rows={2}></textarea>
</div>
<div className="grid grid-cols-2 gap-6">
<div>
<label className="font-['Space_Grotesk'] text-[10px] text-outline uppercase tracking-widest block mb-2">Duration (Min)</label>
<div className="flex items-center bg-surface-container-highest/30 rounded-lg p-1 border border-outline-variant/10">
<button className="w-10 h-10 flex items-center justify-center text-outline hover:text-primary transition-colors" type="button">
<span className="material-symbols-outlined">remove</span>
</button>
<input className="w-full bg-transparent border-0 text-center focus:ring-0 text-on-surface font-['Space_Grotesk'] font-bold" type="number" value="30"/>
<button className="w-10 h-10 flex items-center justify-center text-outline hover:text-primary transition-colors" type="button">
<span className="material-symbols-outlined">add</span>
</button>
</div>
</div>
<div>
<label className="font-['Space_Grotesk'] text-[10px] text-outline uppercase tracking-widest block mb-2">Price ($)</label>
<div className="relative">
<span className="absolute left-0 top-2.5 text-outline">$</span>
<input className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-primary text-on-surface placeholder:text-outline-variant/50 pl-4 pb-3 font-['Space_Grotesk'] font-bold text-lg" placeholder="0.00" type="text"/>
</div>
</div>
</div>
<div>
<label className="font-['Space_Grotesk'] text-[10px] text-outline uppercase tracking-widest block mb-4">Category Icon</label>
<div className="grid grid-cols-5 gap-3">
<button className="aspect-square bg-surface-container-highest rounded-lg flex items-center justify-center text-outline hover:bg-primary-container hover:text-on-primary-container transition-all" type="button">
<span className="material-symbols-outlined" data-icon="content_cut">content_cut</span>
</button>
<button className="aspect-square bg-surface-container-highest rounded-lg flex items-center justify-center text-outline hover:bg-primary-container hover:text-on-primary-container transition-all border border-primary/40 text-primary" type="button">
<span className="material-symbols-outlined" data-icon="face">face</span>
</button>
<button className="aspect-square bg-surface-container-highest rounded-lg flex items-center justify-center text-outline hover:bg-primary-container hover:text-on-primary-container transition-all" type="button">
<span className="material-symbols-outlined" data-icon="wash">wash</span>
</button>
<button className="aspect-square bg-surface-container-highest rounded-lg flex items-center justify-center text-outline hover:bg-primary-container hover:text-on-primary-container transition-all" type="button">
<span className="material-symbols-outlined" data-icon="palette">palette</span>
</button>
<button className="aspect-square bg-surface-container-highest rounded-lg flex items-center justify-center text-outline hover:bg-primary-container hover:text-on-primary-container transition-all" type="button">
<span className="material-symbols-outlined" data-icon="spa">spa</span>
</button>
</div>
</div>
<button className="w-full luxury-gradient py-5 rounded-xl text-on-primary font-bold font-['Space_Grotesk'] uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-[0.98] transition-all">
                            Create Service
                        </button>
</form>
</div>
</div>
</div>
{/* Section Texture */}
<div className="mt-24 bg-surface-container-lowest/50 p-12 rounded-[2rem] border border-outline-variant/5 relative overflow-hidden">
<div className="absolute top-0 right-0 w-64 h-64 luxury-gradient opacity-5 blur-[100px]"></div>
<div className="relative z-10 grid grid-cols-3 gap-12">
<div>
<h5 className="font-['Epilogue'] text-3xl font-bold mb-4">Tiered Pricing</h5>
<p className="text-on-surface-variant text-sm">Assign different rates for Senior vs. Master barbers within the same service category.</p>
</div>
<div>
<h5 className="font-['Epilogue'] text-3xl font-bold mb-4">Auto-Buffer</h5>
<p className="text-on-surface-variant text-sm">Set cleanup time between services automatically to prevent back-to-back fatigue.</p>
</div>
<div>
<h5 className="font-['Epilogue'] text-3xl font-bold mb-4">Add-Ons</h5>
<p className="text-on-surface-variant text-sm">Create upsell opportunities like luxury pomades or express facials during checkout.</p>
</div>
</div>
</div>
</main>

    </>
  );
}
