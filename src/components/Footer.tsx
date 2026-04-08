import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0b0b0b] mt-24">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-8 max-w-screen-2xl mx-auto gap-6">

        <div className="text-[#353534] font-semibold">
          Revoras
        </div>

        <div className="flex gap-8 text-xs uppercase tracking-widest text-[#353534]">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
        </div>

        <div className="text-xs uppercase tracking-widest text-[#353534]">
          © 2024 Revoras. THE DIGITAL CONCIERGE EXPERIENCE.
        </div>

      </div>
    </footer>
  );
}