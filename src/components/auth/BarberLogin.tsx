"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function BarberLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'studio' | 'barber'>('studio');
  const [form, setForm] = useState({
    phone: "",
    email: "",
    password: "",
    remember: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (loginType === 'studio') {
      // Studio owner login - can use phone or email
      if ((!form.phone && !form.email) || !form.password) {
        toast.error("Please fill in phone/email and password");
        return;
      }
    } else {
      // Barber login - requires phone
      if (!form.phone || !form.password) {
        toast.error("Please fill in phone and password");
        return;
      }
    }

    setLoading(true);
    toast.loading("Authenticating...");

    try {
      let res;
      
      if (loginType === 'studio') {
        // Studio owner login
        res = await api.studioLogin({
          phone: form.phone || undefined,
          email: form.email || undefined,
          password: form.password,
        });
      } else {
        // Barber employee login
        res = await api.barberEmployeeLogin({
          phone: form.phone,
          password: form.password,
        });
      }

      toast.dismiss();

      if (res.token) {
        // Debug: verify localStorage is being set
        console.log("Login successful, token received:", res.token ? "YES" : "NO");
        console.log("Owner:", res.owner);
        console.log("Studio:", res.studio);
        
        // Verify localStorage after setting (the API function sets it)
        setTimeout(() => {
          console.log("localStorage studioToken:", localStorage.getItem("studioToken") ? "SET" : "NOT SET");
          console.log("localStorage studioOwner:", localStorage.getItem("studioOwner") ? "SET" : "NOT SET");
        }, 100);
        
        toast.success(loginType === 'studio' 
          ? "Welcome back, Studio Owner!" 
          : "Welcome back, Professional!");
        // Use window.location for full page reload to ensure fresh auth context
        window.location.href = "/barbers/dashboard";
      } else if (res.error === "Account not found" || res.error === "Not found") {
        toast.error("Account not found. Please check your credentials.");
      } else if (res.error === "Invalid credentials" || res.error === "Invalid") {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.error(res.error || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-175 h-175 bg-[#C8A96E]/10 blur-[140px] rounded-full" />

      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Section */}
        <div className="space-y-8">

          <div className="text-xs tracking-[0.35em] text-[#C8A96E] uppercase">
            Partner Portal
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Command Your <br />
            <span className="text-[#C8A96E]">
              {loginType === 'studio' ? 'Studio.' : 'Craft.'}
            </span>
          </h1>

          <p className="text-gray-400 max-w-lg">
            {loginType === 'studio' 
              ? "Access your studio dashboard. Manage your business, team, services, and deliver elite experiences to your clients."
              : "Access your barber dashboard. Manage your schedule, view bookings, and track your performance."}
          </p>

          {/* Avatars */}
          <div className="flex items-center gap-4">

            <div className="flex -space-x-2">
              <img src="https://i.pravatar.cc/40?img=1" className="w-10 h-10 rounded-full border border-black"/>
              <img src="https://i.pravatar.cc/40?img=2" className="w-10 h-10 rounded-full border border-black"/>
              <img src="https://i.pravatar.cc/40?img=3" className="w-10 h-10 rounded-full border border-black"/>
            </div>

            <span className="text-sm text-gray-400">
              Joined by the world's finest studios
            </span>

          </div>

        </div>



        {/* Login Card */}
        <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.8)]">

          <div className="space-y-8">

            <div>
              <h2 className="text-2xl font-semibold">
                {loginType === 'studio' ? 'Studio Login' : 'Barber Login'}
              </h2>

              <p className="text-gray-400 text-sm">
                Welcome back to SnapCut. Enter your credentials.
              </p>
            </div>

            {/* Login Type Toggle */}
            <div className="flex bg-[#1a1a1a] rounded-xl p-1">
              <button
                onClick={() => setLoginType('studio')}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                  loginType === 'studio' 
                    ? 'bg-[#C8A96E] text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Studio Owner
              </button>
              <button
                onClick={() => setLoginType('barber')}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                  loginType === 'barber' 
                    ? 'bg-[#C8A96E] text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Barber
              </button>
            </div>


            <div className="space-y-6">

              <div>
                <label className="text-xs uppercase text-gray-500">
                  Phone Number
                </label>

                <input 
                  className="w-full bg-transparent border-b border-gray-700 py-3 outline-none focus:border-[#C8A96E] transition"
                  placeholder="+1 234 567 8900"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  disabled={loading}
                />
              </div>

              {loginType === 'studio' && (
                <div>
                  <label className="text-xs uppercase text-gray-500">
                    Or Email Address
                  </label>

                  <input 
                    type="email"
                    className="w-full bg-transparent border-b border-gray-700 py-3 outline-none focus:border-[#C8A96E] transition"
                    placeholder="owner@studio.com"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}


              <div>
                <label className="text-xs uppercase text-gray-500">
                  Password
                </label>

                <input 
                  type="password" 
                  className="w-full bg-transparent border-b border-gray-700 py-3 outline-none focus:border-[#C8A96E] transition"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>


              <div className="flex justify-between text-sm">

                <label className="flex gap-2 text-gray-400 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={form.remember}
                    onChange={(e) => updateField("remember", e.target.checked)}
                    className="accent-[#C8A96E]"
                    disabled={loading}
                  />
                  Remember me
                </label>

                <span className="text-[#C8A96E] cursor-pointer">
                  Forgot?
                </span>

              </div>


              <button 
                className="w-full bg-[#C8A96E] text-black py-4 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Authenticating...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </button>

            </div>


            <div className="text-center text-sm text-gray-400">
              {loginType === 'studio' ? (
                <>
                  New to the network?
                  <span
                    className="text-[#C8A96E] ml-2 cursor-pointer"
                    onClick={() => router.push("/barber-signup")}
                  >
                    Register Your Studio →
                  </span>
                </>
              ) : (
                <>
                  Contact your studio admin to get your login credentials.
                </>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
