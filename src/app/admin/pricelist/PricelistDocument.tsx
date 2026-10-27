'use client';

import React from 'react';
import type { PricelistConfig } from '@/lib/data/pricelistConfig';

interface PricelistDocumentProps {
  config: PricelistConfig;
  className?: string;
  isPrintOnly?: boolean;
  selectedCategoryIds?: string[];
}

export function PricelistDocument({
  config,
  className = '',
  isPrintOnly = false,
  selectedCategoryIds,
}: PricelistDocumentProps) {
  const { customization, categories } = config;
  const {
    title,
    subtitle,
    edition,
    badgeText,
    companyName,
    logoUrl,
    logoWidth,
    headerLayout,
    bgTheme,
    customBgColor,
    accentColor,
    cardStyle,
    cardColumns,
    showItemDescriptions,
    footer,
  } = customization;

  // Compute theme background
  const getThemeBg = () => {
    switch (bgTheme) {
      case 'white':
        return '#FFFFFF';
      case 'cream':
        return '#FAF8F5';
      case 'tealTint':
        return '#F0FDF9';
      case 'navy':
        return '#0B132B';
      case 'custom':
        return customBgColor || '#F8FAFC';
      case 'slate':
      default:
        return '#F8FAFC';
    }
  };

  const isDarkBg = bgTheme === 'navy';
  const bgColor = getThemeBg();
  const textColor = isDarkBg ? '#F8FAFC' : '#1A2E44';
  const subtitleColor = isDarkBg ? '#94A3B8' : '#64748B';
  const effectiveAccent = accentColor || '#008080';

  // Card background & borders based on style
  const getCardClasses = () => {
    if (isDarkBg) {
      return 'bg-[#1E293B] border border-slate-700/80 shadow-md text-white';
    }
    switch (cardStyle) {
      case 'bordered':
        return 'bg-white border-2 border-slate-200/90 shadow-none text-[#1A2E44]';
      case 'minimal':
        return 'bg-white/80 border border-slate-200/60 shadow-xs backdrop-blur-xs text-[#1A2E44]';
      case 'elevated':
      default:
        return 'bg-white border border-slate-200/80 shadow-sm text-[#1A2E44] hover:shadow-md transition-shadow';
    }
  };

  const visibleCategories =
    selectedCategoryIds && selectedCategoryIds.length > 0
      ? categories.filter((c) => selectedCategoryIds.includes(c.id))
      : categories;

  const isSingleCard = visibleCategories.length === 1;

  const cardColsClass = isSingleCard
    ? 'single-card-grid grid-cols-1 max-w-xl mx-auto'
    : visibleCategories.length === 2
    ? 'multi-cards-grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 max-w-4xl mx-auto'
    : cardColumns === 3
    ? 'multi-cards-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2'
    : 'multi-cards-grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2';

  const formatPrice = (price: number) => {
    return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
  };

  // Helper icon renderer
  const renderCategoryIcon = (icon?: string) => {
    switch (icon) {
      case 'home':
        return (
          <svg className="w-4 h-4 print:w-3.5 print:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'sparkles':
        return (
          <svg className="w-4 h-4 print:w-3.5 print:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'building':
        return (
          <svg className="w-4 h-4 print:w-3.5 print:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'towel':
        return (
          <svg className="w-4 h-4 print:w-3.5 print:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
      case 'tag':
      default:
        return (
          <svg className="w-4 h-4 print:w-3.5 print:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
    }
  };

  return (
    <div
      id="printable-pricelist"
      className={`relative mx-auto rounded-2xl p-6 sm:p-8 md:p-10 transition-colors print:p-2 print:pt-1 print:rounded-none print:shadow-none print:max-w-none ${className}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        maxWidth: '1200px',
      }}
    >
      {/* Decorative top accent border */}
      <div
        className="absolute top-0 left-0 right-0 h-2.5 print:h-1.5 rounded-t-2xl print:rounded-none"
        style={{
          background: `linear-gradient(90deg, ${effectiveAccent} 0%, #00AEEF 100%)`,
        }}
      />

      {/* ── DOCUMENT TABLE TO REPEAT HEADER ON MULTI-PAGE PRINT ─────── */}
      <table className="pricelist-print-table w-full border-collapse border-none p-0 m-0">
        <thead className="pricelist-doc-thead">
          <tr>
            <td className="p-0 border-none">
              {/* ── HEADER SECTION ───────────────────────────────────── */}
              <div
                className={`pricelist-doc-header pt-3 pb-5 mb-5 print:pt-1 print:pb-2 print:mb-2.5 border-b ${
                  isDarkBg ? 'border-slate-800' : 'border-slate-200'
                } ${
                  headerLayout === 'centered'
                    ? 'flex flex-col items-center text-center gap-2.5 print:gap-1.5'
                    : headerLayout === 'stacked'
                    ? 'flex flex-col items-start gap-2.5 print:gap-1.5'
                    : 'flex flex-col md:flex-row md:items-center justify-between gap-4 print:flex-row print:items-center print:justify-between print:gap-3'
                }`}
              >
                {/* Logo and Brand */}
                <div className="flex items-center gap-3.5 shrink-0">
                  {logoUrl ? (
                    <div className="shrink-0 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoUrl}
                        alt={companyName || 'Company Logo'}
                        style={{ width: `${Math.min(logoWidth || 170, 200)}px` }}
                        className="max-h-20 print:max-h-11 object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      className="px-3.5 py-1.5 rounded-xl text-white font-extrabold text-base print:text-sm tracking-wider"
                      style={{ backgroundColor: effectiveAccent }}
                    >
                      {companyName || 'HANDCLEANED'}
                    </div>
                  )}

                  {headerLayout !== 'centered' && (
                    <div className="hidden sm:block print:block border-l border-slate-300 dark:border-slate-700 pl-3 py-0.5">
                      <span className="text-xs print:text-[10px] uppercase tracking-widest font-bold opacity-75">
                        {companyName}
                      </span>
                      <p className="text-[11px] print:text-[9px] text-slate-500 font-medium leading-none mt-0.5">
                        Sydney, Australia
                      </p>
                    </div>
                  )}
                </div>

                {/* Title and Subtitle */}
                <div
                  className={`${
                    headerLayout === 'centered'
                      ? 'max-w-2xl text-center'
                      : headerLayout === 'stacked'
                      ? 'max-w-3xl text-left'
                      : 'text-left md:text-right print:text-right max-w-2xl'
                  }`}
                >
                  <h1 className="text-xl sm:text-2xl lg:text-3xl print:text-lg print:leading-tight font-extrabold tracking-tight leading-tight">
                    {title || 'Service Price List'}
                  </h1>

                  {subtitle && (
                    <p
                      className="text-xs sm:text-sm print:text-[9.5px] mt-1 print:mt-0.5 font-normal leading-relaxed"
                      style={{ color: subtitleColor }}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </td>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="p-0 border-none" style={isSingleCard ? { textAlign: 'center' } : undefined}>
              {/* ── CATEGORIES IN CARDS ─────────────────── */}
              <div
                className={`pricelist-cards-grid ${
                  isSingleCard ? 'single-card-grid' : 'multi-cards-grid'
                } grid gap-4 sm:gap-5 print:gap-2.5 mb-6 print:mb-3 ${cardColsClass}`}
                style={isSingleCard ? { margin: '0 auto', textAlign: 'left' } : undefined}
              >
                {visibleCategories.map((category) => {
                  const catAccent = category.accentColor || effectiveAccent;

                  return (
                    <div
                      key={category.id}
                      className={`rounded-xl p-4 sm:p-5 print:p-2.5 print:rounded-lg break-inside-avoid relative overflow-hidden flex flex-col justify-between ${
                        isSingleCard ? 'w-full max-w-xl mx-auto' : ''
                      } ${getCardClasses()}`}
                    >
                      {/* Subtle top indicator bar */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1.5 print:h-1"
                        style={{ backgroundColor: catAccent }}
                      />

                      <div>
                        {/* Category Card Header */}
                        <div className="flex items-start justify-between gap-2.5 mb-2 print:mb-1.5 pt-0.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 sm:w-8 sm:h-8 print:w-5.5 print:h-5.5 rounded-lg print:rounded-md flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: `${catAccent}18`,
                                color: catAccent,
                              }}
                            >
                              {renderCategoryIcon(category.icon)}
                            </div>
                            <div>
                              <h2 className="text-sm sm:text-base print:text-[11.5px] print:leading-tight font-bold tracking-tight">
                                {category.title}
                              </h2>
                              {category.badge && (
                                <span
                                  className="inline-block text-[9px] print:text-[7.5px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded mt-0.5"
                                  style={{
                                    backgroundColor: `${catAccent}15`,
                                    color: catAccent,
                                  }}
                                >
                                  {category.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Category Description */}
                        {category.description && (
                          <p
                            className="text-[11px] sm:text-xs print:text-[9px] print:leading-tight mb-2.5 print:mb-1.5 line-clamp-2 leading-relaxed"
                            style={{ color: subtitleColor }}
                          >
                            {category.description}
                          </p>
                        )}

                        {/* Items List Inside Card */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                          {category.items.map((item) => (
                            <div
                              key={item.id}
                              className={`py-1.5 sm:py-2 print:py-1 flex items-start justify-between gap-2 transition-colors ${
                                item.isHighlighted
                                  ? 'bg-amber-500/5 -mx-1.5 px-1.5 rounded border-l-2 border-amber-500'
                                  : ''
                              }`}
                            >
                              <div className="flex-1 min-w-0 pr-1.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs sm:text-[13px] print:text-[10px] print:leading-tight font-semibold text-inherit">
                                    {item.name}
                                  </span>
                                  {item.badge && (
                                    <span className="text-[8.5px] print:text-[7px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1 py-0.1 rounded">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>

                                {showItemDescriptions && item.description && (
                                  <p
                                    className="text-[10.5px] print:text-[8px] print:leading-tight mt-0.5 leading-tight"
                                    style={{ color: subtitleColor }}
                                  >
                                    {item.description}
                                  </p>
                                )}
                              </div>

                              {/* Price Tag Pill */}
                              <div className="text-right shrink-0 pt-0.5">
                                <span className="inline-block text-xs sm:text-[13px] print:text-[10.5px] print:leading-none font-extrabold tracking-tight text-inherit">
                                  {formatPrice(item.price)}
                                </span>
                                {item.unit && (
                                  <span
                                    className="block text-[9.5px] print:text-[7.5px] font-medium leading-tight"
                                    style={{ color: subtitleColor }}
                                  >
                                    {item.unit}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom footer note per card */}
                      <div className="mt-3 pt-1.5 print:mt-1.5 print:pt-1 border-t border-slate-100 dark:border-slate-800 text-[9px] print:text-[7.5px] text-slate-400 flex items-center justify-between">
                        <span>{category.items.length} items</span>
                        <span className="font-semibold" style={{ color: catAccent }}>
                          Guaranteed Clean
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── FOOTER CONTACT INFORMATION (CENTERED ALIGNMENT) ─── */}
              <div
                className={`pt-4 pb-4 px-4 sm:px-6 print:pt-2.5 print:pb-2.5 print:px-3 border-t rounded-xl break-inside-avoid text-center ${
                  isDarkBg
                    ? 'border-slate-800 bg-[#111C36]'
                    : 'border-slate-200 bg-white/85 shadow-xs'
                }`}
              >
                <div className="flex flex-col items-center justify-center text-center space-y-2 print:space-y-1 max-w-2xl mx-auto">
                  {/* 1. Badges Centered */}
                  {(edition || badgeText) && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-0.5">
                      {edition && (
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9.5px] print:text-[8px] font-bold tracking-wide uppercase"
                          style={{
                            backgroundColor: `${effectiveAccent}1A`,
                            color: effectiveAccent,
                          }}
                        >
                          {edition}
                        </span>
                      )}
                      {badgeText && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9.5px] print:text-[8px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <svg className="w-2.5 h-2.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {badgeText}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 2. Company Name Centered */}
                  <div className="flex items-center justify-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: effectiveAccent }}
                    />
                    <span className="text-[11px] print:text-[9.5px] font-extrabold uppercase tracking-wider text-inherit">
                      {companyName} — Contact & Booking Details
                    </span>
                  </div>

                  {/* 3. Terms Note Centered */}
                  {footer.termsNote && (
                    <p className="text-[10px] print:text-[8px] leading-tight text-slate-500 max-w-xl mx-auto">
                      {footer.termsNote}
                    </p>
                  )}

                  {/* 4. Contact Details Grid Centered */}
                  <div className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-1.5 pt-1.5 print:pt-1 text-xs print:text-[8.5px]">
                    {footer.phone && (
                      <div className="inline-flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 print:w-4 print:h-4 rounded-md flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${effectiveAccent}15`,
                            color: effectiveAccent,
                          }}
                        >
                          <svg className="w-3 h-3 print:w-2.5 print:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <span className="text-slate-400 font-semibold text-[8.5px] print:text-[7px] uppercase">Phone:</span>
                        <a href={`tel:${footer.phone.replace(/\s+/g, '')}`} className="font-bold hover:underline">
                          {footer.phone}
                        </a>
                      </div>
                    )}

                    {footer.email && (
                      <div className="inline-flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 print:w-4 print:h-4 rounded-md flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${effectiveAccent}15`,
                            color: effectiveAccent,
                          }}
                        >
                          <svg className="w-3 h-3 print:w-2.5 print:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-slate-400 font-semibold text-[8.5px] print:text-[7px] uppercase">Email:</span>
                        <a href={`mailto:${footer.email}`} className="font-bold hover:underline">
                          {footer.email}
                        </a>
                      </div>
                    )}

                    {footer.website && (
                      <div className="inline-flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 print:w-4 print:h-4 rounded-md flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${effectiveAccent}15`,
                            color: effectiveAccent,
                          }}
                        >
                          <svg className="w-3 h-3 print:w-2.5 print:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <span className="text-slate-400 font-semibold text-[8.5px] print:text-[7px] uppercase">Web:</span>
                        <span className="font-bold">{footer.website}</span>
                      </div>
                    )}

                    {footer.serviceArea && (
                      <div className="inline-flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 print:w-4 print:h-4 rounded-md flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${effectiveAccent}15`,
                            color: effectiveAccent,
                          }}
                        >
                          <svg className="w-3 h-3 print:w-2.5 print:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-slate-400 font-semibold text-[8.5px] print:text-[7px] uppercase">Coverage:</span>
                        <span className="font-semibold">{footer.serviceArea}</span>
                      </div>
                    )}
                  </div>

                  {/* 5. ABN Centered */}
                  {footer.abn && (
                    <p className="text-[9.5px] print:text-[7.5px] text-slate-400 font-medium">
                      {footer.abn}
                    </p>
                  )}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
