export default function SlotConfiguration() {
  return (
    <>

<style dangerouslySetInnerHTML={{ __html: `.material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
    color: #E3C285;
    font-size: 20px
    }
.luxury-grain {
    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuBVwpE5Xjc2L_Da220vO0j7eo93pkcnAC83LjcfEUaq1aosKXe2dqH98LdcvX5lWf2fJN90MAVggJV5es9WCiuA6OCs8TScFHZpPXl4kioYc-dIvKcGWT3OBnrAsRsesdRn9B8vz_RFeVGOvOPmzWOFXBerpMAEMlhXQG5VKcAScz2QJ6AZTeuFW4GolLDFJ_vK3cBSFk1tzmVBC7Cg8zBLakv8g5yG4cMjQzmUOf715Njt6FeYM0-WXUmhBFx7BHgMFL7OW_D135Y);
    opacity: 0.03
    }
.asymmetric-clip {
    clip-path: polygon(0 0, 100% 0, 95% 100%, 0% 100%)
    }` }} />

<div className="luxury-grain fixed inset-0 pointer-events-none z-0"></div>
<aside className="h-screen w-72 flex flex-col fixed left-0 top-0 z-50 bg-[#0E0E0E] bg-[#1C1B1B] border-r border-[#4D463A]/15 flat no shadows py-8">
<div className="px-8 mb-10">
<h1 className="font-headline font-black text-[#E5C487] text-2xl tracking-tighter">The Gilded Groom</h1>
<p className="font-label uppercase tracking-widest text-[10px] text-[#4D463A] mt-1">Elite Management</p>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-4 py-3 group hover:bg-[#1C1B1B] transition-all text-[#4D463A] pl-5 hover:text-[#E5C487] hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="font-label uppercase tracking-widest text-xs">Dashboard</span>
</a>
<a className="flex items-center gap-4 py-3 group hover:bg-[#1C1B1B] transition-all text-[#E5C487] font-bold border-l-4 border-[#E5C487] pl-4 bg-gradient-to-r from-[#E5C487]/10 to-transparent hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined icon-filled" data-icon="calendar_today">calendar_today</span>
<span className="font-label uppercase tracking-widest text-xs">Appointments</span>
</a>
<a className="flex items-center gap-4 py-3 group hover:bg-[#1C1B1B] transition-all text-[#4D463A] pl-5 hover:text-[#E5C487] hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined" data-icon="content_cut">content_cut</span>
<span className="font-label uppercase tracking-widest text-xs">Barbers</span>
</a>
<a className="flex items-center gap-4 py-3 group hover:bg-[#1C1B1B] transition-all text-[#4D463A] pl-5 hover:text-[#E5C487] hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined" data-icon="dry_cleaning">dry_cleaning</span>
<span className="font-label uppercase tracking-widest text-xs">Services</span>
</a>
<a className="flex items-center gap-4 py-3 group hover:bg-[#1C1B1B] transition-all text-[#4D463A] pl-5 hover:text-[#E5C487] hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
<span className="font-label uppercase tracking-widest text-xs">Inventory</span>
</a>
<a className="flex items-center gap-4 py-3 group hover:bg-[#1C1B1B] transition-all text-[#4D463A] pl-5 hover:text-[#E5C487] hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined" data-icon="payments">payments</span>
<span className="font-label uppercase tracking-widest text-xs">Revenue</span>
</a>
</nav>
<div className="px-6 mt-auto">
<button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2">
<span className="material-symbols-outlined !text-on-primary" data-icon="add">add</span>
                New Appointment
            </button>
<div className="mt-8 space-y-4">
<a className="flex items-center gap-4 text-[#4D463A] hover:text-primary transition-colors pl-2" href="#">
<span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
<span className="font-label uppercase tracking-widest text-[10px]">Support</span>
</a>
<a className="flex items-center gap-4 text-[#4D463A] hover:text-primary transition-colors pl-2" href="#">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
<span className="font-label uppercase tracking-widest text-[10px]">Logout</span>
</a>
</div>
</div>
</aside>
<main className="ml-72 min-h-screen p-12 relative z-10">
<header className="flex justify-between items-end mb-12">
<div className="max-w-2xl">
<span className="font-label text-primary uppercase tracking-[0.3em] text-xs font-bold mb-3 block">Scheduling Engine</span>
<h2 className="font-headline text-5xl font-black tracking-tight text-on-surface mb-4">Slot Configuration</h2>
<p className="text-on-surface-variant text-lg leading-relaxed">Refine your studio's rhythm. Control availability density, buffer intervals, and customer booking parameters from a single command center.</p>
</div>
<div className="flex gap-4">
<button className="px-8 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-headline font-bold hover:bg-surface-container-highest transition-all">Discard</button>
<button className="px-8 py-3 rounded-xl bg-primary text-on-primary font-headline font-bold shadow-xl shadow-primary/10 hover:translate-y-[-2px] active:translate-y-0 transition-all">Publish Changes</button>
</div>
</header>
<div className="grid grid-cols-12 gap-8">
<div className="col-span-12 lg:col-span-7 space-y-8">
<section className="bg-surface-container-low p-8 rounded-3xl relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
<div className="flex items-center gap-3 mb-8">
<div className="p-2 bg-primary/10 rounded-lg">
<span className="material-symbols-outlined" data-icon="timer">timer</span>
</div>
<h3 className="font-headline text-xl font-bold">Duration &amp; Density</h3>
</div>
<div className="grid grid-cols-2 gap-8">
<div className="space-y-4">
<label className="font-label text-xs uppercase tracking-widest text-outline">Default Slot Duration</label>
<div className="grid grid-cols-2 gap-3">
<button className="py-3 px-4 rounded-xl bg-surface-container-highest border border-primary text-primary font-bold transition-all">15 min</button>
<button className="py-3 px-4 rounded-xl bg-surface-container-highest border border-outline-variant/20 text-on-surface-variant hover:border-primary/50 transition-all">30 min</button>
<button className="py-3 px-4 rounded-xl bg-surface-container-highest border border-outline-variant/20 text-on-surface-variant hover:border-primary/50 transition-all">45 min</button>
<button className="py-3 px-4 rounded-xl bg-surface-container-highest border border-outline-variant/20 text-on-surface-variant hover:border-primary/50 transition-all">60 min</button>
</div>
</div>
<div className="space-y-4">
<label className="font-label text-xs uppercase tracking-widest text-outline">Buffer Time (Prep)</label>
<div className="relative group">
<select className="w-full bg-surface-container-highest border-b border-outline-variant appearance-none py-4 px-4 rounded-t-xl focus:border-primary focus:ring-0 transition-all text-on-surface" defaultValue="5 minutes">
<option>None (Back-to-back)</option>
<option>5 minutes</option>
<option>10 minutes</option>
<option>15 minutes</option>
</select>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" data-icon="expand_more">expand_more</span>
</div>
<p className="text-[11px] text-on-surface-variant italic">Applied between every consecutive appointment.</p>
</div>
</div>
<div className="mt-12 space-y-6">
<div className="flex justify-between items-center">
<div>
<h4 className="font-headline font-bold">Booking Window</h4>
<p className="text-xs text-on-surface-variant">How far in advance can clients book?</p>
</div>
<div className="flex items-center gap-4 bg-surface-container-highest px-4 py-2 rounded-xl">
<input className="w-12 bg-transparent border-none text-center font-bold text-primary focus:ring-0 p-0" type="number" defaultValue={30}/>
<span className="text-xs font-label uppercase tracking-tighter text-outline">Days</span>
</div>
</div>
<div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary w-[40%]"></div>
</div>
</div>
</section>
<section className="bg-surface-container-low p-8 rounded-3xl">
<div className="flex items-center justify-between mb-8">
<div className="flex items-center gap-3">
<div className="p-2 bg-primary/10 rounded-lg">
<span className="material-symbols-outlined" data-icon="event_busy">event_busy</span>
</div>
<h3 className="font-headline text-xl font-bold">Studio Closures</h3>
</div>
<button className="text-primary font-label text-xs uppercase tracking-widest font-bold hover:underline">Add Recurring</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
<div className="flex justify-between items-center mb-6">
<span className="font-headline font-bold">December 2024</span>
<div className="flex gap-2">
<span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary" data-icon="chevron_left">chevron_left</span>
<span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary" data-icon="chevron_right">chevron_right</span>
</div>
</div>
<div className="grid grid-cols-7 text-center gap-y-3">
<span className="text-[10px] font-label text-outline uppercase">S</span>
<span className="text-[10px] font-label text-outline uppercase">M</span>
<span className="text-[10px] font-label text-outline uppercase">T</span>
<span className="text-[10px] font-label text-outline uppercase">W</span>
<span className="text-[10px] font-label text-outline uppercase">T</span>
<span className="text-[10px] font-label text-outline uppercase">F</span>
<span className="text-[10px] font-label text-outline uppercase">S</span>
<span className="text-sm py-2 text-outline/30">24</span>
<span className="text-sm py-2 text-outline/30">25</span>
<span className="text-sm py-2 text-outline/30">26</span>
<span className="text-sm py-2 text-outline/30">27</span>
<span className="text-sm py-2 text-outline/30">28</span>
<span className="text-sm py-2 text-outline/30">29</span>
<span className="text-sm py-2 text-on-surface">1</span>
<span className="text-sm py-2 text-on-surface">2</span>
<span className="text-sm py-2 text-on-surface">3</span>
<span className="text-sm py-2 text-on-surface">4</span>
<span className="text-sm py-2 text-on-surface">5</span>
<span className="text-sm py-2 text-on-surface">6</span>
<span className="text-sm py-2 text-on-surface">7</span>
<span className="text-sm py-2 text-on-surface">8</span>
<span className="text-sm py-2 text-on-surface">9</span>
<span className="text-sm py-2 text-on-surface">10</span>
<span className="text-sm py-2 text-on-surface">11</span>
<span className="text-sm py-2 text-on-surface">12</span>
<span className="text-sm py-2 text-on-surface">13</span>
<span className="text-sm py-2 text-on-surface">14</span>
<span className="text-sm py-2 text-on-surface">15</span>
<span className="text-sm py-2 text-on-surface">16</span>
<span className="text-sm py-2 text-on-surface">17</span>
<span className="text-sm py-2 text-on-surface">18</span>
<span className="text-sm py-2 text-on-surface">19</span>
<span className="text-sm py-2 text-on-surface">20</span>
<span className="text-sm py-2 text-on-surface">21</span>
<span className="text-sm py-2 text-on-surface">22</span>
<span className="text-sm py-2 text-on-surface">23</span>
<span className="text-sm py-2 bg-error-container/30 text-error rounded-lg font-bold border border-error/20">24</span>
<span className="text-sm py-2 bg-error-container/30 text-error rounded-lg font-bold border border-error/20">25</span>
<span className="text-sm py-2 bg-error-container/30 text-error rounded-lg font-bold border border-error/20">26</span>
<span className="text-sm py-2 text-on-surface">27</span>
<span className="text-sm py-2 text-on-surface">28</span>
<span className="text-sm py-2 text-on-surface">29</span>
</div>
</div>
<div className="space-y-4">
<h4 className="font-headline font-bold text-sm uppercase tracking-wider text-outline">Upcoming Holidays</h4>
<div className="space-y-3">
<div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-xl border-l-4 border-error/40">
<div>
<div className="font-bold text-on-surface">Christmas Eve</div>
<div className="text-xs text-on-surface-variant">Dec 24, 2024 • All Day</div>
</div>
<span className="material-symbols-outlined text-outline/50 hover:text-error cursor-pointer" data-icon="close">close</span>
</div>
<div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-xl border-l-4 border-error/40">
<div>
<div className="font-bold text-on-surface">Christmas Day</div>
<div className="text-xs text-on-surface-variant">Dec 25, 2024 • All Day</div>
</div>
<span className="material-symbols-outlined text-outline/50 hover:text-error cursor-pointer" data-icon="close">close</span>
</div>
<div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-xl border-l-4 border-error/40">
<div>
<div className="font-bold text-on-surface">Boxing Day</div>
<div className="text-xs text-on-surface-variant">Dec 26, 2024 • All Day</div>
</div>
<span className="material-symbols-outlined text-outline/50 hover:text-error cursor-pointer" data-icon="close">close</span>
</div>
</div>
</div>
</div>
</section>
</div>
<div className="col-span-12 lg:col-span-5">
<div className="sticky top-12">
<div className="relative bg-surface-container-high rounded-[2.5rem] p-1 border-8 border-surface-container-lowest shadow-2xl overflow-hidden aspect-[9/19] max-h-[850px] mx-auto">
<div className="h-full bg-surface rounded-[2rem] overflow-y-auto flex flex-col">
<div className="p-8 text-center bg-surface-container-low border-b border-outline-variant/10">
<div className="w-16 h-1 bg-surface-container-highest mx-auto mb-6 rounded-full"></div>
<h5 className="font-headline text-2xl font-black mb-2">Book a Session</h5>
<p className="text-on-surface-variant text-sm">Select your preferred time</p>
</div>
<div className="p-6 space-y-8 flex-1">
<div>
<div className="flex justify-between items-center mb-4">
<span className="font-headline font-bold text-sm">Tomorrow, Dec 12</span>
<span className="material-symbols-outlined text-primary" data-icon="calendar_month">calendar_month</span>
</div>
<div className="grid grid-cols-2 gap-3">
<div className="p-4 bg-surface-container-lowest rounded-2xl text-center border border-outline-variant/20 hover:border-primary cursor-pointer transition-all">
<div className="text-lg font-headline font-black text-on-surface">09:00</div>
<div className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mt-1">Available</div>
</div>
<div className="p-4 bg-primary rounded-2xl text-center border border-primary shadow-lg shadow-primary/20 scale-105 z-10">
<div className="text-lg font-headline font-black text-on-primary">09:20</div>
<div className="text-[10px] font-label text-on-primary/60 uppercase tracking-widest mt-1">Selected</div>
</div>
<div className="p-4 bg-surface-container-lowest rounded-2xl text-center border border-outline-variant/20 hover:border-primary cursor-pointer transition-all">
<div className="text-lg font-headline font-black text-on-surface">09:40</div>
<div className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mt-1">Available</div>
</div>
<div className="p-4 bg-surface-container-lowest opacity-40 rounded-2xl text-center border border-outline-variant/10 cursor-not-allowed">
<div className="text-lg font-headline font-black text-on-surface/50">10:00</div>
<div className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mt-1 line-through">Booked</div>
</div>
<div className="p-4 bg-surface-container-lowest rounded-2xl text-center border border-outline-variant/20 hover:border-primary cursor-pointer transition-all">
<div className="text-lg font-headline font-black text-on-surface">10:20</div>
<div className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mt-1">Available</div>
</div>
<div className="p-4 bg-surface-container-lowest rounded-2xl text-center border border-outline-variant/20 hover:border-primary cursor-pointer transition-all">
<div className="text-lg font-headline font-black text-on-surface">10:40</div>
<div className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mt-1">Available</div>
</div>
</div>
</div>
<div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-high shrink-0">
<img alt="Barber" className="w-full h-full object-cover" data-alt="Portrait of a skilled professional barber with sharp features and modern grooming style in high-end barbershop environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmddIRPhpgEyVv7kB9i75LTKWK3ckmpN0-c1ptvtP5LJfu8ufWKb43DMhr9ZGitK9f6XbDuJ9Ky4-P5Ei0FHaxULJNFHnoINhjmtXscXiEkJhDf7hSw7RSgFxK9eIqS8MpNBGxvbBX7lXSPgYTDQj0Wn9ia-4K4wUoe1gea7FqTLm2sKjQboKKrvLtojOQENPanmYqwgMyy0og-xmks3pCT_cloBpu_pcYZk3-SUW6mB7ARP8vtDpWa0y-7PfsOtJQls8sst92Wvg"/>
</div>
<div>
<div className="font-headline font-bold text-sm">Elite Fade &amp; Beard</div>
<div className="text-xs text-on-surface-variant">with Julian Vance • 20 mins</div>
</div>
</div>
</div>
</div>
<div className="p-6 mt-auto">
<button className="w-full bg-primary text-on-primary font-headline font-black py-5 rounded-2xl tracking-tight shadow-2xl shadow-primary/30">CONTINUE TO PAYMENT</button>
</div>
</div>
<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-secondary-container/90 backdrop-blur px-4 py-2 rounded-full border border-secondary/20 animate-pulse">
<span className="w-2 h-2 bg-secondary rounded-full"></span>
<span className="text-[10px] font-label font-bold text-secondary uppercase tracking-widest">Live Preview</span>
</div>
</div>
</div>
</div>
</div>
</main>
<div className="fixed bottom-8 right-8 z-[60]">
<button className="bg-surface-container-high text-primary p-4 rounded-full shadow-2xl border border-outline-variant/30 hover:bg-surface-container-highest transition-all group flex items-center gap-3 pr-6">
<span className="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
<span className="font-headline font-bold text-sm">Optimize Slots with AI</span>
</button>
</div>

    </>
  );
}
