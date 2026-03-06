import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Raleway,
  Merriweather_Sans,
} from "next/font/google";
import "../globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/seraui/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import ScrollToTop from "@/components/scroll-to-top";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Fitra",
  description:
    "An event running app for runners to organize/join events and track their running progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} ${merriweatherSans.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
          <ScrollToTop />
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
