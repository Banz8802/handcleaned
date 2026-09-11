'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


// ---------------------------------------------------------------------------
// Logo placeholder - swap src prop for the real logo image when available.
// Reserved dimensions match the mockup logo aspect ratio (~140x40px area).
// ---------------------------------------------------------------------------
function LogoPlaceholder() {
  return (
    <div className="flex items-center select-none" aria-label="Hand Cleaned home">
      <Image
        src="/images/hand-cleaning-logo.png"
        alt="Hand Cleaned"
        width={257}
        height={86}
        priority
      />
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 5.54 5.54l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          <Link href="/" className="flex-shrink-0">
            <LogoPlaceholder />
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <a
              href="tel:+61411289877"
              className="inline-flex items-center gap-3 bg-[#FFE67B] hover:bg-[#FFDE59] text-[#1A2E44] font-bold text-sm pl-2 pr-5 py-1.5 rounded-full transition-all duration-200 shadow-md shadow-black/5"
            >
              <span className="w-8 h-8 rounded-full bg-[#E5A000] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.429 5.43l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </span>
              <span className="tracking-wide">+61 411 289 877</span>
            </a>

            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#2CBAE8] text-white font-bold text-sm hover:bg-[#17739C] transition-all duration-200 whitespace-nowrap shadow-md shadow-[#2CBAE8]/20 hover:shadow-lg hover:shadow-[#2CBAE8]/30"
            >
              Contact Us
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-[#1A2E44] hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <HamburgerIcon open={mobileMenuOpen} />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-5 flex flex-col gap-4">
          <a
            href="tel:+61411289877"
            className="inline-flex items-center justify-center gap-3 bg-[#FFE67B] hover:bg-[#FFDE59] text-[#1A2E44] font-bold text-sm py-2.5 rounded-full transition-all duration-200 shadow-md shadow-black/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="w-8 h-8 rounded-full bg-[#E5A000] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.429 5.43l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </span>
            <span>+61 411 289 877</span>
          </a>

          <Link
            href="#contact"
            className="inline-flex items-center justify-center py-3 rounded-full bg-[#2CBAE8] text-white font-bold text-sm hover:bg-[#17739C] transition-all duration-200 shadow-md shadow-[#2CBAE8]/20 hover:shadow-lg hover:shadow-[#2CBAE8]/30"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}