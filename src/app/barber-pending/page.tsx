import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function BarberPendingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-[#0b0b0b] border border-white/10 rounded-2xl p-8 text-center space-y-4">
          <h1 className="text-3xl font-semibold text-[#C8A96E]">Signup Submitted</h1>
          <p className="text-gray-300">
            Your studio profile has been created and is pending admin approval.
          </p>
          <p className="text-gray-400 text-sm">
            You will be able to access the studio dashboard after your studio is approved.
          </p>
          <div className="pt-4">
            <Link
              href="/login-barber"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#C8A96E] text-black font-semibold"
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
