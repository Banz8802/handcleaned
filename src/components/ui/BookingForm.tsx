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
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#243d58] text-white placeholder-white/40 text-sm px-4 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#00AEEF]/60 focus:ring-1 focus:ring-[#00AEEF]/30 transition-colors"
        autoComplete="off"
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
// BookingForm — dark navy card with all fields
// Phase 1: visual only. Form submission is intentionally blocked.
// Phase 2: replace handleSubmit body with a real server action or API call.
// ---------------------------------------------------------------------------
export default function BookingForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    date: "",
    service: "",
  });

  function set(field: keyof FormState) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Phase 1: no-op submit handler. Replace with real logic in Phase 2.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO Phase 2: submit to Supabase / booking API
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 bg-[#1A2E44] rounded-2xl p-7 shadow-xl border border-white/5 w-full"
      aria-label="Book a cleaning service"
    >
      <h3 className="text-white text-xl font-bold tracking-tight mb-1">
        Book Service
      </h3>

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
        placeholder="Date"
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

      <button
        type="submit"
        className="mt-2 w-full bg-[#2CBAE8] hover:bg-[#17739C] text-white font-semibold text-sm py-3 rounded-full transition-colors tracking-wide"
      >
        Book Now
      </button>
    </form>
  );
}