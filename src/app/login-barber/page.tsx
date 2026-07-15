import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import BarberLogin from "@/components/auth/BarberLogin";
import { BusinessQueryProvider } from "@/lib/business/queryClient";
import { BusinessAuthProvider } from "@/lib/business/auth";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BusinessQueryProvider>
        <BusinessAuthProvider>
          <BarberLogin />
        </BusinessAuthProvider>
      </BusinessQueryProvider>
      <Footer />
    </div>
  );
}
