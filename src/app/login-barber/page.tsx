import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import BarberLogin from "@/components/auth/BarberLogin";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BarberLogin />
      <Footer />
    </div>
  );
}