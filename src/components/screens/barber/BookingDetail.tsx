export default function BookingDetail() {
  return (
    <>

<style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            color: #E3C285;
            font-size: 20px;
        }
        .glass-panel {
            background: rgba(28, 27, 27, 0.6);
            backdrop-filter: blur(24px);
        }
        .luxury-gradient {
            background: linear-gradient(45deg, #E5C487, #C8A96E);
        }
        .asymmetric-crop {
            border-top-left-radius: 1.5rem;
            border-bottom-right-radius: 0.75rem;
        }
    ` }} />

{/* Sidebar Navigation */}
<aside className="h-screen w-72 flex flex-col fixed left-0 top-0 z-50 bg-[#0E0E0E] bg-[#1C1B1B] border-r border-[#4D463A]/15">
<div className="flex flex-col h-full py-8">
{/* Brand Anchor */}
<div className="px-8 mb-12">
<h1 className="font-['Epilogue'] font-black text-[#E5C487] text-2xl tracking-tight">The Gilded Groom</h1>
<p className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px] text-outline mt-1">Elite Management</p>
</div>
{/* Navigation Links */}
<nav className="flex-1 space-y-2">
<a className="flex items-center gap-4 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all group py-3 hover:bg-[#1C1B1B]" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Dashboard</span>
</a>
<a className="flex items-center gap-4 text-[#E5C487] font-bold border-l-4 border-[#E5C487] pl-4 bg-gradient-to-r from-[#E5C487]/10 to-transparent group py-3" href="#">
<span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Appointments</span>
</a>
<a className="flex items-center gap-4 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all group py-3 hover:bg-[#1C1B1B]" href="#">
<span className="material-symbols-outlined" data-icon="content_cut">content_cut</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Barbers</span>
</a>
<a className="flex items-center gap-4 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all group py-3 hover:bg-[#1C1B1B]" href="#">
<span className="material-symbols-outlined" data-icon="dry_cleaning">dry_cleaning</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Services</span>
</a>
<a className="flex items-center gap-4 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all group py-3 hover:bg-[#1C1B1B]" href="#">
<span className="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Inventory</span>
</a>
<a className="flex items-center gap-4 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all group py-3 hover:bg-[#1C1B1B]" href="#">
<span className="material-symbols-outlined" data-icon="payments">payments</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Revenue</span>
</a>
</nav>
{/* Footer Tabs */}
<div className="px-5 mt-auto pt-8 border-t border-outline-variant/10 space-y-2">
<a className="flex items-center gap-4 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all group py-2" href="#">
<span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Support</span>
</a>
<a className="flex items-center gap-4 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all group py-2" href="#">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Logout</span>
</a>
</div>
</div>
</aside>
{/* Main Content Area */}
<main className="ml-72 min-h-screen p-12">
{/* Header Section */}
<header className="mb-12 flex justify-between items-end">
<div>
<nav className="flex items-center gap-2 text-outline-variant font-label text-xs uppercase tracking-widest mb-4">
<span>Appointments</span>
<span className="material-symbols-outlined text-[12px]" data-icon="chevron_right">chevron_right</span>
<span className="text-primary">BK-7294-Luxury</span>
</nav>
<h2 className="font-headline text-5xl font-black text-on-surface tracking-tighter">Booking Details</h2>
</div>
<div className="flex gap-4">
<button className="px-6 py-3 border border-outline-variant/20 rounded-xl font-label text-xs uppercase tracking-widest text-on-surface hover:bg-surface-container-high transition-all active:scale-95">
                    Reschedule
                </button>
<button className="px-6 py-3 border border-error/20 rounded-xl font-label text-xs uppercase tracking-widest text-error hover:bg-error/5 transition-all active:scale-95">
                    Cancel Appointment
                </button>
</div>
</header>
{/* Bento Layout */}
<div className="grid grid-cols-12 gap-8">
{/* Column 1: Customer Profile & Service Info */}
<div className="col-span-12 lg:col-span-8 space-y-8">
{/* Main Booking Card */}
<section className="bg-surface-container-low p-8 rounded-3xl relative overflow-hidden group">
<div className="absolute top-0 right-0 p-8">
<div className="bg-secondary-container/20 text-secondary border border-secondary/20 px-4 py-1.5 rounded-full flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
<span className="font-label text-xs font-bold uppercase tracking-widest">Active Session</span>
</div>
</div>
<div className="flex items-start gap-8">
<div className="relative">
<img alt="Customer Portrait" className="w-32 h-32 object-cover asymmetric-crop border-2 border-primary/20" data-alt="portrait of a sharp dressed man with a well-groomed beard, studio lighting, deep shadows, professional and sophisticated atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzV9xLfyysfsK66tY_OGJLjPhYPnRlOultCkbNaMW_AEfxRmbcpe6asiVRV5xj4pA1qnC21sX710DH5Wezk_-pTTiheM-J-fq-kq406jbzkuYT3Kos7tH_vTrOynPVknEHxTTwt0Xkqeg1G6654aXnO8ofyohr6_nMW450Ut3-wSx4mF7Gu5wqf9nUAI4nZQCqR2kG_0USLE4r3et5Ox4QIutwKX9OvpJZMNwzEDIsilzfdJZQKT8QMCP62IMdnZ5TrHRy6ghuys0"/>
<div className="absolute -bottom-2 -right-2 bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center font-black text-xl border-4 border-surface-container-low">
                                V
                            </div>
</div>
<div className="flex-1 pt-2">
<p className="font-label text-primary uppercase tracking-widest text-xs font-bold mb-1">Platinum Member</p>
<h3 className="font-headline text-3xl font-bold text-on-surface mb-2">Julian Vercetti</h3>
<div className="flex items-center gap-6">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-outline" data-icon="event_repeat">event_repeat</span>
<span className="text-sm font-label text-outline-variant">24 Previous Visits</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-outline" data-icon="verified_user">verified_user</span>
<span className="text-sm font-label text-outline-variant">Member since 2022</span>
</div>
</div>
</div>
</div>
<div className="mt-12 grid grid-cols-3 gap-12 pt-8 border-t border-outline-variant/10">
<div>
<p className="font-label text-outline uppercase tracking-widest text-[10px] mb-2">Service Selection</p>
<p className="font-headline font-bold text-xl">The Gilded Full Cut</p>
<p className="text-on-surface-variant text-sm mt-1">Includes wash, style, and signature aroma therapy.</p>
</div>
<div>
<p className="font-label text-outline uppercase tracking-widest text-[10px] mb-2">Assigned Artisan</p>
<div className="flex items-center gap-3">
<img alt="Barber" className="w-8 h-8 rounded-full object-cover" data-alt="close up of a professional barber with tattoos focused on his craft, warm lighting, blurred background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyAVnv9lk5_88rK2DhASh8rv4IqsnALV7tmBF-GVvNEwr6KYanYGGK59Lzndqy5OjiL4z-TA0OYjqtpVfUwW1CSnjmiJYzyAUW9KJzqZVc0MeEi6CVq8Id67ZB9EyjaRzgUFbAv7skNx7NLbukvU7o7uG4W_km_ddrnbDvinOqTj6GqPE19aIJmRPNjcXPhYzEaFqdTAWF44gl85TPwYUgp3oZXXcG9lx4kttNsaxqZBjvEGTx-pl8vp7vZ6th8HRlCubx_6AI0nE"/>
<div>
<p className="font-headline font-bold text-sm">Marcus Sterling</p>
<p className="text-xs text-outline-variant">Senior Barber</p>
</div>
</div>
</div>
<div>
<p className="font-label text-outline uppercase tracking-widest text-[10px] mb-2">Time Slot</p>
<p className="font-headline font-bold text-xl">14:30 — 15:15</p>
<p className="text-on-surface-variant text-sm mt-1">Today, Oct 12th</p>
</div>
</div>
</section>
{/* Notes & Special Requests */}
<section className="grid grid-cols-2 gap-8">
<div className="bg-surface-container-low p-8 rounded-3xl">
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined" data-icon="sticky_note_2">sticky_note_2</span>
<h4 className="font-headline font-bold uppercase tracking-widest text-sm">Service Notes</h4>
</div>
<p className="text-on-surface-variant leading-relaxed text-sm">
                            Customer prefers cold water during hair wash. Sensitive skin on the neck area—use alcohol-free aftershave only. Keep the sideburns pointed.
                        </p>
<button className="mt-6 text-primary font-label text-xs uppercase tracking-widest hover:underline">Edit Notes</button>
</div>
<div className="bg-surface-container-low p-8 rounded-3xl relative overflow-hidden">
<div className="absolute -right-4 -bottom-4 opacity-10">
<span className="material-symbols-outlined text-8xl" data-icon="liquor">liquor</span>
</div>
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined" data-icon="local_bar">local_bar</span>
<h4 className="font-headline font-bold uppercase tracking-widest text-sm">Complimentary Service</h4>
</div>
<p className="text-on-surface-variant leading-relaxed text-sm">
                            Selected Beverage: Single Malt Highland Scotch (Neat).
                        </p>
<div className="mt-4 flex gap-2">
<span className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-label uppercase text-outline">Requested</span>
</div>
</div>
</section>
{/* Action Bar */}
<section className="bg-surface-container-highest p-6 rounded-3xl flex justify-between items-center">
<div className="flex gap-4">
<button className="luxury-gradient px-8 py-4 rounded-xl flex items-center gap-3 group active:scale-95 transition-all">
<span className="material-symbols-outlined text-on-primary icon-filled" data-icon="check_circle">check_circle</span>
<span className="font-headline font-bold text-on-primary tracking-tight">Complete Service</span>
</button>
<button className="bg-surface-container-low border border-primary/20 px-8 py-4 rounded-xl flex items-center gap-3 group active:scale-95 transition-all">
<span className="material-symbols-outlined" data-icon="hail">hail</span>
<span className="font-headline font-bold text-primary tracking-tight">Mark Arrived</span>
</button>
</div>
<p className="font-label text-outline-variant text-xs">Updated 2 mins ago by Front Desk</p>
</section>
</div>
{/* Column 2: Financials & History */}
<div className="col-span-12 lg:col-span-4 space-y-8">
{/* Payment Summary */}
<section className="bg-surface-container-low rounded-3xl overflow-hidden border-t-4 border-primary">
<div className="p-8">
<h4 className="font-headline font-bold uppercase tracking-widest text-sm mb-8 text-center">Checkout Summary</h4>
<div className="space-y-4 mb-8">
<div className="flex justify-between items-center text-sm">
<span className="text-outline-variant">Gilded Full Cut</span>
<span className="font-label font-bold">$85.00</span>
</div>
<div className="flex justify-between items-center text-sm">
<span className="text-outline-variant">Beard Sculpting Add-on</span>
<span className="font-label font-bold">$25.00</span>
</div>
<div className="flex justify-between items-center text-sm">
<span className="text-outline-variant">Luxury Surcharge</span>
<span className="font-label font-bold">$15.00</span>
</div>
<div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
<span className="font-headline font-bold">Total Estimate</span>
<span className="font-headline font-black text-2xl text-primary">$125.00</span>
</div>
</div>
<div className="bg-surface-container-highest p-4 rounded-2xl flex items-center gap-4 mb-6">
<div className="bg-[#0E0E0E] p-2 rounded-lg">
<span className="material-symbols-outlined" data-icon="contactless">contactless</span>
</div>
<div>
<p className="text-[10px] font-label uppercase text-outline-variant">Preferred Payment</p>
<p className="text-xs font-bold font-label">Amex Gold •••• 1004</p>
</div>
</div>
<div className="flex items-center gap-2 justify-center py-2 px-4 bg-secondary-container/10 border border-secondary/10 rounded-full">
<span className="material-symbols-outlined text-[16px] text-secondary icon-filled" data-icon="shield_checked">shield</span>
<span className="text-[10px] font-label uppercase text-secondary font-bold tracking-widest">Transaction Pre-Authorized</span>
</div>
</div>
</section>
{/* History Timeline */}
<section className="bg-surface-container-low p-8 rounded-3xl">
<h4 className="font-headline font-bold uppercase tracking-widest text-sm mb-8">Booking Timeline</h4>
<div className="space-y-8 relative">
<div className="absolute left-[11px] top-2 bottom-2 w-px bg-outline-variant/20"></div>
<div className="relative pl-10">
<div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface-container-highest border border-primary flex items-center justify-center z-10">
<div className="w-2 h-2 rounded-full bg-primary"></div>
</div>
<p className="text-xs font-label text-outline mb-1">14:15 Today</p>
<p className="text-sm font-bold">Customer Checked-in</p>
<p className="text-xs text-outline-variant mt-1">Via mobile app geo-fencing.</p>
</div>
<div className="relative pl-10">
<div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface-container-low border border-outline-variant/30 flex items-center justify-center z-10">
<div className="w-2 h-2 rounded-full bg-outline-variant/30"></div>
</div>
<p className="text-xs font-label text-outline mb-1">09:00 Today</p>
<p className="text-sm font-bold">Appointment Confirmed</p>
<p className="text-xs text-outline-variant mt-1">Automated SMS reminder sent.</p>
</div>
<div className="relative pl-10">
<div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface-container-low border border-outline-variant/30 flex items-center justify-center z-10">
<div className="w-2 h-2 rounded-full bg-outline-variant/30"></div>
</div>
<p className="text-xs font-label text-outline mb-1">Oct 08, 11:30</p>
<p className="text-sm font-bold">Booking Created</p>
<p className="text-xs text-outline-variant mt-1">Staff: Sarah (Reception)</p>
</div>
</div>
</section>
{/* Quick Help */}
<div className="p-8 rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
<h5 className="font-headline font-bold text-primary mb-2">Need Assistance?</h5>
<p className="text-xs text-outline-variant leading-relaxed mb-6">If there are any issues with this premium session, contact the manager on duty immediately.</p>
<button className="w-full py-3 rounded-xl bg-surface-container-highest text-primary font-label text-[10px] uppercase tracking-widest hover:bg-surface-container-high transition-colors">
                        Call Floor Manager
                    </button>
</div>
</div>
</div>
</main>
{/* Floating Quick Actions (Admin Only) */}
<div className="fixed bottom-8 right-8 z-40">
<button className="w-16 h-16 rounded-full luxury-gradient shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center group active:scale-90 transition-all">
<span className="material-symbols-outlined text-on-primary text-3xl transition-transform group-hover:rotate-90" data-icon="add">add</span>
</button>
</div>

    </>
  );
}
