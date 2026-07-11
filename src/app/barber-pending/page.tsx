import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function BarberPendingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-card border border-border rounded-2xl p-8 text-center space-y-4">
          <h1 className="text-3xl font-semibold text-primary">Signup Submitted</h1>
          <p className="text-foreground">
            Your studio profile has been created and is pending admin approval.
          </p>
          <p className="text-muted text-sm">
            You will be able to access the studio dashboard after your studio is approved.
          </p>
          <div className="pt-4">
            <Link
              href="/login-barber"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
