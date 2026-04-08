import Link from "next/link";

export default function FooterExperience() {
  return (
    <footer className="bg-[#0E0E0E] w-full py-12 border-t border-[#4D463A]/15 relative z-10">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="text-lg font-black text-[#C8A96E] opacity-50 font-headline uppercase tracking-tighter">Revoras</div>
          <p className="font-['Manrope'] text-xs tracking-wide text-[#353534] leading-relaxed">
            The world&apos;s first digital concierge designed specifically for the high-end grooming industry. Precision booking, curated talent, effortless style.
          </p>
        </div>
        <div className="space-y-6">
          <h5 className="text-[#E5C487] font-label text-xs uppercase tracking-widest font-bold">Platform</h5>
          <div className="flex flex-col space-y-3">
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-[#353534] hover:text-white transition-colors">Find a Barber</Link>
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-[#353534] hover:text-white transition-colors">Shop Directory</Link>
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-[#353534] hover:text-white transition-colors">Gift Cards</Link>
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-[#353534] hover:text-white transition-colors">Mobile App</Link>
          </div>
        </div>
        <div className="space-y-6">
          <h5 className="text-[#E5C487] font-label text-xs uppercase tracking-widest font-bold">Company</h5>
          <div className="flex flex-col space-y-3">
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-[#353534] hover:text-white transition-colors">Careers</Link>
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-[#353534] hover:text-white transition-colors">Contact Support</Link>
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-[#353534] hover:text-white transition-colors">Press Kit</Link>
            <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-[#353534] hover:text-white transition-colors">Partner with Us</Link>
          </div>
        </div>
        <div className="space-y-6">
          <h5 className="text-[#E5C487] font-label text-xs uppercase tracking-widest font-bold">Newsletter</h5>
          <p className="font-['Manrope'] text-xs tracking-wide text-[#353534]">Stay fresh. Get the latest grooming trends and shop openings.</p>
          <div className="relative">
            <input className="w-full bg-transparent border-b border-[#4D463A]/30 py-2 text-xs font-body focus:outline-none focus:border-[#C8A96E] transition-colors" placeholder="Email Address" type="email" />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[#C8A96E]">
              <span className="material-symbols-outlined text-sm">mail</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-20 pt-8 border-t border-[#4D463A]/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-['Manrope'] text-xs tracking-wide text-[#353534]">
          © 2024 Revoras Digital Concierge. All Rights Reserved.
        </div>
        <div className="flex items-center space-x-8">
          <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-[#353534] hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="font-['Manrope'] text-xs tracking-wide text-[#353534] hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
