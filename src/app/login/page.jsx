import LoginHero from "@/components/auth/LoginHero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <LoginHero />
      <Footer />
    </div>
  );
}