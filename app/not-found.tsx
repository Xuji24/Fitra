import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#121212] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            {/* 404 Number */}
            <div className="relative mb-6">
              <span className="text-[120px] sm:text-[160px] font-raleway font-bold leading-none text-[#FF5733]/10 select-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#FF5733]/10 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-[#FF5733]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message */}
            <h1 className="font-raleway font-bold text-2xl sm:text-3xl text-[#1A1A1A] dark:text-white mb-3">
              Wrong Route, Runner!
            </h1>
            <p className="font-merriweather-sans text-sm sm:text-base text-[#1A1A1A]/50 dark:text-white/40 mb-8 leading-relaxed">
              Looks like you&apos;ve veered off course. The page you&apos;re
              looking for doesn&apos;t exist or has been moved.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5733] hover:bg-[#E84E2E] text-white text-sm font-semibold font-raleway transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                Back to Home
              </Link>
              <Link
                href="/race"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#1A1A1A]/10 dark:border-white/10 hover:border-[#FF5733]/30 dark:hover:border-[#FF5733]/30 text-[#1A1A1A] dark:text-white text-sm font-semibold font-raleway transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                  />
                </svg>
                Browse Races
              </Link>
            </div>

            {/* Decorative line */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-[#FF5733]/20" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#1A1A1A]/20 dark:text-white/15 font-merriweather-sans">
                Fitra
              </span>
              <div className="h-px w-8 bg-[#FF5733]/20" />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
