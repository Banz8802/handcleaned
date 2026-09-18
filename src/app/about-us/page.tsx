import type { Metadata } from "next";
import AboutUsHeroSection from "@/components/sections/AboutUsHeroSection";
import AboutUsIntroSection from "@/components/sections/AboutUsIntroSection";
import AboutUsServiceApproachSection from "@/components/sections/AboutUsServiceApproachSection";
import AboutUsCommitmentSection from "@/components/sections/AboutUsCommitmentSection";
import AboutUsMissionSection from "@/components/sections/AboutUsMissionSection";
import AboutUsCtaSection from "@/components/sections/AboutUsCtaSection";

export const metadata: Metadata = {
  title: "About Us | Hand Cleaned - Professional Cleaning Services",
  description:
    "At Hand Cleaned, we are committed to providing professional, reliable, and detail-oriented cleaning services designed to make your space feel fresh, comfortable, and well cared for.",
  openGraph: {
    title: "About Us | Hand Cleaned",
    description:
      "Professional cleaning services focused on quality, care, trust, and customer satisfaction across Sydney & NSW.",
    url: "https://handcleaned.com.au/about-us",
    siteName: "Hand Cleaned",
    locale: "en_AU",
    type: "website",
  },
};

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutUsHeroSection />
      <AboutUsIntroSection />
      <AboutUsServiceApproachSection />
      <AboutUsCommitmentSection />
      <AboutUsMissionSection />
      <AboutUsCtaSection />
    </main>
  );
}
