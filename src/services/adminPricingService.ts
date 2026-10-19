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

/**
 * Reads the active pricing rates configuration.
 * Prioritizes persistent disk JSON, then Supabase settings, then default constants.
 */
export async function getAdminPricingRates(): Promise<PricingRatesConfig> {
  try {
    if (fs.existsSync(PRICING_JSON_PATH)) {
      const fileData = fs.readFileSync(PRICING_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      return {
        ...DEFAULT_PRICING_RATES,
        ...parsed,
      };
    }
  } catch (err) {
    console.warn('[getAdminPricingRates] Could not read local file, falling back:', err);
  }

  // Attempt to read from Supabase settings if available
  try {
    const supabase = getClient();
    const { data } = await supabase
      .from('pricing_settings')
      .select('settings_data')
      .eq('key', 'active_pricing_rates')
      .maybeSingle();

    if (data?.settings_data) {
      return {
        ...DEFAULT_PRICING_RATES,
        ...(data.settings_data as PricingRatesConfig),
      };
    }
  } catch {
    // Table may not exist yet in Supabase, ignore
  }

  return DEFAULT_PRICING_RATES;
}

/**
 * Validates and updates the pricing rates configuration.
 * Persists to disk and syncs with Supabase if table is present.
 */
export async function saveAdminPricingRates(
  rates: Partial<PricingRatesConfig>,
  updatedBy: string = 'admin@handcleaned.com.au'
): Promise<{ success: boolean; error: string | null; data?: PricingRatesConfig }> {
  try {
    const current = await getAdminPricingRates();

    const updatedConfig: PricingRatesConfig = {
      extraFullBathroomFee:
        typeof rates.extraFullBathroomFee === 'number' && rates.extraFullBathroomFee >= 0
          ? rates.extraFullBathroomFee
          : current.extraFullBathroomFee,
      extraHalfBathroomFee:
        typeof rates.extraHalfBathroomFee === 'number' && rates.extraHalfBathroomFee >= 0
          ? rates.extraHalfBathroomFee
          : current.extraHalfBathroomFee,
      contractedBathrooms: {
        studio:
          typeof rates.contractedBathrooms?.studio === 'number' && rates.contractedBathrooms.studio >= 0
            ? rates.contractedBathrooms.studio
            : current.contractedBathrooms.studio,
        oneBed:
          typeof rates.contractedBathrooms?.oneBed === 'number' && rates.contractedBathrooms.oneBed >= 0
            ? rates.contractedBathrooms.oneBed
            : current.contractedBathrooms.oneBed,
        twoPlusBeds:
          typeof rates.contractedBathrooms?.twoPlusBeds === 'number' && rates.contractedBathrooms.twoPlusBeds >= 0
            ? rates.contractedBathrooms.twoPlusBeds
            : current.contractedBathrooms.twoPlusBeds,
      },
      deepCleanExtraBedroom: {
        extraBedroomFee:
          typeof rates.deepCleanExtraBedroom?.extraBedroomFee === 'number' && rates.deepCleanExtraBedroom.extraBedroomFee >= 0
            ? rates.deepCleanExtraBedroom.extraBedroomFee
            : current.deepCleanExtraBedroom.extraBedroomFee,
        includedBedrooms:
          typeof rates.deepCleanExtraBedroom?.includedBedrooms === 'number' && rates.deepCleanExtraBedroom.includedBedrooms >= 0
            ? rates.deepCleanExtraBedroom.includedBedrooms
            : current.deepCleanExtraBedroom.includedBedrooms,
      },
      storeySurcharges: {
        standardTwoStorey:
          typeof rates.storeySurcharges?.standardTwoStorey === 'number' && rates.storeySurcharges.standardTwoStorey >= 0
            ? rates.storeySurcharges.standardTwoStorey
            : current.storeySurcharges.standardTwoStorey,
        standardThreeStorey:
          typeof rates.storeySurcharges?.standardThreeStorey === 'number' && rates.storeySurcharges.standardThreeStorey >= 0
            ? rates.storeySurcharges.standardThreeStorey
            : current.storeySurcharges.standardThreeStorey,
        deepTwoStorey:
          typeof rates.storeySurcharges?.deepTwoStorey === 'number' && rates.storeySurcharges.deepTwoStorey >= 0
            ? rates.storeySurcharges.deepTwoStorey
            : current.storeySurcharges.deepTwoStorey,
        deepThreeStorey:
          typeof rates.storeySurcharges?.deepThreeStorey === 'number' && rates.storeySurcharges.deepThreeStorey >= 0
            ? rates.storeySurcharges.deepThreeStorey
            : current.storeySurcharges.deepThreeStorey,
      },
      hourlyRates: {
        regularCleaningPerHour:
          typeof rates.hourlyRates?.regularCleaningPerHour === 'number' && rates.hourlyRates.regularCleaningPerHour >= 0
            ? rates.hourlyRates.regularCleaningPerHour
            : current.hourlyRates.regularCleaningPerHour,
        deepCleaningPerHour:
          typeof rates.hourlyRates?.deepCleaningPerHour === 'number' && rates.hourlyRates.deepCleaningPerHour >= 0
            ? rates.hourlyRates.deepCleaningPerHour
            : current.hourlyRates.deepCleaningPerHour,
        commercialCleaningPerHour:
          typeof rates.hourlyRates?.commercialCleaningPerHour === 'number' && rates.hourlyRates.commercialCleaningPerHour >= 0
            ? rates.hourlyRates.commercialCleaningPerHour
            : current.hourlyRates.commercialCleaningPerHour,
      },
      updatedAt: new Date().toISOString(),
      updatedBy,
    };

    // 1. Write to local disk file
    try {
      fs.writeFileSync(PRICING_JSON_PATH, JSON.stringify(updatedConfig, null, 2), 'utf-8');
    } catch (writeErr) {
      console.error('[saveAdminPricingRates] Disk write error:', writeErr);
    }

    // 2. Optionally sync with Supabase
    try {
      const supabase = getClient();
      await supabase.from('pricing_settings').upsert({
        key: 'active_pricing_rates',
        settings_data: updatedConfig,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Table may not exist yet, fallback to file only is fine
    }

    return { success: true, error: null, data: updatedConfig };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[saveAdminPricingRates Error]:', msg);
    return { success: false, error: msg };
  }
}
