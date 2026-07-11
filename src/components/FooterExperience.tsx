import Link from "next/link";

export default function FooterExperience() {
  return (
    <footer className="bg-background w-full py-12 border-t border-border/15 relative z-10">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="text-lg font-black text-primary opacity-50 font-headline uppercase tracking-tighter">Revoras</div>
          <p className="font-['Manrope'] text-xs tracking-wide text-secondary-foreground leading-relaxed">
            The world&apos;s first digital concierge designed specifically for the high-end grooming industry. Precision booking, curated talent, effortless style.
          </p>
        </div>
        <div className="space-y-6">
          <h5 className="text-primary font-label text-xs uppercase tracking-widest font-bold">Platform</h5>
          <div className="flex flex-col space-y-3">
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-secondary-foreground hover:text-foreground transition-colors">Find a Barber</Link>
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-secondary-foreground hover:text-foreground transition-colors">Shop Directory</Link>
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-secondary-foreground hover:text-foreground transition-colors">Gift Cards</Link>
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-secondary-foreground hover:text-foreground transition-colors">Mobile App</Link>
          </div>
        </div>
        <div className="space-y-6">
          <h5 className="text-primary font-label text-xs uppercase tracking-widest font-bold">Company</h5>
          <div className="flex flex-col space-y-3">
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-secondary-foreground hover:text-foreground transition-colors">Careers</Link>
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-secondary-foreground hover:text-foreground transition-colors">Contact Support</Link>
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-secondary-foreground hover:text-foreground transition-colors">Press Kit</Link>
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-secondary-foreground hover:text-foreground transition-colors">Partner with Us</Link>
          </div>
        </div>
        <div className="space-y-6">
          <h5 className="text-primary font-label text-xs uppercase tracking-widest font-bold">Newsletter</h5>
          <p className="font-['Manrope'] text-xs tracking-wide text-secondary-foreground">Stay fresh. Get the latest grooming trends and shop openings.</p>
          <div className="relative">
            <input className="w-full bg-transparent border-b border-border/30 py-2 text-xs font-body focus:outline-none focus:border-primary transition-colors" placeholder="Email Address" type="email" />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-primary">
              <span className="material-symbols-outlined text-sm">mail</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-20 pt-8 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-['Manrope'] text-xs tracking-wide text-secondary-foreground">
          © 2024 Revoras Digital Concierge. All Rights Reserved.
        </div>
        <div className="flex items-center space-x-8">
          <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-secondary-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-secondary-foreground hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
