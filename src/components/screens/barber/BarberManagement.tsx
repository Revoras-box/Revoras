export default function BarberManagement() {
  return (
    <>

<style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .luxury-gradient {
            background: linear-gradient(45deg, #E5C487 0%, #C8A96E 100%);
        }
        .grain-overlay {
            position: relative;
        }
        .grain-overlay::before {
            content: "";
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.03;
            pointer-events: none;
            z-index: 10;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4D463A; border-radius: 10px; }
    ` }} />

{/* SideNavBar Anchor */}
<nav className="h-screen w-72 flex flex-col fixed left-0 top-0 z-50 bg-[#0E0E0E] bg-[#1C1B1B] border-r border-[#4D463A]/15 flex flex-col h-full py-8">
<div className="px-8 mb-12">
<h1 className="font-['Epilogue'] font-black text-[#E5C487] text-2xl tracking-tight">The Gilded Groom</h1>
<p className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px] text-outline mt-1">Elite Management</p>
</div>
<div className="flex-1 space-y-2">
<a className="flex items-center gap-4 py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="dashboard">dashboard</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Dashboard</span>
</a>
<a className="flex items-center gap-4 py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="calendar_today">calendar_today</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Appointments</span>
</a>
<a className="flex items-center gap-4 py-3 text-[#E5C487] font-bold border-l-4 border-[#E5C487] pl-4 bg-gradient-to-r from-[#E5C487]/10 to-transparent group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="content_cut">content_cut</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Barbers</span>
</a>
<a className="flex items-center gap-4 py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="dry_cleaning">dry_cleaning</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Services</span>
</a>
<a className="flex items-center gap-4 py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="inventory_2">inventory_2</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Inventory</span>
</a>
<a className="flex items-center gap-4 py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="payments">payments</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Revenue</span>
</a>
</div>
<div className="px-8 mb-8">
<button className="w-full py-4 rounded-xl luxury-gradient text-on-primary font-bold text-sm shadow-[0_10px_20px_rgba(229,196,135,0.2)] active:scale-95 transition-transform">
                New Appointment
            </button>
</div>
<div className="mt-auto border-t border-[#4D463A]/15 pt-6 space-y-2">
<a className="flex items-center gap-4 py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all group" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="help_outline">help_outline</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Support</span>
</a>
<a className="flex items-center gap-4 py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all group" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="logout">logout</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Logout</span>
</a>
</div>
</nav>
{/* Main Canvas */}
<main className="ml-72 min-h-screen flex flex-col relative overflow-y-auto h-screen custom-scrollbar">
{/* TopAppBar Anchor */}
<header className="sticky top-0 z-40 bg-[#131313]/60 backdrop-blur-xl flex justify-between items-center w-full px-12 h-24 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
<div className="flex items-center gap-8">
<h2 className="text-3xl font-headline font-bold bg-gradient-to-r from-[#E5C487] to-[#C8A96E] bg-clip-text text-transparent">Barber Directory</h2>
<div className="h-8 w-[1px] bg-outline-variant/30"></div>
<div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10">
<span className="material-symbols-outlined text-primary" data-icon="search">search</span>
<input className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-outline/50" placeholder="Search by name or specialty..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<button className="p-3 rounded-full hover:bg-[#353534]/50 transition-all text-[#E5C487] relative">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
</button>
<button className="p-3 rounded-full hover:bg-[#353534]/50 transition-all text-[#E5C487]">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
</button>
<div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
<div className="text-right">
<p className="text-sm font-bold text-on-surface">Julian Rossi</p>
<p className="text-[10px] font-label text-outline uppercase tracking-wider">Studio Manager</p>
</div>
<img className="w-10 h-10 rounded-full border-2 border-primary/30 object-cover" data-alt="Portrait of a sophisticated male studio manager with groomed beard and professional attire in a warm office setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK8FBsbchzRl2GAkAzG7qS9zCvO2JN8sTJpjm1xlL2uG_Ife8IJmmjfu-ydpfNmGekl61qTyLiTWSO-gYDz_Kv8JzfjakGeuiAhz8jstUZZnDojBNBGeBLBw8joZEDOdu_5sppV3iCcvkRr2tFk6JrJWVqSY9BcCq65ln0EzaRp20p7BMv2jb6k0AeqHVfa5I0C8Zx40HBqvOLX1vDFjNRVZmxaCCR14t6L5L-fOk154hy6QwFIe2eBB23wpm3Zvf1lgLHhkIbRfA"/>
</div>
</div>
</header>
<div className="p-12 space-y-12">
{/* Header Section */}
<div className="flex justify-between items-end">
<div className="space-y-2">
<h3 className="text-5xl font-headline font-black tracking-tight uppercase">The A-Team</h3>
<p className="text-on-surface-variant max-w-md">Manage your elite roster, track availability, and monitor studio performance in real-time.</p>
</div>
<button className="flex items-center gap-2 px-8 py-4 bg-surface-container-high border border-primary/20 rounded-xl text-primary font-bold hover:bg-surface-container-highest transition-all group">
<span className="material-symbols-outlined" data-icon="person_add">person_add</span>
<span>Add New Barber</span>
</button>
</div>
{/* Bento Grid of Barbers */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
{/* Barber Card 1: Senior */}
<div className="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-500">
<div className="absolute top-0 right-0 p-4">
<span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-secondary text-[10px] font-label font-bold uppercase tracking-widest animate-pulse">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Active
                        </span>
</div>
<div className="flex gap-6 items-start">
<img className="w-32 h-44 object-cover rounded-tl-[3rem] rounded-br-[3rem] border border-outline-variant/20 shadow-2xl" data-alt="Close-up profile of a professional barber with sharp tattoos and groomed hair in a high-end studio lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcrn3t4RFVudYqlcxAt3PeofCUZyOvnCN4j3WMfgpTFdzGj_N9bfYkLAqnVorOs3diMuBxQlrF0gKlKR1LWzfG6s71_Eom0eJDaWY5iy1uIxCleNN8e6kWP-I8MFjTl1joP3Jbpzd8Qt6rmitACbxR4L4M2-LwqQeVknH0Yk00ryF-5JkbS5z55Q9_49gSlDFJmhyA4KIrUa4Fvy-GusHJs0CMg3xQs5bUcM6zoHugeVn7q7zjzc3LPxIgi_X3Z-2jHMcyCtdij4U"/>
<div className="flex-1 space-y-4 pt-4">
<div>
<h4 className="text-2xl font-headline font-bold text-on-surface">Elias Thorne</h4>
<p className="text-primary-container font-label text-[10px] uppercase tracking-[0.2em] font-bold">Master Craftsman</p>
</div>
<div className="flex flex-wrap gap-2">
<span className="text-[10px] px-2 py-1 bg-surface-container-highest rounded text-outline uppercase font-label">Straight Razor</span>
<span className="text-[10px] px-2 py-1 bg-surface-container-highest rounded text-outline uppercase font-label">Hot Towel</span>
</div>
</div>
</div>
<div className="mt-8 grid grid-cols-2 gap-4 border-t border-outline-variant/10 pt-6">
<div className="bg-surface-container-lowest/50 p-4 rounded-2xl">
<p className="text-[10px] font-label text-outline uppercase tracking-wider mb-1">Queue Load</p>
<p className="text-xl font-bold font-headline">85%</p>
<div className="w-full bg-surface-container-high h-1 rounded-full mt-2">
<div className="bg-primary h-full rounded-full" style={{ width: "85%" }}></div>
</div>
</div>
<div className="bg-surface-container-lowest/50 p-4 rounded-2xl">
<p className="text-[10px] font-label text-outline uppercase tracking-wider mb-1">Next Up</p>
<p className="text-sm font-bold truncate">Classic Fade @ 14:30</p>
<p className="text-[10px] text-primary-fixed-dim mt-1">Confirmed</p>
</div>
</div>
</div>
{/* Barber Card 2 */}
<div className="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-500">
<div className="absolute top-0 right-0 p-4">
<span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-outline text-[10px] font-label font-bold uppercase tracking-widest">
                            Lunch Break
                        </span>
</div>
<div className="flex gap-6 items-start">
<img className="w-32 h-44 object-cover rounded-tl-[3rem] rounded-br-[3rem] border border-outline-variant/20 shadow-2xl" data-alt="Professional young barber in a leather apron posing confidently in a dark industrial workspace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp3AeNXspqe2ZJT65MXe_2waG8Od-zIfgaQHrVtfJ7Wk9qTm_Y0oQfAx7y217Rvp5QKrFMow3eovypKTOQF_sODugB8TzcNfjdNMsmpbO5LEUG5nrOXJvMnQABaYCbk8wQSCxAUYBvenRm6ff2L-p2qvFBY-tH6f2R5Dqb4ETF708SQ6_S2bFj3B4Qm3fUfkUY4ppaGENFssC_-Ji5KL5ja7MzXzFNDjX8ZBJpy8KtKaxwvIMPN5oO8Gas3cxRhXVhoFdAuFmbcpY"/>
<div className="flex-1 space-y-4 pt-4">
<div>
<h4 className="text-2xl font-headline font-bold text-on-surface">Marco Villi</h4>
<p className="text-primary-container font-label text-[10px] uppercase tracking-[0.2em] font-bold">Texture Specialist</p>
</div>
<div className="flex flex-wrap gap-2">
<span className="text-[10px] px-2 py-1 bg-surface-container-highest rounded text-outline uppercase font-label">Tapers</span>
<span className="text-[10px] px-2 py-1 bg-surface-container-highest rounded text-outline uppercase font-label">Beard Sculpt</span>
</div>
</div>
</div>
<div className="mt-8 grid grid-cols-2 gap-4 border-t border-outline-variant/10 pt-6">
<div className="bg-surface-container-lowest/50 p-4 rounded-2xl">
<p className="text-[10px] font-label text-outline uppercase tracking-wider mb-1">Queue Load</p>
<p className="text-xl font-bold font-headline">40%</p>
<div className="w-full bg-surface-container-high h-1 rounded-full mt-2">
<div className="bg-primary h-full rounded-full" style={{ width: "40%" }}></div>
</div>
</div>
<div className="bg-surface-container-lowest/50 p-4 rounded-2xl">
<p className="text-[10px] font-label text-outline uppercase tracking-wider mb-1">Next Up</p>
<p className="text-sm font-bold truncate">Long Trim @ 15:00</p>
<p className="text-[10px] text-secondary mt-1">VIP Member</p>
</div>
</div>
</div>
{/* Barber Card 3 */}
<div className="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-500">
<div className="absolute top-0 right-0 p-4">
<span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-secondary text-[10px] font-label font-bold uppercase tracking-widest animate-pulse">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Active
                        </span>
</div>
<div className="flex gap-6 items-start">
<img className="w-32 h-44 object-cover rounded-tl-[3rem] rounded-br-[3rem] border border-outline-variant/20 shadow-2xl" data-alt="Modern female barber with short styled hair and stylish glasses in a moody studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZUrzw1ycvxCxBtVq0cgEzTdkPsD5k0mBN5kfdj1spy-JX_PeOJv_MCgwEyDxkPPqML9QrIEZucJ4AWEH3LrupxptompAVRPGcS2rKcWQ--bwcV8z8laiNAQ-sjpkwnYBZ7dDviVzFJbXt_UmX9ddNOdXgFulYpOQxxIsHtfr3MdSgM0dSnsrCcFzb4jmcoFxGiJVU_YNmkrz2NCFXtMQM1_GG2tt12KjRVRgzdILDPGbgrNzTAEI_CTgCkQT4ImrHu_8PdEAXJWk"/>
<div className="flex-1 space-y-4 pt-4">
<div>
<h4 className="text-2xl font-headline font-bold text-on-surface">Sasha Grey</h4>
<p className="text-primary-container font-label text-[10px] uppercase tracking-[0.2em] font-bold">Color Artist</p>
</div>
<div className="flex flex-wrap gap-2">
<span className="text-[10px] px-2 py-1 bg-surface-container-highest rounded text-outline uppercase font-label">Bleach</span>
<span className="text-[10px] px-2 py-1 bg-surface-container-highest rounded text-outline uppercase font-label">Modern Cut</span>
</div>
</div>
</div>
<div className="mt-8 grid grid-cols-2 gap-4 border-t border-outline-variant/10 pt-6">
<div className="bg-surface-container-lowest/50 p-4 rounded-2xl">
<p className="text-[10px] font-label text-outline uppercase tracking-wider mb-1">Queue Load</p>
<p className="text-xl font-bold font-headline">95%</p>
<div className="w-full bg-surface-container-high h-1 rounded-full mt-2">
<div className="bg-primary h-full rounded-full" style={{ width: "95%" }}></div>
</div>
</div>
<div className="bg-surface-container-lowest/50 p-4 rounded-2xl">
<p className="text-[10px] font-label text-outline uppercase tracking-wider mb-1">Next Up</p>
<p className="text-sm font-bold truncate">Full Balayage @ 14:15</p>
<p className="text-[10px] text-error mt-1">Running Late (5m)</p>
</div>
</div>
</div>
</div>
{/* Detailed Add Barber Form (Overlay Simulation) */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-outline-variant/15">
<div className="lg:col-span-1 space-y-6">
<h4 className="text-3xl font-headline font-bold">New Staff Enrollment</h4>
<p className="text-on-surface-variant leading-relaxed">Add a new professional to your roster. Ensure all certification tags are added for correct service matching.</p>
<div className="p-8 rounded-[2rem] bg-surface-container-high border border-outline-variant/20 relative group overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
<div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-outline-variant/30 rounded-2xl aspect-[3/4]">
<span className="material-symbols-outlined text-4xl text-outline/50" data-icon="add_a_photo">add_a_photo</span>
<p className="text-xs font-label uppercase tracking-widest text-outline">Upload Profile</p>
</div>
</div>
</div>
<div className="lg:col-span-2 bg-surface-container-low rounded-[3rem] p-12 border border-outline-variant/10">
<form className="space-y-8">
<div className="grid grid-cols-2 gap-8">
<div className="space-y-2">
<label className="text-[10px] font-label text-outline uppercase tracking-widest pl-4">Full Legal Name</label>
<input className="w-full bg-transparent border-none border-b border-outline-variant/50 focus:border-primary focus:ring-0 text-lg transition-all py-3 px-4" placeholder="e.g. Julian Rossi" type="text"/>
</div>
<div className="space-y-2">
<label className="text-[10px] font-label text-outline uppercase tracking-widest pl-4">Direct Phone</label>
<input className="w-full bg-transparent border-none border-b border-outline-variant/50 focus:border-primary focus:ring-0 text-lg transition-all py-3 px-4" placeholder="+1 (555) 000-0000" type="tel"/>
</div>
</div>
<div className="space-y-4">
<label className="text-[10px] font-label text-outline uppercase tracking-widest pl-4">Specialty Tags</label>
<div className="flex flex-wrap gap-3">
<button className="px-6 py-2 rounded-full border border-primary text-primary text-xs font-bold bg-primary/5" type="button">Straight Razor</button>
<button className="px-6 py-2 rounded-full border border-outline-variant text-outline text-xs hover:border-primary hover:text-primary transition-all" type="button">Skin Fades</button>
<button className="px-6 py-2 rounded-full border border-outline-variant text-outline text-xs hover:border-primary hover:text-primary transition-all" type="button">Beard Grooming</button>
<button className="px-6 py-2 rounded-full border border-outline-variant text-outline text-xs hover:border-primary hover:text-primary transition-all" type="button">Coloring</button>
<button className="px-4 py-2 rounded-full border border-dashed border-outline-variant text-outline/50" type="button">
<span className="material-symbols-outlined text-sm" data-icon="add">add</span>
</button>
</div>
</div>
<div className="space-y-6">
<label className="text-[10px] font-label text-outline uppercase tracking-widest pl-4">Standard Working Hours</label>
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
<div className="p-4 bg-surface-container-high rounded-2xl border border-outline-variant/20">
<p className="text-[10px] font-label text-outline uppercase mb-2">Mon-Fri</p>
<p className="text-sm font-bold">09:00 - 18:00</p>
</div>
<div className="p-4 bg-surface-container-high rounded-2xl border border-outline-variant/20">
<p className="text-[10px] font-label text-outline uppercase mb-2">Saturday</p>
<p className="text-sm font-bold">10:00 - 20:00</p>
</div>
<div className="p-4 bg-surface-container-high rounded-2xl border border-outline-variant/20 border-dashed opacity-50">
<p className="text-[10px] font-label text-outline uppercase mb-2">Sunday</p>
<p className="text-sm font-bold">Closed</p>
</div>
<button className="flex flex-col items-center justify-center bg-surface-container-lowest rounded-2xl border border-outline-variant/20 hover:border-primary transition-all group" type="button">
<span className="material-symbols-outlined text-outline group-hover:text-primary" data-icon="edit_calendar">edit_calendar</span>
<span className="text-[9px] uppercase tracking-widest mt-1">Modify</span>
</button>
</div>
</div>
<div className="pt-8 flex justify-end gap-4">
<button className="px-10 py-4 rounded-xl text-outline font-bold hover:bg-surface-container-high transition-all" type="button">Discard</button>
<button className="px-12 py-4 rounded-xl luxury-gradient text-on-primary font-bold shadow-[0_15px_30px_rgba(229,196,135,0.2)] active:scale-95 transition-all" type="submit">
                                Confirm Professional
                            </button>
</div>
</form>
</div>
</div>
</div>
{/* Subtle Footer Spacer */}
<div className="h-12"></div>
</main>

    </>
  );
}
