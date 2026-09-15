import { Suspense } from "react";
import type { Metadata } from "next";
import BookingHero from "@/components/booking/BookingHero";
import BookingFlow from "@/components/booking/BookingFlow";
import TestimonialSection from "@/components/sections/TestimonialSection";

export const metadata: Metadata = {
  title: "Book Airbnb & House Cleaning Online | Hand Cleaned Sydney",
  description:
    "Easy online booking for Airbnb turnover, midstay, deep cleaning, and house cleaning in Sydney. Select your package, pick your schedule, and get instant quotes.",
};

export default function BookingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Booking Hero Banner */}
      <BookingHero />

      {/* Main Multi-Step Booking Flow wrapped in Suspense */}
      <Suspense fallback={<div className="py-20 text-center text-[#1A2E44] font-bold text-[#2CBAE8]">Loading booking system...</div>}>
        <BookingFlow />
      </Suspense>

      {/* Reused Testimonials Section */}
      <TestimonialSection />
    </main>
  );
}
