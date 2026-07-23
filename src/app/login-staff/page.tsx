import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StaffLogin from "@/components/auth/StaffLogin";
import { BusinessQueryProvider } from "@/lib/business/queryClient";
import { BusinessAuthProvider } from "@/lib/business/auth";

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BusinessQueryProvider>
        <BusinessAuthProvider>
          <StaffLogin />
        </BusinessAuthProvider>
      </BusinessQueryProvider>
      <Footer />
    </div>
  );
}
