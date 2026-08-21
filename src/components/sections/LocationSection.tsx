// ---------------------------------------------------------------------------
// LocationSection
//
// Map replacement guide:
//   1. Static image: replace <MapPlaceholder /> with:
//        <Image src="/images/sydney-map.jpg" fill alt="Sydney, Australia map"
//               className="object-cover" />
//      inside a `relative overflow-hidden rounded-2xl` wrapper.
//
//   2. Google Maps embed: replace <MapPlaceholder /> with:
//        <iframe
//          src="https://www.google.com/maps/embed?pb=..."
//          className="absolute inset-0 w-full h-full border-0"
//          allowFullScreen loading="lazy"
//          referrerPolicy="no-referrer-when-downgrade"
//        />
//
//   3. Mapbox / react-map-gl: mount inside the same wrapper with fill sizing.
//
// The outer wrapper (rounded-2xl, overflow-hidden, shadow, aspect ratio)
// must remain unchanged regardless of which map implementation is used.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Section label — consistent with the rest of the page
// ---------------------------------------------------------------------------
function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-block text-[#00AEEF] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
      {text}
    </span>
  );
}

// ---------------------------------------------------------------------------
// LocationSection — main export
// ---------------------------------------------------------------------------
export default function LocationSection() {
  return (
    <section
      className="relative w-full bg-[#F7FBFF] overflow-hidden"
      aria-labelledby="location-heading"
    >
      {/* ── Subtle background bubbles ──────────────────────────────── */}
      <div aria-hidden="true" className="absolute top-8   left-4  w-16 h-16 rounded-full border border-sky-200 opacity-25 pointer-events-none" />
      <div aria-hidden="true" className="absolute top-16  right-8 w-10 h-10 rounded-full bg-pink-100 opacity-20 pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-6 right-6 w-14 h-14 rounded-full border border-sky-200 opacity-20 pointer-events-none" />

      {/* ── Inner container ───────────────────────────────────────── */}
      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8 py-20 lg:py-28">

        {/* ── Section header ────────────────────────────────────────── */}
        <div className="mb-8 lg:mb-10">
          <SectionLabel text="Location" />
          <h2
            id="location-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight"
          >
            Sydney, Australia
          </h2>
        </div>

        {/* ── Map container ─────────────────────────────────────────── */}
        {/*
          Outer wrapper establishes the map dimensions and visual framing.
          Replace <MapPlaceholder /> with a real map implementation — the
          wrapper itself should remain unchanged (see file header for options).
        */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.10)] border border-sky-100 aspect-[16/7]"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106037.28859942767!2d151.1204111!3d-33.8476626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129838f39a743f%3A0x3017d681632a850!2sSydney%20NSW%2C%20Australia!5e0!3m2!1sen!2sau!4v1710000000000!5m2!1sen!2sau"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sydney NSW, Australia Map"
          />
        </div>

      </div>
    </section>
  );
}