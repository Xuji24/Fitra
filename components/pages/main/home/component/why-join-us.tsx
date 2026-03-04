'use client';
import Image from "next/image";
import { featuresData } from "@/data/features-data";

export default function WhyJoinUs() {
    return(
        <div className="w-full bg-background px-4 sm:px-6 md:px-12 lg:px-16 py-16 sm:py-20 md:py-28 lg:py-32">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="mb-12 sm:mb-16 lg:mb-20">
                    <span className="font-raleway font-bold text-[#FF5733] text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
                        Why Choose Us
                    </span>
                    <h2 className="font-raleway font-bold text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight mb-4 sm:mb-5">
                        Everything You Need{" "}
                        <span className="text-[#FF5733]">to Run Better</span>
                    </h2>
                    <p className="font-merriweather-sans text-sm sm:text-base md:text-lg text-foreground/60 leading-relaxed max-w-xl">
                        From tracking your first mile to crossing the finish line — we&apos;ve got you covered.
                    </p>
                </div>

                {/* Horizontal Feature Cards */}
                <div className="flex flex-col gap-5 sm:gap-6">
                    {featuresData.map((feature, index) => (
                        <div 
                            key={index} 
                            className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8
                                bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 sm:p-8
                                border border-gray-100 dark:border-white/8
                                hover:border-[#FF5733]/20 dark:hover:border-[#FF5733]/30
                                hover:shadow-lg hover:shadow-[#FF5733]/5
                                transition-all duration-300"
                        >
                            {/* Number + Icon */}
                            <div className="flex items-center gap-4 sm:gap-5 shrink-0">
                                <span className="font-raleway font-bold text-3xl sm:text-4xl text-[#FF5733]/20 select-none w-10 text-right">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FF5733]/10 dark:bg-[#FF5733]/15 rounded-xl flex items-center justify-center group-hover:bg-[#FF5733]/15 dark:group-hover:bg-[#FF5733]/20 transition-colors duration-300">
                                    <Image 
                                        src={feature.icon} 
                                        alt={feature.title} 
                                        width={32} 
                                        height={32}
                                        className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                                    />
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-raleway font-bold text-lg sm:text-xl text-foreground mb-1.5 sm:mb-2">
                                    {feature.title}
                                </h3>
                                <p className="font-merriweather-sans text-sm sm:text-base text-foreground/55 dark:text-foreground/50 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}