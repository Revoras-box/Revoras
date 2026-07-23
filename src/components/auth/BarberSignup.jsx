"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PasswordChecklist, isStrongPassword } from "@/components/ui/PasswordChecklist";

export default function BarberSignup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState({ email: null, phone: null });

  const [formData, setFormData] = useState({
    name: "",
    salonName: "",
    phone: "",
    email: "",
    experience: "",
    speciality: "",
    shopAddress: "",
    city: "",
    panCard: "",
    password: "",
    confirmPassword: "",
    emailVerified: false,
    phoneVerified: false,
    agreed: false,
  });

  const [otpData, setOtpData] = useState({
    emailOtp: "",
    phoneOtp: "",
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-submit each OTP once its 6th digit lands; track the last fired code per
  // channel so a failed attempt doesn't loop and re-typing the same code retries.
  const lastEmailOtp = useRef("");
  useEffect(() => {
    const code = otpData.emailOtp;
    if (code.length === 6 && !loading && lastEmailOtp.current !== code) {
      lastEmailOtp.current = code;
      handleVerifyEmail();
    }
    if (code.length < 6) lastEmailOtp.current = "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpData.emailOtp, loading]);

  const lastPhoneOtp = useRef("");
  useEffect(() => {
    const code = otpData.phoneOtp;
    if (code.length === 6 && !loading && lastPhoneOtp.current !== code) {
      lastPhoneOtp.current = code;
      handleVerifyPhone();
    }
    if (code.length < 6) lastPhoneOtp.current = "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpData.phoneOtp, loading]);

  const next = () => setStep((s) => Math.min(s + 1, 7));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSendEmailOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    toast.loading("Sending verification code...");

    try {
      const result = await api.sendVerification({
        email: formData.email,
        phone: formData.phone,
        type: "email",
      });

      toast.dismiss();

      if (result.error) {
        toast.error(result.error);
      } else {
        if (result.otp) {
          setDevOtp((prev) => ({ ...prev, email: result.otp }));
        }
        toast.success("Email verification code sent!");
        setStep(3);
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!otpData.emailOtp || otpData.emailOtp.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    toast.loading("Verifying...");

    try {
      const result = await api.verifyCode({
        email: formData.email,
        type: "email",
        otp: otpData.emailOtp,
      });

      toast.dismiss();

      if (result.error) {
        toast.error(result.error);
      } else if (result.verified) {
        updateField("emailVerified", true);
        toast.success("Email verified successfully!");
        setStep(4);
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    if (!formData.phone) {
      toast.error("Please enter your phone number");
      return;
    }

    setLoading(true);
    toast.loading("Sending verification code...");

    try {
      const result = await api.sendVerification({
        email: formData.email,
        phone: formData.phone,
        type: "phone",
      });

      toast.dismiss();

      if (result.error) {
        toast.error(result.error);
      } else {
        if (result.otp) {
          setDevOtp((prev) => ({ ...prev, phone: result.otp }));
        }
        toast.success("Phone verification code sent!");
        setStep(5);
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!otpData.phoneOtp || otpData.phoneOtp.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    toast.loading("Verifying...");

    try {
      const result = await api.verifyCode({
        phone: formData.phone,
        type: "phone",
        otp: otpData.phoneOtp,
      });

      toast.dismiss();

      if (result.error) {
        toast.error(result.error);
      } else if (result.verified) {
        updateField("phoneVerified", true);
        toast.success("Phone verified successfully!");
        setStep(6);
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const validatePanCard = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.salonName || !formData.shopAddress) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!formData.panCard) {
      toast.error("PAN Card number is required");
      return;
    }
    if (!validatePanCard(formData.panCard)) {
      toast.error("Please enter a valid PAN Card number (Format: XXXXX0000X)");
      return;
    }
    if (!isStrongPassword(formData.password)) {
      toast.error("Password must be at least 8 characters with an uppercase letter and a number");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!formData.agreed) {
      toast.error("Please agree to the Terms and Privacy Policy");
      return;
    }

    setLoading(true);
    toast.loading("Creating your profile...");

    try {
      const result = await api.studioSignup({
        ownerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        studioName: formData.salonName,
        address: formData.shopAddress,
        city: formData.city || undefined,
        emailVerified: formData.emailVerified,
        phoneVerified: formData.phoneVerified,
      });

      toast.dismiss();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Studio signup submitted! Awaiting admin approval.");
        router.push("/barber-pending");
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 7;

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24">
        {/* LEFT SIDE */}
        <div className="space-y-10">
          <div>
            <div className="text-xs tracking-[0.35em] text-primary uppercase mb-6">
              Professional Membership
            </div>
            <h1 className="text-6xl font-bold leading-tight">
              Join the{" "}
              <span className="text-primary">Elite.</span>
            </h1>
            <p className="text-muted mt-6 max-w-lg text-lg leading-relaxed">
              The digital concierge for the modern craftsman. Manage your chair,
              clients and brand with premium tools.
            </p>
          </div>

          <div className="space-y-8 pt-8">
            <Feature
              title="Intelligent Queueing"
              desc="Real-time booking management with smart scheduling"
            />
            <Feature
              title="Instant Settlements"
              desc="Fast onboarding without registration fees"
            />
            <Feature
              title="Client Analytics"
              desc="Track customer behavior and retention"
            />
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="bg-card border border-border rounded-3xl p-12 shadow-floating">
          {/* Progress */}
          <div className="mb-10">
            <div className="flex justify-between text-sm text-muted mb-3">
              <span>Professional Onboarding</span>
              <span>Step {step}/7</span>
            </div>
            <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Contact Details</h2>
              <div className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="your@email.com"
                  disabled={loading}
                />
                <Input
                  label="Mobile Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+1 234 567 8900"
                  disabled={loading}
                />
              </div>
              <button
                onClick={next}
                className="primary-btn w-full"
                disabled={!formData.email || !formData.phone}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: Send Email Verification */}
          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Verify Email</h2>
              <p className="text-muted text-sm">
                We will send a verification code to{" "}
                <span className="text-foreground">{formData.email}</span>
              </p>
              <button
                onClick={handleSendEmailOtp}
                className="primary-btn w-full disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Sending Code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </button>
              <button onClick={prev} className="secondary-btn w-full" disabled={loading}>
                Back
              </button>
            </div>
          )}

          {/* STEP 3: Verify Email */}
          {step === 3 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Enter Email Code</h2>
              {devOtp.email && (
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  Dev Mode: Your code is {devOtp.email}
                </div>
              )}
              <Input
                label="6-Digit Code"
                type="text"
                value={otpData.emailOtp}
                onChange={(e) =>
                  setOtpData((prev) => ({
                    ...prev,
                    emailOtp: e.target.value.replace(/\D/g, "").slice(0, 6),
                  }))
                }
                placeholder="000000"
                disabled={loading}
              />
              <button
                onClick={handleVerifyEmail}
                className="primary-btn w-full disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={loading || otpData.emailOtp.length !== 6}
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
              <button onClick={prev} className="secondary-btn w-full" disabled={loading}>
                Back
              </button>
            </div>
          )}

          {/* STEP 4: Send Phone Verification */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="flex items-center gap-2 text-green-400 mb-4">
                <span>✓</span>
                <span className="text-sm">Email verified</span>
              </div>
              <h2 className="text-2xl font-semibold">Verify Phone</h2>
              <p className="text-muted text-sm">
                We will send a verification code to{" "}
                <span className="text-foreground">{formData.phone}</span>
              </p>
              <button
                onClick={handleSendPhoneOtp}
                className="primary-btn w-full disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Sending Code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </button>
              <button onClick={prev} className="secondary-btn w-full" disabled={loading}>
                Back
              </button>
            </div>
          )}

          {/* STEP 5: Verify Phone */}
          {step === 5 && (
            <div className="space-y-8">
              <div className="flex items-center gap-2 text-green-400 mb-4">
                <span>✓</span>
                <span className="text-sm">Email verified</span>
              </div>
              <h2 className="text-2xl font-semibold">Enter Phone Code</h2>
              {devOtp.phone && (
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  Dev Mode: Your code is {devOtp.phone}
                </div>
              )}
              <Input
                label="6-Digit Code"
                type="text"
                value={otpData.phoneOtp}
                onChange={(e) =>
                  setOtpData((prev) => ({
                    ...prev,
                    phoneOtp: e.target.value.replace(/\D/g, "").slice(0, 6),
                  }))
                }
                placeholder="000000"
                disabled={loading}
              />
              <button
                onClick={handleVerifyPhone}
                className="primary-btn w-full disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={loading || otpData.phoneOtp.length !== 6}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Verifying...
                  </>
                ) : (
                  "Verify Phone"
                )}
              </button>
              <button onClick={prev} className="secondary-btn w-full" disabled={loading}>
                Back
              </button>
            </div>
          )}

          {/* STEP 6: Business Details */}
          {step === 6 && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center gap-2 text-green-400 text-sm">
                  <span>✓</span> Email
                </span>
                <span className="flex items-center gap-2 text-green-400 text-sm">
                  <span>✓</span> Phone
                </span>
              </div>
              <h2 className="text-2xl font-semibold">Professional Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Professional Name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  disabled={loading}
                />
                <Input
                  label="Salon Name"
                  value={formData.salonName}
                  onChange={(e) => updateField("salonName", e.target.value)}
                  disabled={loading}
                />
                <Input
                  label="Years of Experience"
                  value={formData.experience}
                  onChange={(e) => updateField("experience", e.target.value)}
                  disabled={loading}
                />
                <Select
                  label="Speciality"
                  value={formData.speciality}
                  onChange={(e) => updateField("speciality", e.target.value)}
                  disabled={loading}
                />
                <Input
                  label="Shop Address"
                  value={formData.shopAddress}
                  onChange={(e) => updateField("shopAddress", e.target.value)}
                  disabled={loading}
                />
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  disabled={loading}
                />
                <div className="col-span-2">
                  <Input
                    label="PAN Card Number"
                    value={formData.panCard}
                    onChange={(e) => updateField("panCard", e.target.value.toUpperCase())}
                    placeholder="XXXXX0000X"
                    disabled={loading}
                  />
                  <p className="text-xs text-secondary-foreground mt-1">Required for verification (Format: XXXXX0000X)</p>
                </div>
              </div>
              <button onClick={next} className="primary-btn w-full" disabled={loading}>
                Continue
              </button>
            </div>
          )}

          {/* STEP 7: Account Setup */}
          {step === 7 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Account Setup</h2>
              <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
                <p className="text-primary font-semibold">No registration fee required</p>
                <p className="text-muted mt-1">
                  Complete your details and submit your profile for approval.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    disabled={loading}
                  />
                  <PasswordChecklist value={formData.password} className="mt-2" />
                </div>
                <Input
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                  disabled={loading}
                />
                <label className="flex gap-3 text-sm text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreed}
                    onChange={(e) => updateField("agreed", e.target.checked)}
                    className="w-5 h-5 accent-primary"
                    disabled={loading}
                  />
                  I agree to Terms and Privacy Policy
                </label>
              </div>
              <button
                onClick={handleSignup}
                className="primary-btn w-full disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Creating Profile...
                  </>
                ) : (
                  "Create Professional Profile"
                )}
              </button>
              <button onClick={prev} className="secondary-btn w-full" disabled={loading}>
                Back
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="max-w-7xl mx-auto mt-32 grid lg:grid-cols-3 gap-10 items-end">
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold leading-tight">
            Designed by Barbers,
            <br />
            for <span className="text-primary">Professionals.</span>
          </h2>
          <p className="text-muted max-w-sm">
            Streamline your bookings, team and schedule — all from one
            dashboard built for grooming professionals.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1621605815971-fbc98d665033"
            className="w-full h-105 object-cover group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <div className="text-xs text-muted uppercase tracking-widest">
              Master Barber
            </div>
            <div className="text-lg font-semibold">The Artisan's Toolset</div>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1"
            className="w-full h-105 object-cover group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <div className="text-xs text-muted uppercase tracking-widest">
              Shop Owners
            </div>
            <div className="text-lg font-semibold">Full-Scale Oversight</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="flex gap-5">
      <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center">
        ✓
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-muted text-sm">{desc}</p>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, disabled }) {
  return (
    <div>
      <label className="text-xs text-secondary-foreground uppercase tracking-widest">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-transparent border-b border-border py-3 mt-2 outline-none focus:border-primary transition-colors disabled:opacity-50"
      />
    </div>
  );
}

function Select({ label, value, onChange, disabled }) {
  return (
    <div>
      <label className="text-xs text-secondary-foreground uppercase tracking-widest">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-transparent border-b border-border py-3 mt-2 outline-none focus:border-primary disabled:opacity-50"
      >
        <option value="">Select Expertise</option>
        <option>Haircut</option>
        <option>Beard</option>
        <option>Styling</option>
      </select>
    </div>
  );
}
