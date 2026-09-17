'use client';

import { useState, type FormEvent } from "react";

// ---------------------------------------------------------------------------
// Field types — kept consistent with future backend field names.
// When real booking is implemented, replace the dummy handler with a
// server action or API call. Field names (name, email, phone, date, service)
// are intentionally stable to make that migration easy.
// ---------------------------------------------------------------------------
interface FormState {
  name: string;
  email: string;
  phone: string;
  date: string;
  service: string;
  message: string;
}

const SERVICES = [
  "Deep Cleaning",
  "End of Lease Cleaning",
  "Initial / Deep Cleaning Airbnb",
  "Commercial Cleaning",
];

// ---------------------------------------------------------------------------
// Reusable input field styled for the dark form card
// ---------------------------------------------------------------------------
interface FieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

function Field({ id, label, type = "text", placeholder, value, onChange }: FieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputType = type === "date" ? (isFocused || value ? "date" : "text") : type;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={inputType}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#243d58] text-white placeholder-white/40 text-sm px-4 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#00AEEF]/60 focus:ring-1 focus:ring-[#00AEEF]/30 transition-colors"
        autoComplete="off"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable textarea field
// ---------------------------------------------------------------------------
interface TextAreaFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}

function TextAreaField({ id, label, placeholder, value, onChange, rows = 3 }: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#243d58] text-white placeholder-white/40 text-sm px-4 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#00AEEF]/60 focus:ring-1 focus:ring-[#00AEEF]/30 transition-colors resize-none"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Select field variant
// ---------------------------------------------------------------------------
interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

function SelectField({ id, label, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-[#243d58] text-sm px-4 py-2.5 pr-10 rounded-lg border border-white/10 focus:outline-none focus:border-[#00AEEF]/60 focus:ring-1 focus:ring-[#00AEEF]/30 transition-colors cursor-pointer"
          style={{ color: value ? "white" : "rgba(255,255,255,0.4)" }}
        >
          <option value="" disabled style={{ color: "#888" }}>
            Select Service
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} style={{ color: "#fff", background: "#1A2E44" }}>
              {opt}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-3.5 h-3.5 text-white/40"
            aria-hidden="true"
          >
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
import { submitInquiry } from "@/app/actions/submitInquiry";

// ---------------------------------------------------------------------------
// BookingForm — dark navy card inquiry form
// ---------------------------------------------------------------------------
export default function BookingForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    date: "",
    service: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryRef, setInquiryRef] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function set(field: keyof FormState) {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errorMessage) setErrorMessage(null);
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!form.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!form.phone.trim()) {
      setErrorMessage("Please enter your phone number.");
      return;
    }
    if (!form.service) {
      setErrorMessage("Please select a service.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        date: form.date,
        service: form.service,
        message: form.message.trim(),
      });

      if (res.success) {
        setIsSubmitted(true);
        setInquiryRef(res.inquiryReference || "");
        setForm({
          name: "",
          email: "",
          phone: "",
          date: "",
          service: "",
          message: "",
        });
      } else {
        setErrorMessage(res.error || "Failed to send inquiry. Please try again.");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-[#1A2E44] rounded-2xl p-7 shadow-xl border border-white/5 w-full text-center py-10">
        <div className="w-12 h-12 rounded-full bg-[#00AEEF]/20 text-[#00AEEF] flex items-center justify-center mb-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="text-white text-xl font-bold tracking-tight">
          Inquiry Sent!
        </h3>

        <p className="text-white/80 text-sm leading-relaxed max-w-xs">
          Thank you for reaching out. We have received your inquiry and our team will get back to you shortly.
        </p>

        {inquiryRef && (
          <div className="bg-[#243d58] px-4 py-2 rounded-lg border border-white/10 text-xs text-sky-200 font-mono my-1">
            Ref: {inquiryRef}
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className="mt-2 text-xs text-[#00AEEF] hover:underline font-medium focus:outline-none"
        >
          Send another inquiry &rarr;
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 bg-[#1A2E44] rounded-2xl p-7 shadow-xl border border-white/5 w-full"
      aria-label="Submit an Inquiry form"
    >
      <h3 className="text-white text-xl font-bold tracking-tight mb-1">
        Submit an Inquiry
      </h3>

      {errorMessage && (
        <div className="bg-red-500/15 border border-red-500/30 text-red-200 text-xs px-3.5 py-2.5 rounded-lg">
          {errorMessage}
        </div>
      )}

      <Field
        id="name"
        label="Your Name"
        placeholder="Your Name"
        value={form.name}
        onChange={set("name")}
      />
      <Field
        id="email"
        label="Your Email Address"
        type="email"
        placeholder="Your Email Address"
        value={form.email}
        onChange={set("email")}
      />
      <Field
        id="phone"
        label="Phone Number"
        type="tel"
        placeholder="Phone Number"
        value={form.phone}
        onChange={set("phone")}
      />
      <Field
        id="date"
        label="Preferred Date"
        type="date"
        placeholder="Select a date"
        value={form.date}
        onChange={set("date")}
      />
      <SelectField
        id="service"
        label="Select Service"
        value={form.service}
        onChange={set("service")}
        options={SERVICES}
      />
      <TextAreaField
        id="message"
        label="Your Message"
        placeholder="Your Message (Optional)"
        value={form.message}
        onChange={set("message")}
        rows={3}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full bg-[#2CBAE8] hover:bg-[#17739C] disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-full transition-colors tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </>
        ) : (
          "Send"
        )}
      </button>
    </form>
  );
}