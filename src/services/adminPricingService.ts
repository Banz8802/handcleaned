import fs from 'fs';
import path from 'path';
import { getSupabaseAdminClient, getSupabaseServerClient } from '@/lib/supabase/server';
import { type PricingRatesConfig, DEFAULT_PRICING_RATES } from '@/lib/data/pricingConfig';

const PRICING_JSON_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'pricingRates.json');

/**
 * Returns best available Supabase client for admin operations.
 */
function getClient() {
  const adminClient = getSupabaseAdminClient();
  if (adminClient) return adminClient;
  return getSupabaseServerClient();
}

let inMemoryPricingCache: PricingRatesConfig | null = null;

function parsePositiveNum(val: unknown, fallback: number): number {
  if (val === undefined || val === null || val === '') return fallback;
  const n = typeof val === 'number' ? val : parseFloat(String(val));
  return !isNaN(n) && n >= 0 ? n : fallback;
}

/**
 * Reads the active pricing rates configuration.
 * Prioritizes in-memory cache, then persistent disk JSON, then Supabase settings, then default constants.
 */
export async function getAdminPricingRates(): Promise<PricingRatesConfig> {
  if (inMemoryPricingCache) {
    return inMemoryPricingCache;
  }

  try {
    if (fs.existsSync(PRICING_JSON_PATH)) {
      const fileData = fs.readFileSync(PRICING_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      const merged: PricingRatesConfig = {
        ...DEFAULT_PRICING_RATES,
        ...parsed,
        contractedBathrooms: {
          ...DEFAULT_PRICING_RATES.contractedBathrooms,
          ...(parsed.contractedBathrooms || {}),
        },
        deepCleanExtraBedroom: {
          ...DEFAULT_PRICING_RATES.deepCleanExtraBedroom,
          ...(parsed.deepCleanExtraBedroom || {}),
        },
        storeySurcharges: {
          ...DEFAULT_PRICING_RATES.storeySurcharges,
          ...(parsed.storeySurcharges || {}),
        },
        hourlyRates: {
          ...DEFAULT_PRICING_RATES.hourlyRates,
          ...(parsed.hourlyRates || {}),
        },
      };
      inMemoryPricingCache = merged;
      const { setPricingRates } = await import('@/lib/data/pricingConfig');
      setPricingRates(merged);
      return merged;
    }
  } catch (err) {
    console.warn('[getAdminPricingRates] Could not read local file, falling back:', err);
  }

  // Attempt to read from Supabase settings if available
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('pricing_settings')
      .select('settings_data')
      .eq('key', 'active_pricing_rates')
      .maybeSingle();

    if (!error && data?.settings_data) {
      const parsed = data.settings_data as PricingRatesConfig;
      const merged: PricingRatesConfig = {
        ...DEFAULT_PRICING_RATES,
        ...parsed,
        contractedBathrooms: {
          ...DEFAULT_PRICING_RATES.contractedBathrooms,
          ...(parsed.contractedBathrooms || {}),
        },
        deepCleanExtraBedroom: {
          ...DEFAULT_PRICING_RATES.deepCleanExtraBedroom,
          ...(parsed.deepCleanExtraBedroom || {}),
        },
        storeySurcharges: {
          ...DEFAULT_PRICING_RATES.storeySurcharges,
          ...(parsed.storeySurcharges || {}),
        },
        hourlyRates: {
          ...DEFAULT_PRICING_RATES.hourlyRates,
          ...(parsed.hourlyRates || {}),
        },
      };
      inMemoryPricingCache = merged;
      const { setPricingRates } = await import('@/lib/data/pricingConfig');
      setPricingRates(merged);
      return merged;
    }
  } catch {
    // Table may not exist yet in Supabase, ignore
  }

  inMemoryPricingCache = DEFAULT_PRICING_RATES;
  return DEFAULT_PRICING_RATES;
}

/**
 * Validates and updates the pricing rates configuration.
 * Persists to disk, memory cache, and syncs with Supabase if table is present.
 */
export async function saveAdminPricingRates(
  rates: Partial<PricingRatesConfig>,
  updatedBy: string = 'admin@handcleaned.com.au'
): Promise<{ success: boolean; error: string | null; data?: PricingRatesConfig }> {
  try {
    const current = await getAdminPricingRates();

    const updatedConfig: PricingRatesConfig = {
      extraFullBathroomFee: parsePositiveNum(rates.extraFullBathroomFee, current.extraFullBathroomFee),
      extraHalfBathroomFee: parsePositiveNum(rates.extraHalfBathroomFee, current.extraHalfBathroomFee),
      contractedBathrooms: {
        studio: parsePositiveNum(rates.contractedBathrooms?.studio, current.contractedBathrooms.studio),
        oneBed: parsePositiveNum(rates.contractedBathrooms?.oneBed, current.contractedBathrooms.oneBed),
        twoPlusBeds: parsePositiveNum(rates.contractedBathrooms?.twoPlusBeds, current.contractedBathrooms.twoPlusBeds),
      },
      deepCleanExtraBedroom: {
        extraBedroomFee: parsePositiveNum(rates.deepCleanExtraBedroom?.extraBedroomFee, current.deepCleanExtraBedroom.extraBedroomFee),
        includedBedrooms: Math.round(parsePositiveNum(rates.deepCleanExtraBedroom?.includedBedrooms, current.deepCleanExtraBedroom.includedBedrooms)),
      },
      storeySurcharges: {
        standardTwoStorey: parsePositiveNum(rates.storeySurcharges?.standardTwoStorey, current.storeySurcharges.standardTwoStorey),
        standardThreeStorey: parsePositiveNum(rates.storeySurcharges?.standardThreeStorey, current.storeySurcharges.standardThreeStorey),
        deepTwoStorey: parsePositiveNum(rates.storeySurcharges?.deepTwoStorey, current.storeySurcharges.deepTwoStorey),
        deepThreeStorey: parsePositiveNum(rates.storeySurcharges?.deepThreeStorey, current.storeySurcharges.deepThreeStorey),
      },
      hourlyRates: {
        regularCleaningPerHour: parsePositiveNum(rates.hourlyRates?.regularCleaningPerHour, current.hourlyRates.regularCleaningPerHour),
        deepCleaningPerHour: parsePositiveNum(rates.hourlyRates?.deepCleaningPerHour, current.hourlyRates.deepCleaningPerHour),
        commercialCleaningPerHour: parsePositiveNum(rates.hourlyRates?.commercialCleaningPerHour, current.hourlyRates.commercialCleaningPerHour),
      },
      updatedAt: new Date().toISOString(),
      updatedBy,
    };

    // 1. Update in-memory runtime cache immediately
    inMemoryPricingCache = updatedConfig;
    const { setPricingRates } = await import('@/lib/data/pricingConfig');
    setPricingRates(updatedConfig);

    // 2. Write to local disk file
    try {
      const dir = path.dirname(PRICING_JSON_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(PRICING_JSON_PATH, JSON.stringify(updatedConfig, null, 2), 'utf-8');
    } catch (writeErr) {
      console.warn('[saveAdminPricingRates] Disk write warning (read-only/serverless environment):', writeErr);
    }

    // 3. Best-effort sync with Supabase
    try {
      const supabase = getClient();
      await supabase.from('pricing_settings').upsert({
        key: 'active_pricing_rates',
        settings_data: updatedConfig,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Table may not exist yet, fallback to in-memory/disk is fine
    }

    return { success: true, error: null, data: updatedConfig };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[saveAdminPricingRates Error]:', msg);
    return { success: false, error: msg };
  }
}
