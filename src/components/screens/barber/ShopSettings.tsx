export default function ShopSettings() {
  return (
    <>

<style dangerouslySetInnerHTML={{ __html: `.material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
    vertical-align: middle
    }
.grain-overlay {
    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuAPHVBCZOXr84PEac0dn_YbvfhwxFHAvxsIfDEAuSWOFIUlu-AaXMrhD4qy3yEeLXpoAQ_tGm5t8r3ydkx3WOLlVUtijtleZ92AH0Rjbj8gBPFVB53bXOn4tm-FNJC3QggH7gx5PJBT2BGArOXAwIDuhSlhvra7Ak-Yfd1ksCoVAZf_FWcxbcLp55XpVr4wK8kCPZvX5qP_I0OoWEGpvsiQWBcekDfS384zaojkAw0SMoWogEEXfVZJPqoP_kX3P40RnhUM9XqxB5E);
    opacity: 0.03;
    pointer-events: none
    }
.glass-panel {
    backdrop-filter: blur(24px)
    }
.no-scrollbar::-webkit-scrollbar {
    display: none
    }` }} />

<aside className="bg-[#0E0E0E] h-screen w-72 flex flex-col fixed left-0 top-0 z-50 bg-[#1C1B1B] border-r border-[#4D463A]/15 flat no shadows flex flex-col h-full py-8">
<div className="px-8 mb-10">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary font-bold">content_cut</span>
</div>
<div>
<h1 className="font-['Epilogue'] font-black text-[#E5C487] text-lg leading-none">The Gilded Groom</h1>
<p className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px] text-outline mt-1">Elite Management</p>
</div>
</div>
</div>
<nav className="flex-1 space-y-1">
<div className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300 cursor-pointer">
<span className="material-symbols-outlined mr-4" data-icon="dashboard">dashboard</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Dashboard</span>
</div>
<div className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300 cursor-pointer">
<span className="material-symbols-outlined mr-4" data-icon="calendar_today">calendar_today</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Appointments</span>
</div>
<div className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300 cursor-pointer">
<span className="material-symbols-outlined mr-4" data-icon="content_cut">content_cut</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Barbers</span>
</div>
<div className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300 cursor-pointer">
<span className="material-symbols-outlined mr-4" data-icon="dry_cleaning">dry_cleaning</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Services</span>
</div>
<div className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300 cursor-pointer">
<span className="material-symbols-outlined mr-4" data-icon="inventory_2">inventory_2</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Inventory</span>
</div>
<div className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300 cursor-pointer">
<span className="material-symbols-outlined mr-4" data-icon="payments">payments</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Revenue</span>
</div>
</nav>
<div className="px-6 mb-8">
<button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402D00] font-bold font-['Space_Grotesk'] uppercase tracking-widest text-xs active:scale-95 duration-200">
                New Appointment
            </button>
</div>
<div className="mt-auto pt-8 border-t border-[#4D463A]/15">
<div className="flex items-center h-12 text-[#E5C487] font-bold border-l-4 border-[#E5C487] pl-4 bg-gradient-to-r from-[#E5C487]/10 to-transparent hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300 cursor-pointer">
<span className="material-symbols-outlined mr-4" data-icon="settings">settings</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Settings</span>
</div>
<div className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300 cursor-pointer">
<span className="material-symbols-outlined mr-4" data-icon="help_outline">help_outline</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Support</span>
</div>
<div className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300 cursor-pointer">
<span className="material-symbols-outlined mr-4" data-icon="logout">logout</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Logout</span>
</div>
</div>
</aside>
<main className="ml-72 min-h-screen relative overflow-hidden">
<div className="fixed inset-0 grain-overlay z-0"></div>
<header className="bg-[#131313]/60 backdrop-blur-xl text-[#E5C487] font-['Epilogue'] tracking-tight docked full-width top-0 z-40 tonal-transition bg-[#1C1B1B] shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex justify-between items-center w-full px-8 h-20 relative z-10">
<div className="flex items-center gap-6">
<div className="relative">
<span className="material-symbols-outlined text-[#4D463A] absolute left-3 top-1/2 -translate-y-1/2">search</span>
<input className="bg-[#353534]/50 border-none rounded-full pl-10 pr-4 py-2 w-64 text-sm text-[#E5C487] focus:ring-1 focus:ring-[#E5C487] transition-all" placeholder="Search configuration..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 rounded-full hover:bg-[#353534]/50 transition-all duration-300 text-[#4D463A] hover:text-[#E5C487] relative">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-[#E5C487] rounded-full"></span>
</button>
<div className="h-8 w-px bg-[#4D463A]/30 mx-2"></div>
<div className="flex items-center gap-3 cursor-pointer group">
<div className="text-right">
<p className="text-xs font-bold leading-none">Julian Vance</p>
<p className="text-[10px] text-[#4D463A] group-hover:text-[#E5C487] transition-colors">Studio Owner</p>
</div>
<img className="w-10 h-10 rounded-full border border-[#E5C487]/30 group-hover:border-[#E5C487] transition-all" data-alt="Close-up portrait of a sharp-dressed studio owner with a groomed beard and professional haircut" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgwS7GOa-_pCC6Cg6KvsUQcnN-UvbqxcxPCGILJ95Jy4jyPqrlXbDb3PoON4eS4RoBvPw7wJkRgY6fxL-BAt1U4-_ed2it62G-DazRXnqjOq3UY7Lmb5GnKLm3Y47vnX9qz4Iz0ikgYAZaq6-QL1_pI32kcxv1IGd6YkZPezXDYLNO4ZLDfF3ddqKpLAsRV23Gs-7HH9QkwzGf-ZxQyQ1efif3eH-yXBQ4NzBydsc_LjCYXfXSGjjIy9P-3mIgSJ_LTxDm0u0zr7I"/>
</div>
</div>
</header>
<div className="p-12 relative z-10 max-w-7xl mx-auto">
<div className="mb-12">
<h2 className="text-5xl font-headline font-black text-on-surface mb-2 tracking-tighter">Shop Settings</h2>
<p className="text-on-surface-variant font-body max-w-xl">Configure your studio's digital storefront, manage operational flow, and oversee financial routing from one central concierge.</p>
</div>
<div className="grid grid-cols-12 gap-8">
<section className="col-span-8 space-y-8">
<div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
<div className="flex items-center justify-between mb-8">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary" data-icon="store">store</span>
<h3 className="text-xl font-headline font-bold">Shop Profile</h3>
</div>
<span className="px-3 py-1 bg-secondary-container/20 text-secondary text-[10px] font-label uppercase tracking-widest rounded-full border border-secondary/20">Verified Merchant</span>
</div>
<div className="grid grid-cols-2 gap-8">
<div className="space-y-6">
<div>
<label className="block text-[10px] font-label uppercase tracking-widest text-outline mb-2">Studio Name</label>
<input className="w-full bg-transparent border-0 border-b border-outline-variant/30 text-on-surface focus:ring-0 focus:border-primary px-0 py-2 transition-all font-body text-lg" type="text" value="The Gilded Groom"/>
</div>
<div>
<label className="block text-[10px] font-label uppercase tracking-widest text-outline mb-2">Contact Email</label>
<input className="w-full bg-transparent border-0 border-b border-outline-variant/30 text-on-surface focus:ring-0 focus:border-primary px-0 py-2 transition-all font-body" type="email" value="concierge@gildedgroom.com"/>
</div>
<div>
<label className="block text-[10px] font-label uppercase tracking-widest text-outline mb-2">Location Address</label>
<textarea className="w-full bg-transparent border-0 border-b border-outline-variant/30 text-on-surface focus:ring-0 focus:border-primary px-0 py-2 transition-all font-body resize-none" rows={2}>124 Savile Row, Mayfair, London, W1S 3PR</textarea>
</div>
</div>
<div className="flex flex-col items-center justify-center p-6 bg-surface-container-highest/30 rounded-2xl border border-dashed border-outline-variant/30">
<div className="w-24 h-24 rounded-full bg-surface-container overflow-hidden border-2 border-primary/20 mb-4 flex items-center justify-center">
<span className="material-symbols-outlined text-4xl text-primary/40">add_a_photo</span>
</div>
<p className="text-xs font-label uppercase tracking-widest text-outline mb-4">Studio Logo</p>
<button className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-bold rounded-lg transition-all border border-primary/10">Upload New</button>
</div>
</div>
</div>
<div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
<div className="flex items-center gap-3 mb-8">
<span className="material-symbols-outlined text-primary" data-icon="schedule">schedule</span>
<h3 className="text-xl font-headline font-bold">Working Hours</h3>
</div>
<div className="space-y-4">
{/* Working Hours Rows */}
<div className="flex items-center justify-between py-3 group">
<div className="w-32 flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-secondary"></div>
<span className="font-label uppercase tracking-widest text-xs">Monday</span>
</div>
<div className="flex items-center gap-4">
<input className="w-28 bg-surface-container-highest border-none rounded-lg text-sm text-center text-on-surface focus:ring-1 focus:ring-primary" type="text" value="09:00 AM"/>
<span className="text-outline">to</span>
<input className="w-28 bg-surface-container-highest border-none rounded-lg text-sm text-center text-on-surface focus:ring-1 focus:ring-primary" type="text" value="07:00 PM"/>
</div>
<div className="flex items-center gap-2">
<span className="text-[10px] font-label uppercase text-secondary">Open</span>
<div className="w-10 h-5 bg-secondary/20 rounded-full relative p-1 cursor-pointer">
<div className="w-3 h-3 bg-secondary rounded-full absolute right-1 top-1"></div>
</div>
</div>
</div>
<div className="flex items-center justify-between py-3 group">
<div className="w-32 flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-secondary"></div>
<span className="font-label uppercase tracking-widest text-xs">Tuesday</span>
</div>
<div className="flex items-center gap-4">
<input className="w-28 bg-surface-container-highest border-none rounded-lg text-sm text-center text-on-surface focus:ring-1 focus:ring-primary" type="text" value="09:00 AM"/>
<span className="text-outline">to</span>
<input className="w-28 bg-surface-container-highest border-none rounded-lg text-sm text-center text-on-surface focus:ring-1 focus:ring-primary" type="text" value="07:00 PM"/>
</div>
<div className="flex items-center gap-2">
<span className="text-[10px] font-label uppercase text-secondary">Open</span>
<div className="w-10 h-5 bg-secondary/20 rounded-full relative p-1 cursor-pointer">
<div className="w-3 h-3 bg-secondary rounded-full absolute right-1 top-1"></div>
</div>
</div>
</div>
<div className="flex items-center justify-between py-3 group">
<div className="w-32 flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-secondary"></div>
<span className="font-label uppercase tracking-widest text-xs">Wednes.</span>
</div>
<div className="flex items-center gap-4">
<input className="w-28 bg-surface-container-highest border-none rounded-lg text-sm text-center text-on-surface focus:ring-1 focus:ring-primary" type="text" value="09:00 AM"/>
<span className="text-outline">to</span>
<input className="w-28 bg-surface-container-highest border-none rounded-lg text-sm text-center text-on-surface focus:ring-1 focus:ring-primary" type="text" value="07:00 PM"/>
</div>
<div className="flex items-center gap-2">
<span className="text-[10px] font-label uppercase text-secondary">Open</span>
<div className="w-10 h-5 bg-secondary/20 rounded-full relative p-1 cursor-pointer">
<div className="w-3 h-3 bg-secondary rounded-full absolute right-1 top-1"></div>
</div>
</div>
</div>
<div className="flex items-center justify-between py-3 group">
<div className="w-32 flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-secondary"></div>
<span className="font-label uppercase tracking-widest text-xs">Thursday</span>
</div>
<div className="flex items-center gap-4">
<input className="w-28 bg-surface-container-highest border-none rounded-lg text-sm text-center text-on-surface focus:ring-1 focus:ring-primary" type="text" value="09:00 AM"/>
<span className="text-outline">to</span>
<input className="w-28 bg-surface-container-highest border-none rounded-lg text-sm text-center text-on-surface focus:ring-1 focus:ring-primary" type="text" value="09:00 PM"/>
</div>
<div className="flex items-center gap-2">
<span className="text-[10px] font-label uppercase text-secondary">Open</span>
<div className="w-10 h-5 bg-secondary/20 rounded-full relative p-1 cursor-pointer">
<div className="w-3 h-3 bg-secondary rounded-full absolute right-1 top-1"></div>
</div>
</div>
</div>
<div className="flex items-center justify-between py-3 group border-b border-outline-variant/10 pb-6">
<div className="w-32 flex items-center gap-3">
<div className="w-2 h-2 rounded-full bg-error"></div>
<span className="font-label uppercase tracking-widest text-xs">Sunday</span>
</div>
<div className="flex items-center gap-4 opacity-30">
<input className="w-28 bg-surface-container-highest border-none rounded-lg text-sm text-center text-on-surface focus:ring-0" disabled type="text" value="Closed"/>
<span className="text-outline">to</span>
<input className="w-28 bg-surface-container-highest border-none rounded-lg text-sm text-center text-on-surface focus:ring-0" disabled type="text" value="Closed"/>
</div>
<div className="flex items-center gap-2">
<span className="text-[10px] font-label uppercase text-outline">Closed</span>
<div className="w-10 h-5 bg-surface-container-highest rounded-full relative p-1 cursor-pointer">
<div className="w-3 h-3 bg-outline rounded-full absolute left-1 top-1"></div>
</div>
</div>
</div>
</div>
<div className="mt-8 flex justify-end">
<button className="text-primary hover:underline font-label uppercase tracking-widest text-[10px] flex items-center gap-2">
<span className="material-symbols-outlined text-sm">history</span>
                                Manage Holiday Closures
                            </button>
</div>
</div>
</section>
<aside className="col-span-4 space-y-8">
<div className="bg-gradient-to-br from-primary-container/20 to-surface-container-low rounded-3xl p-8 border border-primary/20 overflow-hidden relative">
<div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
<div className="relative z-10">
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined text-primary" data-icon="account_balance_wallet">account_balance_wallet</span>
<h3 className="text-xl font-headline font-bold">Payouts</h3>
</div>
<div className="mb-8">
<p className="text-[10px] font-label uppercase tracking-widest text-outline mb-1">Active Account</p>
<div className="flex items-center gap-3">
<div className="w-10 h-6 bg-[#00210f] rounded border border-secondary/30 flex items-center justify-center">
<span className="text-[8px] font-bold text-secondary">VISA</span>
</div>
<p className="font-body font-bold text-on-surface">•••• 8829</p>
</div>
</div>
<div className="space-y-4 mb-8">
<div className="flex justify-between items-center">
<span className="text-xs text-outline font-body">Next Payout</span>
<span className="text-sm font-bold text-on-surface">Oct 24, 2023</span>
</div>
<div className="flex justify-between items-center">
<span className="text-xs text-outline font-body">Pending Amount</span>
<span className="text-sm font-bold text-secondary">£2,450.00</span>
</div>
</div>
<button className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all">Manage Bank Details</button>
</div>
</div>
<div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined text-primary" data-icon="security">security</span>
<h3 className="text-lg font-headline font-bold">Security</h3>
</div>
<div className="space-y-6">
<div className="flex items-center justify-between">
<div>
<p className="text-xs font-bold text-on-surface">2FA Authentication</p>
<p className="text-[10px] text-outline">Enabled via Authenticator</p>
</div>
<div className="w-8 h-4 bg-secondary/20 rounded-full relative p-1">
<div className="w-2 h-2 bg-secondary rounded-full absolute right-1 top-1"></div>
</div>
</div>
<div className="flex items-center justify-between">
<div>
<p className="text-xs font-bold text-on-surface">Session Timeout</p>
<p className="text-[10px] text-outline">4 Hours inactivity</p>
</div>
<span className="material-symbols-outlined text-outline text-lg cursor-pointer">chevron_right</span>
</div>
</div>
</div>
<div className="p-6 bg-[#353534]/30 rounded-2xl border border-outline-variant/10">
<div className="flex gap-4">
<span className="material-symbols-outlined text-primary" data-icon="auto_awesome">auto_awesome</span>
<div>
<h4 className="text-xs font-bold mb-1">VIP Concierge Support</h4>
<p className="text-[10px] text-outline leading-relaxed mb-3">Your elite plan includes 24/7 dedicated studio success management.</p>
<a className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline" href="#">Contact Manager</a>
</div>
</div>
</div>
</aside>
</div>
<div className="mt-12 pt-8 border-t border-outline-variant/10 flex justify-between items-center">
<div className="flex items-center gap-2 text-outline">
<span className="material-symbols-outlined text-sm">info</span>
<p className="text-[10px] font-label uppercase tracking-widest">Last synced: 2 minutes ago</p>
</div>
<div className="flex gap-4">
<button className="px-8 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold text-xs uppercase tracking-widest hover:bg-surface-container-high transition-all">Discard</button>
<button className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/10 active:scale-95 duration-200">Save Changes</button>
</div>
</div>
</div>
</main>
<div className="fixed bottom-8 right-8 z-50">
<button className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
</button>
</div>

    </>
  );
}
