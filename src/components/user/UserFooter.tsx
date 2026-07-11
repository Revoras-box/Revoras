import Link from "next/link";

export default function UserFooter() {
  return (
    <footer className="bg-background border-t border-border py-12 px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <Link href="/user" className="text-primary font-black font-headline text-xl tracking-tighter">
            Revoras
          </Link>
          <p className="text-secondary-foreground font-label text-[10px] tracking-widest uppercase italic">
            The Digital Concierge.
          </p>
        </div>
        <div className="flex gap-8">
          <Link
            href="/privacy"
            className="text-secondary-foreground font-label uppercase text-xs tracking-widest hover:text-primary transition-all opacity-80 hover:opacity-100"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-secondary-foreground font-label uppercase text-xs tracking-widest hover:text-primary transition-all opacity-80 hover:opacity-100"
          >
            Terms of Service
          </Link>
          <Link
            href="/user/bookings"
            className="text-secondary-foreground font-label uppercase text-xs tracking-widest hover:text-primary transition-all opacity-80 hover:opacity-100"
          >
            VIP Access
          </Link>
          <Link
            href="/careers"
            className="text-secondary-foreground font-label uppercase text-xs tracking-widest hover:text-primary transition-all opacity-80 hover:opacity-100"
          >
            Careers
          </Link>
        </div>
        <div className="text-secondary-foreground font-label uppercase text-[10px] tracking-widest">
          © 2024 Revoras. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
