import Link from "next/link";
import Image from "next/image";


// ---------------------------------------------------------------------------
// Star rating — 5 filled yellow stars matching the mockup
// ---------------------------------------------------------------------------
function StarRating() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 star rating" role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          className="w-3.5 h-3.5 text-[#F5C518]"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
        </svg>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ServiceCard — reusable card component driven by data from ServicesSection
//
// Image replacement:
//   The inner placeholder <div> in the image slot should be replaced with:
//   <Image src={image} fill alt={title} className="object-cover" />
//   when the real assets are available. The outer wrapper dimensions stay.
// ---------------------------------------------------------------------------
export interface ServiceCardData {
  id: string;
  title: string;
  description?: string;
  price?: string;
  image: string;       // path for future <Image src={image} />
  href?: string;
}

export default function ServiceCard({ title, description, price, image, href = "#contact" }: ServiceCardData) {
  return (
    <article className="group flex flex-col bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)] hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 overflow-hidden">

      {/* ── Image slot ─────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-sky-50 flex-shrink-0">
        <Image src={image} fill alt={title} className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>

      {/* ── Card body ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 p-4 flex-1">

        {/* Service title */}
        <h3 className="text-sm font-semibold text-[#1A2E44] leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Description or Price */}
        {description ? (
          <p className="text-xs text-gray-500 leading-relaxed min-h-[36px] line-clamp-2">
            {description}
          </p>
        ) : price ? (
          <p className="text-base font-bold text-[#1A2E44]">{price}</p>
        ) : null}

        {/* Star rating */}
        <StarRating />

        {/* Read more button */}
        <div className="mt-auto pt-2">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 bg-[#2CBAE8] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full hover:bg-[#17739C] transition-colors"
          >
            Reserve Now
            {/* Small circular arrow */}
            <span className="flex items-center justify-center w-4 h-4 rounded-full border border-white/50">
              <svg
                viewBox="0 0 12 12"
                fill="currentColor"
                className="w-2 h-2"
                aria-hidden="true"
              >
                <path d="M1 6h8.586L6.293 2.707a1 1 0 0 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 1 1-1.414-1.414L9.586 8H1a1 1 0 0 1 0-2z" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}