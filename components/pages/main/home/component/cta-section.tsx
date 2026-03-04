import { Button } from "@/components/shadcn/button";
import Link from "next/link";
import Image from "next/image";

export default function CTASection() {
  return (
    <div className="w-full relative py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden">
      {/* Background image */}
      <Image
        src="/running-model.jpg"
        alt="Runner"
        fill
        className="object-cover object-center"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Accent gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-[#FF5733] via-[#FFB800] to-[#FF5733]" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <span className="font-raleway font-bold text-[#FFB800] text-xs sm:text-sm tracking-[0.2em] uppercase mb-4 sm:mb-5 block">
          Ready?
        </span>
        <h2 className="font-raleway font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 sm:mb-6">
          Your Next{" "}
          <span className="text-[#FF5733]">Finish Line</span>{" "}
          Awaits
        </h2>
        <p className="font-merriweather-sans text-base sm:text-lg text-white/70 mb-8 sm:mb-10 max-w-lg mx-auto leading-relaxed">
          Sign up today and join a global community of runners. Your first race is just one click away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup">
            <Button className="font-raleway font-bold text-base sm:text-lg bg-[#FF5733] text-white hover:bg-[#E84E2E] transition-all px-10 sm:px-12 py-3.5 sm:py-4 rounded-full cursor-pointer shadow-lg shadow-[#FF5733]/30 hover:shadow-xl hover:shadow-[#FF5733]/40 hover:scale-[1.02] active:scale-[0.98]">
              Sign Up Free
            </Button>
          </Link>
          <Link href="/race" className="font-raleway font-bold text-sm sm:text-base text-white/70 hover:text-[#FFB800] transition-colors underline underline-offset-4 decoration-white/25 hover:decoration-[#FFB800]">
            Explore Races →
          </Link>
        </div>
      </div>
    </div>
  );
}
