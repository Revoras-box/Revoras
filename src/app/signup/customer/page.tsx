import { Suspense } from "react";
import SignupHero from "@/components/auth/SignupHero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Phase 1.5a - the customer signup flow (unchanged), moved here so /signup can
// host the account-type selector. Reached from the selector's "book services".
export default function CustomerSignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* SignupHero reads the `redirect` query (set when a visitor started a
          booking before having an account), so it needs a Suspense boundary. */}
      <Suspense fallback={<div className="min-h-screen" />}>
        <SignupHero />
      </Suspense>
      <Footer />
    </div>
  );
}
