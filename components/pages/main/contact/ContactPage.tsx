"use client";

import Navbar from "@/components/navbar";
import ContactForm from "./component/contact-form";
import ContactInfo from "./component/contact-info";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <div className="w-full bg-[#1A1A1A] dark:bg-[#0D0D0D] py-14 sm:py-18 md:py-22 px-4 sm:px-6 md:px-10 lg:px-16 relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-[#FF5733]/5 blur-[100px] pointer-events-none translate-x-1/3" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <span className="font-raleway font-bold text-[#FF5733] text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 block">
            Get In Touch
          </span>
          <h1 className="font-raleway font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-3 sm:mb-4">
            We&apos;d Love to{" "}
            <span className="text-[#FFB800]">Hear From You</span>
          </h1>
          <p className="font-merriweather-sans text-sm sm:text-base md:text-lg text-white/60 max-w-xl leading-relaxed">
            Have a question, feedback, or want to partner with us? Drop us a message and we&apos;ll get back to you.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Contact Form — takes more space */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2">
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
