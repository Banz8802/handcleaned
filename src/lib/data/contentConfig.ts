import siteContentData from "./siteContent.json";

export interface HeroContent {
  videoUrl: string;
  badgeText: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
}

export interface HomeAboutContent {
  badgeText: string;
  heading: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

export interface PillarBenefit {
  title: string;
  description: string;
}

export interface AboutPageContent {
  hero: {
    badgeText: string;
    heading: string;
    subheading: string;
    ctaText: string;
    phone: string;
  };
  intro: {
    badgeText: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;
    imageUrl: string;
    badgeTitle: string;
    badgeSubtitle: string;
    pillars: PillarBenefit[];
  };
}

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServicePageContent {
  hero: {
    badgeText: string;
    heading: string;
    subheading: string;
    bgImage: string;
    cta1Text: string;
    cta1Link: string;
    cta2Text: string;
    cta2Link: string;
  };
  featuresTitle: string;
  features: ServiceFeature[];
}

export interface ServiceCardItem {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
  active: boolean;
}

export interface TestimonialSectionContent {
  sectionBadge: string;
  sectionHeading: string;
  items: TestimonialItem[];
}

export interface SiteContentConfig {
  hero: HeroContent;
  homeAbout: HomeAboutContent;
  aboutPage: AboutPageContent;
  servicesCards: ServiceCardItem[];
  residentialPage: ServicePageContent;
  airbnbPage: ServicePageContent;
  commercialPage: ServicePageContent;
  testimonials: TestimonialSectionContent;
  updatedAt?: string;
  updatedBy?: string;
}

export const DEFAULT_SITE_CONTENT: SiteContentConfig = siteContentData as unknown as SiteContentConfig;

/**
 * Returns active site content configuration.
 */
export function getSiteContent(): SiteContentConfig {
  return DEFAULT_SITE_CONTENT;
}
