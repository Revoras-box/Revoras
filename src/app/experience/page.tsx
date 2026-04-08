import type { Metadata } from "next";
import FooterExperience from "@/components/FooterExperience";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
      <header className="relative min-h-screen flex items-center overflow-hidden bg-black">

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

              <span className="bg-linear-to-r from-[#E7D2A0] to-[#C8A96E] text-transparent bg-clip-text">
                Walk in fresh.
              </span>

            </h1>


            {/* Description */}
            <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
              The digital concierge for elite grooming. Secure your
              spot in the city's most exclusive chairs without lifting a
              finger.
            </p>


            {/* Buttons */}
            <div className="flex items-center gap-8">

              <Link href="/login" className="bg-[#C8A96E] text-black px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition inline-block">
                BOOK NOW
              </Link>

              <Link href="/services" className="flex items-center gap-2 text-[#C8A96E] uppercase tracking-widest text-sm font-semibold hover:translate-x-1 transition">
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
            <div className="absolute inset-0 bg-[#1b1b1b]/70 backdrop-blur-xl rounded-2xl" />

            {/* Gold Left Border Glow */}
            <div className="absolute left-0 top-0 h-full w-0.75 bg-linear-to-b from-[#E7D2A0] to-[#C8A96E]" />

            {/* Content */}
            <div className="relative p-7">

              <div className="text-xs tracking-widest uppercase text-[#C8A96E] mb-3">
                Current Queue
              </div>

              <div className="flex items-end gap-3 mb-3">
                <span className="text-5xl font-bold text-white">
                  04
                </span>

                <span className="text-gray-400 mb-2">
                  Mins
                </span>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed">
                Average wait time at Revoras Partner shops
              </p>

            </div>

          </div>

        </div>

      </header>

      {/* Experience Section */}
      <section className="relative py-32 overflow-hidden bg-[#0b0b0b]">

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

          <span className="material-symbols-outlined text-[420px] text-[#C8A96E]">
            content_cut
          </span>

        </div>



        <div className="relative max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="mb-20">

            <div className="text-[#C8A96E] uppercase tracking-[0.4em] text-xs mb-4 font-semibold">
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

              <div className="w-14 h-14 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#C8A96E]">
                  hotel_class
                </span>
              </div>

              <h3 className="text-xl font-semibold text-white">
                Luxury Service
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Curated amenities from hot towels to premium beverages.
                Every visit is designed to be a sanctuary for the modern gentleman.
              </p>

            </div>



            {/* Expert */}
            <div className="space-y-6">

              <div className="w-14 h-14 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#C8A96E]">
                  content_cut
                </span>
              </div>

              <h3 className="text-xl font-semibold text-white">
                Expert Barbers
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Our platform only features master-level artisans who
                understand the nuances of classic and contemporary styling.
              </p>

            </div>



            {/* No Queue */}
            <div className="space-y-6">

              <div className="w-14 h-14 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#C8A96E]">
                  schedule
                </span>
              </div>

              <h3 className="text-xl font-semibold text-white">
                No Queues
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Real-time dynamic booking ensures you spend zero
                time in the waiting area. Your time is our most respected asset.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Social Proof: Top Rated Shops */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-primary font-label uppercase tracking-[0.4em] text-xs font-bold">Elite Partners</h2>
              <h3 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">Top Rated Shops</h3>
            </div>
            <Link href="/locations" className="text-primary font-headline font-bold uppercase tracking-widest flex items-center space-x-2 group">
              <span>View All Locations</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Syne Studio - Large Feature */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-4xl h-125 bg-surface-container-low">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIGXd00BLTqc9Zx4E-RqHAzchH4b4Nyg-faJ5jB_aryCKTGeQQqF-MO-C_VdtBV4Jt1KO9CMAywPuyj4ioCvA1FqrL9rVB4SwVWUcj5NtmyjD5aWdh9r__ziXQmgHibexi7HXPgB-BdVikqL2ijpDSCFMjbS1rpBXNHOb8gZ6QGSQ3fyJu1OeUMKOS2MeV3IqqHkfJbjggcChHd-BXoYCdHP0N1EUVRfG8wHVOYuWQowRAXLAXMNA_VIHM89jFuz9SzSID5k1fxI0" alt="Modern minimalist barber studio with black marble finishes" />
              <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10 w-full flex justify-between items-end">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-primary text-on-primary font-label text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Featured</span>
                    <div className="flex items-center text-primary">
                      <span className="material-symbols-outlined text-sm! icon-filled">star</span>
                      <span className="text-sm font-label ml-1">4.9 (1.2k Reviews)</span>
                    </div>
                  </div>
                  <h4 className="text-4xl font-headline font-bold">Syne Studio</h4>
                  <p className="text-on-surface-variant font-light flex items-center">
                    <span className="material-symbols-outlined mr-2 text-sm">location_on</span>
                    Downtown District, Arts Quarter
                  </p>
                </div>
                <Link href="/user/studio/syne" className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-primary group-hover:text-on-primary transition-all">
                  <span className="material-symbols-outlined">north_east</span>
                </Link>
              </div>
            </div>

            {/* Secondary Shop 1 */}
            <div className="md:col-span-4 group relative overflow-hidden rounded-4xl h-125 bg-surface-container-low">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnh3f5tbzLBBmxkXz9blMopepyu2hr1DvNTaW7JYybL4Y4CZ1m8K_MLXHNIxvxfZko4y3_avZXpW7aYzMyRI4ju55Dji432OQu71ruQWvOVdYLSRCKzJ5iYQUtbtJn9MkVGSp_Ip2YkjrVEceMEqhDXRsxfFjg3jjcAXslHs5RT7nvjS3DDy9MEdtL9lpKwn5-stq_86r_QomP3OH3vr5dAIpUB4xXJaRxhsJMlGwJ0tzWYGUjfcLmW1C2Qa3pAIoAu-O4e36vakc" alt="Vintage style barbershop with classic red barber pole" />
              <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <div className="flex items-center text-primary mb-2">
                  <span className="material-symbols-outlined text-sm! icon-filled">star</span>
                  <span className="text-xs font-label ml-1">4.8</span>
                </div>
                <h4 className="text-2xl font-headline font-bold mb-4">The Golden Blade</h4>
                <Link href="/user/book" className="text-primary font-label text-xs uppercase tracking-widest border-b border-primary/30 pb-1">Book Session</Link>
              </div>
            </div>

            {/* Small Bento Cards */}
            <div className="md:col-span-4 group relative overflow-hidden rounded-4xl h-75 bg-surface-container-low">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdyaYtdj7FRt-_FxX1wzPAicW2H0PWKhySglOJr1Rs-BZsJiQtyUHLzk3F10IYmvCdsm_Hnccy7cKYTkU8WUtxshpJyC6ZOhcJRQYMpMW0l_VX7xfiuZ5jZ7CEV0I09PZMV29Q1UZTZY5l9uRvucaURt6LEY9XGmDrA4MmtAZ74OZZFeccsFVLztWtqqyPcSGhWupmCLi-MYl45CUBy-nGPY-qRabLV7fYoBxhJFyEKonG32t8nMqV8cZsN4ZHL2msXuDGs_ld-fk" alt="Contemporary urban barber shop" />
              <div className="absolute inset-0 bg-linear-to-t from-surface to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-xl font-headline font-bold">Noir Cuts</h4>
                <p className="text-xs font-label text-on-surface-variant uppercase tracking-wider">Eastside</p>
              </div>
            </div>

            <div className="md:col-span-4 group relative overflow-hidden rounded-4xl h-75 bg-surface-container-low">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGsUbDUrj49gwVFKJ7Z9eOqt5oQrDnxhVGY6uXxkUGJNx_w3JFPMyBkMeWL4uoOIcgTvM1fX0twROsLTLT1EJH5GDu0cUr60HJBTwFwq6tkAXhGRKU6oXjA4AbF7d-sPATecpYVW5IqlHeoPmHzb2W526iJrT9xjsEdKI_5tsOhlBPSit5sZ-c4Gu343ZwLM-fuIUY9-6LKKhCb2usvUZTE2T9x78jc4aAjF0VQqu2f9AgsG2sGWtj_Z-itMhw--gg01072oWTcHg" alt="Minimalist barber workspace" />
              <div className="absolute inset-0 bg-linear-to-t from-surface to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-xl font-headline font-bold">Precision Lab</h4>
                <p className="text-xs font-label text-on-surface-variant uppercase tracking-wider">West End</p>
              </div>
            </div>

            <div className="md:col-span-4 group relative overflow-hidden rounded-4xl h-75 premium-gradient">
              <div className="w-full h-full bg-linear-to-br from-primary-container to-primary flex flex-col items-center justify-center text-on-primary p-8 text-center space-y-4">
                <span className="material-symbols-outlined text-5xl! text-[#594312]">add_location</span>
                <h4 className="text-xl font-headline font-bold text-[#402D00]">Want to list your shop?</h4>
                <p className="text-sm opacity-80 font-light text-[#402D00]">Join the most exclusive digital network of premium barbers.</p>
                <div className="bg-black rounded-md">

                  <Link href="/login-barber" className="bg-surface text-on-surface px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest inline-block">Apply Now</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

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

      <FooterExperience />
    </div>
  );
}
