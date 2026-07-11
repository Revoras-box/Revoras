import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background mt-24">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-8 max-w-screen-2xl mx-auto gap-6">

        <div className="text-secondary-foreground font-semibold">
          Revoras
        </div>

        <div className="flex gap-8 text-xs uppercase tracking-widest text-secondary-foreground">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
        </div>

        <div className="text-xs uppercase tracking-widest text-secondary-foreground">
          © 2024 Revoras. THE DIGITAL CONCIERGE EXPERIENCE.
        </div>

      </div>
    </footer>
  );
}