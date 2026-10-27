'use client';

import React, { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type {
  PricelistConfig,
  PricelistCategory,
  PricelistItem,
  BgThemeType,
  CardStyleType,
  HeaderLayoutType,
} from '@/lib/data/pricelistConfig';
import { savePricelistAction, resetPricelistAction } from '@/app/actions/adminActions';
import { PricelistDocument } from './PricelistDocument';

interface PricelistViewProps {
  initialConfig: PricelistConfig;
}

const LOGO_PRESETS = [
  { name: 'Handcleaned Primary Logo', url: '/images/hand-cleaning-logo.png' },
  { name: 'Invoice Header Logo', url: '/images/invoice-header-logo.png' },
  { name: 'Admin Brand Logo', url: '/images/admin-logo.png' },
];

const ACCENT_COLORS = [
  { name: 'Brand Teal', hex: '#008080' },
  { name: 'Deep Navy', hex: '#1A2E44' },
  { name: 'Sky Cyan', hex: '#00AEEF' },
  { name: 'Warm Gold', hex: '#D97706' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Royal Indigo', hex: '#4F46E5' },
];

const BG_THEMES: { id: BgThemeType; name: string; bg: string; border: string }[] = [
  { id: 'slate', name: 'Crisp Slate', bg: '#F8FAFC', border: '#E2E8F0' },
  { id: 'white', name: 'Pure White', bg: '#FFFFFF', border: '#E2E8F0' },
  { id: 'cream', name: 'Warm Cream', bg: '#FAF8F5', border: '#E7E2D9' },
  { id: 'tealTint', name: 'Teal Tint', bg: '#F0FDF9', border: '#CCFBF1' },
  { id: 'navy', name: 'Midnight Navy', bg: '#0B132B', border: '#1E293B' },
  { id: 'custom', name: 'Custom Color', bg: '#F1F5F9', border: '#CBD5E1' },
];

export function PricelistView({ initialConfig }: PricelistViewProps) {
  const router = useRouter();
  const [config, setConfig] = useState<PricelistConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<'preview' | 'prices' | 'branding' | 'styling' | 'footer'>('preview');
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<{ type: 'idle' | 'success' | 'error'; message?: string }>({
    type: 'idle',
  });
  const [selectedCatId, setSelectedCatId] = useState<string>(
    initialConfig.categories[0]?.id || ''
  );
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedCardIdsForExport, setSelectedCardIdsForExport] = useState<string[]>(
    initialConfig.categories.map((c) => c.id)
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleCardForExport = (cardId: string) => {
    setSelectedCardIdsForExport((prev) => {
      if (prev.includes(cardId)) {
        if (prev.length === 1) return prev; // Keep at least one card selected
        return prev.filter((id) => id !== cardId);
      } else {
        return [...prev, cardId];
      }
    });
  };

  const selectSingleCardForExport = (cardId: string) => {
    setSelectedCardIdsForExport([cardId]);
  };

  const selectTwoCardsForExport = (id1?: string, id2?: string) => {
    const first = id1 || config.categories[0]?.id;
    const second = id2 || config.categories[1]?.id || first;
    const cards = [first, second].filter(Boolean) as string[];
    setSelectedCardIdsForExport(Array.from(new Set(cards)));
  };

  const selectAllCardsForExport = () => {
    setSelectedCardIdsForExport(config.categories.map((c) => c.id));
  };

  // ── Price & Category Handlers ──────────────────────────────────────────────
  const handleUpdateCategory = (catId: string, field: keyof PricelistCategory, value: string) => {
    setConfig((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => (cat.id === catId ? { ...cat, [field]: value } : cat)),
    }));
  };

  const handleUpdateItem = (
    catId: string,
    itemId: string,
    field: keyof PricelistItem,
    value: string | number | boolean
  ) => {
    setConfig((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          items: cat.items.map((it) => {
            if (it.id !== itemId) return it;
            const parsedVal = field === 'price' ? parseFloat(String(value)) || 0 : value;
            return { ...it, [field]: parsedVal };
          }),
        };
      }),
    }));
  };

  const handleAddItem = (catId: string) => {
    const newItem: PricelistItem = {
      id: `item-${Date.now()}`,
      name: 'New Cleaning Service',
      description: 'Standard description of the inclusions',
      price: 99,
      unit: '/ clean',
    };

    setConfig((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === catId ? { ...cat, items: [...cat.items, newItem] } : cat
      ),
    }));
  };

  const handleDeleteItem = (catId: string, itemId: string) => {
    setConfig((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === catId ? { ...cat, items: cat.items.filter((it) => it.id !== itemId) } : cat
      ),
    }));
  };

  const handleAddCategory = () => {
    const newCategory: PricelistCategory = {
      id: `cat-${Date.now()}`,
      title: 'New Service Category',
      badge: 'Available',
      description: 'Description of the new specialized cleaning or facility services.',
      icon: 'sparkles',
      accentColor: config.customization.accentColor || '#008080',
      items: [
        {
          id: `item-${Date.now()}-1`,
          name: 'Standard Package',
          description: 'Basic inclusions and scope',
          price: 150,
          unit: '/ service',
        },
      ],
    };

    setConfig((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
    setSelectedCatId(newCategory.id);
  };

  const handleDeleteCategory = (catId: string) => {
    if (config.categories.length <= 1) {
      alert('You must have at least one category.');
      return;
    }
    if (confirm('Are you sure you want to delete this category and all its items?')) {
      setConfig((prev) => {
        const remaining = prev.categories.filter((cat) => cat.id !== catId);
        if (selectedCatId === catId && remaining.length > 0) {
          setSelectedCatId(remaining[0].id);
        }
        return { ...prev, categories: remaining };
      });
    }
  };

  // Bulk percentage adjustment (e.g. +5% or +10%)
  const handleBulkAdjustPrices = (percent: number) => {
    if (
      !confirm(
        `Are you sure you want to adjust ALL prices by ${percent > 0 ? `+${percent}` : percent}%?`
      )
    ) {
      return;
    }

    const factor = 1 + percent / 100;
    setConfig((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => ({
        ...cat,
        items: cat.items.map((it) => ({
          ...it,
          price: Math.round(it.price * factor * 100) / 100,
        })),
      })),
    }));
  };

  // ── Branding & Customization Handlers ─────────────────────────────────────
  const handleCustomizationChange = <K extends keyof PricelistConfig['customization']>(
    field: K,
    val: PricelistConfig['customization'][K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        [field]: val,
      },
    }));
  };

  const handleFooterChange = (field: keyof PricelistConfig['customization']['footer'], val: string) => {
    setConfig((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        footer: {
          ...prev.customization.footer,
          [field]: val,
        },
      },
    }));
  };

  // Logo File Upload (converts image to base64)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleCustomizationChange('logoUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Save & Reset Actions ───────────────────────────────────────────────────
  const handleSave = () => {
    setSaveStatus({ type: 'idle' });
    startTransition(async () => {
      const res = await savePricelistAction(config);
      if (res.success) {
        if (res.data) setConfig(res.data);
        setSaveStatus({
          type: 'success',
          message: 'Price list and customization settings saved successfully!',
        });
        router.refresh();
      } else {
        setSaveStatus({
          type: 'error',
          message: res.error || 'Failed to save price list.',
        });
      }
    });
  };

  const handleReset = () => {
    if (confirm('Reset all prices, categories, and branding back to company defaults?')) {
      startTransition(async () => {
        const res = await resetPricelistAction();
        if (res.success && res.data) {
          setConfig(res.data);
          setSelectedCatId(res.data.categories[0]?.id || '');
          setSaveStatus({
            type: 'success',
            message: 'Price list reset to default settings.',
          });
          router.refresh();
        }
      });
    }
  };

  // Trigger high-fidelity browser print to PDF
  const handleExportPDF = () => {
    window.print();
  };

  const currentCategory = config.categories.find((c) => c.id === selectedCatId) || config.categories[0];

  return (
    <div className="space-y-6">
      {/* ── PRINT-ONLY STYLESHEET ───────────────────────────────────────── */}
      <style jsx global>{`
        @media print {
          /* Hide non-document admin chrome */
          .no-print,
          .admin-shell-header,
          aside,
          nav,
          button,
          .print-hide {
            display: none !important;
          }

          body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }

          /* Ensure document and all its parts are visible */
          #printable-pricelist {
            position: relative !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 4mm 6mm !important;
            box-shadow: none !important;
            border: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            display: block !important;
            visibility: visible !important;
          }

          #printable-pricelist * {
            visibility: visible !important;
          }

          /* Repeating table header on every printed page */
          table.pricelist-print-table {
            display: table !important;
            width: 100% !important;
            border-collapse: collapse !important;
          }
          table.pricelist-print-table > thead.pricelist-doc-thead {
            display: table-header-group !important;
          }
          table.pricelist-print-table > tbody {
            display: table-row-group !important;
          }
          table.pricelist-print-table tr {
            display: table-row !important;
          }
          table.pricelist-print-table td {
            display: table-cell !important;
          }

          /* Explicitly display and format the header in print */
          #printable-pricelist .pricelist-doc-header {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            margin-bottom: 10px !important;
            padding-bottom: 8px !important;
          }

          /* Multi-card grid in print (2 columns) */
          #printable-pricelist .pricelist-cards-grid.multi-cards-grid,
          #printable-pricelist .pricelist-cards-grid:not(.single-card-grid) {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
            width: 100% !important;
            margin-bottom: 12px !important;
          }

          /* If only 1 card is selected, align center in print / PDF */
          #printable-pricelist .pricelist-cards-grid.single-card-grid {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            max-width: 540px !important;
            margin: 0 auto 12px auto !important;
          }

          #printable-pricelist .pricelist-cards-grid.single-card-grid > div {
            width: 100% !important;
            max-width: 540px !important;
            margin: 0 auto !important;
          }

          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          @page {
            size: A4 portrait;
            margin: 6mm;
          }
        }
      `}</style>

      {/* ── TOP ACTION & TITLE BAR ───────────────────────────────────────── */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008080] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">
              Rate Card & PDF Manager
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A2E44] tracking-tight">
            Service Price List & PDF Rate Card
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Edit live prices, organize categories into cards, customize branding (logo, colors, background, and title),
            and export high-resolution branded PDF rate cards.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0">
          <Link
            href="/admin/pricing"
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Formula Settings
          </Link>

          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="px-5 py-2 rounded-xl bg-[#008080] text-white text-xs font-bold hover:bg-[#006e6e] transition-all shadow-md shadow-[#008080]/20 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── NOTIFICATION ALERT ──────────────────────────────────────────── */}
      {saveStatus.type !== 'idle' && (
        <div
          className={`no-print p-4 rounded-xl text-xs font-medium flex items-center justify-between border ${
            saveStatus.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {saveStatus.type === 'success' ? (
              <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span>{saveStatus.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveStatus({ type: 'idle' })}
            className="text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── NAVIGATION TABS ─────────────────────────────────────────────── */}
      <div className="no-print border-b border-slate-200 flex flex-wrap gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'preview'
              ? 'border-[#008080] text-[#008080] bg-white shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Live PDF Preview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('prices')}
          className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'prices'
              ? 'border-[#008080] text-[#008080] bg-white shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Edit Prices & Cards ({config.categories.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'branding'
              ? 'border-[#008080] text-[#008080] bg-white shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Logo & Header Title
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('styling')}
          className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'styling'
              ? 'border-[#008080] text-[#008080] bg-white shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Background & Theme
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'footer'
              ? 'border-[#008080] text-[#008080] bg-white shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Footer Contact Info
        </button>
      </div>

      {/* ── TAB 1: LIVE PREVIEW & EXPORT ────────────────────────────────── */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          {/* Card Selection Selector for PDF Export */}
          <div className="no-print bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    Cards to Include in PDF:
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-[#008080] border border-teal-200">
                    {selectedCardIdsForExport.length === 1
                      ? '1 Card Selected (Single Page)'
                      : selectedCardIdsForExport.length === 2
                      ? '2 Cards Selected (Fits 1 A4 Page)'
                      : `${selectedCardIdsForExport.length} of ${config.categories.length} Cards`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Choose preset or click any card to include/exclude it:
                </p>
              </div>

              {/* Quick Presets for 1 card, 2 cards, or all */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={selectAllCardsForExport}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    selectedCardIdsForExport.length === config.categories.length
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All Cards ({config.categories.length})
                </button>

                <button
                  type="button"
                  onClick={() => selectSingleCardForExport(selectedCatId || config.categories[0]?.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    selectedCardIdsForExport.length === 1
                      ? 'bg-[#008080] text-white border-[#008080]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Just 1 Card
                </button>

                <button
                  type="button"
                  onClick={() => selectTwoCardsForExport()}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    selectedCardIdsForExport.length === 2
                      ? 'bg-[#008080] text-white border-[#008080]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Just 2 Cards
                </button>
              </div>
            </div>

            {/* Individual Card Chips to toggle */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
              {config.categories.map((cat) => {
                const isSelected = selectedCardIdsForExport.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCardForExport(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-teal-50 border-teal-300 text-[#008080] font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                        isSelected
                          ? 'bg-[#008080] text-white'
                          : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                    <span>{cat.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="no-print bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                <strong>Document Preview:</strong> Exporting <strong>{selectedCardIdsForExport.length}</strong> {selectedCardIdsForExport.length === 1 ? 'card' : 'cards'} to PDF.
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 font-semibold text-slate-700"
              >
                PDF Export Instructions
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                className="flex-1 sm:flex-none px-4 py-1.5 rounded-lg bg-[#008080] hover:bg-[#006e6e] text-white font-bold inline-flex items-center justify-center gap-1.5 shadow-xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print / Save as PDF ({selectedCardIdsForExport.length})
              </button>
            </div>
          </div>

          {/* Real rendered rate card */}
          <div className="p-2 sm:p-6 bg-slate-200/50 rounded-2xl border border-slate-300/80 overflow-x-auto shadow-inner">
            <PricelistDocument
              config={config}
              selectedCategoryIds={selectedCardIdsForExport}
            />
          </div>
        </div>
      )}

      {/* ── TAB 2: EDIT PRICES & CARDS ──────────────────────────────────── */}
      {activeTab === 'prices' && (
        <div className="no-print space-y-6">
          {/* Quick Bulk Adjust Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-50 text-[#008080]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-800">Batch Price Adjustment</h3>
                <p className="text-[11px] text-slate-500">
                  Quickly adjust all service prices across all categories simultaneously
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleBulkAdjustPrices(5)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold hover:bg-slate-100 text-slate-700"
              >
                +5% Increase
              </button>
              <button
                type="button"
                onClick={() => handleBulkAdjustPrices(10)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold hover:bg-slate-100 text-slate-700"
              >
                +10% Increase
              </button>
              <button
                type="button"
                onClick={() => handleBulkAdjustPrices(-5)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold hover:bg-slate-100 text-slate-700"
              >
                -5% Discount
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-3 py-1.5 rounded-lg bg-[#008080] text-white text-xs font-bold hover:bg-[#006e6e] inline-flex items-center gap-1 shadow-xs"
              >
                + Add New Category
              </button>
            </div>
          </div>

          {/* Categories Selector Tabs */}
          <div className="flex overflow-x-auto gap-2 pb-2">
            {config.categories.map((cat, idx) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                  selectedCatId === cat.id
                    ? 'bg-[#1A2E44] text-white border-[#1A2E44] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{idx + 1}.</span>
                <span>{cat.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-inherit">
                  {cat.items.length}
                </span>
              </button>
            ))}
          </div>

          {/* Active Category Editor Card */}
          {currentCategory && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Category Header Form */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Category Card Title
                    </label>
                    <input
                      type="text"
                      value={currentCategory.title}
                      onChange={(e) => handleUpdateCategory(currentCategory.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#008080]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Badge Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={currentCategory.badge || ''}
                      onChange={(e) => handleUpdateCategory(currentCategory.id, 'badge', e.target.value)}
                      placeholder="e.g. Most Popular"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#008080]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Card Icon
                    </label>
                    <select
                      value={currentCategory.icon || 'sparkles'}
                      onChange={(e) => handleUpdateCategory(currentCategory.id, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#008080]"
                    >
                      <option value="home">Home / Residential</option>
                      <option value="sparkles">Sparkles / Clean</option>
                      <option value="building">Building / Commercial</option>
                      <option value="towel">Towel / Linen Hire</option>
                      <option value="tag">Tag / Surcharge</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Category Card Description
                    </label>
                    <input
                      type="text"
                      value={currentCategory.description || ''}
                      onChange={(e) => handleUpdateCategory(currentCategory.id, 'description', e.target.value)}
                      placeholder="Brief overview displayed at the top of this category card..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#008080]"
                    />
                  </div>
                </div>

                <div className="shrink-0 self-start md:self-center flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCardIdsForExport([currentCategory.id]);
                      setActiveTab('preview');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 text-[#008080] hover:bg-teal-100 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    📄 Export Only This Card
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(currentCategory.id)}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                  >
                    Delete Category
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Services & Price Items ({currentCategory.items.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleAddItem(currentCategory.id)}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 text-[#008080] hover:bg-teal-100 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {currentCategory.items.map((item, itIndex) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center gap-3"
                    >
                      <span className="w-5 text-center text-xs font-bold text-slate-400">
                        {itIndex + 1}
                      </span>

                      {/* Name & Description */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleUpdateItem(currentCategory.id, item.id, 'name', e.target.value)
                          }
                          placeholder="Service name (e.g. 2 Bed Turnover)"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold focus:outline-none focus:border-[#008080]"
                        />
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) =>
                            handleUpdateItem(currentCategory.id, item.id, 'description', e.target.value)
                          }
                          placeholder="Short description or inclusions..."
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 focus:outline-none focus:border-[#008080]"
                        />
                      </div>

                      {/* Price & Unit */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            $
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) =>
                              handleUpdateItem(currentCategory.id, item.id, 'price', e.target.value)
                            }
                            className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-extrabold text-[#1A2E44] text-right focus:outline-none focus:border-[#008080]"
                          />
                        </div>

                        <input
                          type="text"
                          value={item.unit || ''}
                          onChange={(e) =>
                            handleUpdateItem(currentCategory.id, item.id, 'unit', e.target.value)
                          }
                          placeholder="/ clean"
                          className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 focus:outline-none focus:border-[#008080]"
                        />

                        {/* Highlight Toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateItem(
                              currentCategory.id,
                              item.id,
                              'isHighlighted',
                              !item.isHighlighted
                            )
                          }
                          title="Highlight in rate card"
                          className={`p-1.5 rounded-lg border text-xs ${
                            item.isHighlighted
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          ★
                        </button>

                        {/* Delete Item */}
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(currentCategory.id, item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: BRANDING & LOGO ──────────────────────────────────────── */}
      {activeTab === 'branding' && (
        <div className="no-print bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-[#1A2E44]">Document Header & Branding</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the title, subtitle, badges, and company logo displayed at the top of the price list.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title & Subtitle */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Main Document Title
                </label>
                <input
                  type="text"
                  value={config.customization.title}
                  onChange={(e) => handleCustomizationChange('title', e.target.value)}
                  placeholder="e.g. Commercial & Residential Cleaning Services"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-[#008080]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Subtitle / Rate Card Scope
                </label>
                <input
                  type="text"
                  value={config.customization.subtitle}
                  onChange={(e) => handleCustomizationChange('subtitle', e.target.value)}
                  placeholder="e.g. Professional Cleaning, Airbnb Turnover & Linen Hire Rates — Sydney NSW"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#008080]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Header Alignment & Layout
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['split', 'centered', 'stacked'] as HeaderLayoutType[]).map((layout) => (
                    <button
                      key={layout}
                      type="button"
                      onClick={() => handleCustomizationChange('headerLayout', layout)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        config.customization.headerLayout === layout
                          ? 'bg-[#1A2E44] text-white border-[#1A2E44]'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {layout}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Logo Customizer */}
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Company Logo
              </label>

              {/* Logo Preview */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center min-h-[120px]">
                {config.customization.logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={config.customization.logoUrl}
                    alt="Logo Preview"
                    style={{ width: `${config.customization.logoWidth}px` }}
                    className="max-h-24 object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400">No logo selected</span>
                )}
              </div>

              {/* Logo Presets */}
              <div>
                <span className="block text-[11px] font-bold text-slate-500 mb-2">Preset Logos:</span>
                <div className="flex flex-wrap gap-2">
                  {LOGO_PRESETS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => handleCustomizationChange('logoUrl', preset.url)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        config.customization.logoUrl === preset.url
                          ? 'bg-[#008080] text-white border-[#008080]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image Upload & URL */}
              <div className="space-y-2 pt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-[#008080] bg-slate-50 hover:bg-teal-50/50 text-xs font-bold text-[#008080] transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Custom Logo from Device
                </button>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={config.customization.logoUrl}
                    onChange={(e) => handleCustomizationChange('logoUrl', e.target.value)}
                    placeholder="Or paste external image URL..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#008080]"
                  />
                  {config.customization.logoUrl && (
                    <button
                      type="button"
                      onClick={() => handleCustomizationChange('logoUrl', '')}
                      className="px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Logo Size Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Logo Width</span>
                  <span>{config.customization.logoWidth}px</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="300"
                  step="5"
                  value={config.customization.logoWidth}
                  onChange={(e) => handleCustomizationChange('logoWidth', parseInt(e.target.value))}
                  className="w-full accent-[#008080]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: BACKGROUND & STYLING ─────────────────────────────────── */}
      {activeTab === 'styling' && (
        <div className="no-print bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-[#1A2E44]">Document Background & Styling</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the PDF background color, accent themes, and card layouts for visual impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Background Theme */}
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Background Theme
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {BG_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleCustomizationChange('bgTheme', theme.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      config.customization.bgTheme === theme.id
                        ? 'border-[#008080] ring-2 ring-[#008080]/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    style={{ backgroundColor: theme.bg }}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300"
                        style={{ backgroundColor: theme.bg }}
                      />
                      {config.customization.bgTheme === theme.id && (
                        <span className="text-xs font-bold text-[#008080]">✓</span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        theme.id === 'navy' ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>

              {config.customization.bgTheme === 'custom' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Custom Hex Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.customization.customBgColor}
                      onChange={(e) => handleCustomizationChange('customBgColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                    />
                    <input
                      type="text"
                      value={config.customization.customBgColor}
                      onChange={(e) => handleCustomizationChange('customBgColor', e.target.value)}
                      className="w-32 px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Accent Color */}
              <div className="pt-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Primary Brand Accent Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => handleCustomizationChange('accentColor', color.hex)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        config.customization.accentColor === color.hex
                          ? 'border-slate-900 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color.hex }} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Layout & Style */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Category Card Presentation Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['elevated', 'bordered', 'minimal'] as CardStyleType[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => handleCustomizationChange('cardStyle', style)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        config.customization.cardStyle === style
                          ? 'bg-[#1A2E44] text-white border-[#1A2E44]'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Grid Columns on Screen / Print
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCustomizationChange('cardColumns', 2)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      config.customization.cardColumns === 2
                        ? 'bg-[#008080] text-white border-[#008080]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    2 Columns (Spacious, Optimal)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCustomizationChange('cardColumns', 3)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      config.customization.cardColumns === 3
                        ? 'bg-[#008080] text-white border-[#008080]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    3 Columns (Compact)
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.customization.showItemDescriptions}
                    onChange={(e) => handleCustomizationChange('showItemDescriptions', e.target.checked)}
                    className="w-4 h-4 accent-[#008080] rounded"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    Display item description subtext in category cards
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: FOOTER & CONTACT ─────────────────────────────────────── */}
      {activeTab === 'footer' && (
        <div className="no-print bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-[#1A2E44]">Footer Badges & Contact Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the rate card edition tag, guarantee badge, phone, email, website, coverage area, and terms.
            </p>
          </div>

          {/* Footer Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Edition / Date Tag (Footer)
              </label>
              <input
                type="text"
                value={config.customization.edition}
                onChange={(e) => handleCustomizationChange('edition', e.target.value)}
                placeholder="e.g. Official 2026 Rate Card"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#008080]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Guarantee Badge (Footer)
              </label>
              <input
                type="text"
                value={config.customization.badgeText}
                onChange={(e) => handleCustomizationChange('badgeText', e.target.value)}
                placeholder="e.g. 100% Satisfaction Guaranteed"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#008080]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Booking Phone Number
              </label>
              <input
                type="text"
                value={config.customization.footer.phone}
                onChange={(e) => handleFooterChange('phone', e.target.value)}
                placeholder="e.g. 0400 000 000"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#008080]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Customer Support Email
              </label>
              <input
                type="email"
                value={config.customization.footer.email}
                onChange={(e) => handleFooterChange('email', e.target.value)}
                placeholder="e.g. support@handcleaned.com.au"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#008080]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Official Website
              </label>
              <input
                type="text"
                value={config.customization.footer.website}
                onChange={(e) => handleFooterChange('website', e.target.value)}
                placeholder="e.g. www.handcleaned.com.au"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#008080]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Coverage / Service Area
              </label>
              <input
                type="text"
                value={config.customization.footer.serviceArea}
                onChange={(e) => handleFooterChange('serviceArea', e.target.value)}
                placeholder="e.g. Sydney Metro, Eastern Suburbs, North Shore & Inner West"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#008080]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                ABN or Company Reg
              </label>
              <input
                type="text"
                value={config.customization.footer.abn}
                onChange={(e) => handleFooterChange('abn', e.target.value)}
                placeholder="e.g. ABN: 12 345 678 910"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#008080]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Terms, Inclusions & Guarantee Disclaimer
              </label>
              <textarea
                rows={3}
                value={config.customization.footer.termsNote}
                onChange={(e) => handleFooterChange('termsNote', e.target.value)}
                placeholder="Terms and guarantee notes..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#008080]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── PRINT INSTRUCTIONS MODAL ────────────────────────────────────── */}
      {showPrintModal && (
        <div className="no-print fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-[#1A2E44]">
                How to Export as a Flawless PDF
              </h3>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>When you click <strong>Export PDF</strong>, the browser print dialog will appear:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Set <strong>Destination</strong> to <strong>Save as PDF</strong> (or Microsoft Print to PDF).
                </li>
                <li>
                  Under <em>More settings</em>, set <strong>Margins</strong> to <strong>Default</strong> or <strong>Minimum</strong>.
                </li>
                <li>
                  <strong>Crucial:</strong> Ensure <strong>&quot;Background graphics&quot;</strong> is <strong>CHECKED</strong> so colors and badges print!
                </li>
                <li>
                  Click <strong>Save</strong> to download your high-resolution vector PDF rate card.
                </li>
              </ol>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPrintModal(false);
                  handleExportPDF();
                }}
                className="px-4 py-2 rounded-xl bg-[#008080] text-white text-xs font-bold hover:bg-[#006e6e]"
              >
                Launch Print Dialog Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
