import Link from "next/link";

export default function NavbarExperience() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl shadow-2xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tighter text-[#C8A96E] italic font-headline">
          <Link href="/">Revoras</Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/experience" className="font-['Epilogue'] tracking-tight text-sm uppercase font-semibold text-[#E5C487] border-b-2 border-[#C8A96E] pb-1">
            Experience
          </Link>
          <Link href="/services" className="font-['Epilogue'] tracking-tight text-sm uppercase font-semibold text-[#353534] hover:text-[#C8A96E] transition-colors duration-300">
            Services
          </Link>
          <Link href="/barbers" className="font-['Epilogue'] tracking-tight text-sm uppercase font-semibold text-[#353534] hover:text-[#C8A96E] transition-colors duration-300">
            Barbers
          </Link>
          <Link href="/locations" className="font-['Epilogue'] tracking-tight text-sm uppercase font-semibold text-[#353534] hover:text-[#C8A96E] transition-colors duration-300">
            Locations
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="#" className="hidden lg:block font-['Epilogue'] text-sm uppercase font-semibold text-[#C8A96E] hover:scale-[1.02] transition-all">
            Join as Barber
          </Link>
          <Link href="#" className="bg-[#C8A96E] text-[#402D00] px-6 py-2.5 rounded-xl font-headline font-bold text-sm uppercase tracking-wide hover:scale-[1.02] active:scale-95 transition-all inline-block text-center">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
