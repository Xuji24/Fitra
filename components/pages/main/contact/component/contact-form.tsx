"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Send } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div>
      <h2 className="font-raleway font-bold text-xl sm:text-2xl text-foreground mb-6">
        Send Us a Message
      </h2>

      {isSubmitted && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl">
          <p className="font-merriweather-sans text-sm text-emerald-700 dark:text-emerald-400">
            Thank you! Your message has been sent. We&apos;ll get back to you soon.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="name"
              className="block font-raleway font-bold text-sm text-foreground mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C1C1E] text-foreground text-sm font-merriweather-sans placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-[#FF5733] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block font-raleway font-bold text-sm text-foreground mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C1C1E] text-foreground text-sm font-merriweather-sans placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-[#FF5733] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block font-raleway font-bold text-sm text-foreground mb-2"
          >
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C1C1E] text-foreground text-sm font-merriweather-sans focus:outline-none focus:ring-2 focus:ring-[#FF5733] focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled>
              Select a topic
            </option>
            <option value="general">General Inquiry</option>
            <option value="race">Race & Events</option>
            <option value="partnership">Partnership / Sponsorship</option>
            <option value="support">Technical Support</option>
            <option value="feedback">Feedback & Suggestions</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block font-raleway font-bold text-sm text-foreground mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Tell us what's on your mind..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C1C1E] text-foreground text-sm font-merriweather-sans placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-[#FF5733] focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="font-raleway font-bold text-base bg-[#FF5733] text-white hover:bg-[#E84E2E] transition-all px-8 py-3 rounded-full cursor-pointer shadow-md shadow-[#FF5733]/20 hover:shadow-lg hover:shadow-[#FF5733]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
