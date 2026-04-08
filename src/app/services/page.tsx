import type { Metadata } from "next";
import FooterExperience from "@/components/FooterExperience";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Premium Grooming Services | Revoras",
  description: "Explore our curated collection of artisanal barber services. From precision cuts to luxury treatments.",
  keywords: ["barber services", "grooming", "haircut", "luxury", "premium"],
};

export const revalidate = 3600; // ISR: Revalidate every hour

const services = [
  {
    id: "royal-cut",
    title: "The Royal Cut",
    description: "Our ultimate precision service including hot towel treatment, straight razor finish, and styling consultation.",
    price: "₹1,499",
    duration: "75 min",
    icon: "auto_awesome",
    featured: true,
  },
  {
    id: "classic-haircut",
    title: "Classic Haircut",
    description: "Modern or traditional. Expertly tapered and finished with a neck shave.",
    price: "₹799",
    duration: "45 min",
    icon: "content_cut",
    featured: false,
  },
  {
    id: "beard-trim",
    title: "Precision Beard Trim",
    description: "Sculpting, lining, and moisturizing for the modern gentleman's beard.",
    price: "₹599",
    duration: "30 min",
    icon: "face",
    featured: false,
  },
  {
    id: "charcoal-facial",
    title: "Charcoal Facial",
    description: "Deep detoxifying treatment to clear pores and revitalize skin.",
    price: "₹999",
    duration: "50 min",
    icon: "spa",
    featured: false,
  },
  {
    id: "head-massage",
    title: "Head Massage",
    description: "Stress-relieving Ayurvedic scalp treatment with essential oils.",
    price: "₹499",
    duration: "30 min",
    icon: "self_improvement",
    featured: false,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 grainy-overlay z-50 pointer-events-none"></div>
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full text-[#C8A96E]">
              <span className="text-secondary text-xs font-label uppercase tracking-widest font-bold">Elite Grooming Catalog</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter leading-[0.9]">
              Mastery in Every <br />
              <span className="text-[#C8A96E]">Subtle Detail.</span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-xl font-light leading-relaxed">
              Select from our curated menu of artisanal services. Each session is a bespoke experience tailored to your unique structure and style.
            </p>
          </div>
        </div>
        {/* Decorative scissors */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none hidden lg:block">
          <span className="material-symbols-outlined text-[350px]!">content_cut</span>
        </div>
      </header>

      {/* Services Grid */}
      <section className="py-24 bg-[#0b0b0b]">
        <div className="max-w-7xl mx-auto px-6 space-y-10">

          {/* Top Featured Row */}
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Featured Image Card */}
            <div className="lg:col-span-2 relative rounded-3xl overflow-hidden group">

              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1920"
                alt="The Royal Cut service"
                className="w-full h-105 object-cover group-hover:scale-105 transition duration-700"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">

                <div className="space-y-3">
                  <div className="flex gap-3">

                    <span className="bg-green-900/40 text-green-400 text-xs px-3 py-1 rounded-full">
                      Signature
                    </span>

                    <span className="text-gray-400 text-xs">
                      60 Minutes
                    </span>

                  </div>

                  <h3 className="text-3xl font-bold text-white">
                    The Royal Cut
                  </h3>

                  <p className="text-gray-400 max-w-md">
                    Our ultimate precision service including hot towel
                    treatment, straight razor finish, and styling consultation.
                  </p>
                </div>

                <div className="text-right space-y-3">

                  <div className="text-2xl font-bold text-[#C8A96E]">
                    ₹1,499
                  </div>

                  <Link href="/login" className="bg-[#C8A96E] text-black px-5 py-2 rounded-lg inline-block hover:bg-[#b8946e] transition-colors">
                    Select
                  </Link>

                </div>

              </div>

            </div>



            {/* Right Glass Card */}
            <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between">

              <div className="space-y-4">

                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#C8A96E]">
                    content_cut
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white">
                  Classic Haircut
                </h3>

                <p className="text-gray-400">
                  Modern or traditional. Expertly tapered and finished with a neck shave.
                </p>

                <div className="text-xs text-gray-500 uppercase">
                  40 min • Junior/Senior
                </div>

              </div>

              <div className="flex justify-between items-center">

                <div className="text-xl font-bold text-white">
                  ₹799
                </div>

                <Link href="/login" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-[#C8A96E] hover:text-[#C8A96E] transition-colors">
                  →
                </Link>

              </div>

            </div>

          </div>



          {/* Bottom Cards */}
          <div className="grid md:grid-cols-3 gap-8">

            {services.slice(2).map((service) => (
              <div
                key={service.id}
                className="bg-[#111] rounded-2xl p-6 border border-white/5"
              >

                <h4 className="text-lg font-semibold text-white">
                  {service.title}
                </h4>

                <p className="text-gray-400 text-sm mt-2">
                  {service.description}
                </p>

                <div className="flex justify-between items-center mt-6">

                  <div className="text-lg font-bold text-white">
                    {service.price}
                  </div>

                  <Link href="/login" className="bg-[#C8A96E] text-black px-4 py-1 rounded-md text-sm hover:bg-[#b8946e] transition-colors">
                    Select
                  </Link>

                </div>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-10 relative z-10">
          <div className="space-y-4">
            <h2 className="text-primary font-label uppercase tracking-[0.4em] text-xs font-bold">Ready for Your Transformation?</h2>
            <h3 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight max-w-3xl mx-auto">
              Join 4,000+ gentlemen who trust Revoras.
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/login" className="premium-gradient text-on-primary px-12 py-5 rounded-full font-headline font-black text-lg uppercase tracking-widest shadow-2xl hover:scale-105 transition-all inline-block">
              Book a Session
            </Link>
            <Link href="/barbers" className="flex items-center space-x-2 text-primary font-headline font-bold uppercase tracking-widest hover:translate-x-1 transition-transform">
              <span>Meet Our Barbers</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #c8a96e 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
      </section>

      <FooterExperience />
    </div>
  );
}
