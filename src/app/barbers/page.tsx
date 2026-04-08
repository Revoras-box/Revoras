import type { Metadata } from "next";
import FooterExperience from "@/components/FooterExperience";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Master Barbers | Revoras",
  description: "Meet our master-level artisans who understand the nuances of classic and contemporary styling.",
  keywords: ["barbers", "master barbers", "grooming professionals", "luxury"],
};

export const revalidate = 86400; // ISR: Revalidate daily

const barbers = [
  {
    id: "sam-pra",
    name: "Sam Pra",
    title: "Executive Scissor Specialist",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDuMgogr37-apOeBIKesBBtJzuj9sKvucmC4wXlRsgQ7glz2kEE_Q_RgzKzEKMPBZRTbsmOdZ9rRNGxpmnhs1THW-7BCEu2CKJ_tcpFZPEmE4gqZwhMnAV92YKMzVf4P2YRyQafJGYf8SpgCjulTX4IaQOJadqOR1BqN2wZOPzJovnT6n5LHW0tgGtnQ5HhShXPeQkJRaBbSJpRq98n3J-KtapMhdOuOZVQTRXN9dHN5D2ZkSBsT6zzrEOqpoEe0V56LWklxNID6U",
    rating: 4.9,
    reviews: "1.2k",
    specialties: ["Precision Cuts", "Hair Design", "Styling Consultation"],
    experience: "12 Years",
  },
  {
    id: "sachhu-mehta",
    name: "Sachhu Mehta",
    title: "Beard Sculpture Architect",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIGXd00BLTqc9Zx4E-RqHAzchH4b4Nyg-faJ5jB_aryCKTGeQQqF-MO-C_VdtBV4Jt1KO9CMAywPuyj4ioCvA1FqrL9rVB4SwVWUcj5NtmyjD5aWdh9r__ziXQmgHibexi7HXPgB-BdVikqL2ijpDSCFMjbS1rpBXNHOb8gZ6QGSQ3fyJu1OeUMKOS2MeV3IqqHkfJbjggcChHd-BXoYCdHP0N1EUVRfG8wHVOYuWQowRAXLAXMNA_VIHM89jFuz9SzSID5k1fxI0",
    rating: 4.8,
    reviews: "890",
    specialties: ["Beard Sculpting", "Hot Towel Shaves", "Facial Grooming"],
    experience: "9 Years",
  },
  {
    id: "ravi-kumar",
    name: "Ravi Kumar",
    title: "Classic Straight-Razor Master",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnh3f5tbzLBBmxkXz9blMopepyu2hr1DvNTaW7JYybL4Y4CZ1m8K_MLXHNIxvxfZko4y3_avZXpW7aYzMyRI4ju55Dji432OQu71ruQWvOVdYLSRCKzJ5iYQUtbtJn9MkVGSp_Ip2YkjrVEceMEqhDXRsxfFjg3jjcAXslHs5RT7nvjS3DDy9MEdtL9lpKwn5-stq_86r_QomP3OH3vr5dAIpUB4xXJaRxhsJMlGwJ0tzWYGUjfcLmW1C2Qa3pAIoAu-O4e36vakc",
    rating: 4.9,
    reviews: "760",
    specialties: ["Straight Razor", "Classic Styles", "Head Massage"],
    experience: "15 Years",
  },
];

export default function BarbersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 grainy-overlay z-50 pointer-events-none"></div>
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-primary-container/20">
              <span className="material-symbols-outlined text-primary text-sm">workspace_premium</span>
              <span className="text-primary text-xs font-label uppercase tracking-widest font-bold">The Digital Concierge</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter leading-[0.9]">
              Master <br />
              <span className="text-[#C8A96E]">Artisans</span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-xl font-light leading-relaxed">
              Meet the architects of style. Our curated collective of master barbers combines century-old traditions with modern technical precision.
            </p>
          </div>
        </div>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none hidden lg:block">
          <span className="material-symbols-outlined text-[350px]!">person</span>
        </div>
      </header>

      {/* Barber Profiles */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {barbers.map((barber, index) => (
            <div
              key={barber.id}
              className={`group grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden rounded-4xl h-112.5 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={barber.image}
                  alt={barber.name}
                />
                <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent"></div>
                <div className="absolute top-6 left-6 flex items-center space-x-2">
                  <div className="bg-surface/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2">
                    <span className="material-symbols-outlined text-primary text-sm! icon-filled">star</span>
                    <span className="text-sm font-label font-bold">{barber.rating}</span>
                    <span className="text-xs text-on-surface-variant">({barber.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className={`space-y-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="space-y-3">
                  <p className="text-primary font-label text-xs uppercase tracking-[0.3em] font-bold">{barber.experience} Experience</p>
                  <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight">{barber.name}</h2>
                  <p className="text-on-surface-variant text-xl font-light">{barber.title}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {barber.specialties.map((s) => (
                    <span key={s} className="px-4 py-2 rounded-full bg-surface-container-highest text-sm font-label uppercase tracking-wider text-on-surface-variant">
                      {s}
                    </span>
                  ))}
                </div>
                <Link href="/login" className="inline-flex items-center space-x-3 premium-gradient text-on-primary px-8 py-4 rounded-xl font-headline font-bold uppercase tracking-wider hover:shadow-[0_0_30px_rgba(229,196,135,0.3)] transition-all">
                  <span>Book with {barber.name.split(" ")[0]}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-24 bg-[#0b0b0b]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* Image */}
          <div className="rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1"
              className="w-full h-112.5 object-cover"
            />
          </div>


          {/* Content */}
          <div className="space-y-6">

            <div className="text-xs tracking-widest text-[#C8A96E] uppercase">
              Unrivaled Experience
            </div>

            <h2 className="text-4xl font-bold">
              Craftsmanship Beyond the Ordinary.
            </h2>


            <div className="space-y-6">

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                  ✓
                </div>
                <div>
                  <h4>Vetted Excellence</h4>
                  <p className="text-gray-400 text-sm">
                    Each artisan undergoes a rigorous 50-point technical assessment
                  </p>
                </div>
              </div>


              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                  ✦
                </div>
                <div>
                  <h4>Bespoke Consultations</h4>
                  <p className="text-gray-400 text-sm">
                    In-depth facial structure analysis and aesthetic alignment.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      <FooterExperience />
    </div>
  );
}
