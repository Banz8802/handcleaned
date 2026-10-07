import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { headers } from "next/headers";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hand Cleaned | Professional Cleaning Services Sydney",
  description:
    "Hand Cleaned offers professional home, Airbnb, end-of-lease and commercial cleaning services across Sydney, Australia.",
  icons: {
    icon: [
      {
        url: "/favicon.png",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isAdminSubdomain = host.startsWith("admin.") || host.includes("admin.handcleaned");

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {!isAdminSubdomain && <Header />}
        {children}
        {!isAdminSubdomain && <Footer />}
        {!isAdminSubdomain && <ScrollToTopButton />}
        {!isAdminSubdomain && <WhatsAppButton />}
      </body>
    </html>
  );
}