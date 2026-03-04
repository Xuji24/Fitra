import { Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const contactDetails = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@befitera.com",
    description: "We typically reply within 24 hours",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Manila, Philippines",
    description: "Run events across the country",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon - Fri, 9AM - 6PM",
    description: "Philippine Standard Time (PST)",
  },
  {
    icon: MessageCircle,
    label: "Social Media",
    value: "@befitera",
    description: "Follow us on Instagram, Facebook & TikTok",
  },
];

export default function ContactInfo() {
  return (
    <div>
      <h2 className="font-raleway font-bold text-xl sm:text-2xl text-foreground mb-6">
        Contact Information
      </h2>

      <div className="space-y-5">
        {contactDetails.map((detail, index) => {
          const Icon = detail.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-100 dark:border-white/8"
            >
              <div className="w-10 h-10 shrink-0 bg-[#FF5733]/10 dark:bg-[#FF5733]/15 rounded-lg flex items-center justify-center">
                <Icon size={18} className="text-[#FF5733]" />
              </div>
              <div className="min-w-0">
                <p className="font-raleway font-bold text-sm text-foreground">
                  {detail.label}
                </p>
                <p className="font-merriweather-sans text-sm text-foreground mt-0.5">
                  {detail.value}
                </p>
                <p className="font-merriweather-sans text-xs text-foreground/45 mt-1">
                  {detail.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Link */}
      <div className="mt-8 p-5 bg-[#F2F2EF] dark:bg-[#1C1C1E] rounded-xl border border-gray-100 dark:border-white/8">
        <h3 className="font-raleway font-bold text-base text-foreground mb-2">
          Frequently Asked Questions
        </h3>
        <p className="font-merriweather-sans text-sm text-foreground/55 mb-3 leading-relaxed">
          Check our FAQ section for quick answers about races, registration, and more.
        </p>
        <a
          href="#"
          className="font-raleway font-bold text-sm text-[#FF5733] hover:text-[#E84E2E] transition-colors underline underline-offset-4 decoration-[#FF5733]/30 hover:decoration-[#FF5733]"
        >
          View FAQ →
        </a>
      </div>
    </div>
  );
}
