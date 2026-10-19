import fs from 'fs';
import path from 'path';
import { getSupabaseAdminClient, getSupabaseServerClient } from '@/lib/supabase/server';
import { type SiteContentConfig, DEFAULT_SITE_CONTENT } from '@/lib/data/contentConfig';

const CONTENT_JSON_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'siteContent.json');

function getClient() {
  const adminClient = getSupabaseAdminClient();
  if (adminClient) return adminClient;
  return getSupabaseServerClient();
}

let inMemoryContentCache: SiteContentConfig | null = null;

/**
 * Reads the active website content configuration.
 * Prioritizes in-memory cache, then Supabase cloud database, then persistent disk JSON, then default constants.
 */
export async function getAdminSiteContent(): Promise<SiteContentConfig> {
  if (inMemoryContentCache) {
    return inMemoryContentCache;
  }

  // 1. Attempt to read from Supabase settings FIRST (Source of truth in production / Vercel)
  try {
    const supabase = getClient();

    // Check unified app_settings table first
    const { data: appData, error: appError } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'site_content')
      .maybeSingle();

    const rawContent = !appError && appData?.value ? appData.value : null;

    // Fallback check to legacy site_content_settings table
    let legacyContent = null;
    if (!rawContent) {
      const { data: legData, error: legError } = await supabase
        .from('site_content_settings')
        .select('content_data')
        .eq('key', 'active_site_content')
        .maybeSingle();

      if (!legError && legData?.content_data) {
        legacyContent = legData.content_data;
      }
    }

    const remoteContent = (rawContent || legacyContent) as Partial<SiteContentConfig> | null;

    if (remoteContent) {
      const parsed = remoteContent;
      const merged: SiteContentConfig = {
        ...DEFAULT_SITE_CONTENT,
        ...parsed,
        hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
        homeAbout: { ...DEFAULT_SITE_CONTENT.homeAbout, ...(parsed.homeAbout || {}) },
        aboutPage: {
          hero: { ...DEFAULT_SITE_CONTENT.aboutPage.hero, ...(parsed.aboutPage?.hero || {}) },
          intro: {
            ...DEFAULT_SITE_CONTENT.aboutPage.intro,
            ...(parsed.aboutPage?.intro || {}),
            pillars: parsed.aboutPage?.intro?.pillars || DEFAULT_SITE_CONTENT.aboutPage.intro.pillars,
          },
        },
        servicesCards: parsed.servicesCards || DEFAULT_SITE_CONTENT.servicesCards,
        residentialPage: {
          hero: { ...DEFAULT_SITE_CONTENT.residentialPage.hero, ...(parsed.residentialPage?.hero || {}) },
          featuresTitle: parsed.residentialPage?.featuresTitle || DEFAULT_SITE_CONTENT.residentialPage.featuresTitle,
          features: parsed.residentialPage?.features || DEFAULT_SITE_CONTENT.residentialPage.features,
        },
        airbnbPage: {
          hero: { ...DEFAULT_SITE_CONTENT.airbnbPage.hero, ...(parsed.airbnbPage?.hero || {}) },
          featuresTitle: parsed.airbnbPage?.featuresTitle || DEFAULT_SITE_CONTENT.airbnbPage.featuresTitle,
          features: parsed.airbnbPage?.features || DEFAULT_SITE_CONTENT.airbnbPage.features,
        },
        commercialPage: {
          hero: { ...DEFAULT_SITE_CONTENT.commercialPage.hero, ...(parsed.commercialPage?.hero || {}) },
          featuresTitle: parsed.commercialPage?.featuresTitle || DEFAULT_SITE_CONTENT.commercialPage.featuresTitle,
          features: parsed.commercialPage?.features || DEFAULT_SITE_CONTENT.commercialPage.features,
        },
        testimonials: {
          sectionBadge: parsed.testimonials?.sectionBadge || DEFAULT_SITE_CONTENT.testimonials.sectionBadge,
          sectionHeading: parsed.testimonials?.sectionHeading || DEFAULT_SITE_CONTENT.testimonials.sectionHeading,
          items: parsed.testimonials?.items || DEFAULT_SITE_CONTENT.testimonials.items,
        },
      };
      inMemoryContentCache = merged;
      const { setSiteContent } = await import('@/lib/data/contentConfig');
      setSiteContent(merged);
      return merged;
    }
  } catch (sbErr) {
    console.warn('[getAdminSiteContent] Supabase read attempt note:', sbErr);
  }

  // 2. Fallback to persistent disk JSON (Local development or pre-bundled defaults)
  try {
    if (fs.existsSync(CONTENT_JSON_PATH)) {
      const fileData = fs.readFileSync(CONTENT_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      const merged: SiteContentConfig = {
        ...DEFAULT_SITE_CONTENT,
        ...parsed,
        hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
        homeAbout: { ...DEFAULT_SITE_CONTENT.homeAbout, ...(parsed.homeAbout || {}) },
        aboutPage: {
          hero: { ...DEFAULT_SITE_CONTENT.aboutPage.hero, ...(parsed.aboutPage?.hero || {}) },
          intro: {
            ...DEFAULT_SITE_CONTENT.aboutPage.intro,
            ...(parsed.aboutPage?.intro || {}),
            pillars: parsed.aboutPage?.intro?.pillars || DEFAULT_SITE_CONTENT.aboutPage.intro.pillars,
          },
        },
        servicesCards: parsed.servicesCards || DEFAULT_SITE_CONTENT.servicesCards,
        residentialPage: {
          hero: { ...DEFAULT_SITE_CONTENT.residentialPage.hero, ...(parsed.residentialPage?.hero || {}) },
          featuresTitle: parsed.residentialPage?.featuresTitle || DEFAULT_SITE_CONTENT.residentialPage.featuresTitle,
          features: parsed.residentialPage?.features || DEFAULT_SITE_CONTENT.residentialPage.features,
        },
        airbnbPage: {
          hero: { ...DEFAULT_SITE_CONTENT.airbnbPage.hero, ...(parsed.airbnbPage?.hero || {}) },
          featuresTitle: parsed.airbnbPage?.featuresTitle || DEFAULT_SITE_CONTENT.airbnbPage.featuresTitle,
          features: parsed.airbnbPage?.features || DEFAULT_SITE_CONTENT.airbnbPage.features,
        },
        commercialPage: {
          hero: { ...DEFAULT_SITE_CONTENT.commercialPage.hero, ...(parsed.commercialPage?.hero || {}) },
          featuresTitle: parsed.commercialPage?.featuresTitle || DEFAULT_SITE_CONTENT.commercialPage.featuresTitle,
          features: parsed.commercialPage?.features || DEFAULT_SITE_CONTENT.commercialPage.features,
        },
        testimonials: {
          sectionBadge: parsed.testimonials?.sectionBadge || DEFAULT_SITE_CONTENT.testimonials.sectionBadge,
          sectionHeading: parsed.testimonials?.sectionHeading || DEFAULT_SITE_CONTENT.testimonials.sectionHeading,
          items: parsed.testimonials?.items || DEFAULT_SITE_CONTENT.testimonials.items,
        },
      };
      inMemoryContentCache = merged;
      const { setSiteContent } = await import('@/lib/data/contentConfig');
      setSiteContent(merged);
      return merged;
    }
  } catch (err) {
    console.warn('[getAdminSiteContent] Could not read local file, falling back:', err);
  }

  inMemoryContentCache = DEFAULT_SITE_CONTENT;
  return DEFAULT_SITE_CONTENT;
}

/**
 * Validates and updates the website content configuration.
 * Persists to Supabase, disk, and in-memory runtime cache.
 */
export async function saveAdminSiteContent(
  newContent: Partial<SiteContentConfig>,
  updatedBy: string = 'admin@handcleaned.com.au'
): Promise<{ success: boolean; error?: string; data?: SiteContentConfig }> {
  try {
    const current = await getAdminSiteContent();
    const merged: SiteContentConfig = {
      ...current,
      ...newContent,
      hero: { ...current.hero, ...(newContent.hero || {}) },
      homeAbout: { ...current.homeAbout, ...(newContent.homeAbout || {}) },
      aboutPage: {
        hero: { ...current.aboutPage.hero, ...(newContent.aboutPage?.hero || {}) },
        intro: {
          ...current.aboutPage.intro,
          ...(newContent.aboutPage?.intro || {}),
          pillars: newContent.aboutPage?.intro?.pillars || current.aboutPage.intro.pillars,
        },
      },
      servicesCards: newContent.servicesCards || current.servicesCards,
      residentialPage: {
        hero: { ...current.residentialPage.hero, ...(newContent.residentialPage?.hero || {}) },
        featuresTitle: newContent.residentialPage?.featuresTitle || current.residentialPage.featuresTitle,
        features: newContent.residentialPage?.features || current.residentialPage.features,
      },
      airbnbPage: {
        hero: { ...current.airbnbPage.hero, ...(newContent.airbnbPage?.hero || {}) },
        featuresTitle: newContent.airbnbPage?.featuresTitle || current.airbnbPage.featuresTitle,
        features: newContent.airbnbPage?.features || current.airbnbPage.features,
      },
      commercialPage: {
        hero: { ...current.commercialPage.hero, ...(newContent.commercialPage?.hero || {}) },
        featuresTitle: newContent.commercialPage?.featuresTitle || current.commercialPage.featuresTitle,
        features: newContent.commercialPage?.features || current.commercialPage.features,
      },
      testimonials: {
        sectionBadge: newContent.testimonials?.sectionBadge || current.testimonials.sectionBadge,
        sectionHeading: newContent.testimonials?.sectionHeading || current.testimonials.sectionHeading,
        items: newContent.testimonials?.items || current.testimonials.items,
      },
      updatedAt: new Date().toISOString(),
      updatedBy,
    };

    // 1. Update in-memory runtime cache immediately
    inMemoryContentCache = merged;
    const { setSiteContent } = await import('@/lib/data/contentConfig');
    setSiteContent(merged);

    // 2. Write to persistent local file (for local development persistence)
    try {
      const dir = path.dirname(CONTENT_JSON_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(CONTENT_JSON_PATH, JSON.stringify(merged, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('[saveAdminSiteContent] Local filesystem write skipped (serverless environment):', fsErr);
    }

    // 3. Persist to Supabase (primary persistent storage for live site)
    let supabaseSaved = false;
    let supabaseErrorMessage: string | null = null;
    try {
      const supabase = getClient();

      // Try primary app_settings table
      const { error: appErr } = await supabase.from('app_settings').upsert({
        key: 'site_content',
        value: merged,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
      });

      if (!appErr) {
        supabaseSaved = true;
      } else {
        supabaseErrorMessage = appErr.message;
        console.warn('[saveAdminSiteContent] app_settings upsert error:', appErr.message);
      }

      // Also try site_content_settings table
      const { error: legErr } = await supabase.from('site_content_settings').upsert({
        key: 'active_site_content',
        content_data: merged,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
      });

      if (!legErr) {
        supabaseSaved = true;
      }
    } catch (sbEx) {
      supabaseErrorMessage = sbEx instanceof Error ? sbEx.message : String(sbEx);
      console.warn('[saveAdminSiteContent] Supabase connection exception:', supabaseErrorMessage);
    }

    // If running in production (e.g. Vercel) and Supabase failed, notify the admin
    const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
    if (isProduction && !supabaseSaved && supabaseErrorMessage) {
      return {
        success: false,
        error: `Database persistence failed (${supabaseErrorMessage}). Please run the supabase-schema.sql script in your Supabase SQL Editor to enable live database storage.`,
        data: merged,
      };
    }

    return { success: true, data: merged };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[saveAdminSiteContent] Exception:', msg);
    return { success: false, error: msg };
  }
}

export interface AvailableMediaAssets {
  images: string[];
  videos: string[];
}

/**
 * Returns available public media images and videos for visual asset selection.
 */
export function getAvailableMediaAssets(): AvailableMediaAssets {
  const images: string[] = [];
  const videos: string[] = [];

  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    if (fs.existsSync(imagesDir)) {
      const files = fs.readdirSync(imagesDir);
      for (const file of files) {
        if (/\.(webp|jpg|jpeg|png|svg)$/i.test(file)) {
          images.push(`/images/${file}`);
        }
      }
    }
  } catch (err) {
    console.warn('Could not read public/images:', err);
  }

  try {
    const videosDir = path.join(process.cwd(), 'public', 'videos');
    if (fs.existsSync(videosDir)) {
      const files = fs.readdirSync(videosDir);
      for (const file of files) {
        if (/\.(webm|mp4|ogg)$/i.test(file)) {
          videos.push(`/videos/${file}`);
        }
      }
    }
  } catch (err) {
    console.warn('Could not read public/videos:', err);
  }

  return {
    images: images.sort(),
    videos: videos.sort(),
  };
}
