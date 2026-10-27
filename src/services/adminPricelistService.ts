import fs from 'fs';
import path from 'path';
import { getSupabaseAdminClient, getSupabaseServerClient } from '@/lib/supabase/server';
import {
  type PricelistConfig,
  DEFAULT_PRICELIST_CONFIG,
  setPricelistConfig,
} from '@/lib/data/pricelistConfig';

const PRICELIST_JSON_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'pricelistConfig.json');

function getClient() {
  const adminClient = getSupabaseAdminClient();
  if (adminClient) return adminClient;
  return getSupabaseServerClient();
}

let inMemoryPricelistCache: PricelistConfig | null = null;

/**
 * Reads the active pricelist configuration.
 * Prioritizes in-memory cache, then Supabase cloud database, then persistent disk JSON, then default constants.
 */
export async function getAdminPricelistConfig(): Promise<PricelistConfig> {
  if (inMemoryPricelistCache) {
    return inMemoryPricelistCache;
  }

  // 1. Attempt to read from Supabase settings first
  try {
    const supabase = getClient();
    const { data: appData, error: appError } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'pricelist_config')
      .maybeSingle();

    if (!appError && appData?.value) {
      const remoteConfig = appData.value as Partial<PricelistConfig>;
      const merged: PricelistConfig = {
        ...DEFAULT_PRICELIST_CONFIG,
        ...remoteConfig,
        customization: {
          ...DEFAULT_PRICELIST_CONFIG.customization,
          ...(remoteConfig.customization || {}),
          footer: {
            ...DEFAULT_PRICELIST_CONFIG.customization.footer,
            ...(remoteConfig.customization?.footer || {}),
          },
        },
        categories: remoteConfig.categories && remoteConfig.categories.length > 0
          ? remoteConfig.categories
          : DEFAULT_PRICELIST_CONFIG.categories,
      };

      inMemoryPricelistCache = merged;
      setPricelistConfig(merged);
      return merged;
    }
  } catch (sbErr) {
    console.warn('[getAdminPricelistConfig] Supabase read attempt note:', sbErr);
  }

  // 2. Fallback to local disk file JSON
  try {
    if (fs.existsSync(PRICELIST_JSON_PATH)) {
      const fileData = fs.readFileSync(PRICELIST_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      const merged: PricelistConfig = {
        ...DEFAULT_PRICELIST_CONFIG,
        ...parsed,
        customization: {
          ...DEFAULT_PRICELIST_CONFIG.customization,
          ...(parsed.customization || {}),
          footer: {
            ...DEFAULT_PRICELIST_CONFIG.customization.footer,
            ...(parsed.customization?.footer || {}),
          },
        },
        categories: parsed.categories && parsed.categories.length > 0
          ? parsed.categories
          : DEFAULT_PRICELIST_CONFIG.categories,
      };

      inMemoryPricelistCache = merged;
      setPricelistConfig(merged);
      return merged;
    }
  } catch (err) {
    console.warn('[getAdminPricelistConfig] Local file read error:', err);
  }

  inMemoryPricelistCache = DEFAULT_PRICELIST_CONFIG;
  return DEFAULT_PRICELIST_CONFIG;
}

/**
 * Validates and updates the pricelist configuration.
 * Persists to Supabase, disk, and in-memory runtime cache.
 */
export async function saveAdminPricelistConfig(
  config: Partial<PricelistConfig>,
  updatedBy: string = 'admin@handcleaned.com.au'
): Promise<{ success: boolean; error: string | null; data?: PricelistConfig }> {
  try {
    const current = await getAdminPricelistConfig();

    const merged: PricelistConfig = {
      ...current,
      ...config,
      customization: {
        ...current.customization,
        ...(config.customization || {}),
        footer: {
          ...current.customization.footer,
          ...(config.customization?.footer || {}),
        },
      },
      categories: config.categories || current.categories,
      updatedAt: new Date().toISOString(),
      updatedBy,
    };

    // Update in-memory cache immediately
    inMemoryPricelistCache = merged;
    setPricelistConfig(merged);

    // Write to local disk file JSON
    try {
      fs.writeFileSync(PRICELIST_JSON_PATH, JSON.stringify(merged, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('[saveAdminPricelistConfig] Disk write error (may be read-only env):', fsErr);
    }

    // Persist to Supabase app_settings
    try {
      const supabase = getClient();
      const { error: upsertErr } = await supabase
        .from('app_settings')
        .upsert(
          {
            key: 'pricelist_config',
            value: merged,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

      if (upsertErr) {
        console.warn('[saveAdminPricelistConfig] Supabase upsert note:', upsertErr);
      }
    } catch (sbErr) {
      console.warn('[saveAdminPricelistConfig] Supabase save exception:', sbErr);
    }

    return { success: true, error: null, data: merged };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error saving pricelist';
    return { success: false, error: message };
  }
}

/**
 * Resets the pricelist configuration back to standard defaults.
 */
export async function resetAdminPricelistConfig(
  updatedBy: string = 'admin@handcleaned.com.au'
): Promise<{ success: boolean; error: string | null; data?: PricelistConfig }> {
  return saveAdminPricelistConfig(DEFAULT_PRICELIST_CONFIG, updatedBy);
}
