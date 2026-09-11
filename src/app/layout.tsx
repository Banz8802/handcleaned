import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}