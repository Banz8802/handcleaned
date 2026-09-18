import type { Metadata } from "next";
import TermsHeroSection from "@/components/sections/TermsHeroSection";
import TermsContentSection from "@/components/sections/TermsContentSection";

export const metadata: Metadata = {
  title: "Terms of Service | Hand Cleaned",
  description:
    "Review the Terms of Service for Hand Cleaned cleaning services in Sydney and NSW, including booking, payment, cancellation, and property access policies.",
  openGraph: {
    title: "Terms of Service | Hand Cleaned",
    description:
      "Hand Cleaned Terms of Service outlining our service agreements, pricing, cancellation policy, and customer guidelines.",
    url: "https://handcleaned.com.au/terms-of-service",
    siteName: "Hand Cleaned",
    locale: "en_AU",
    type: "website",
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white">
      <TermsHeroSection />
      <TermsContentSection />
    </main>
  );
}
