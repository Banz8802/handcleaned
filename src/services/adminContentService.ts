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

/**
 * Reads the active website content configuration.
 * Prioritizes persistent disk JSON, then Supabase settings, then default constants.
 */
export async function getAdminSiteContent(): Promise<SiteContentConfig> {
  try {
    if (fs.existsSync(CONTENT_JSON_PATH)) {
      const fileData = fs.readFileSync(CONTENT_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      return {
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
    }
  } catch (err) {
    console.warn('[getAdminSiteContent] Could not read local file, falling back:', err);
  }

  // Attempt to read from Supabase settings if available
  try {
    const supabase = getClient();
    const { data } = await supabase
      .from('site_content_settings')
      .select('content_data')
      .eq('key', 'active_site_content')
      .maybeSingle();

    if (data?.content_data) {
      return {
        ...DEFAULT_SITE_CONTENT,
        ...(data.content_data as SiteContentConfig),
      };
    }
  } catch {
    // Table may not exist yet in Supabase, ignore
  }

  return DEFAULT_SITE_CONTENT;
}

/**
 * Validates and updates the website content configuration.
 * Persists to disk and syncs with Supabase if table is present.
 */
export async function saveAdminSiteContent(
  newContent: Partial<SiteContentConfig>,
  updatedBy: string = 'admin@handcleaned.com.au'
): Promise<{ success: boolean; error?: string }> {
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

    // 1. Write to persistent local file
    try {
      const dir = path.dirname(CONTENT_JSON_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(CONTENT_JSON_PATH, JSON.stringify(merged, null, 2), 'utf-8');
    } catch (fsErr) {
      console.error('[saveAdminSiteContent] Local filesystem write failed:', fsErr);
    }

    // 2. Best-effort sync to Supabase table
    try {
      const supabase = getClient();
      await supabase.from('site_content_settings').upsert({
        key: 'active_site_content',
        content_data: merged,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
      });
    } catch {
      // Non-blocking if table is not yet provisioned in Supabase
    }

    return { success: true };
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
