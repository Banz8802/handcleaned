'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { PricingRatesConfig } from '@/lib/data/pricingConfig';
import { savePricingRatesAction } from '@/app/actions/adminActions';
import { calculateExtraBathroomFee, getContractedBathrooms } from '@/lib/data/pricingConfig';

export type PricingRatesFormState = {
  extraFullBathroomFee: number | string;
  extraHalfBathroomFee: number | string;
  contractedBathrooms: {
    studio: number | string;
    oneBed: number | string;
    twoPlusBeds: number | string;
  };
  deepCleanExtraBedroom: {
    extraBedroomFee: number | string;
    includedBedrooms: number | string;
  };
  storeySurcharges: {
    standardTwoStorey: number | string;
    standardThreeStorey: number | string;
    deepTwoStorey: number | string;
    deepThreeStorey: number | string;
  };
  hourlyRates: {
    regularCleaningPerHour: number | string;
    deepCleaningPerHour: number | string;
    commercialCleaningPerHour: number | string;
  };
  updatedAt?: string;
  updatedBy?: string;
};

interface PricingViewProps {
  initialRates: PricingRatesConfig;
}

const toNum = (val: number | string | undefined, fallback: number = 0): number => {
  if (typeof val === 'number') return val;
  if (!val && val !== '0') return fallback;
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? fallback : parsed;
};

export function PricingView({ initialRates }: PricingViewProps) {
  const router = useRouter();
  const [rates, setRates] = useState<PricingRatesFormState>(initialRates);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  // Test Simulator State
  const [simBedrooms, setSimBedrooms] = useState<string>('1');
  const [simBathrooms, setSimBathrooms] = useState<string>('2.5');

  const handleBathroomRateChange = (field: 'extraFullBathroomFee' | 'extraHalfBathroomFee', val: string) => {
    setRates((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleContractedBathChange = (field: 'studio' | 'oneBed' | 'twoPlusBeds', val: string) => {
    setRates((prev) => ({
      ...prev,
      contractedBathrooms: {
        ...prev.contractedBathrooms,
        [field]: val,
      },
    }));
  };

  const handleStoreyChange = (
    field: 'standardTwoStorey' | 'standardThreeStorey' | 'deepTwoStorey' | 'deepThreeStorey',
    val: string
  ) => {
    setRates((prev) => ({
      ...prev,
      storeySurcharges: {
        ...prev.storeySurcharges,
        [field]: val,
      },
    }));
  };

  const handleBedroomFeeChange = (
    field: 'extraBedroomFee' | 'includedBedrooms',
    val: string
  ) => {
    setRates((prev) => ({
      ...prev,
      deepCleanExtraBedroom: {
        ...prev.deepCleanExtraBedroom,
        [field]: val,
      },
    }));
  };

  const handleHourlyChange = (
    field: 'regularCleaningPerHour' | 'deepCleaningPerHour' | 'commercialCleaningPerHour',
    val: string
  ) => {
    setRates((prev) => ({
      ...prev,
      hourlyRates: {
        ...prev.hourlyRates,
        [field]: val,
      },
    }));
  };

  const handleSave = () => {
    setSaveStatus({ type: 'idle' });
    startTransition(async () => {
      const payload: PricingRatesConfig = {
        extraFullBathroomFee: toNum(rates.extraFullBathroomFee, 25),
        extraHalfBathroomFee: toNum(rates.extraHalfBathroomFee, 15),
        contractedBathrooms: {
          studio: toNum(rates.contractedBathrooms.studio, 1),
          oneBed: toNum(rates.contractedBathrooms.oneBed, 1.5),
          twoPlusBeds: toNum(rates.contractedBathrooms.twoPlusBeds, 2),
        },
        deepCleanExtraBedroom: {
          extraBedroomFee: toNum(rates.deepCleanExtraBedroom.extraBedroomFee, 10),
          includedBedrooms: Math.round(toNum(rates.deepCleanExtraBedroom.includedBedrooms, 2)),
        },
        storeySurcharges: {
          standardTwoStorey: toNum(rates.storeySurcharges.standardTwoStorey, 21),
          standardThreeStorey: toNum(rates.storeySurcharges.standardThreeStorey, 42),
          deepTwoStorey: toNum(rates.storeySurcharges.deepTwoStorey, 31.5),
          deepThreeStorey: toNum(rates.storeySurcharges.deepThreeStorey, 63),
        },
        hourlyRates: {
          regularCleaningPerHour: toNum(rates.hourlyRates.regularCleaningPerHour, 60),
          deepCleaningPerHour: toNum(rates.hourlyRates.deepCleaningPerHour, 68),
          commercialCleaningPerHour: toNum(rates.hourlyRates.commercialCleaningPerHour, 65),
        },
      };

      const res = await savePricingRatesAction(payload);
      if (res.success) {
        if (res.data) {
          setRates(res.data);
        }
        setSaveStatus({
          type: 'success',
          message: 'Pricing rates and bathroom policies successfully updated and saved across all booking systems.',
        });
        router.refresh();
      } else {
        setSaveStatus({
          type: 'error',
          message: res.error || 'Failed to save pricing rates. Please try again.',
        });
      }
    });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all rates back to the original company defaults?')) {
      const defaultReset: PricingRatesConfig = {
        extraFullBathroomFee: 25.0,
        extraHalfBathroomFee: 15.0,
        contractedBathrooms: {
          studio: 1.0,
          oneBed: 1.5,
          twoPlusBeds: 2.0,
        },
        deepCleanExtraBedroom: {
          extraBedroomFee: 10.0,
          includedBedrooms: 2,
        },
        storeySurcharges: {
          standardTwoStorey: 21.0,
          standardThreeStorey: 42.0,
          deepTwoStorey: 31.5,
          deepThreeStorey: 63.0,
        },
        hourlyRates: {
          regularCleaningPerHour: 60.0,
          deepCleaningPerHour: 68.0,
          commercialCleaningPerHour: 65.0,
        },
      };
      setRates(defaultReset);
      setSaveStatus({
        type: 'idle',
      });
    }
  };

  // Live Simulator Calculations using current active rates
  const activeRatesForSim: PricingRatesConfig = {
    extraFullBathroomFee: toNum(rates.extraFullBathroomFee, 25),
    extraHalfBathroomFee: toNum(rates.extraHalfBathroomFee, 15),
    contractedBathrooms: {
      studio: toNum(rates.contractedBathrooms.studio, 1),
      oneBed: toNum(rates.contractedBathrooms.oneBed, 1.5),
      twoPlusBeds: toNum(rates.contractedBathrooms.twoPlusBeds, 2),
    },
    deepCleanExtraBedroom: {
      extraBedroomFee: toNum(rates.deepCleanExtraBedroom.extraBedroomFee, 10),
      includedBedrooms: Math.round(toNum(rates.deepCleanExtraBedroom.includedBedrooms, 2)),
    },
    storeySurcharges: {
      standardTwoStorey: toNum(rates.storeySurcharges.standardTwoStorey, 21),
      standardThreeStorey: toNum(rates.storeySurcharges.standardThreeStorey, 42),
      deepTwoStorey: toNum(rates.storeySurcharges.deepTwoStorey, 31.5),
      deepThreeStorey: toNum(rates.storeySurcharges.deepThreeStorey, 63),
    },
    hourlyRates: {
      regularCleaningPerHour: toNum(rates.hourlyRates.regularCleaningPerHour, 60),
      deepCleaningPerHour: toNum(rates.hourlyRates.deepCleaningPerHour, 68),
      commercialCleaningPerHour: toNum(rates.hourlyRates.commercialCleaningPerHour, 65),
    },
  };

  const simContracted = getContractedBathrooms(simBedrooms, activeRatesForSim);
  const simExcessFee = calculateExtraBathroomFee(simBedrooms, simBathrooms, activeRatesForSim);
  const parsedSimBaths = parseFloat(simBathrooms.replace('+', '')) || 1;
  const simExcessBaths = Math.max(0, parsedSimBaths - simContracted);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── TOP HEADER & SAVE BAR ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00AEEF] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#17739C]">
              Admin Rate Management
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A2E44] tracking-tight">
            Pricing Rates & Bathroom Policies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Configure live turnover rates, excess bathroom surcharges, contracted allowances, and hourly fees.
            Changes update website booking calculators and checkout sessions immediately.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 flex-wrap">
          <Link
            href="/admin/pricelist"
            className="px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs font-bold text-[#008080] hover:bg-teal-100 transition-colors inline-flex items-center gap-1.5"
          >
            <svg className="w-4 h-4 text-[#008080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Price List & PDF Export →
          </Link>
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#00AEEF] text-white text-xs font-bold hover:bg-[#0098d4] transition-all shadow-md shadow-[#00AEEF]/20 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Save All Rates</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Notification Banner */}
      {saveStatus.type !== 'idle' && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 transition-all ${
            saveStatus.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <div className="flex-1">
            <p className="font-bold">
              {saveStatus.type === 'success' ? 'Update Successful' : 'Save Error'}
            </p>
            <p className="text-xs mt-0.5">{saveStatus.message}</p>
          </div>
        </div>
      )}

      {/* ── SECTION 1: ADDITIONAL BATHROOM FEATURE & CONTRACT ALLOWANCES ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00AEEF] block mb-1">
              Feature Configuration
            </span>
            <h2 className="text-xl font-bold text-[#1A2E44]">
              Additional Bathroom Rates & Contract Limits
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure how much is charged when bathroom counts exceed the initially contracted tier.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#00AEEF]/10 text-[#00AEEF] font-extrabold text-xs self-start sm:self-auto">
            Active in Booking Flow
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Rate Inputs */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                1. Excess Bathroom Surcharges (AUD)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Additional Full Bathroom ($)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">Charged per +1.0 full bathroom excess</p>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={rates.extraFullBathroomFee}
                      onChange={(e) => handleBathroomRateChange('extraFullBathroomFee', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Additional Half Bathroom ($)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">Charged per +0.5 powder room / half bath</p>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={rates.extraHalfBathroomFee}
                      onChange={(e) => handleBathroomRateChange('extraHalfBathroomFee', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Allowance Inputs */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                2. Base Contract Allowances (Included Baths)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Studio
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">Base allowance</p>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={rates.contractedBathrooms.studio}
                    onChange={(e) => handleContractedBathChange('studio', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    1 Bedroom
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">Base allowance</p>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={rates.contractedBathrooms.oneBed}
                    onChange={(e) => handleContractedBathChange('oneBed', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2 to 5 Beds
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">Base allowance</p>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={rates.contractedBathrooms.twoPlusBeds}
                    onChange={(e) => handleContractedBathChange('twoPlusBeds', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live Simulator Widget */}
          <div className="bg-gradient-to-br from-[#1A2E44] to-[#243d58] text-white p-6 rounded-2xl shadow-md border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2CBAE8]">
                Interactive Surcharge Simulator
              </span>
              <span className="text-[10px] font-semibold bg-white/10 px-2.5 py-1 rounded-full text-gray-300">
                Live Calculation
              </span>
            </div>

            <p className="text-xs text-gray-300 mb-5">
              Test how the booking form calculates extra bathroom surcharges in real-time with the configured rates above.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Bedrooms:
                </label>
                <select
                  value={simBedrooms}
                  onChange={(e) => setSimBedrooms(e.target.value)}
                  className="w-full bg-[#1A2E44] border border-white/20 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2CBAE8]"
                >
                  <option value="Studio">Studio</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="5">5 Bedrooms</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Bathrooms Selected:
                </label>
                <select
                  value={simBathrooms}
                  onChange={(e) => setSimBathrooms(e.target.value)}
                  className="w-full bg-[#1A2E44] border border-white/20 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2CBAE8]"
                >
                  <option value="1">1 Bath</option>
                  <option value="1.5">1.5 Baths</option>
                  <option value="2">2 Baths</option>
                  <option value="2.5">2.5 Baths</option>
                  <option value="3">3 Baths</option>
                  <option value="3.5">3.5 Baths</option>
                  <option value="4+">4+ Baths</option>
                </select>
              </div>
            </div>

            {/* Results Output */}
            <div className="bg-black/25 rounded-xl p-4 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Contract Base Allowance:</span>
                <span className="font-bold text-white">{simContracted} Bath(s)</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Excess Above Contract:</span>
                <span className={`font-bold ${simExcessBaths > 0 ? 'text-[#FFE67B]' : 'text-emerald-400'}`}>
                  {simExcessBaths > 0 ? `+${simExcessBaths} Bath(s)` : 'None (Included)'}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                <span className="font-bold text-white">Extra Surcharge Added:</span>
                <span className="text-xl font-black text-[#2CBAE8]">
                  +${simExcessFee.toFixed(2)} AUD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2 & 3: STOREY & EXTRA BEDROOM POLICIES ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Storey Surcharges */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="mb-5 pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00AEEF] block mb-1">
              Storey Fees
            </span>
            <h2 className="text-lg font-bold text-[#1A2E44]">Storey Configuration Surcharges</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-storey turnover adjustments for 2-storey and 3-storey properties.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Standard 2-Storey ($)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={rates.storeySurcharges.standardTwoStorey}
                  onChange={(e) => handleStoreyChange('standardTwoStorey', e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Standard 3-Storey ($)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={rates.storeySurcharges.standardThreeStorey}
                  onChange={(e) => handleStoreyChange('standardThreeStorey', e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deep Clean 2-Storey ($)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={rates.storeySurcharges.deepTwoStorey}
                  onChange={(e) => handleStoreyChange('deepTwoStorey', e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deep Clean 3-Storey ($)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={rates.storeySurcharges.deepThreeStorey}
                  onChange={(e) => handleStoreyChange('deepThreeStorey', e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Extra Bedroom Policy */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="mb-5 pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00AEEF] block mb-1">
              Deep Clean Policy
            </span>
            <h2 className="text-lg font-bold text-[#1A2E44]">Extra Bedroom Surcharges</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Applies to Initial / Deep Cleaning package when listings have &gt; 2 bedrooms.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fee Per Extra Bedroom ($)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={rates.deepCleanExtraBedroom.extraBedroomFee}
                  onChange={(e) => handleBedroomFeeChange('extraBedroomFee', e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Included Base Bedrooms
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={rates.deepCleanExtraBedroom.includedBedrooms}
                onChange={(e) => handleBedroomFeeChange('includedBedrooms', e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: HOURLY CLEANING RATES ────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="mb-5 pb-3 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00AEEF] block mb-1">
            Hourly Service Rates
          </span>
          <h2 className="text-lg font-bold text-[#1A2E44]">Hourly Cleaning Rates (Per Cleaner / Hour)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hourly base rates for Residential regular &amp; deep cleans, and Commercial properties.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Residential Regular ($/hr)
            </label>
            <p className="text-[11px] text-slate-500 mb-2">Standard weekly/fortnightly cleans</p>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400 text-sm">$</span>
              <input
                type="number"
                step="1"
                min="0"
                value={rates.hourlyRates.regularCleaningPerHour}
                onChange={(e) => handleHourlyChange('regularCleaningPerHour', e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Residential Deep ($/hr)
            </label>
            <p className="text-[11px] text-slate-500 mb-2">Detailed scrub &amp; end-of-lease</p>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400 text-sm">$</span>
              <input
                type="number"
                step="1"
                min="0"
                value={rates.hourlyRates.deepCleaningPerHour}
                onChange={(e) => handleHourlyChange('deepCleaningPerHour', e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Commercial Cleaning ($/hr)
            </label>
            <p className="text-[11px] text-slate-500 mb-2">Offices &amp; commercial premises</p>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400 text-sm">$</span>
              <input
                type="number"
                step="1"
                min="0"
                value={rates.hourlyRates.commercialCleaningPerHour}
                onChange={(e) => handleHourlyChange('commercialCleaningPerHour', e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
