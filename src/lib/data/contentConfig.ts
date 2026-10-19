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

// Mutable in-memory active content that syncs when admin updates content
let activeSiteContent: SiteContentConfig = { ...DEFAULT_SITE_CONTENT };

/**
 * Returns active site content configuration.
 */
export function getSiteContent(): SiteContentConfig {
  return activeSiteContent;
}

/**
 * Updates active site content configuration in-memory.
 */
export function setSiteContent(newContent: SiteContentConfig): void {
  activeSiteContent = {
    ...DEFAULT_SITE_CONTENT,
    ...newContent,
    hero: { ...DEFAULT_SITE_CONTENT.hero, ...(newContent.hero || {}) },
    homeAbout: { ...DEFAULT_SITE_CONTENT.homeAbout, ...(newContent.homeAbout || {}) },
    aboutPage: {
      hero: { ...DEFAULT_SITE_CONTENT.aboutPage.hero, ...(newContent.aboutPage?.hero || {}) },
      intro: {
        ...DEFAULT_SITE_CONTENT.aboutPage.intro,
        ...(newContent.aboutPage?.intro || {}),
        pillars: newContent.aboutPage?.intro?.pillars || DEFAULT_SITE_CONTENT.aboutPage.intro.pillars,
      },
    },
    servicesCards: newContent.servicesCards || DEFAULT_SITE_CONTENT.servicesCards,
    residentialPage: {
      hero: { ...DEFAULT_SITE_CONTENT.residentialPage.hero, ...(newContent.residentialPage?.hero || {}) },
      featuresTitle: newContent.residentialPage?.featuresTitle || DEFAULT_SITE_CONTENT.residentialPage.featuresTitle,
      features: newContent.residentialPage?.features || DEFAULT_SITE_CONTENT.residentialPage.features,
    },
    airbnbPage: {
      hero: { ...DEFAULT_SITE_CONTENT.airbnbPage.hero, ...(newContent.airbnbPage?.hero || {}) },
      featuresTitle: newContent.airbnbPage?.featuresTitle || DEFAULT_SITE_CONTENT.airbnbPage.featuresTitle,
      features: newContent.airbnbPage?.features || DEFAULT_SITE_CONTENT.airbnbPage.features,
    },
    commercialPage: {
      hero: { ...DEFAULT_SITE_CONTENT.commercialPage.hero, ...(newContent.commercialPage?.hero || {}) },
      featuresTitle: newContent.commercialPage?.featuresTitle || DEFAULT_SITE_CONTENT.commercialPage.featuresTitle,
      features: newContent.commercialPage?.features || DEFAULT_SITE_CONTENT.commercialPage.features,
    },
    testimonials: {
      sectionBadge: newContent.testimonials?.sectionBadge || DEFAULT_SITE_CONTENT.testimonials.sectionBadge,
      sectionHeading: newContent.testimonials?.sectionHeading || DEFAULT_SITE_CONTENT.testimonials.sectionHeading,
      items: newContent.testimonials?.items || DEFAULT_SITE_CONTENT.testimonials.items,
    },
  };
}
