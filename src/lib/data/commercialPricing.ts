// ---------------------------------------------------------------------------
// Commercial Cleaning & Linen Hire Data Contract & Admin CMS Interface
// ---------------------------------------------------------------------------

export interface CommercialPackageConfig {
  id: string;
  name: string;
  ratePerCleanerPerHour: number;
  gstNote: string;
  shortDescription: string;
  inclusions: string[];
}

export const DEFAULT_COMMERCIAL_PACKAGE: CommercialPackageConfig = {
  id: "commercial-cleaning",
  name: "Commercial & Office Cleaning",
  ratePerCleanerPerHour: 68,
  gstNote: "All prices are exclusive of GST.",
  shortDescription: "Professional workspace and office cleaning tailored to keep your team healthy, productive, and impresive to clients.",
  inclusions: [
    "Desk, workstation & office surface wiping",
    "Kitchen & breakroom sanitization",
    "Restroom cleaning, sanitization & restocking",
    "Floor vacuuming & hard floor mopping",
    "Trash & recycling bin emptying",
    "High-touch point sanitization (handles & switches)",
  ],
};

export interface LinenHirePackage {
  id: string;
  name: string;
  price: number;
  gstNote: string;
  inclusions: { item: string; count: number }[];
}

export const DEFAULT_LINEN_HIRE_PACKAGES: LinenHirePackage[] = [
  {
    id: "king-linen",
    name: "King Linen Hire",
    price: 36,
    gstNote: "Exclusive of GST",
    inclusions: [
      { item: "Queen Plain / Bottom Sheets", count: 2 },
      { item: "Top Sheet", count: 1 },
      { item: "Plain Pillow Cases", count: 2 },
      { item: "Striped Pillow Cases", count: 2 },
      { item: "Bath Towels", count: 2 },
      { item: "Bath Mat", count: 1 },
      { item: "Hand Towel", count: 1 },
      { item: "Tea Towel", count: 1 },
    ],
  },
  {
    id: "queen-linen",
    name: "Queen Linen Hire",
    price: 36,
    gstNote: "Exclusive of GST",
    inclusions: [
      { item: "Queen Plain / Bottom Sheets", count: 2 },
      { item: "Top Sheet", count: 1 },
      { item: "Plain Pillow Cases", count: 2 },
      { item: "Striped Pillow Cases", count: 2 },
      { item: "Bath Towels", count: 2 },
      { item: "Bath Mat", count: 1 },
      { item: "Hand Towel", count: 1 },
      { item: "Tea Towel", count: 1 },
    ],
  },
  {
    id: "single-linen",
    name: "Single Linen Hire",
    price: 30,
    gstNote: "Exclusive of GST",
    inclusions: [
      { item: "Single Plain / Bottom Sheets", count: 2 },
      { item: "Top Sheet", count: 1 },
      { item: "Plain Pillow Case", count: 1 },
      { item: "Striped Pillow Case", count: 1 },
      { item: "Bath Towel", count: 1 },
      { item: "Hand Towel", count: 1 },
    ],
  },
];

export interface ExtraServiceItem {
  id: string;
  name: string;
  priceNote: string;
  description: string;
}

export const DEFAULT_EXTRA_SERVICES: ExtraServiceItem[] = [
  { id: "bbq-cleaning", name: "BBQ Cleaning", priceNote: "Price on request", description: "Deep degreasing and sanitization of outdoor grills & BBQs." },
  { id: "change-bed-linens", name: "Change Bed Linens", priceNote: "Price on request", description: "Fresh sheet, duvet, and pillowcase changing service." },
  { id: "window-cleaning", name: "Window Cleaning", priceNote: "Price on request", description: "Interior & exterior glass polishing for streak-free views." },
  { id: "sliding-door-cleaning", name: "Sliding Door Cleaning", priceNote: "Price on request", description: "Track vacuuming, glass wiping, and frame detailing." },
  { id: "door-cleaning", name: "Door Cleaning", priceNote: "Price on request", description: "Wiping door panels, frames, and high-touch handles." },
  { id: "wall-washing", name: "Wall Washing", priceNote: "Price on request", description: "Scuff mark removal and spot cleaning for painted walls." },
  { id: "mold-cleaning", name: "Mold Cleaning", priceNote: "Price on request", description: "Specialized anti-fungal treatment for damp surface areas." },
  { id: "scrubbing", name: "Heavy Scrubbing", priceNote: "Price on request", description: "Intensive deep scrub for stubborn floor or tile grime." },
  { id: "garage-cleaning", name: "Garage Cleaning", priceNote: "Price on request", description: "Sweeping, cobweb removal, and floor wash for garages." },
  { id: "pool-fence-cleaning", name: "Pool Fence Cleaning", priceNote: "Price on request", description: "Glass or metal pool barrier wash and water spot removal." },
  { id: "ceiling-cleaning", name: "Ceiling Cleaning", priceNote: "Price on request", description: "Dusting ceiling corners, vents, and fan blade wiping." },
  { id: "blinds-cleaning", name: "Blinds Cleaning", priceNote: "Price on request", description: "Detailed wiping and dusting of window blinds & shutters." },
];

export async function getCommercialPricingData() {
  return {
    commercialPackage: DEFAULT_COMMERCIAL_PACKAGE,
    linenPackages: DEFAULT_LINEN_HIRE_PACKAGES,
    extraServices: DEFAULT_EXTRA_SERVICES,
  };
}
