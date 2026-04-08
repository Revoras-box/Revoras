import React from 'react';

export default function ScreenS6() {
  return (
    <>
      
<div className="fixed inset-0 grain-overlay z-50"></div>

<nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-md flex justify-between items-center px-12 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
<div className="text-2xl font-bold tracking-tighter text-[#E5C487] font-headline">SnapCut</div>
<div className="hidden md:flex gap-8 items-center">
<a className="text-gray-400 font-medium font-headline tracking-tight hover:text-[#E5C487] transition-colors duration-300" href="#">Experience</a>
<a className="text-gray-400 font-medium font-headline tracking-tight hover:text-[#E5C487] transition-colors duration-300" href="#">Services</a>
<a className="text-gray-400 font-medium font-headline tracking-tight hover:text-[#E5C487] transition-colors duration-300" href="#">Barbers</a>
<a className="text-gray-400 font-medium font-headline tracking-tight hover:text-[#E5C487] transition-colors duration-300" href="#">Locations</a>
</div>
<div className="flex items-center gap-6">
<span className="material-symbols-outlined cursor-pointer hover:scale-110 transition-transform">notifications</span>
<div className="w-10 h-10 rounded-full border border-outline-variant/15 overflow-hidden">
<img alt="User premium profile" className="w-full h-full object-cover" data-alt="close-up portrait of a stylish man with a well-groomed beard and undercut hairstyle, professional lighting, dark studio background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCDNbYmkDzRnutQvV0P4PG6AStATmeTm1lZyjjonMeXExSdbnjY6fSiusuJPJtL33wFi7sLzM-B4lV99FXSDdDzGkB8TqgTz8u-AirkMmzo8iRBbWv7EgFSF0_4HvstqeT1D2vF0YzkzkzKUpWaNfk7E0D5OMghQZLnWL7xvnJr6_hISgpWiBoBu0x1Bx4lSCXMBeQBDsR0KZ7KG8gs1KAb__Kr5NbzU9vHmVI6X4KcUZVefvfKeSqB2f2SpyAJXpXRo2fQzHRQ0c"/>
</div>
</div>
</nav>

<main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
<div className="mb-12">
<h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary mb-2">Secure Checkout</h1>
<p className="font-label text-xs tracking-widest text-on-surface-variant uppercase">Finalize your premium experience</p>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

<div className="lg:col-span-7 space-y-8">
<div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
<div className="absolute top-0 right-0 p-4">
<span className="material-symbols-outlined text-primary/20 scale-150">shield_lock</span>
</div>
<h2 className="font-headline text-xl font-bold mb-8 flex items-center gap-3">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>account_balance_wallet</span>
                        Payment Method
                    </h2>
<div className="space-y-4">

<div className="group cursor-pointer p-5 rounded-xl border border-primary bg-surface-container-highest/50 flex items-center justify-between transition-all">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center">
<span className="material-symbols-outlined text-primary">contactless</span>
</div>
<div>
<p className="font-bold text-primary">UPI Transfer</p>
<p className="text-xs text-on-surface-variant font-label">Google Pay, PhonePe, Paytm</p>
</div>
</div>
<div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
<div className="w-3 h-3 rounded-full bg-primary"></div>
</div>
</div>

<div className="group cursor-pointer p-5 rounded-xl border border-outline-variant/15 hover:border-primary/50 bg-surface-container flex items-center justify-between transition-all">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
</div>
<div>
<p className="font-bold text-on-surface">Debit / Credit Cards</p>
<p className="text-xs text-on-surface-variant font-label">Visa, Mastercard, Amex</p>
</div>
</div>
<div className="w-6 h-6 rounded-full border-2 border-outline-variant/30"></div>
</div>

<div className="group cursor-pointer p-5 rounded-xl border border-outline-variant/15 hover:border-primary/50 bg-surface-container flex items-center justify-between transition-all">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant">account_balance</span>
</div>
<div>
<p className="font-bold text-on-surface">Digital Wallets</p>
<p className="text-xs text-on-surface-variant font-label">Apple Pay, PayPal</p>
</div>
</div>
<div className="w-6 h-6 rounded-full border-2 border-outline-variant/30"></div>
</div>
</div>

<div className="mt-12 pt-12 border-t border-outline-variant/15 space-y-6">
<h3 className="font-headline text-lg font-bold">Quick Verification</h3>
<div className="grid grid-cols-2 gap-6">
<div className="col-span-2">
<label className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant mb-1 block">Full Name</label>
<input className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-2 font-headline tracking-wide outline-none transition-colors" placeholder="ALEXANDER VANCE" type="text"/>
</div>
<div>
<label className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant mb-1 block">Mobile Number</label>
<input className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-2 font-headline tracking-wide outline-none transition-colors" placeholder="+1 (555) 000-0000" type="text"/>
</div>
<div>
<label className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant mb-1 block">Promo Code</label>
<input className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 px-0 py-2 font-headline tracking-wide outline-none transition-colors" placeholder="Optional" type="text"/>
</div>
</div>
</div>
</div>

<div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm">verified_user</span>
<span className="font-label text-[10px] tracking-widest uppercase">SSL Secured 256-bit</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm">payments</span>
<span className="font-label text-[10px] tracking-widest uppercase">Razorpay Verified</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm">lock</span>
<span className="font-label text-[10px] tracking-widest uppercase">PCI-DSS Compliant</span>
</div>
</div>
</div>

<div className="lg:col-span-5 sticky top-32">
<div className="bg-surface-container-high rounded-xl overflow-hidden shadow-2xl">

<div className="h-32 relative">
<img className="w-full h-full object-cover opacity-40" data-alt="blurred interior of a luxury vintage barbershop with dark wood, leather chairs, and warm ambient lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAon_D8YwnccdagcfN8GKTlaftDGliRUbapMLbGjIJibLU1adbj1znvn3WPUF3fwDAsyeOHH-Jv32N4RtV4Uw6lB-X3BjukCLsoZHrPijbGWzZ5vrks86DSBJZefeJ3IBQkWT8CWgUy2oQs-6qpnUqTYwzgxb-8JCybKHS7hkiLGbVGDCiARUNHKOF3VQRAjTD8SEpaIa5cSktDKOe44SYM-Plg1A8rFqD83u4Mz57A4CNEHNH_F5wwPhtc8pZfRSw_uhk2HxHseH4"/>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-high to-transparent"></div>
<div className="absolute bottom-4 left-6 flex items-center gap-4">
<div className="w-16 h-16 rounded-xl bg-background border border-primary/20 flex items-center justify-center p-2">
<span className="font-headline font-black text-primary text-2xl tracking-tighter">SC</span>
</div>
<div>
<h3 className="font-headline font-bold text-lg">SnapCut Flagship</h3>
<p className="text-xs text-on-surface-variant font-label">Manhattan District, NY</p>
</div>
</div>
</div>
<div className="p-8 space-y-6">
<div className="flex justify-between items-start">
<div>
<h4 className="font-headline font-bold">The Royal Signature Cut</h4>
<p className="text-sm text-on-surface-variant">Includes wash, hot towel, &amp; grooming</p>
</div>
<span className="font-headline font-bold text-primary">$85.00</span>
</div>
<div className="bg-surface-container-low/50 p-4 rounded-lg space-y-3">
<div className="flex items-center gap-3 text-sm">
<span className="material-symbols-outlined text-primary text-lg">event</span>
<span className="text-on-surface-variant font-medium">October 24, 2024</span>
</div>
<div className="flex items-center gap-3 text-sm">
<span className="material-symbols-outlined text-primary text-lg">schedule</span>
<span className="text-on-surface-variant font-medium">04:30 PM (45 Mins)</span>
</div>
<div className="flex items-center gap-3 text-sm">
<span className="material-symbols-outlined text-primary text-lg" style={{"fontVariationSettings":"'FILL' 1"}}>person</span>
<span className="text-on-surface-variant font-medium">Senior Barber: Julian V.</span>
</div>
</div>
<div className="space-y-3 pt-6 border-t border-outline-variant/15">
<div className="flex justify-between text-sm">
<span className="text-on-surface-variant">Service Subtotal</span>
<span className="font-medium">$85.00</span>
</div>
<div className="flex justify-between text-sm">
<span className="text-on-surface-variant">Concierge Fee</span>
<span className="font-medium">$4.50</span>
</div>
<div className="flex justify-between text-sm">
<span className="text-on-surface-variant">GST / Luxury Tax</span>
<span className="font-medium">$7.20</span>
</div>
</div>
<div className="pt-6 border-t border-outline-variant/15">
<div className="flex justify-between items-end mb-8">
<div>
<p className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant">Total Amount Due</p>
<p className="font-headline text-3xl font-black text-primary">$96.70</p>
</div>
<div className="bg-secondary-container/20 px-3 py-1 rounded-full flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
<span className="font-label text-[10px] tracking-widest text-secondary font-bold uppercase">Locked Rate</span>
</div>
</div>
<button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary/10 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                                PAY &amp; CONFIRM BOOKING
                                <span className="material-symbols-outlined text-on-primary">arrow_forward</span>
</button>
<p className="text-[10px] text-center text-on-surface-variant font-label mt-4 tracking-tight">
                                By clicking, you agree to our 24h Cancellation Policy.
                            </p>
</div>
</div>
</div>

<div className="mt-6 flex justify-end">
<div className="bg-surface-container-high/50 backdrop-blur-sm border border-outline-variant/10 px-4 py-2 rounded-full flex items-center gap-3">
<span className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">Current Queue</span>
<div className="bg-secondary-container text-secondary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Pos: #02</div>
</div>
</div>
</div>
</div>
</main>

<footer className="bg-[#0E0E0E] w-full py-12 px-12 border-t border-[#4D463A]/15">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div className="text-[#E5C487] font-black tracking-tighter text-xl font-headline italic">SnapCut.</div>
<div className="flex flex-wrap justify-center gap-8">
<a className="font-label uppercase text-xs tracking-widest text-gray-500 hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
<a className="font-label uppercase text-xs tracking-widest text-gray-500 hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Terms of Service</a>
<a className="font-label uppercase text-xs tracking-widest text-gray-500 hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">VIP Access</a>
<a className="font-label uppercase text-xs tracking-widest text-gray-500 hover:text-[#E5C487] transition-all opacity-80 hover:opacity-100" href="#">Careers</a>
</div>
<p className="font-label uppercase text-[10px] tracking-widest text-gray-500">© 2024 SnapCut. The Digital Concierge.</p>
</div>
</footer>

    </>
  );
}
