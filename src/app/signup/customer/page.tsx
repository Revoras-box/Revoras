import SignupHero from "@/components/auth/SignupHero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Phase 1.5a - the customer signup flow (unchanged), moved here so /signup can
// host the account-type selector. Reached from the selector's "book services".
export default function CustomerSignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <SignupHero />
      <Footer />
    </div>
  );
}
