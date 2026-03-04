"use client";
import Image from "next/image";

interface CardProps {
  id: number;
  title?: string;
  growthNumber?: number;
  imageWidth?: number;
  imageHeight?: number;
  iconPath: string;
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K";
  }
  return num.toString();
}

export default function Card(props: CardProps) {
  return (
    <div
      className="group relative bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 flex flex-col items-center justify-center gap-4 
            border border-gray-100 dark:border-white/8
            shadow-sm hover:shadow-xl hover:shadow-[#FF5733]/10 dark:hover:shadow-[#FF5733]/15
            hover:-translate-y-1 transition-all duration-300 ease-out
            overflow-hidden"
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#FF5733] to-[#FFB800] 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Icon */}
      <div
        className="relative w-14 h-14 bg-linear-to-br from-[#FF5733] to-[#E84E2E] rounded-xl flex items-center justify-center
                shadow-md shadow-[#FF5733]/25 group-hover:scale-110 transition-transform duration-300"
      >
        <Image
          src={props.iconPath}
          alt={`${props.title} Icon`}
          width={props.imageWidth || 26}
          height={props.imageHeight || 26}
          className="object-contain brightness-0 invert"
        />
      </div>

      {/* Growth Number */}
      <p className="font-raleway text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight">
        <span className="text-[#FF5733]">+</span>
        {formatNumber(props.growthNumber || 0)}
      </p>

      {/* Title */}
      <h3 className="font-merriweather-sans text-sm sm:text-base font-medium text-center text-gray-500 dark:text-gray-400 leading-snug">
        {props.title}
      </h3>
    </div>
  );
}
