"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function SignupHero() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [devOtp, setDevOtp] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        emailVerified: false,
        agreed: false,
    });

    const [otp, setOtp] = useState("");

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSendEmailOtp = async () => {
        if (!form.email) {
            toast.error("Please enter your email address");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        toast.loading("Sending verification code...");

        try {
            const result = await api.sendVerification({
                email: form.email,
                type: "email",
            });

            toast.dismiss();

            if (result.error) {
                toast.error(result.error);
            } else {
                if (result.otp) {
                    setDevOtp(result.otp);
                }
                toast.success("Verification code sent!");
                setStep(2);
            }
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to send verification code");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a 6-digit code");
            return;
        }

        setLoading(true);
        toast.loading("Verifying...");

        try {
            const result = await api.verifyCode({
                email: form.email,
                type: "email",
                otp: otp,
            });

            toast.dismiss();

            if (result.error) {
                toast.error(result.error);
            } else if (result.verified) {
                updateField("emailVerified", true);
                toast.success("Email verified successfully!");
                setStep(3);
            }
        } catch (err) {
            toast.dismiss();
            toast.error("Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        if (!form.name || !form.email || !form.phone) {
            toast.error("Please fill in all fields");
            return;
        }
        if (!form.password || form.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (!form.agreed) {
            toast.error("Please agree to the Terms and Privacy Policy");
            return;
        }

        setLoading(true);
        toast.loading("Creating your account...");

        try {
            const result = await api.userSignup({
                name: form.name,
                email: form.email,
                password: form.password,
                emailVerified: form.emailVerified,
            });

            toast.dismiss();

            if (result.error) {
                toast.error(result.error);
            } else if (result.token) {
                localStorage.setItem("userToken", result.token);
                localStorage.setItem("user", JSON.stringify(result.user));
                toast.success("Account created successfully!");
                router.push("/");
            }
        } catch (err) {
            toast.dismiss();
            toast.error("Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">

            <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Section */}
                <div className="space-y-8">

                    <div className="text-xs tracking-[0.35em] text-[#C8A96E] uppercase">
                        Join The Elite
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                        Elevate your <br />
                        <span className="text-[#C8A96E]">
                            Grooming.
                        </span>
                    </h1>

                    <p className="text-gray-400 max-w-lg leading-relaxed">
                        Access the world's most exclusive barber collective.
                        Secure your spot in the live queue and experience
                        the digital concierge for the modern gentleman.
                    </p>


                    {/* Feature Cards */}
                    <div className="flex gap-6">

                        <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-6 w-40">

                            <div className="w-10 h-10 bg-[#C8A96E]/20 rounded-lg flex items-center justify-center mb-3">
                                ⏱
                            </div>

                            <div className="text-xs uppercase text-gray-400">
                                Priority Booking
                            </div>

                        </div>


                        <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-6 w-40">

                            <div className="w-10 h-10 bg-[#C8A96E]/20 rounded-lg flex items-center justify-center mb-3">
                                ✓
                            </div>

                            <div className="text-xs uppercase text-gray-400">
                                Elite Access
                            </div>

                        </div>

                    </div>

                </div>



                {/* Right Signup Form */}
                <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-10 backdrop-blur-xl">

                    <div className="space-y-6">

                        <div>
                            <h2 className="text-2xl font-semibold">
                                {step === 1 && "Create Account"}
                                {step === 2 && "Verify Email"}
                                {step === 3 && "Complete Registration"}
                            </h2>

                            <p className="text-gray-400 text-sm mt-2">
                                {step === 1 && "Enter your details to join the Revoras community."}
                                {step === 2 && `Enter the code sent to ${form.email}`}
                                {step === 3 && "Set your password to complete registration."}
                            </p>
                        </div>

                        {/* STEP 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">
                                        Full Name
                                    </label>

                                    <input
                                        value={form.name}
                                        onChange={(e) => updateField("name", e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-700 py-3 outline-none focus:border-[#C8A96E]"
                                        placeholder="Johnathan Sterling"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 uppercase">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => updateField("email", e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-700 py-3 outline-none focus:border-[#C8A96E]"
                                        placeholder="example@email.com"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 uppercase">
                                        Phone Number
                                    </label>

                                    <input
                                        value={form.phone}
                                        onChange={(e) => updateField("phone", e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-700 py-3 outline-none focus:border-[#C8A96E]"
                                        placeholder="+91 9876543210"
                                        disabled={loading}
                                    />
                                </div>

                                <button 
                                    className="w-full bg-[#C8A96E] text-black py-4 rounded-full font-semibold mt-4 disabled:opacity-50 flex items-center justify-center gap-2" 
                                    onClick={handleSendEmailOtp}
                                    disabled={loading || !form.name || !form.email || !form.phone}
                                >
                                    {loading ? (
                                        <>
                                            <LoadingSpinner />
                                            Sending Code...
                                        </>
                                    ) : (
                                        "Verify Email"
                                    )}
                                </button>

                                <div className="text-center text-sm text-gray-400">
                                    Already a member?{" "}
                                    <span className="text-[#C8A96E] cursor-pointer" onClick={() => router.push("/login")}>
                                        Member Login
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Email Verification */}
                        {step === 2 && (
                            <div className="space-y-6">
                                {devOtp && (
                                    <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                                        Dev Mode: Your code is {devOtp}
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs text-gray-500 uppercase">
                                        6-Digit Code
                                    </label>

                                    <input
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        className="w-full bg-transparent border-b border-gray-700 py-3 outline-none focus:border-[#C8A96E] text-center text-2xl tracking-[0.5em]"
                                        placeholder="000000"
                                        disabled={loading}
                                    />
                                </div>

                                <button 
                                    className="w-full bg-[#C8A96E] text-black py-4 rounded-full font-semibold mt-4 disabled:opacity-50 flex items-center justify-center gap-2" 
                                    onClick={handleVerifyEmail}
                                    disabled={loading || otp.length !== 6}
                                >
                                    {loading ? (
                                        <>
                                            <LoadingSpinner />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify Email"
                                    )}
                                </button>

                                <button 
                                    className="w-full border border-gray-700 py-3 rounded-full text-gray-400 mt-2 disabled:opacity-50"
                                    onClick={() => {
                                        setStep(1);
                                        setOtp("");
                                        setDevOtp(null);
                                    }}
                                    disabled={loading}
                                >
                                    Change Email
                                </button>
                            </div>
                        )}

                        {/* STEP 3: Password & Submit */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-green-400 text-sm mb-4">
                                    <span>✓</span>
                                    <span>Email verified</span>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 uppercase">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => updateField("password", e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-700 py-3 outline-none focus:border-[#C8A96E]"
                                        placeholder="Min 6 characters"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 uppercase">
                                        Confirm Password
                                    </label>

                                    <input
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-700 py-3 outline-none focus:border-[#C8A96E]"
                                        placeholder="Confirm password"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="flex items-start gap-2 text-sm text-gray-400">
                                    <input 
                                        type="checkbox" 
                                        checked={form.agreed}
                                        onChange={(e) => updateField("agreed", e.target.checked)}
                                        className="mt-1 accent-[#C8A96E]"
                                        disabled={loading}
                                    />

                                    <span>
                                        By creating an account, I agree to the Terms of
                                        Service and Privacy Policy.
                                    </span>
                                </div>

                                <button 
                                    className="w-full bg-[#C8A96E] text-black py-4 rounded-full font-semibold mt-4 disabled:opacity-50 flex items-center justify-center gap-2" 
                                    onClick={handleSignup}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <LoadingSpinner />
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>

                                <div className="text-center text-sm text-gray-400">
                                    Already a member?{" "}
                                    <span className="text-[#C8A96E] cursor-pointer" onClick={() => router.push("/login")}>
                                        Member Login
                                    </span>
                                </div>
                            </div>
                        )}

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
