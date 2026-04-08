import Link from "next/link";

export default function SplashHero() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden bg-[#0b0b0b]">

      {/* Barber Stripe Background */}
      <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#111,#111_20px,#0b0b0b_20px,#0b0b0b_40px)]" />

      {/* Glow */}
      <div className="absolute w-175 h-175 bg-[#C8A96E]/10 blur-[120px] rounded-full" />

      {/* Hero */}
      <div className="relative z-10 text-center">

        <div className="flex justify-center mb-6">
          <span className="material-symbols-outlined text-[#C8A96E] text-7xl">
            content_cut
          </span>
        </div>

        <h1 className="text-7xl md:text-9xl font-bold text-[#C8A96E] tracking-tight">
          Revoras 
        </h1>

        <p className="mt-4 text-[#6f6f6f] tracking-[0.35em] uppercase text-sm md:text-base">
          Revive Your Aura.
        </p>
      </div>

      {/* Cards */}
      <div className="relative z-10 grid md:grid-cols-2 gap-8 w-full max-w-6xl mt-16 px-6 pb-20">

        {/* Customer */}
        <Link href="/login" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111]/80 backdrop-blur-xl p-8 transition-all duration-500 hover:border-[#C8A96E]/40 block">

          {/* Right Image */}
          <div
            className="absolute right-0 top-0 h-full w-1/2 opacity-25 group-hover:opacity-40 transition"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Gradient Fade */}
          <div className="absolute inset-0 bg-linear-to-r from-[#111] via-[#111]/95 to-transparent" />

          <div className="relative z-10 flex flex-col gap-6">

            <div className="w-12 h-12 rounded-lg bg-[#C8A96E]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#C8A96E]">
                person
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Customer
              </h2>

              <p className="text-[#8a8a8a] mt-2 max-w-xs">
                Book a walk-in or queue up at your local favorite studio.
              </p>
            </div>

            <span className="flex items-center gap-2 text-[#C8A96E] text-sm uppercase tracking-widest mt-4">
              Get Started
              <span className="material-symbols-outlined group-hover:translate-x-2 transition">
                arrow_forward
              </span>
            </span>

          </div>
        </Link>


        {/* Shop Owner */}
        <Link href="/login-barber" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111]/80 backdrop-blur-xl p-8 transition-all duration-500 hover:border-[#C8A96E]/40 block">

          {/* Right Image */}
          <div
            className="absolute right-0 top-0 h-full w-1/2 opacity-25 group-hover:opacity-40 transition"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Gradient Fade */}
          <div className="absolute inset-0 bg-linear-to-r from-[#111] via-[#111]/95 to-transparent" />

          <div className="relative z-10 flex flex-col gap-6">

            <div className="w-12 h-12 rounded-lg bg-[#C8A96E]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#C8A96E]">
                storefront
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Shop Owner
              </h2>

              <p className="text-[#8a8a8a] mt-2 max-w-xs">
                Manage your queue, staff schedules, and digital shop experience.
              </p>
            </div>

            <span className="flex items-center gap-2 text-[#C8A96E] text-sm uppercase tracking-widest mt-4">
              Merchant Portal
              <span className="material-symbols-outlined group-hover:translate-x-2 transition">
                arrow_forward
              </span>
            </span>

          </div>
        </Link>

      </div>

    </main>
  );
}