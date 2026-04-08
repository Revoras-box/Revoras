export default function ScheduleView() {
  return (
    <>

<style dangerouslySetInnerHTML={{ __html: `.material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24
    }
.grain-overlay {
    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuAepLujnHl5hXgMA3k5gbXmEd9PmZjAFsZ2TkrGZN6BkVrRKIuUorskFYMU5UREpd59stn1ztc_iHyhMBnYb5G1VVNk3mJ7-pR5w_hQ9UucNQb-mZcVQbw4HbAm15JNL_FJqQHKKfp2HuIQzNoFHxOqIBQVceXu8wqlqBaub6_4eSiD_3pOoOvKRRUXwgLNzm0LR462ffqfavbXDN4dnNcjtU-G93lmKo3nn7hdN_sLm8dJzJPKMx_AhBY6BlV2R1XylunFFBv4VW4);
    opacity: 0.03;
    pointer-events: none
    }
.timeline-grid {
    grid-template-columns: 80px repeat(4, 1fr)
    }
.custom-scrollbar::-webkit-scrollbar {
    width: 4px
    }
.custom-scrollbar::-webkit-scrollbar-track {
    background: #1c1b1b
    }
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4d463a;
    border-radius: 10px
    }` }} />

<div className="fixed inset-0 grain-overlay z-50"></div>
{/* SideNavBar Anchor */}
<aside className="h-screen w-72 flex flex-col fixed left-0 top-0 z-50 bg-[#0E0E0E] bg-[#1C1B1B] border-r border-[#4D463A]/15 py-8">
<div className="px-8 mb-12">
<h1 className="font-['Epilogue'] font-black text-[#E5C487] text-2xl tracking-tight">The Gilded Groom</h1>
<p className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px] text-outline mt-1">Elite Management</p>
</div>
<nav className="flex-1 space-y-2">
{/* Dashboard */}
<a className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined mr-4" data-icon="dashboard">dashboard</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Dashboard</span>
</a>
{/* Appointments (Active) */}
<a className="flex items-center h-12 text-[#E5C487] font-bold border-l-4 border-[#E5C487] pl-4 bg-gradient-to-r from-[#E5C487]/10 to-transparent hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined mr-4" data-icon="calendar_today">calendar_today</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Appointments</span>
</a>
{/* Barbers */}
<a className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined mr-4" data-icon="content_cut">content_cut</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Barbers</span>
</a>
{/* Services */}
<a className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined mr-4" data-icon="dry_cleaning">dry_cleaning</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Services</span>
</a>
{/* Inventory */}
<a className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined mr-4" data-icon="inventory_2">inventory_2</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Inventory</span>
</a>
{/* Revenue */}
<a className="flex items-center h-12 text-[#4D463A] pl-5 hover:text-[#E5C487] transition-all hover:bg-[#1C1B1B] group transition-all hover:translate-x-1 duration-300" href="#">
<span className="material-symbols-outlined mr-4" data-icon="payments">payments</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Revenue</span>
</a>
</nav>
<div className="px-6 mt-auto">
<button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-primary/10">
                New Appointment
            </button>
<div className="mt-8 pt-8 border-t border-outline-variant/20 space-y-4">
<a className="flex items-center text-[#4D463A] pl-2 hover:text-[#E5C487] transition-all" href="#">
<span className="material-symbols-outlined mr-4 text-sm" data-icon="help_outline">help_outline</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px]">Support</span>
</a>
<a className="flex items-center text-[#4D463A] pl-2 hover:text-error transition-all" href="#">
<span className="material-symbols-outlined mr-4 text-sm" data-icon="logout">logout</span>
<span className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px]">Logout</span>
</a>
</div>
</div>
</aside>
{/* Main Canvas */}
<main className="ml-72 min-h-screen bg-surface flex flex-col">
{/* Header Strip */}
<header className="h-20 px-10 flex justify-between items-center bg-surface-container-low/60 backdrop-blur-xl z-40 sticky top-0">
<div className="flex items-center gap-8">
<h2 className="font-headline font-black text-2xl tracking-tight">Schedule</h2>
{/* Horizontal Day Selector */}
<div className="flex gap-2 p-1 bg-surface-container-lowest rounded-full">
<button className="px-6 py-2 rounded-full font-label text-xs uppercase tracking-widest transition-all bg-primary text-on-primary font-bold">Mon 12</button>
<button className="px-6 py-2 rounded-full font-label text-xs uppercase tracking-widest transition-all text-outline hover:text-primary">Tue 13</button>
<button className="px-6 py-2 rounded-full font-label text-xs uppercase tracking-widest transition-all text-outline hover:text-primary">Wed 14</button>
<button className="px-6 py-2 rounded-full font-label text-xs uppercase tracking-widest transition-all text-outline hover:text-primary">Thu 15</button>
<button className="px-6 py-2 rounded-full font-label text-xs uppercase tracking-widest transition-all text-outline hover:text-primary">Fri 16</button>
</div>
</div>
<div className="flex items-center gap-4">
<div className="relative">
<span className="material-symbols-outlined text-outline-variant hover:text-primary cursor-pointer p-2 transition-colors" data-icon="notifications">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-surface"></span>
</div>
<div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/30">
<img alt="Manager Profile" className="w-full h-full object-cover" data-alt="professional male portrait with sharp jawline and stylish haircut against a dark moody background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9SLAuAcNxyKcmxRo6-n0LdnmGft0rxA8wqMMgtWfxjz3IXhMaFAYeH7BrVZBYJJhC1RkI8VVA-pvtPec01M5OPT8xtQHrH0gY42wYyqPpIjOgzmAvkFLt_Rk9fNv3OhBhJ-is9j0TtaHhlPRk276CSP1av-sJoC0lWOVLDeOkMbuXzYKKopL2_PClaTT2PIbu05jyQTdaGCuZJdTc_WgBdzCFM7K5MHihebdUWsCoPJkho3anj8AL-RbfGH7NHBvt9YJadyXgvQI"/>
</div>
</div>
</header>
{/* Calendar Container */}
<div className="flex-1 p-10 overflow-hidden flex flex-col">
<div className="bg-surface-container-low rounded-3xl overflow-hidden flex flex-col flex-1 shadow-2xl border border-outline-variant/5">
{/* Barber Headers */}
<div className="grid timeline-grid border-b border-outline-variant/15 bg-surface-container-high/40">
<div className="h-20 flex items-center justify-center border-r border-outline-variant/15">
<span className="material-symbols-outlined text-outline-variant" data-icon="schedule">schedule</span>
</div>
{/* Barber 1 */}
<div className="h-20 px-6 flex items-center gap-4 border-r border-outline-variant/15">
<div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-container-highest">
<img alt="Barber 1" className="w-full h-full object-cover" data-alt="portrait of a bearded barber with tattoos in a vintage barbershop setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9T_Ag1Ts8JFYYb9zDJ22wJmF8ejrIE9YebiqSprQF6x_VJz3ewFEnyM4NqteM-ZG0O99-RRVvwlBMSjhgx__mrHG766PBB4gj7JsHGiavYl-y3PLMd7OYvkMK0wj-hlkJZ9UCg7TZNFQ3gF-zRpIqCWAMOIs9m29CnJPyxuHflNsEcrBccG2yuus0bB7Qiku245HPtHTY4AevUzEqYxeny9M6Brfnj-XfA1JQBRJ-VHgmFzpYRKULwq9af39_VqLH12fXfQYYzyM"/>
</div>
<div>
<p className="font-headline font-bold text-sm text-primary">Julian V.</p>
<p className="font-label text-[10px] text-outline uppercase tracking-widest">Master Barber</p>
</div>
</div>
{/* Barber 2 */}
<div className="h-20 px-6 flex items-center gap-4 border-r border-outline-variant/15">
<div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-container-highest">
<img alt="Barber 2" className="w-full h-full object-cover" data-alt="confident professional barber looking at camera with sophisticated lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoRpXnfaex2c8zggpaIVghb5dpZwrl74Cif7oQbNF3oG3ES3ec-dN11aycPRubN9NgHF5TaXIg3p6Ruj62OfVZ44gG4-yxqkJPI_HLpuOWRjxPzFNZZ6fo_kAqEwZhjyBScC9vEOMi-Y78Qop2PdlELXfBc5OGocGNUahRzZxhJPdBHT98uceOlHJwFkYX6SX3L2XuhWNZVbXu5FXFjpvs-SMCiPOwhJEiR3DYKt-9M1C34_FJkl1yhKZCOPnsj42QigN_o_OWz8o"/>
</div>
<div>
<p className="font-headline font-bold text-sm text-on-surface">Marcus L.</p>
<p className="font-label text-[10px] text-outline uppercase tracking-widest">Style Director</p>
</div>
</div>
{/* Barber 3 */}
<div className="h-20 px-6 flex items-center gap-4 border-r border-outline-variant/15">
<div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-container-highest">
<img alt="Barber 3" className="w-full h-full object-cover" data-alt="young creative barber in a designer apron holding professional shears" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKkLVZImAt2Pp_VSQjGI_icCpyJl3sHCyE1yAAcZMSt8x6uQRbpI_kc4KVECoD7p-HqHcuYApyZ4_d5rbFt931S78A7PTX7woXSNjQ_8CzNhZdtv51gs0ekN0iGLI6k0WW8D8-n2eZA1JA2VHbmH2n97AU-ntruMSodw4svymtZEbiOC-ly4ZjU6sPRliyzgjOf0HPtlmiJZU4FcX6nw0NtuJWyb9T8iCu0xsDTeWl1hvFl0uUOwCdI1oCqGCRSqYMaA2tLl6XQK0"/>
</div>
<div>
<p className="font-headline font-bold text-sm text-on-surface">Elias K.</p>
<p className="font-label text-[10px] text-outline uppercase tracking-widest">Junior Stylist</p>
</div>
</div>
{/* Barber 4 */}
<div className="h-20 px-6 flex items-center gap-4">
<div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-container-highest">
<img alt="Barber 4" className="w-full h-full object-cover" data-alt="focused barber trimming a client's beard in a luxury studio with soft ambient light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaC0h-MmwQuul-eQnOMsuvWdjGv6IZGWOKIKiGvj0bQiHlTGOZsGKofVRPahw-2nPpCb1VSothWEC7JtH2ALs1gq420P8TDiA4sZw_8nj8Gj8uDS3fGiB1kI0v1972k4V67e_CdZCtoMnIt8uJFMwdGs_QoYD_6BmzDABFvLpo-okOi8nEPSuALW21dA1ZCNDWwl9ZdcXPs7yygxHgfjwljgQ17D6rj58CX5gg_kF_PTXA2rsAW2zibwtW4NAoH3Om_gHA7laFZAM"/>
</div>
<div>
<p className="font-headline font-bold text-sm text-on-surface">Stefan O.</p>
<p className="font-label text-[10px] text-outline uppercase tracking-widest">Senior Barber</p>
</div>
</div>
</div>
{/* Timeline Body */}
<div className="flex-1 overflow-y-auto custom-scrollbar">
<div className="grid timeline-grid relative">
{/* Time Markers Column */}
<div className="flex flex-col">
<div className="h-24 border-r border-b border-outline-variant/15 flex items-start justify-center pt-4">
<span className="font-label text-xs text-outline">09:00 AM</span>
</div>
<div className="h-24 border-r border-b border-outline-variant/15 flex items-start justify-center pt-4">
<span className="font-label text-xs text-outline">10:00 AM</span>
</div>
<div className="h-24 border-r border-b border-outline-variant/15 flex items-start justify-center pt-4">
<span className="font-label text-xs text-outline">11:00 AM</span>
</div>
<div className="h-24 border-r border-b border-outline-variant/15 flex items-start justify-center pt-4">
<span className="font-label text-xs text-outline">12:00 PM</span>
</div>
<div className="h-24 border-r border-b border-outline-variant/15 flex items-start justify-center pt-4">
<span className="font-label text-xs text-outline">01:00 PM</span>
</div>
<div className="h-24 border-r border-b border-outline-variant/15 flex items-start justify-center pt-4">
<span className="font-label text-xs text-outline">02:00 PM</span>
</div>
</div>
{/* Grid Cells */}
{/* Col 1: Julian */}
<div className="flex flex-col relative border-r border-outline-variant/10">
{/* Clickable Empty Slot */}
<div className="h-24 border-b border-outline-variant/5 hover:bg-primary/5 transition-colors cursor-pointer group flex items-center justify-center">
<span className="material-symbols-outlined opacity-0 group-hover:opacity-100 text-primary transition-all scale-75" data-icon="add_circle">add_circle</span>
</div>
{/* Booked Slot */}
<div className="h-24 p-2">
<div className="h-full w-full bg-primary/20 border-l-4 border-primary rounded-lg p-3 flex flex-col justify-between relative overflow-hidden group hover:bg-primary/30 transition-all cursor-pointer">
<div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40">
<span className="material-symbols-outlined text-4xl" data-icon="content_cut">content_cut</span>
</div>
<p className="font-headline font-bold text-xs text-primary truncate">Arthur Shelby</p>
<p className="font-body text-[10px] text-primary/80">Full Service Cut • 45m</p>
</div>
</div>
<div className="h-24 border-b border-outline-variant/5 hover:bg-primary/5 transition-colors cursor-pointer"></div>
<div className="h-24 border-b border-outline-variant/5 hover:bg-primary/5 transition-colors cursor-pointer"></div>
</div>
{/* Col 2: Marcus */}
<div className="flex flex-col relative border-r border-outline-variant/10">
<div className="h-24 border-b border-outline-variant/5 hover:bg-primary/5 transition-colors cursor-pointer"></div>
<div className="h-24 border-b border-outline-variant/5 hover:bg-primary/5 transition-colors cursor-pointer"></div>
{/* Long Appointment */}
<div className="h-48 p-2 absolute top-48 w-full z-10">
<div className="h-full w-full bg-tertiary-container/20 border-l-4 border-tertiary-container rounded-lg p-3 flex flex-col justify-between group hover:bg-tertiary-container/30 transition-all cursor-pointer">
<div>
<p className="font-headline font-bold text-xs text-tertiary truncate">Thomas Miller</p>
<p className="font-body text-[10px] text-tertiary-container/80">Premium Hot Towel &amp; Razor Shave</p>
</div>
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
<span className="text-[10px] font-label uppercase tracking-widest text-tertiary">In Progress</span>
</div>
</div>
</div>
<div className="h-24 border-b border-outline-variant/5"></div>
<div className="h-24 border-b border-outline-variant/5"></div>
<div className="h-24 border-b border-outline-variant/5"></div>
</div>
{/* Col 3: Elias */}
<div className="flex flex-col relative border-r border-outline-variant/10">
<div className="h-24 border-b border-outline-variant/5 hover:bg-primary/5 transition-colors cursor-pointer"></div>
<div className="h-24 p-2">
<div className="h-full w-full bg-secondary-container/20 border-l-4 border-secondary-container rounded-lg p-3 flex flex-col justify-center group hover:bg-secondary-container/30 transition-all cursor-pointer">
<p className="font-headline font-bold text-xs text-secondary-fixed truncate">James Dean Jr.</p>
<p className="font-body text-[10px] text-secondary-fixed-dim">Quick Fade</p>
</div>
</div>
<div className="h-24 border-b border-outline-variant/5 hover:bg-primary/5 transition-colors cursor-pointer"></div>
<div className="h-24 border-b border-outline-variant/5 hover:bg-primary/5 transition-colors cursor-pointer"></div>
<div className="h-24 border-b border-outline-variant/5 hover:bg-primary/5 transition-colors cursor-pointer"></div>
</div>
{/* Col 4: Stefan */}
<div className="flex flex-col relative">
<div className="h-24 border-b border-outline-variant/5 bg-surface-container-lowest/40 flex items-center justify-center">
<span className="font-label text-[10px] uppercase tracking-widest text-outline-variant">Off Duty</span>
</div>
<div className="h-24 border-b border-outline-variant/5 hover:bg-primary/5 transition-colors cursor-pointer"></div>
<div className="h-24 p-2">
<div className="h-full w-full bg-error-container/20 border-l-4 border-error rounded-lg p-3 flex flex-col justify-center group hover:bg-error-container/30 transition-all cursor-pointer">
<div className="flex items-center justify-between">
<p className="font-headline font-bold text-xs text-error truncate">Luciano P.</p>
<span className="material-symbols-outlined text-xs text-error" data-icon="priority_high">priority_high</span>
</div>
<p className="font-body text-[10px] text-error">VIP Custom Sculpting</p>
</div>
</div>
<div className="h-24 border-b border-outline-variant/5 hover:bg-primary/5 transition-colors cursor-pointer"></div>
</div>
{/* Current Time Indicator */}
<div className="absolute top-[208px] left-0 w-full flex items-center pointer-events-none z-20">
<div className="w-20 flex justify-end pr-2">
<span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">11:12</span>
</div>
<div className="flex-1 h-[2px] bg-primary relative">
<div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_#e5c487]"></div>
</div>
</div>
</div>
</div>
{/* Footer Summary Bar */}
<div className="h-16 px-10 bg-surface-container-highest flex items-center justify-between border-t border-outline-variant/10">
<div className="flex gap-8">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-sm bg-primary"></span>
<span className="font-label text-[10px] uppercase tracking-tighter text-on-surface">Confirmed</span>
</div>
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-sm bg-tertiary-container"></span>
<span className="font-label text-[10px] uppercase tracking-tighter text-on-surface">Premium</span>
</div>
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-sm bg-secondary-container"></span>
<span className="font-label text-[10px] uppercase tracking-tighter text-on-surface">Member</span>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-2">
<span className="text-outline text-xs">Available Slots:</span>
<span className="text-secondary font-headline font-bold">14</span>
</div>
<div className="w-px h-6 bg-outline-variant/20"></div>
<div className="flex items-center gap-2">
<span className="text-outline text-xs">Total Revenue:</span>
<span className="text-primary font-headline font-bold">$1,240.00</span>
</div>
</div>
</div>
</div>
</div>
</main>

    </>
  );
}
