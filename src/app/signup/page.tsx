import SignupHero from "@/components/auth/SignupHero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  console.log(process.env.NEXT_PUBLIC_API_URL)
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <SignupHero />
      <Footer />
    </div>
  );
}