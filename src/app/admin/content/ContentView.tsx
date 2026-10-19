'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type {
  SiteContentConfig,
  TestimonialItem,
  ServiceFeature,
  ServiceCardItem,
} from '@/lib/data/contentConfig';
import { DEFAULT_SITE_CONTENT } from '@/lib/data/contentConfig';
import { saveSiteContentAction } from '@/app/actions/adminActions';
import type { AvailableMediaAssets } from '@/services/adminContentService';

interface ContentViewProps {
  initialContent: SiteContentConfig;
  mediaAssets: AvailableMediaAssets;
}

type TabType = 'home' | 'about' | 'services' | 'testimonials';
type ServiceSubTab = 'residential' | 'airbnb' | 'commercial' | 'cards';

export function ContentView({ initialContent, mediaAssets }: ContentViewProps) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContentConfig>(initialContent);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [serviceSubTab, setServiceSubTab] = useState<ServiceSubTab>('residential');

  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  // Media Picker Modal State
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{
    isOpen: boolean;
    type: 'image' | 'video';
    onSelect: (url: string) => void;
  }>({
    isOpen: false,
    type: 'image',
    onSelect: () => {},
  });

  // Testimonial Modal State (Add / Edit)
  const [testimonialModal, setTestimonialModal] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    item: TestimonialItem;
  }>({
    isOpen: false,
    mode: 'add',
    item: {
      id: '',
      name: '',
      role: 'CLIENT',
      text: '',
      avatar: '/images/avatar1.jpg',
      rating: 5,
      active: true,
    },
  });

  // ---------------------------------------------------------------------------
  // Save Handler
  // ---------------------------------------------------------------------------
  const handleSave = () => {
    setSaveStatus({ type: 'idle' });
    startTransition(async () => {
      try {
        const res = await saveSiteContentAction(content);
        if (res.success) {
          if (res.data) {
            setContent(res.data);
          }
          setSaveStatus({
            type: 'success',
            message: 'Website content successfully updated and revalidated across all pages!',
          });
          router.refresh();
          setTimeout(() => setSaveStatus({ type: 'idle' }), 5000);
        } else {
          setSaveStatus({
            type: 'error',
            message: res.error || 'Failed to save website content.',
          });
        }
      } catch (err: unknown) {
        setSaveStatus({
          type: 'error',
          message: err instanceof Error ? err.message : 'An unexpected error occurred.',
        });
      }
    });
  };

  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to reset website content to system defaults? All unsaved and custom wordings will be reset.')) {
      setContent(DEFAULT_SITE_CONTENT);
      setSaveStatus({
        type: 'idle',
      });
    }
  };

  // Helper to open media picker
  const openMediaPicker = (type: 'image' | 'video', onSelect: (url: string) => void) => {
    setMediaPickerTarget({
      isOpen: true,
      type,
      onSelect,
    });
  };

  return (
    <div className="space-y-8 pb-24">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Website Content Manager
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Site Editor
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage wordings, hero video, headers, service details, and testimonials published across handcleaned.com.au.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#00AEEF] hover:bg-[#17739C] rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-50"
          >
            {isPending ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving Changes...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Status Toast ───────────────────────────────────────────── */}
      {saveStatus.type === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 text-sm animate-fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{saveStatus.message}</span>
          </div>
          <button
            onClick={() => setSaveStatus({ type: 'idle' })}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {saveStatus.type === 'error' && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-sm animate-fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{saveStatus.message}</span>
          </div>
          <button
            onClick={() => setSaveStatus({ type: 'idle' })}
            className="text-rose-600 hover:text-rose-800 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Navigation Tabs ────────────────────────────────────────── */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto pb-px" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('home')}
            className={`py-3.5 px-3 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'home'
                ? 'border-[#00AEEF] text-[#00AEEF]'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home & Hero Video
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`py-3.5 px-3 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'about'
                ? 'border-[#00AEEF] text-[#00AEEF]'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About Us Page
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`py-3.5 px-3 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'services'
                ? 'border-[#00AEEF] text-[#00AEEF]'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Service Pages
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`py-3.5 px-3 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'testimonials'
                ? 'border-[#00AEEF] text-[#00AEEF]'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Testimonial Reviews
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 font-bold">
              {content.testimonials.items.length}
            </span>
          </button>
        </nav>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: HOME & HERO VIDEO                                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'home' && (
        <div className="space-y-8 animate-fade-in">
          {/* Hero Section Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Homepage Hero Section & Background Video</h2>
                <p className="text-xs text-slate-500 mt-0.5">Control the main headline, call-to-actions, and background ambient video.</p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                Above the Fold
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Hero Video Config & Live Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Hero Background Video URL / Asset Path
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={content.hero.videoUrl}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, videoUrl: e.target.value },
                          }))
                        }
                        placeholder="/videos/hero-bg-final.webm"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker('video', (url) => {
                            setContent((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, videoUrl: url },
                            }));
                          })
                        }
                        className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
                      >
                        Choose Video
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      WebM or MP4 format recommended. Must be responsive, looping, and muted.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Location Eyebrow Badge
                    </label>
                    <input
                      type="text"
                      value={content.hero.badgeText}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, badgeText: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Main Heading (New line allowed)
                    </label>
                    <textarea
                      rows={2}
                      value={content.hero.heading}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, heading: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Subheading Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={content.hero.subheading}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, subheading: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Primary CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={content.hero.ctaText}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, ctaText: e.target.value },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        CTA Link Path
                      </label>
                      <input
                        type="text"
                        value={content.hero.ctaLink}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, ctaLink: e.target.value },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Video Live Preview */}
                <div className="lg:col-span-5 bg-slate-950 rounded-2xl overflow-hidden shadow-md p-4 text-white">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-semibold text-slate-400">Live Video Preview</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Autoplay & Loop
                    </span>
                  </div>
                  <div className="mt-3 relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    {content.hero.videoUrl ? (
                      <video
                        key={content.hero.videoUrl}
                        src={content.hero.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                        No video selected
                      </div>
                    )}
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5 text-xs">
                    <p className="font-semibold text-slate-300">Active Video Path:</p>
                    <code className="text-amber-400 break-all text-[11px] block">{content.hero.videoUrl}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Home About Us Section Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base font-semibold text-slate-900">Homepage "About Us" Section</h2>
              <p className="text-xs text-slate-500 mt-0.5">Edit copy and image for the house cleaning overview section on the homepage.</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Section Badge
                      </label>
                      <input
                        type="text"
                        value={content.homeAbout.badgeText}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            homeAbout: { ...prev.homeAbout, badgeText: e.target.value },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={content.homeAbout.heading}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            homeAbout: { ...prev.homeAbout, heading: e.target.value },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Main Description Copy
                    </label>
                    <textarea
                      rows={5}
                      value={content.homeAbout.description}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          homeAbout: { ...prev.homeAbout, description: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Feature Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={content.homeAbout.imageUrl}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            homeAbout: { ...prev.homeAbout, imageUrl: e.target.value },
                          }))
                        }
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker('image', (url) => {
                            setContent((prev) => ({
                              ...prev,
                              homeAbout: { ...prev.homeAbout, imageUrl: url },
                            }));
                          })
                        }
                        className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
                      >
                        Choose Image
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        CTA Button Label
                      </label>
                      <input
                        type="text"
                        value={content.homeAbout.ctaText}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            homeAbout: { ...prev.homeAbout, ctaText: e.target.value },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        CTA Link
                      </label>
                      <input
                        type="text"
                        value={content.homeAbout.ctaLink}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            homeAbout: { ...prev.homeAbout, ctaLink: e.target.value },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Live Preview */}
                <div className="lg:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-600 block mb-2">Image Preview</span>
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                    <Image
                      src={content.homeAbout.imageUrl}
                      alt="About preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: ABOUT US PAGE                                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'about' && (
        <div className="space-y-8 animate-fade-in">
          {/* About Page Hero Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base font-semibold text-slate-900">About Us Page (/about-us) - Hero Section</h2>
              <p className="text-xs text-slate-500 mt-0.5">Control the dedicated About page header, banner headline, and contact CTAs.</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    value={content.aboutPage.hero.badgeText}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        aboutPage: {
                          ...prev.aboutPage,
                          hero: { ...prev.aboutPage.hero, badgeText: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Direct Phone CTA
                  </label>
                  <input
                    type="text"
                    value={content.aboutPage.hero.phone}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        aboutPage: {
                          ...prev.aboutPage,
                          hero: { ...prev.aboutPage.hero, phone: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Main Headline (Line breaks will format in hero)
                </label>
                <textarea
                  rows={3}
                  value={content.aboutPage.hero.heading}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      aboutPage: {
                        ...prev.aboutPage,
                        hero: { ...prev.aboutPage.hero, heading: e.target.value },
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Subheading Narrative
                </label>
                <textarea
                  rows={3}
                  value={content.aboutPage.hero.subheading}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      aboutPage: {
                        ...prev.aboutPage,
                        hero: { ...prev.aboutPage.hero, subheading: e.target.value },
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Button Action Label
                </label>
                <input
                  type="text"
                  value={content.aboutPage.hero.ctaText}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      aboutPage: {
                        ...prev.aboutPage,
                        hero: { ...prev.aboutPage.hero, ctaText: e.target.value },
                      },
                    }))
                  }
                  className="w-full max-w-sm px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                />
              </div>
            </div>
          </div>

          {/* About Page Intro & 3 Pillars Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base font-semibold text-slate-900">About Us Page - Intro Section & 3 Value Pillars</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage the detailed narrative and the 3 core pillars (Comfort, Productivity, Peace of Mind).</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Intro Label
                  </label>
                  <input
                    type="text"
                    value={content.aboutPage.intro.badgeText}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        aboutPage: {
                          ...prev.aboutPage,
                          intro: { ...prev.aboutPage.intro, badgeText: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Intro Main Title
                  </label>
                  <input
                    type="text"
                    value={content.aboutPage.intro.heading}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        aboutPage: {
                          ...prev.aboutPage,
                          intro: { ...prev.aboutPage.intro, heading: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={content.aboutPage.intro.paragraph1}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      aboutPage: {
                        ...prev.aboutPage,
                        intro: { ...prev.aboutPage.intro, paragraph1: e.target.value },
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={content.aboutPage.intro.paragraph2}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      aboutPage: {
                        ...prev.aboutPage,
                        intro: { ...prev.aboutPage.intro, paragraph2: e.target.value },
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                />
              </div>

              {/* 3 Pillars Editor */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">Core Pillars (3 Benefit Cards)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {content.aboutPage.intro.pillars.map((pillar, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Pillar #{idx + 1} Title
                        </label>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => {
                            const newPillars = [...content.aboutPage.intro.pillars];
                            newPillars[idx] = { ...newPillars[idx], title: e.target.value };
                            setContent((prev) => ({
                              ...prev,
                              aboutPage: {
                                ...prev.aboutPage,
                                intro: { ...prev.aboutPage.intro, pillars: newPillars },
                              },
                            }));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={pillar.description}
                          onChange={(e) => {
                            const newPillars = [...content.aboutPage.intro.pillars];
                            newPillars[idx] = { ...newPillars[idx], description: e.target.value };
                            setContent((prev) => ({
                              ...prev,
                              aboutPage: {
                                ...prev.aboutPage,
                                intro: { ...prev.aboutPage.intro, pillars: newPillars },
                              },
                            }));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Image & Floating Badge text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Team Feature Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={content.aboutPage.intro.imageUrl}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          aboutPage: {
                            ...prev.aboutPage,
                            intro: { ...prev.aboutPage.intro, imageUrl: e.target.value },
                          },
                        }))
                      }
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker('image', (url) => {
                          setContent((prev) => ({
                            ...prev,
                            aboutPage: {
                              ...prev.aboutPage,
                              intro: { ...prev.aboutPage.intro, imageUrl: url },
                            },
                          }));
                        })
                      }
                      className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Browse
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Floating Badge Heading
                    </label>
                    <input
                      type="text"
                      value={content.aboutPage.intro.badgeTitle}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          aboutPage: {
                            ...prev.aboutPage,
                            intro: { ...prev.aboutPage.intro, badgeTitle: e.target.value },
                          },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Floating Badge Subtext
                    </label>
                    <input
                      type="text"
                      value={content.aboutPage.intro.badgeSubtitle}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          aboutPage: {
                            ...prev.aboutPage,
                            intro: { ...prev.aboutPage.intro, badgeSubtitle: e.target.value },
                          },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: SERVICE PAGES & CARDS                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'services' && (
        <div className="space-y-8 animate-fade-in">
          {/* Sub-tab switcher */}
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => setServiceSubTab('residential')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                serviceSubTab === 'residential'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Residential Cleaning
            </button>
            <button
              type="button"
              onClick={() => setServiceSubTab('airbnb')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                serviceSubTab === 'airbnb'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Airbnb Cleaning
            </button>
            <button
              type="button"
              onClick={() => setServiceSubTab('commercial')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                serviceSubTab === 'commercial'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Commercial Cleaning
            </button>
            <button
              type="button"
              onClick={() => setServiceSubTab('cards')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                serviceSubTab === 'cards'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Homepage 4 Service Cards
            </button>
          </div>

          {/* SubTab 3.1: Residential Cleaning Page */}
          {serviceSubTab === 'residential' && (
            <ServicePageEditor
              title="Residential Cleaning Page (/residential-cleaning)"
              data={content.residentialPage}
              mediaAssets={mediaAssets}
              openMediaPicker={openMediaPicker}
              onChange={(updated) =>
                setContent((prev) => ({
                  ...prev,
                  residentialPage: updated,
                }))
              }
            />
          )}

          {/* SubTab 3.2: Airbnb Cleaning Page */}
          {serviceSubTab === 'airbnb' && (
            <ServicePageEditor
              title="Airbnb Cleaning Page (/airbnb-cleaning)"
              data={content.airbnbPage}
              mediaAssets={mediaAssets}
              openMediaPicker={openMediaPicker}
              onChange={(updated) =>
                setContent((prev) => ({
                  ...prev,
                  airbnbPage: updated,
                }))
              }
            />
          )}

          {/* SubTab 3.3: Commercial Cleaning Page */}
          {serviceSubTab === 'commercial' && (
            <ServicePageEditor
              title="Commercial Cleaning Page (/commercial-cleaning)"
              data={content.commercialPage}
              mediaAssets={mediaAssets}
              openMediaPicker={openMediaPicker}
              onChange={(updated) =>
                setContent((prev) => ({
                  ...prev,
                  commercialPage: updated,
                }))
              }
            />
          )}

          {/* SubTab 3.4: Homepage 4 Service Cards */}
          {serviceSubTab === 'cards' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-base font-semibold text-slate-900">Homepage "Our Services" Cards (4 Categories)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Control the 4 primary service cards shown on the homepage and across service footers.</p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.servicesCards.map((card, idx) => (
                  <div key={card.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#00AEEF]">Card #{idx + 1}</span>
                      <span className="text-xs text-slate-500 font-mono">{card.href}</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const updated = [...content.servicesCards];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setContent((prev) => ({ ...prev, servicesCards: updated }));
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) => {
                          const updated = [...content.servicesCards];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setContent((prev) => ({ ...prev, servicesCards: updated }));
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Card Image</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={card.image}
                          onChange={(e) => {
                            const updated = [...content.servicesCards];
                            updated[idx] = { ...updated[idx], image: e.target.value };
                            setContent((prev) => ({ ...prev, servicesCards: updated }));
                          }}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            openMediaPicker('image', (url) => {
                              const updated = [...content.servicesCards];
                              updated[idx] = { ...updated[idx], image: url };
                              setContent((prev) => ({ ...prev, servicesCards: updated }));
                            })
                          }
                          className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: TESTIMONIALS SECTION                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'testimonials' && (
        <div className="space-y-8 animate-fade-in">
          {/* Section Header Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Testimonials Section Header</h2>
                <p className="text-xs text-slate-500 mt-0.5">Edit badge and title displayed at the top of the client review carousel.</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setTestimonialModal({
                    isOpen: true,
                    mode: 'add',
                    item: {
                      id: String(Date.now()),
                      name: '',
                      role: 'CLIENT',
                      text: '',
                      avatar: '/images/avatar1.jpg',
                      rating: 5,
                      active: true,
                    },
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#00AEEF] hover:bg-[#17739C] rounded-xl transition-all shadow-xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add New Review
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Section Pill Badge
                </label>
                <input
                  type="text"
                  value={content.testimonials.sectionBadge}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      testimonials: { ...prev.testimonials, sectionBadge: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Section Title (New line formatted)
                </label>
                <input
                  type="text"
                  value={content.testimonials.sectionHeading}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      testimonials: { ...prev.testimonials, sectionHeading: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                />
              </div>
            </div>
          </div>

          {/* Testimonial Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.testimonials.items.map((review, idx) => (
              <div
                key={review.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-2xs flex flex-col justify-between ${
                  review.active ? 'border-slate-200/90' : 'border-dashed border-slate-300 opacity-60 bg-slate-50'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-xs">
                        <Image
                          src={review.avatar || '/images/avatar1.jpg'}
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{review.name}</h4>
                        <span className="inline-block text-[10px] font-bold text-[#00AEEF] uppercase tracking-wider">
                          {review.role}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        review.active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {review.active ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-4">
                    "{review.text}"
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...content.testimonials.items];
                      updated[idx] = { ...updated[idx], active: !updated[idx].active };
                      setContent((prev) => ({
                        ...prev,
                        testimonials: { ...prev.testimonials, items: updated },
                      }));
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                  >
                    {review.active ? 'Hide from site' : 'Show on site'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setTestimonialModal({
                          isOpen: true,
                          mode: 'edit',
                          item: review,
                        })
                      }
                      className="p-1.5 text-slate-600 hover:text-[#00AEEF] hover:bg-sky-50 rounded-lg transition-colors"
                      title="Edit Review"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete review from "${review.name}"?`)) {
                          setContent((prev) => ({
                            ...prev,
                            testimonials: {
                              ...prev.testimonials,
                              items: prev.testimonials.items.filter((r) => r.id !== review.id),
                            },
                          }));
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Review"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TESTIMONIAL ADD / EDIT MODAL                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {testimonialModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {testimonialModal.mode === 'add' ? 'Add New Testimonial Review' : 'Edit Testimonial Review'}
              </h3>
              <button
                type="button"
                onClick={() => setTestimonialModal((prev) => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={testimonialModal.item.name}
                    onChange={(e) =>
                      setTestimonialModal((prev) => ({
                        ...prev,
                        item: { ...prev.item, name: e.target.value },
                      }))
                    }
                    placeholder="e.g. Jessica Taylor"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Client Type</label>
                  <input
                    type="text"
                    value={testimonialModal.item.role}
                    onChange={(e) =>
                      setTestimonialModal((prev) => ({
                        ...prev,
                        item: { ...prev.item, role: e.target.value.toUpperCase() },
                      }))
                    }
                    placeholder="e.g. AIRBNB HOST"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Client Avatar</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    <Image
                      src={testimonialModal.item.avatar || '/images/avatar1.jpg'}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={testimonialModal.item.avatar}
                      onChange={(e) =>
                        setTestimonialModal((prev) => ({
                          ...prev,
                          item: { ...prev.item, avatar: e.target.value },
                        }))
                      }
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker('image', (url) => {
                          setTestimonialModal((prev) => ({
                            ...prev,
                            item: { ...prev.item, avatar: url },
                          }));
                        })
                      }
                      className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Pick
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Review Quote</label>
                <textarea
                  rows={4}
                  value={testimonialModal.item.text}
                  onChange={(e) =>
                    setTestimonialModal((prev) => ({
                      ...prev,
                      item: { ...prev.item, text: e.target.value },
                    }))
                  }
                  placeholder="Enter the client's review text here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rating (Stars)</label>
                  <select
                    value={testimonialModal.item.rating}
                    onChange={(e) =>
                      setTestimonialModal((prev) => ({
                        ...prev,
                        item: { ...prev.item, rating: parseInt(e.target.value, 10) },
                      }))
                    }
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer mt-5">
                  <input
                    type="checkbox"
                    checked={testimonialModal.item.active}
                    onChange={(e) =>
                      setTestimonialModal((prev) => ({
                        ...prev,
                        item: { ...prev.item, active: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]"
                  />
                  <span className="text-xs font-medium text-slate-700">Display actively on website</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setTestimonialModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!testimonialModal.item.name || !testimonialModal.item.text) {
                    alert('Please enter both client name and review text.');
                    return;
                  }

                  if (testimonialModal.mode === 'add') {
                    setContent((prev) => ({
                      ...prev,
                      testimonials: {
                        ...prev.testimonials,
                        items: [testimonialModal.item, ...prev.testimonials.items],
                      },
                    }));
                  } else {
                    setContent((prev) => ({
                      ...prev,
                      testimonials: {
                        ...prev.testimonials,
                        items: prev.testimonials.items.map((it) =>
                          it.id === testimonialModal.item.id ? testimonialModal.item : it
                        ),
                      },
                    }));
                  }
                  setTestimonialModal((prev) => ({ ...prev, isOpen: false }));
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#00AEEF] hover:bg-[#17739C] rounded-xl shadow-xs"
              >
                {testimonialModal.mode === 'add' ? 'Add Review' : 'Save Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MEDIA ASSET PICKER MODAL                                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {mediaPickerTarget.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-scale-in max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Select {mediaPickerTarget.type === 'video' ? 'Video Asset' : 'Image Asset'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose from existing assets inside /public or type an external URL.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMediaPickerTarget((prev) => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-1">
              {mediaPickerTarget.type === 'image' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mediaAssets.images.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => {
                        mediaPickerTarget.onSelect(img);
                        setMediaPickerTarget((prev) => ({ ...prev, isOpen: false }));
                      }}
                      className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 hover:border-[#00AEEF] hover:ring-2 hover:ring-[#00AEEF]/20 transition-all text-left bg-slate-50"
                    >
                      <div className="relative aspect-4/3 w-full bg-slate-200">
                        <Image src={img} alt={img} fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="p-2 text-[11px] font-mono text-slate-600 truncate block">
                        {img.replace('/images/', '')}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {mediaAssets.videos.map((vid) => (
                    <button
                      key={vid}
                      type="button"
                      onClick={() => {
                        mediaPickerTarget.onSelect(vid);
                        setMediaPickerTarget((prev) => ({ ...prev, isOpen: false }));
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#00AEEF] hover:bg-sky-50/50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          ▶
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-900 block">
                            {vid.replace('/videos/', '')}
                          </span>
                          <span className="text-xs font-mono text-slate-500">{vid}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#00AEEF]">Use Video</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setMediaPickerTarget((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Helper Component: Service Page Content Editor
// -----------------------------------------------------------------------------
interface ServicePageEditorProps {
  title: string;
  data: import('@/lib/data/contentConfig').ServicePageContent;
  mediaAssets: AvailableMediaAssets;
  openMediaPicker: (type: 'image' | 'video', onSelect: (url: string) => void) => void;
  onChange: (updated: import('@/lib/data/contentConfig').ServicePageContent) => void;
}

function ServicePageEditor({
  title,
  data,
  openMediaPicker,
  onChange,
}: ServicePageEditorProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">Control the top hero headline, background image, and 4 service feature callouts.</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">1. Hero Section Content</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Location / Eyebrow Badge
              </label>
              <input
                type="text"
                value={data.hero.badgeText}
                onChange={(e) =>
                  onChange({
                    ...data,
                    hero: { ...data.hero, badgeText: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Hero Background Image
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={data.hero.bgImage}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      hero: { ...data.hero, bgImage: e.target.value },
                    })
                  }
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    openMediaPicker('image', (url) => {
                      onChange({
                        ...data,
                        hero: { ...data.hero, bgImage: url },
                      });
                    })
                  }
                  className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Browse
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Main Heading
            </label>
            <textarea
              rows={2}
              value={data.hero.heading}
              onChange={(e) =>
                onChange({
                  ...data,
                  hero: { ...data.hero, heading: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Subheading Paragraph
            </label>
            <textarea
              rows={3}
              value={data.hero.subheading}
              onChange={(e) =>
                onChange({
                  ...data,
                  hero: { ...data.hero, subheading: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                CTA Button 1 Label
              </label>
              <input
                type="text"
                value={data.hero.cta1Text}
                onChange={(e) =>
                  onChange({
                    ...data,
                    hero: { ...data.hero, cta1Text: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                CTA Button 2 Label
              </label>
              <input
                type="text"
                value={data.hero.cta2Text}
                onChange={(e) =>
                  onChange({
                    ...data,
                    hero: { ...data.hero, cta2Text: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 4 Feature Highlights Section */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">2. Feature Callout Grid</h3>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-semibold">Grid Section Title:</label>
              <input
                type="text"
                value={data.featuresTitle}
                onChange={(e) =>
                  onChange({
                    ...data,
                    featuresTitle: e.target.value,
                  })
                }
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs w-72"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.features.map((feat, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-wider">
                  Feature #{idx + 1}
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Feature Title</label>
                  <input
                    type="text"
                    value={feat.title}
                    onChange={(e) => {
                      const updated = [...data.features];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      onChange({ ...data, features: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={feat.description}
                    onChange={(e) => {
                      const updated = [...data.features];
                      updated[idx] = { ...updated[idx], description: e.target.value };
                      onChange({ ...data, features: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
