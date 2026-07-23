import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TopRatedShops from "@/components/experience/TopRatedShops";

export const metadata: Metadata = {
  title: "The Experience | Revoras",
  description: "Skip the wait. Walk in fresh. The digital concierge for elite grooming.",
  keywords: ["barber experience", "luxury grooming", "booking", "premium"],
};

export const revalidate = 604800; // ISR: Revalidate weekly

export default function ExperiencePage() {
  return (
    <div className="min-h-screen flex flex-col pt-10">
      <div className="fixed inset-0 grainy-overlay z-50"></div>
      <Navbar />

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center overflow-hidden bg-background">

        {/* Background Image */}
        <div className="absolute inset-0">

          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDuMgogr37-apOeBIKesBBtJzuj9sKvucmC4wXlRsgQ7glz2kEE_Q_RgzKzEKMPBZRTbsmOdZ9rRNGxpmnhs1THW-7BCEu2CKJ_tcpFZPEmE4gqZwhMnAV92YKMzVf4P2YRyQafJGYf8SpgCjulTX4IaQOJadqOR1BqN2wZOPzJovnT6n5LHW0tgGtnQ5HhShXPeQkJRaBbSJpRq98n3J-KtapMhdOuOZVQTRXN9dHN5D2ZkSBsT6zzrEOqpoEe0V56LWklxNID6U"
            alt="Premium grooming experience"
            className="w-full h-full object-cover"
          />

          {/* Left Dark Gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/90 to-transparent" />

          {/* Bottom Fade */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

        </div>


        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">

          <div className="max-w-2xl space-y-8">

            {/* Live Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-green-900/20 border border-green-500/30 backdrop-blur-md">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-green-400 font-semibold">
                Live Booking Available
              </span>
            </div>


            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tight text-white">

              Skip the wait.
              <br />

              <span className="bg-linear-to-r from-primary-fixed-dim to-primary-container text-transparent bg-clip-text">
                Walk in fresh.
              </span>

            </h1>


            {/* Description */}
            <p className="text-muted text-lg leading-relaxed max-w-lg">
              The digital concierge for elite grooming. Secure your
              spot in the city's most exclusive chairs without lifting a
              finger.
            </p>


            {/* Buttons */}
            <div className="flex items-center gap-8">

              <Link href="/login" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition inline-block">
                BOOK NOW
              </Link>

              <Link href="/services" className="flex items-center gap-2 text-primary uppercase tracking-widest text-sm font-semibold hover:translate-x-1 transition">
                EXPLORE SERVICES
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </Link>

            </div>

          </div>

        </div>


        {/* Floating Queue Card */}
        <div className="absolute bottom-20 right-16 hidden lg:block">

          <div className="relative w-75 rounded-2xl overflow-hidden">

            {/* Background Glass */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl rounded-2xl" />

            {/* Gold Left Border Glow */}
            <div className="absolute left-0 top-0 h-full w-0.75 bg-linear-to-b from-primary-fixed-dim to-primary-container" />

            {/* Content */}
            <div className="relative p-7">

              <div className="text-xs tracking-widest uppercase text-primary mb-3">
                Current Queue
              </div>

              <div className="flex items-end gap-3 mb-3">
                <span className="text-5xl font-bold text-white">
                  04
                </span>

                <span className="text-muted mb-2">
                  Mins
                </span>
              </div>

              <p className="text-sm text-muted leading-relaxed">
                Average wait time at Revoras Partner shops
              </p>

            </div>

          </div>

        </div>

      </header>

      {/* Experience Section */}
      <section className="relative py-32 overflow-hidden bg-background">

        {/* Background Texture Image */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-[#0b0b0b]/95 to-[#0b0b0b]" />



        {/* Right Scissors Image */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">

          <span className="material-symbols-outlined text-[420px] text-primary">
            content_cut
          </span>

        </div>



        <div className="relative max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="mb-20">

            <div className="text-primary uppercase tracking-[0.4em] text-xs mb-4 font-semibold">
              THE EXPERIENCE
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              Redefining the Grooming Ritual
            </h2>

          </div>



          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-16">

            {/* Luxury */}
            <div className="space-y-6">

              <div className="w-14 h-14 rounded-xl bg-card flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">
                  hotel_class
                </span>
              </div>

              <h3 className="text-xl font-semibold text-foreground">
                Luxury Service
              </h3>

              <p className="text-muted leading-relaxed">
                Curated amenities from hot towels to premium beverages.
                Every visit is designed to be a sanctuary for the modern gentleman.
              </p>

            </div>



            {/* Expert */}
            <div className="space-y-6">

              <div className="w-14 h-14 rounded-xl bg-card flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">
                  content_cut
                </span>
              </div>

              <h3 className="text-xl font-semibold text-foreground">
                Expert Barbers
              </h3>

              <p className="text-muted leading-relaxed">
                Our platform only features master-level artisans who
                understand the nuances of classic and contemporary styling.
              </p>

            </div>



            {/* No Queue */}
            <div className="space-y-6">

              <div className="w-14 h-14 rounded-xl bg-card flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">
                  schedule
                </span>
              </div>

              <h3 className="text-xl font-semibold text-foreground">
                No Queues
              </h3>

              <p className="text-muted leading-relaxed">
                Real-time dynamic booking ensures you spend zero
                time in the waiting area. Your time is our most respected asset.
              </p>

            </div>

          </div>

        </div>

      </section>

      <TopRatedShops />

      {/* Final CTA Section */}
      <section className="py-24 bg-surface relative overflow-hidden ">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-primary font-label uppercase tracking-[0.4em] text-sm font-bold">Elevate Your Standard</h2>
            <h3 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight max-w-4xl mx-auto">Ready for a change?</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
            <Link href="/login" className="w-full sm:w-auto premium-gradient text-on-primary px-12 py-5 rounded-full font-headline font-black text-xl uppercase tracking-widest shadow-2xl hover:scale-105 transition-all text-center inline-block">
              Book Your Fresh Cut
            </Link>
            <button className="w-full sm:w-auto flex items-center justify-center space-x-3 px-12 py-5 rounded-full bg-surface-container-highest/50 backdrop-blur-sm border border-outline-variant/30 text-primary font-headline font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined">app_shortcut</span>
              <span>Download App</span>
            </button>
          </div>
        </div>

        {/* Background Texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #c8a96e 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
      </section>

      <Footer />
    </div>
  );
}
