import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { sponsorsData } from "@/data/sponsors-data";

export default async function Sponsor() {
  let sponsors: { id: string; name: string; logo_url: string }[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("sponsors")
      .select("id, name, logo_url")
      .eq("active", true)
      .order("display_order");
    if (data && data.length > 0) {
      sponsors = data;
    }
  } catch {
    // Supabase fetch failed — fall back to static data
  }

  const useFallback = sponsors.length === 0;
  if (useFallback) {
    sponsors = sponsorsData.map((s) => ({
      id: String(s.id),
      name: s.name,
      logo_url: s.logo,
    }));
  }

  if (sponsors.length === 0) return null;

  return (
    <div className="w-full bg-[#F2F2EF] dark:bg-[#1C1C1E] py-14 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="font-raleway font-bold text-foreground/40 text-xs sm:text-sm tracking-[0.2em] uppercase">
            Trusted By Leading Brands
          </span>
        </div>

        {/* Logo Row — clean, no cards */}
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-10 md:gap-14 lg:gap-16">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="group flex justify-center items-center"
            >
              <Image
                src={sponsor.logo_url}
                alt={sponsor.name}
                width={160}
                height={80}
                className="w-16 sm:w-20 md:w-24 lg:w-28 h-auto object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-400"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}