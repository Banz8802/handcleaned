-- ==============================================================================
-- HANDCLEANED CRM: SUPABASE PERSISTENCE & RLS SCHEMA
-- Run this complete script in your Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/wqhssazzsdswtjqjpyam/sql/new
-- ==============================================================================

-- 1. Create unified app_settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- 2. Create specific settings tables for backward compatibility
CREATE TABLE IF NOT EXISTS public.pricing_settings (
  key TEXT PRIMARY KEY,
  settings_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS public.site_content_settings (
  key TEXT PRIMARY KEY,
  content_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content_settings ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for app_settings (Allow public anon & authenticated read/write)
DROP POLICY IF EXISTS "Allow all access to app_settings" ON public.app_settings;
CREATE POLICY "Allow all access to app_settings"
  ON public.app_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Create RLS Policies for pricing_settings
DROP POLICY IF EXISTS "Allow all access to pricing_settings" ON public.pricing_settings;
CREATE POLICY "Allow all access to pricing_settings"
  ON public.pricing_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. Create RLS Policies for site_content_settings
DROP POLICY IF EXISTS "Allow all access to site_content_settings" ON public.site_content_settings;
CREATE POLICY "Allow all access to site_content_settings"
  ON public.site_content_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 7. Ensure bookings table exists and has RLS policies for booking creation & management
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
    ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow public booking insert" ON public.bookings;
    CREATE POLICY "Allow public booking insert"
      ON public.bookings
      FOR INSERT
      WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public booking select" ON public.bookings;
    CREATE POLICY "Allow public booking select"
      ON public.bookings
      FOR SELECT
      USING (true);

    DROP POLICY IF EXISTS "Allow public booking update" ON public.bookings;
    CREATE POLICY "Allow public booking update"
      ON public.bookings
      FOR UPDATE
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 8. Seed Initial Pricing Rates into app_settings (if not already set)
INSERT INTO public.app_settings (key, value, updated_at, updated_by)
VALUES (
  'pricing_rates',
  '{
    "extraFullBathroomFee": 25,
    "extraHalfBathroomFee": 15,
    "contractedBathrooms": {
      "studio": 1,
      "oneBed": 1.5,
      "twoPlusBeds": 2
    },
    "deepCleanExtraBedroom": {
      "extraBedroomFee": 10,
      "includedBedrooms": 2
    },
    "storeySurcharges": {
      "standardTwoStorey": 21,
      "standardThreeStorey": 42,
      "deepTwoStorey": 31.5,
      "deepThreeStorey": 63
    },
    "hourlyRates": {
      "regularCleaningPerHour": 60,
      "deepCleaningPerHour": 68,
      "commercialCleaningPerHour": 65
    }
  }'::jsonb,
  NOW(),
  'system'
)
ON CONFLICT (key) DO NOTHING;
