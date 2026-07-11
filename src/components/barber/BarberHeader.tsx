"use client";

import { useBarberAuth } from "@/lib/barber-auth";

interface BarberHeaderProps {
  title?: string;
}

export default function BarberHeader({ title }: BarberHeaderProps) {
  const { barber } = useBarberAuth();

  return (
    <header className="bg-card/80 backdrop-blur-xl sticky top-0 z-40 border-b border-border flex justify-between items-center w-full px-6 md:px-8 h-20">
      <div className="flex items-center gap-6">
        {title && (
          <h2 className="text-xl font-headline font-bold text-foreground">{title}</h2>
        )}
        <div className="relative hidden sm:block group">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-muted group-focus-within:text-primary transition-colors pointer-events-none">
            search
          </span>
          <input
            className="bg-surface-container-high border border-transparent rounded-full pl-11 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 focus:bg-surface focus:ring-2 focus:ring-primary/20 w-52 lg:w-72 transition-all duration-200"
            placeholder="Search appointments, clients…"
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          className="relative w-10 h-10 flex items-center justify-center rounded-full text-muted hover:text-primary hover:bg-surface-container-high transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-card" />
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full text-muted hover:text-primary hover:bg-surface-container-high transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Settings"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>

        <div className="flex items-center gap-3 pl-3 md:pl-4 ml-1 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-headline font-bold text-foreground leading-tight">
              {barber?.name || "Barber"}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted">
              Master Barber
            </p>
          </div>
          <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/20 bg-surface-container-high flex items-center justify-center">
            {barber?.image_url ? (
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src={typeof barber.image_url === "string" ? barber.image_url : ""}
              />
            ) : (
              <span className="material-symbols-outlined text-primary">person</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
