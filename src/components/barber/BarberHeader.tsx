"use client";

import { useBarberAuth } from "@/lib/barber-auth";

interface BarberHeaderProps {
  title?: string;
}

export default function BarberHeader({ title }: BarberHeaderProps) {
  const { barber } = useBarberAuth();

  return (
    <header className="bg-[#131313]/60 backdrop-blur-xl sticky top-0 z-40 bg-[#1C1B1B] shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex justify-between items-center w-full px-8 h-20">
      <div className="flex items-center">
        {title && (
          <h2 className="text-xl font-headline font-bold text-white mr-8">{title}</h2>
        )}
        <div className="relative">
          <input
            className="bg-[#353534]/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-[#4D463A] focus:ring-1 focus:ring-[#E5C487] w-64 transition-all"
            placeholder="Search appointments..."
            type="text"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-[#4D463A]">
            search
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="text-[#4D463A] hover:text-[#E5C487] hover:bg-[#353534]/50 p-2 rounded-full transition-all duration-300 relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#E5C487] rounded-full"></span>
        </button>
        <button className="text-[#4D463A] hover:text-[#E5C487] hover:bg-[#353534]/50 p-2 rounded-full transition-all duration-300">
          <span className="material-symbols-outlined">settings</span>
        </button>
        
        <div className="flex items-center pl-6 border-l border-[#4D463A]/20">
          <div className="text-right mr-4">
            <p className="text-sm font-headline font-bold text-[#E5C487]">
              {barber?.name || "Barber"}
            </p>
            <p className="text-[10px] uppercase text-[#4D463A]">
              Master Barber
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl overflow-hidden border border-[#E5C487]/20 bg-[#353534]">
            {barber?.image_url ? (
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src={typeof barber.image_url === "string" ? barber.image_url : ""}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#E5C487]">
                <span className="material-symbols-outlined">person</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
