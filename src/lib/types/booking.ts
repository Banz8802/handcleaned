// ---------------------------------------------------------------------------
// HandCleaned Booking System Types & Data Contracts
// Compatible with future API endpoints, databases, and Admin Dashboard.
// ---------------------------------------------------------------------------

export type PropertyType =
  | "Studio"
  | "1 Bed + 1 to 1.5 Bath"
  | "2 Bed + 1 to 2 Bath"
  | "3 Bed + 1 to 2 Bath"
  | "4 Bed + 1 to 2 Bath"
  | "5 Bed + 1 to 2 Bath";

export type StoreyType = "Single" | "Two-Storey" | "Three-Storey";

export interface BookingService {
  id: string;
  name: string;
  shortDescription: string;
  badge?: string;
  iconName: string;
  isAvailable: boolean;
}

export interface BookingPackage {
  id: string;
  serviceId: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  shortDescription: string;
  inclusions: string[];
  price?: number;
  ratePerCleanerPerHour?: number;
  prices?: Record<PropertyType, Partial<Record<StoreyType, number>>>;
}

export interface PropertyDetails {
  address: string;
  bedrooms: string; // e.g. "Studio", "1", "2", "3", "4", "5"
  bathrooms: string; // e.g. "1", "1.5", "2", "2.5", "3+"
  storey: StoreyType;
  cleanersCount?: number;
  notes?: string;
}

export interface ScheduleDetails {
  date: string; // YYYY-MM-DD
  time: string; // e.g., "08:00 AM - 10:00 AM"
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialInstructions?: string;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface BookingData {
  bookingReference: string;
  createdAt: string;
  service: {
    id: string;
    name: string;
  };
  package: {
    id: string;
    name: string;
    price: number;
    propertyTypeMapped?: PropertyType;
  };
  property: PropertyDetails;
  schedule: ScheduleDetails;
  customer: CustomerDetails;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
}
