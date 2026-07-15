import { HostSignup } from "@/components/auth/HostSignup";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Phase 1.5a - Host signup. Verifies email + phone (same requirement as customer
// signup), then POST /api/auth/host/register creates the account + a DRAFT
// business and drops the owner into the onboarding wizard.
export default function HostSignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <HostSignup />
      <Footer />
    </div>
  );
}
