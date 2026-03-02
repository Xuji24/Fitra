import Image from "next/image";
    
export default function LoginHero() {
  return (
    <div className="hidden lg:block relative w-full lg:w-1/2 min-h-screen">
      {/* Background Image */}
      <Image
        src="/Running.jpg"
        alt="Runner on a misty road"
        fill
        className="object-cover"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Text Content — absolutely positioned & centered */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 lg:px-12 xl:px-16 text-center animate-fade-in">
        <h2 className="font-raleway font-bold text-3xl lg:text-4xl xl:text-5xl text-white leading-tight mb-4 animate-slide-up">
          Running keeps the mind and body healthy
        </h2>
        <p className="font-merriweather-sans text-base lg:text-lg text-white/90 animate-slide-up animation-delay-200">
          Start Running, Stay Healthy, Stay Connected
        </p>
      </div>
    </div>
  );
}
