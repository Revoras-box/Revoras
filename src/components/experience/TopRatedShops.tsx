"use client";

import Link from "next/link";
import { useBusinesses } from "@/lib/hooks";
import type { Business } from "@/lib/types";

function ratingOf(b: Business): string | null {
  // `rating` arrives as a pg decimal, which the driver hands back as a string.
  const n = b.rating ? Number(b.rating) : 0;
  return n > 0 ? n.toFixed(1) : null;
}

export default function TopRatedShops() {
  const { data, loading } = useBusinesses({ limit: "5", sortBy: "recommended", featuredOnly: "true" });
  const businesses = data?.businesses ?? [];

  // A section whose entire content is "nothing yet" is worse than no section.
  if (!loading && businesses.length === 0) return null;

  const [lead, ...rest] = businesses;

  return (
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 h-125 rounded-4xl bg-surface-container-low animate-pulse" />
            <div className="md:col-span-4 h-125 rounded-4xl bg-surface-container-low animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {lead && (
              <div className="md:col-span-8 group relative overflow-hidden rounded-4xl h-125 bg-surface-container-low">
                {lead.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote business photos
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={lead.image_url} alt={lead.name} />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-10 w-full flex justify-between items-end">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="bg-primary text-on-primary font-label text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Featured</span>
                      {ratingOf(lead) && (
                        <div className="flex items-center text-primary">
                          <span className="material-symbols-outlined text-sm! icon-filled">star</span>
                          <span className="text-sm font-label ml-1">{ratingOf(lead)} ({lead.review_count} Reviews)</span>
                        </div>
                      )}
                    </div>
                    <h4 className="text-4xl font-headline font-bold">{lead.name}</h4>
                    {lead.city && (
                      <p className="text-on-surface-variant font-light flex items-center">
                        <span className="material-symbols-outlined mr-2 text-sm">location_on</span>
                        {lead.city}
                      </p>
                    )}
                  </div>
                  <Link href={`/user/business/${lead.id}`} className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <span className="material-symbols-outlined">north_east</span>
                  </Link>
                </div>
              </div>
            )}

            {rest[0] && (
              <div className="md:col-span-4 group relative overflow-hidden rounded-4xl h-125 bg-surface-container-low">
                {rest[0].image_url && (
                  // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote business photos
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={rest[0].image_url} alt={rest[0].name} />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  {ratingOf(rest[0]) && (
                    <div className="flex items-center text-primary mb-2">
                      <span className="material-symbols-outlined text-sm! icon-filled">star</span>
                      <span className="text-xs font-label ml-1">{ratingOf(rest[0])}</span>
                    </div>
                  )}
                  <h4 className="text-2xl font-headline font-bold mb-4">{rest[0].name}</h4>
                  <Link href={`/user/business/${rest[0].id}`} className="text-primary font-label text-xs uppercase tracking-widest border-b border-primary/30 pb-1">Book Session</Link>
                </div>
              </div>
            )}

            {rest.slice(1, 4).map((b) => (
              <div key={b.id} className="md:col-span-4 group relative overflow-hidden rounded-4xl h-75 bg-surface-container-low">
                {b.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote business photos
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={b.image_url} alt={b.name} />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-surface to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h4 className="text-xl font-headline font-bold">{b.name}</h4>
                  {b.city && <p className="text-xs font-label text-on-surface-variant uppercase tracking-wider">{b.city}</p>}
                </div>
              </div>
            ))}

            <div className="md:col-span-4 group relative overflow-hidden rounded-4xl h-75 premium-gradient">
              <div className="w-full h-full bg-linear-to-br from-primary-container to-primary flex flex-col items-center justify-center text-on-primary p-8 text-center space-y-4">
                <span className="material-symbols-outlined text-5xl! text-primary-foreground">add_location</span>
                <h4 className="text-xl font-headline font-bold text-primary-foreground">Want to list your shop?</h4>
                <p className="text-sm opacity-80 font-light text-primary-foreground">Join the most exclusive digital network of premium barbers.</p>
                <div className="bg-black rounded-md">
                  <Link href="/login-barber" className="bg-surface text-on-surface px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest inline-block">Apply Now</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
