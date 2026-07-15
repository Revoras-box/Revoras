import { AccountTypeSelector } from "@/components/auth/AccountTypeSelector";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Phase 1.5a - the signup entry is now an account-type chooser: "book services"
// (customer) or "list my business" (host). Each path continues to its own flow.
export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <AccountTypeSelector />
      <Footer />
    </div>
  );
}
