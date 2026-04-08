export default function Payments() {
  return (
    <>

<style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            color: #E3C285;
            font-size: 20px;
        }
        .premium-grain {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
        }
        .asymmetric-gradient {
            background: linear-gradient(135deg, #1C1B1B 0%, #131313 100%);
        }
        .gold-shimmer {
            background: linear-gradient(45deg, #E5C487 0%, #C8A96E 100%);
        }
    ` }} />

{/* Side Navigation Bar */}
<aside className="h-screen w-72 flex flex-col fixed left-0 top-0 z-50 bg-[#0E0E0E] bg-[#1C1B1B] border-r border-[#4D463A]/15 py-8">
<div className="px-8 mb-12">
<h1 className="font-['Epilogue'] font-black text-[#E5C487] text-2xl tracking-tight">The Gilded Groom</h1>
<p className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px] text-[#4D463A] mt-1">Elite Management</p>
</div>
<nav className="flex-1 flex flex-col gap-1">
<a className="flex items-center gap-4 py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Dashboard</span>
</a>
<a className="flex items-center gap-4 py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Appointments</span>
</a>
<a className="flex items-center gap-4 py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined" data-icon="content_cut">content_cut</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Barbers</span>
</a>
<a className="flex items-center gap-4 py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined" data-icon="dry_cleaning">dry_cleaning</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Services</span>
</a>
<a className="flex items-center gap-4 py-3 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Inventory</span>
</a>
<a className="flex items-center gap-4 py-3 text-[#E5C487] font-bold border-l-4 border-[#E5C487] pl-4 bg-gradient-to-r from-[#E5C487]/10 to-transparent transition-all group duration-300" href="#">
<span className="material-symbols-outlined" data-icon="payments" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Revenue</span>
</a>
</nav>
<div className="px-8 mt-auto flex flex-col gap-4">
<button className="gold-shimmer text-on-primary font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(229,196,135,0.2)] active:scale-95 transition-transform">
                New Appointment
            </button>
<div className="pt-8 flex flex-col gap-4 border-t border-[#4D463A]/15">
<a className="flex items-center gap-4 text-[#4D463A] hover:text-[#E5C487] transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Support</span>
</a>
<a className="flex items-center gap-4 text-[#4D463A] hover:text-[#E5C487] transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Logout</span>
</a>
</div>
</div>
</aside>
{/* Main Content Area */}
<main className="ml-72 min-h-screen p-12">
{/* Top App Bar Content */}
<header className="flex justify-between items-end mb-16">
<div>
<h2 className="font-headline text-5xl font-black text-on-surface tracking-tighter mb-2">Revenue Hub</h2>
<p className="text-on-surface-variant font-body">Financial health and transaction settlement</p>
</div>
<div className="flex items-center gap-6">
<div className="flex flex-col items-end">
<span className="font-label text-xs uppercase tracking-widest text-primary">Settlement Account</span>
<span className="font-body text-sm font-bold">**** 8821 • Studio Elite</span>
</div>
<div className="h-12 w-12 rounded-full overflow-hidden border-2 border-outline-variant">
<img alt="Manager Profile" className="h-full w-full object-cover" data-alt="Close-up portrait of a sharp professional man with a groomed beard in a modern luxury studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx0y6HDB3Ztlspj0IyxMQHMYsU8u_vBWTxhcGg8vU08lsrlVLKOHc3o742nCzLYCSZyDBqioZ--l5lcwJA6cSC6pBtq-72qV3TSeIZogDpB1Uew4YhjVjpvN0koDVSgGhA_0KqycsTmWc6TZzYtqU3KCaL1C9ztlUSJnq2lGym8aeb6XV4LZETmcZdkBbmN3Sf78MxlirZHUNIvhbJngJ-ZnygKm2-RLaR9ivp_6LxjcdMIGuY553nmrhR9Liarf96Ix9B_xtOdN0"/>
</div>
</div>
</header>
{/* Bento Grid Section */}
<section className="grid grid-cols-12 gap-8 mb-12">
{/* Large Available Balance Card */}
<div className="col-span-8 bg-surface-container-low p-10 rounded-[2rem] flex flex-col justify-between border border-outline-variant/10 relative overflow-hidden group">
<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors duration-500"></div>
<div className="relative z-10">
<div className="flex justify-between items-start mb-12">
<span className="font-label text-sm uppercase tracking-[0.2em] text-on-surface-variant">Available Balance</span>
<div className="bg-secondary-container/20 text-secondary px-4 py-1.5 rounded-full flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
<span className="font-label text-[10px] font-bold tracking-widest uppercase">Live Updates</span>
</div>
</div>
<div className="flex items-baseline gap-4 mb-2">
<span className="font-headline text-7xl font-bold text-primary">$12,482.50</span>
<span className="text-secondary font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-secondary" data-icon="arrow_upward">arrow_upward</span>
                            14%
                        </span>
</div>
<p className="text-on-surface-variant font-body opacity-60">Last payout: Oct 14, 2023 • $3,210.00</p>
</div>
<div className="relative z-10 flex gap-4 mt-12">
<button className="gold-shimmer text-on-primary font-bold px-10 py-4 rounded-xl shadow-[0_20px_40px_rgba(229,196,135,0.3)] active:scale-95 transition-all flex items-center gap-3">
<span className="material-symbols-outlined !text-on-primary" data-icon="account_balance_wallet" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                        Withdraw Funds
                    </button>
<button className="bg-surface-container-high px-10 py-4 rounded-xl font-bold text-primary border border-primary/10 hover:bg-surface-container-highest transition-colors active:scale-95">
                        Schedule Payout
                    </button>
</div>
</div>
{/* Stats Column */}
<div className="col-span-4 flex flex-col gap-8">
<div className="bg-surface-container-high p-8 rounded-[2rem] border border-outline-variant/10">
<span className="font-label text-xs uppercase tracking-widest text-on-surface-variant block mb-4">Pending Clearance</span>
<div className="flex justify-between items-end">
<h4 className="font-headline text-3xl font-bold">$1,850.25</h4>
<span className="material-symbols-outlined opacity-40" data-icon="schedule">schedule</span>
</div>
</div>
<div className="bg-surface-container-high p-8 rounded-[2rem] border border-outline-variant/10 flex-1 relative overflow-hidden">
<span className="font-label text-xs uppercase tracking-widest text-on-surface-variant block mb-4">Revenue Breakdown</span>
<div className="space-y-4">
<div className="flex justify-between items-center">
<span className="text-sm opacity-60">Services</span>
<span className="font-bold">82%</span>
</div>
<div className="w-full bg-surface-container-lowest h-1.5 rounded-full">
<div className="bg-primary h-full rounded-full" style={{ width: "82%" }}></div>
</div>
<div className="flex justify-between items-center">
<span className="text-sm opacity-60">Products</span>
<span className="font-bold">18%</span>
</div>
<div className="w-full bg-surface-container-lowest h-1.5 rounded-full">
<div className="bg-primary/40 h-full rounded-full" style={{ width: "18%" }}></div>
</div>
</div>
</div>
</div>
</section>
{/* Transaction History Section */}
<section className="bg-surface-container-low rounded-[2.5rem] border border-outline-variant/5 p-10">
<div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
<h3 className="font-headline text-2xl font-bold">Transaction History</h3>
{/* Filter Tabs */}
<div className="flex bg-surface-container-lowest p-1.5 rounded-2xl border border-outline-variant/10">
<button className="px-6 py-2 rounded-xl bg-surface-container-high text-primary font-bold text-sm shadow-lg transition-all">All</button>
<button className="px-6 py-2 rounded-xl text-on-surface-variant hover:text-on-surface font-medium text-sm transition-all">Received</button>
<button className="px-6 py-2 rounded-xl text-on-surface-variant hover:text-on-surface font-medium text-sm transition-all">Pending</button>
<button className="px-6 py-2 rounded-xl text-on-surface-variant hover:text-on-surface font-medium text-sm transition-all">Refunded</button>
</div>
</div>
{/* Transactions Table */}
<div className="w-full overflow-x-auto">
<table className="w-full text-left border-separate border-spacing-y-4">
<thead>
<tr className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60">
<th className="pb-4 pl-6">Customer</th>
<th className="pb-4">Service / Product</th>
<th className="pb-4">Settlement Date</th>
<th className="pb-4">Amount</th>
<th className="pb-4">Method</th>
<th className="pb-4 text-right pr-6">Action</th>
</tr>
</thead>
<tbody className="font-body">
{/* Transaction Row 1 */}
<tr className="bg-surface-container-high/50 hover:bg-surface-container-high transition-colors group">
<td className="py-5 pl-6 rounded-l-2xl">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/20 overflow-hidden">
<img alt="Customer" className="w-full h-full object-cover" data-alt="Portrait of a young man with a modern hairstyle and clean shaven face" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdhKOj0Zind2wrtm-jtDUDcKwAiBpAOANozzEMcOthyTPFpMLxMnHq_taorWcPsZsMULGu7vvY2lYfM8AL0aBoxWBqeLu3fiDEdGn3S6GxyqyiGtbxS-2aoLZxPO5AnmNedW0QkFqfT75xz2DZ257veYxhpNagR1CHG48T5pJtLadWd7Ir0XsQ_pr9owefM5uOAITPkFtkhOr6mu_1J2F_-YFPei03vthw9BRc_exm-TApAg_Edzx9QarfU4apSLRcUvT0tA6qHmo"/>
</div>
<span className="font-bold text-sm">Julian Vance</span>
</div>
</td>
<td className="py-5">
<div className="flex flex-col">
<span className="text-sm">The Executive Cut</span>
<span className="font-label text-[10px] text-primary/60 uppercase">Service</span>
</div>
</td>
<td className="py-5">
<span className="text-sm opacity-80">Oct 24, 14:30</span>
</td>
<td className="py-5 font-headline font-bold text-on-surface">
                                $85.00
                            </td>
<td className="py-5">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined !text-primary/40" data-icon="credit_card">credit_card</span>
<span className="font-label text-[10px] uppercase tracking-widest opacity-60">Visa 4242</span>
</div>
</td>
<td className="py-5 pr-6 text-right rounded-r-2xl">
<button className="p-2 hover:bg-surface-container-lowest rounded-lg transition-colors group-hover:text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
{/* Transaction Row 2 */}
<tr className="bg-surface-container-high/50 hover:bg-surface-container-high transition-colors group">
<td className="py-5 pl-6 rounded-l-2xl">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/20 overflow-hidden">
<img alt="Customer" className="w-full h-full object-cover" data-alt="Elegant woman smiling in high-end studio lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAlS9nsYn2QoGvPYtvXaTXzNnNaVRjoTJFkZuPQPbuwcPJYe3_hk81nQJr3WLBpzue90TC4ETK_SNV2PhE_W4FQCsrfnfJear_gPjK8LsHPlaBV0NyYIodKttYoJNduK0UvWM5Nwy7IK5uqLSM65VN4kVpR-ic1MYu2DUayXrpSbArBiqyDyCfpCjBdd85t94tQfmz6paDXreDgyoU2oD_XljB6XWo5PLCzyK71cvIUO5acyD7vSwGwbw7Bw7XYfSimFy_GvJpuac"/>
</div>
<span className="font-bold text-sm">Elena Ross</span>
</div>
</td>
<td className="py-5">
<div className="flex flex-col">
<span className="text-sm">Beard Grooming Kit</span>
<span className="font-label text-[10px] text-tertiary uppercase">Product</span>
</div>
</td>
<td className="py-5">
<span className="text-sm opacity-80">Oct 24, 12:15</span>
</td>
<td className="py-5 font-headline font-bold text-on-surface">
                                $120.50
                            </td>
<td className="py-5">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined !text-primary/40" data-icon="payments">payments</span>
<span className="font-label text-[10px] uppercase tracking-widest opacity-60">Apple Pay</span>
</div>
</td>
<td className="py-5 pr-6 text-right rounded-r-2xl">
<button className="p-2 hover:bg-surface-container-lowest rounded-lg transition-colors group-hover:text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
{/* Transaction Row 3 (Pending) */}
<tr className="bg-surface-container-high/50 hover:bg-surface-container-high transition-colors group">
<td className="py-5 pl-6 rounded-l-2xl">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/20 overflow-hidden">
<img alt="Customer" className="w-full h-full object-cover" data-alt="Portrait of a middle aged man with glasses in professional attire" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPhHHzTDcHPETy8aVXsnaZhao7imDPbfiqvX3GD5pxj6Wf8-l4qu6O5ImZtxPuYH_gPgeD7OR-J_yaUYTWQUR55APDYUjAMXZsgjqFZtdCYUnv-feNT25ND4uRQoOZwTqYLqgHM3sxE3Gr0lh6433DbZdAsn8d0_SCG9co4TgD5qseCZi5iaCp4NryPev9UouiXzh-gAX4ZXr9EGl5OJscFNvU_ToSIdjt95qyBYK5edBtLGbBtCQTs3dribflUvfxJ8DY0wd0NQg"/>
</div>
<span className="font-bold text-sm">Marcus Thorne</span>
</div>
</td>
<td className="py-5">
<div className="flex flex-col">
<span className="text-sm">Royal Shave Experience</span>
<span className="font-label text-[10px] text-primary/60 uppercase">Service</span>
</div>
</td>
<td className="py-5">
<div className="flex items-center gap-2">
<span className="text-sm text-secondary font-bold">Pending</span>
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
</div>
</td>
<td className="py-5 font-headline font-bold text-on-surface">
                                $65.00
                            </td>
<td className="py-5">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined !text-primary/40" data-icon="account_balance">account_balance</span>
<span className="font-label text-[10px] uppercase tracking-widest opacity-60">Bank Transfer</span>
</div>
</td>
<td className="py-5 pr-6 text-right rounded-r-2xl">
<button className="p-2 hover:bg-surface-container-lowest rounded-lg transition-colors group-hover:text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
{/* Transaction Row 4 */}
<tr className="bg-surface-container-high/50 hover:bg-surface-container-high transition-colors group">
<td className="py-5 pl-6 rounded-l-2xl">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-center font-label text-sm font-bold text-primary">
                                        SD
                                    </div>
<span className="font-bold text-sm">Sarah Donovan</span>
</div>
</td>
<td className="py-5">
<div className="flex flex-col">
<span className="text-sm">Premium Pomade Case</span>
<span className="font-label text-[10px] text-tertiary uppercase">Product</span>
</div>
</td>
<td className="py-5">
<span className="text-sm opacity-80">Oct 23, 18:45</span>
</td>
<td className="py-5 font-headline font-bold text-on-surface">
                                $45.20
                            </td>
<td className="py-5">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined !text-primary/40" data-icon="credit_card">credit_card</span>
<span className="font-label text-[10px] uppercase tracking-widest opacity-60">Mastercard 1109</span>
</div>
</td>
<td className="py-5 pr-6 text-right rounded-r-2xl">
<button className="p-2 hover:bg-surface-container-lowest rounded-lg transition-colors group-hover:text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
{/* Table Footer / Pagination */}
<div className="mt-8 flex justify-between items-center px-6">
<span className="text-sm text-on-surface-variant font-body">Showing 4 of 128 transactions</span>
<div className="flex gap-2">
<button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
</button>
<button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</section>
</main>

    </>
  );
}
