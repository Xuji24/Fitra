"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Phone, Shirt, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { RaceEvent } from "@/utils/types/race-types";
import { toast } from "sonner";

interface Props {
  race: RaceEvent;
  open: boolean;
  onClose: () => void;
}

const shirtSizes = ["S", "M", "L", "XL", "2XL"];
const paymentMethods = [
  { id: "gcash", label: "GCash" },
  { id: "card", label: "Credit / Debit Card" },
  { id: "bank", label: "Bank Transfer" },
];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  shirtSize: string;
  paymentMethod: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  shirtSize?: string;
  paymentMethod?: string;
}

export default function JoinRaceModal({ race, open, onClose }: Props) {
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    shirtSize: "",
    paymentMethod: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"form" | "confirm">("form");

  // Lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!form.shirtSize) newErrors.shirtSize = "Select a shirt size";
    if (!form.paymentMethod) newErrors.paymentMethod = "Select a payment method";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReview = () => {
    if (validate()) setStep("confirm");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    toast.success("Registration submitted! Check your email for confirmation.");
    onClose();
    // Reset form
    setForm({ fullName: "", email: "", phone: "", shirtSize: "", paymentMethod: "" });
    setStep("form");
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    setStep("form");
    setErrors({});
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-[#1C1C1E] border-b border-gray-100 dark:border-white/8 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="font-raleway font-bold text-lg text-foreground">
              {step === "form" ? "Join Race" : "Confirm Registration"}
            </h2>
            <p className="font-merriweather-sans text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {race.title}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#2A2A2E] transition-colors cursor-pointer"
          >
            <X size={18} className="text-foreground" />
          </button>
        </div>

        <div className="p-6">
          {step === "form" ? (
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-foreground placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1 font-merriweather-sans">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-foreground placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 font-merriweather-sans">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="09XX XXX XXXX"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-foreground placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1 font-merriweather-sans">{errors.phone}</p>
                )}
              </div>

              {/* Shirt Size */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                  <Shirt className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                  Shirt Size
                </label>
                <div className="flex gap-2">
                  {shirtSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleChange("shirtSize", size)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-raleway font-bold transition-all cursor-pointer ${
                        form.shirtSize === size
                          ? "bg-[#FF5733] text-white shadow-md shadow-[#FF5733]/25"
                          : "bg-[#F5F5F0] dark:bg-[#2A2A2E] text-foreground hover:bg-gray-200 dark:hover:bg-[#3A3A3E]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {errors.shirtSize && (
                  <p className="text-xs text-red-500 mt-1 font-merriweather-sans">{errors.shirtSize}</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                  <CreditCard className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                  Payment Method
                </label>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => handleChange("paymentMethod", method.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-merriweather-sans transition-all cursor-pointer text-left ${
                        form.paymentMethod === method.id
                          ? "bg-[#FF5733]/10 border-2 border-[#FF5733] text-foreground"
                          : "bg-[#F5F5F0] dark:bg-[#2A2A2E] border-2 border-transparent text-foreground hover:border-gray-200 dark:hover:border-white/10"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          form.paymentMethod === method.id
                            ? "border-[#FF5733]"
                            : "border-gray-300 dark:border-white/20"
                        }`}
                      >
                        {form.paymentMethod === method.id && (
                          <div className="w-2 h-2 rounded-full bg-[#FF5733]" />
                        )}
                      </div>
                      {method.label}
                    </button>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="text-xs text-red-500 mt-1 font-merriweather-sans">{errors.paymentMethod}</p>
                )}
              </div>

              {/* Review Button */}
              <Button
                type="button"
                onClick={handleReview}
                className="w-full py-4 rounded-xl bg-[#FF5733] text-white font-raleway font-bold text-base hover:bg-[#E84E2E] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer mt-2"
              >
                Review Registration
              </Button>
            </div>
          ) : (
            /* Confirmation Step */
            <div className="space-y-5">
              <div className="bg-[#F5F5F0] dark:bg-[#2A2A2E] rounded-xl p-5 space-y-3">
                <h3 className="font-raleway font-bold text-sm text-foreground mb-3">
                  Registration Summary
                </h3>
                <div className="space-y-2.5 text-sm font-merriweather-sans">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Name</span>
                    <span className="text-foreground font-semibold">{form.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Email</span>
                    <span className="text-foreground font-semibold">{form.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Phone</span>
                    <span className="text-foreground font-semibold">{form.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Shirt Size</span>
                    <span className="text-foreground font-semibold">{form.shirtSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Payment</span>
                    <span className="text-foreground font-semibold">
                      {paymentMethods.find((m) => m.id === form.paymentMethod)?.label}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-white/10 flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Race</span>
                    <span className="text-foreground font-semibold">{race.title}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setStep("form")}
                  disabled={submitting}
                  variant="outline"
                  className="flex-1 py-4 rounded-xl border border-gray-200 dark:border-white/10 font-raleway font-bold text-sm cursor-pointer"
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-[2] py-4 rounded-xl bg-[#FF5733] text-white font-raleway font-bold text-base hover:bg-[#E84E2E] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
