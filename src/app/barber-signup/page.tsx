import SignupHero from "@/components/auth/BarberSignup";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <SignupHero />
      <Footer />
    </div>
  );
}