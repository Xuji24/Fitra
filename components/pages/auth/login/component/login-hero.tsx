import Image from "next/image";
import { PersonStanding } from "lucide-react";

export default function LoginHero() {
  return (
    <div className="hidden lg:flex relative w-full lg:w-1/2 min-h-screen overflow-hidden items-center justify-center">
      {/* Background running image */}
      <Image
        src="/Running.jpg"
        alt="Runner in action"
        fill
        className="object-cover"
        priority
        sizes="50vw"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/70" />
      <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-transparent" />

      {/* Diagonal accent stripes — subtle over image */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-150 h-50 bg-[#FF5733]/8 rotate-[-35deg] origin-center" />
        <div className="absolute bottom-1/4 -right-16 w-500 h-25 bg-[#FFB800]/6 rotate-[-35deg] origin-center" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-10 lg:px-14 xl:px-20 text-center max-w-md">
        {/* Logo mark */}
        <div className="mx-auto mb-8 w-16 h-16 rounded-2xl bg-[#FF5733]/15 border border-[#FF5733]/30 backdrop-blur-sm flex items-center justify-center">
          <PersonStanding className="w-8 h-8 text-[#FF5733]" />
        </div>

        {/* Tagline */}
        <h2 className="font-raleway font-bold text-3xl lg:text-4xl xl:text-[2.75rem] text-white leading-tight mb-4 drop-shadow-lg">
          Bold Race
          <span className="block bg-linear-to-r from-[#FF5733] to-[#FFB800] bg-clip-text text-transparent">
            Energy
          </span>
        </h2>
        <p className="font-merriweather-sans text-sm lg:text-base text-white/70 leading-relaxed drop-shadow-md">
          Every stride brings you closer to the finish line. Track your runs, join races, and unleash your potential.
        </p>

        {/* Accent line */}
        <div className="mt-8 mx-auto w-16 h-1 rounded-full bg-linear-to-r from-[#FF5733] to-[#FFB800]" />
      </div>
    </div>
  );
}
