import Image from "next/image";
import { Button } from "@/components/shadcn/button";
import Link from "next/link";

export default function HeroSection() {
    return (
      <section className="w-full relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
        {/* Full-bleed background image */}
        <Image
          src="/Running.jpg"
          alt="Runner in action"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/55 dark:bg-black/70" />

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#FAFAF8] dark:from-[#121212] to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-20 sm:py-24">
          <div className="max-w-2xl">
            {/* Accent tag */}
            <div className="inline-flex items-center gap-2 bg-[#FF5733]/15 backdrop-blur-sm border border-[#FF5733]/30 rounded-full px-4 py-1.5 mb-6 sm:mb-8">
              <span className="w-2 h-2 rounded-full bg-[#FF5733] animate-pulse" />
              <span className="font-raleway font-bold text-[#FF5733] text-xs tracking-[0.15em] uppercase">
                Event Running App
              </span>
            </div>

            <h1 className="font-raleway font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-5 sm:mb-6">
              Run Your Race.{" "}
              <span className="text-[#FF5733]">Own Your Pace.</span>
            </h1>

            <p className="font-merriweather-sans text-base sm:text-lg md:text-xl text-white/80 mb-8 sm:mb-10 leading-relaxed max-w-lg">
              Join thousands of runners worldwide. Track progress, compete in virtual races, and transform your fitness journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link href="/signup">
                <Button className="font-raleway font-bold text-base sm:text-lg bg-[#FF5733] text-white hover:bg-[#E84E2E] transition-all px-8 sm:px-10 py-3 sm:py-4 rounded-full cursor-pointer shadow-lg shadow-[#FF5733]/30 hover:shadow-xl hover:shadow-[#FF5733]/40 hover:scale-[1.02] active:scale-[0.98]">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/race">
                <Button variant="outline" className="font-raleway font-bold text-base sm:text-lg bg-white/10 backdrop-blur-sm text-white border-white/25 hover:bg-white/20 hover:border-white/40 transition-all px-8 sm:px-10 py-3 sm:py-4 rounded-full cursor-pointer">
                  Browse Races
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
}