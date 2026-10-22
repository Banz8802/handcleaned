'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { AdminBooking } from '@/services/adminBookingService';
import { INVOICE_HEADER_BANNER, INVOICE_FOOTER_BANNER, INVOICE_SIGNATURE } from '@/lib/data/invoiceBanner';

interface InvoiceModalProps {
  booking: AdminBooking | null;
  isOpen?: boolean;
  onClose: () => void;
}

export function InvoiceModal({ booking, onClose }: InvoiceModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const customerName = booking ? `${booking.first_name} ${booking.last_name}`.trim() : '';
  const invoiceNumber = booking ? `INV-${booking.booking_reference}` : '';
  const pdfFileName = `${invoiceNumber}_${customerName}_Admin CRM _ Handcleaned`;

  useEffect(() => {
    if (booking) {
      document.body.classList.add('invoice-modal-open');
      const originalTitle = document.title;
      document.title = pdfFileName;

      return () => {
        document.body.classList.remove('invoice-modal-open');
        document.title = originalTitle;
      };
    }
  }, [booking, pdfFileName]);

  if (!mounted || !booking) return null;

  // Invoice calculations
  const invoiceDate = booking.created_at
    ? new Date(booking.created_at).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    : new Date().toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const totalAmount = booking.price;
  // Australian GST calculation (10% GST included in price: GST = Total / 11, Subtotal = Total * 10 / 11)
  const subtotal = totalAmount / 1.1;
  const gstAmount = totalAmount - subtotal;
  const isPaid = booking.payment_status === 'paid';
  const balanceDue = isPaid ? 0 : totalAmount;

  const generateSinglePageInvoiceHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${pdfFileName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 11px;
      line-height: 1.4;
    }
    .invoice-box {
      max-width: 740px;
      min-height: 255mm;
      margin: 0 auto;
      padding: 4px 10px 0 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .invoice-content {
      width: 100%;
    }
    .banner-container {
      width: 100%;
      margin-bottom: 12px;
      border-radius: 6px 6px 0 0;
      overflow: hidden;
    }
    .banner-img {
      width: 100%;
      height: auto;
      display: block;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 10px;
      border-bottom: 2px solid #00aeef;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #1a2e44;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-title span { color: #00aeef; }
    .company-info {
      font-size: 11px;
      color: #64748b;
      line-height: 1.4;
      margin-top: 4px;
    }
    .invoice-meta { text-align: right; }
    .invoice-badge {
      display: inline-block;
      padding: 3px 10px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      border-radius: 9999px;
      margin-bottom: 4px;
      ${isPaid ? 'background: #dcfce7; color: #166534;' : 'background: #fef3c7; color: #92400e;'}
    }
    .meta-title { font-size: 18px; font-weight: 800; color: #1a2e44; margin: 0; }
    .meta-details { font-size: 11px; color: #64748b; margin-top: 4px; line-height: 1.4; }
    .section-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin: 14px 0;
    }
    .card {
      background: #ebf7fc;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid #cbeaf6;
    }
    .card-title {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      color: #19739d;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .card-body { font-size: 12px; font-weight: 600; color: #0f172a; line-height: 1.4; }
    .card-muted { font-size: 11px; color: #64748b; font-weight: 400; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    th {
      text-align: left;
      font-size: 10px;
      text-transform: uppercase;
      color: #ffffff;
      padding: 8px 10px;
      background: #19739d;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    td {
      padding: 9px 10px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 11px;
      color: #1e293b;
    }
    .totals-area {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-top: 14px;
    }
    .payment-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .payment-box {
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 11px;
      line-height: 1.5;
      ${isPaid ? 'background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;' : 'background: #fefce8; border: 1px solid #fef08a; color: #854d0e;'}
    }
    .signature-box {
      margin-top: 14px;
      text-align: left;
    }
    .signature-img {
      height: 38px;
      width: auto;
      display: block;
      object-fit: contain;
      mix-blend-mode: multiply;
    }
    .signature-line {
      width: 190px;
      border-bottom: 2px solid #17739C;
      margin: 4px 0 4px 0;
    }
    .signature-name {
      font-size: 11px;
      font-weight: 700;
      color: #1A2E44;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .totals-table { width: 280px; }
    .totals-table td { padding: 3px 6px; font-size: 11px; }
    .totals-table tr.grand-total td {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      border-top: 2px solid #e2e8f0;
      border-bottom: 2px solid #e2e8f0;
      padding: 6px 6px;
    }
    .footer-container {
      position: relative;
      width: 100%;
      margin-top: auto;
      padding-top: 36px;
      text-align: center;
    }
    .footer-img {
      width: 100%;
      height: auto;
      display: block;
    }
    .footer-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 14px 20px 4px 20px;
      text-align: center;
      z-index: 2;
    }
    .footer-overlay p {
      margin: 2px 0;
      font-size: 10px;
      color: #475569;
      line-height: 1.4;
    }
    .footer-overlay p.highlight {
      font-weight: 700;
      color: #1e293b;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="invoice-box">
    <div class="invoice-content">
      <div class="banner-container">
      <img src="${INVOICE_HEADER_BANNER}" alt="HandCleaned — Clean with a side of WOW" class="banner-img" />
    </div>

    <div class="header">
      <div>
        <div class="company-info">
          <strong style="color: #1a2e44; font-size: 13px;">Mayra Bedoya Quintero</strong><br>
          ABN: 51164078848<br>
          3 Sunbeam Street Campsie, NSW 2194<br>
          contact@handcleaned.com.au &bull; 0406898997<br>
          Website: handcleaned.com.au
        </div>
      </div>
      <div class="invoice-meta">
        <span class="invoice-badge">${isPaid ? 'PAID IN FULL' : 'PAYMENT DUE'}</span>
        <h2 class="meta-title">TAX INVOICE</h2>
        <div class="meta-details">
          <strong>Invoice No:</strong> ${invoiceNumber}<br>
          <strong>Issue Date:</strong> ${invoiceDate}<br>
          <strong>Booking Ref:</strong> ${booking.booking_reference}<br>
          <strong>Service Date:</strong> ${booking.booking_date} (${booking.booking_time})
        </div>
      </div>
    </div>

    <div class="section-grid">
      <div class="card">
        <div class="card-title">Billed To</div>
        <div class="card-body">
          ${booking.first_name} ${booking.last_name}<br>
          <span class="card-muted">${booking.email}</span><br>
          <span class="card-muted">${booking.phone}</span>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Service Address</div>
        <div class="card-body">
          ${booking.property_address}<br>
          <span class="card-muted">Specs: ${booking.bedrooms === 0 ? 'Studio' : `${booking.bedrooms} Bed`}, ${booking.bathrooms} Bath</span>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Service Description</th>
          <th>Service Date</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Rate</th>
          <th style="text-align: right;">Total AUD</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${booking.service}</strong> &mdash; ${booking.package_name}<br>
            <span style="font-size: 10px; color: #64748b;">${booking.bedrooms === 0 ? 'Studio' : `${booking.bedrooms} Bedroom`}, ${booking.bathrooms} Bathroom(s)${booking.notes ? ` &bull; Note: ${booking.notes}` : ''}</span>
          </td>
          <td>${booking.booking_date}</td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">$${totalAmount.toFixed(2)}</td>
          <td style="text-align: right; font-weight: 700;">$${totalAmount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals-area">
      <div class="payment-col">
        <div class="payment-box">
          <strong>${isPaid ? 'Payment Confirmed' : 'Payment Instructions (Bank Transfer)'}:</strong><br>
          ${isPaid ? `Paid in full via Stripe Card Checkout.<br>Transaction Reference: <strong>${booking.booking_reference}</strong>.<br>Thank you for choosing HandCleaned!` : `<strong>Account Name:</strong> Mayra Bedoya Quintero<br><strong>Bank:</strong> Commonwealth Bank Of Australia<br><strong>BSB:</strong> 062006 &bull; <strong>Account Number:</strong> 1343 6065<br><strong>Reference:</strong> ${booking.booking_reference}`}
        </div>
        <div class="signature-box">
          <img src="${INVOICE_SIGNATURE}" alt="Mayra Bedoya Q." class="signature-img" />
          <div class="signature-line"></div>
          <div class="signature-name">MAYRA BEDOYA QUINTERO</div>
        </div>
      </div>

      <table class="totals-table">
        <tr>
          <td style="color: #64748b;">Subtotal (excl. GST):</td>
          <td style="text-align: right;">$${subtotal.toFixed(2)} AUD</td>
        </tr>
        <tr>
          <td style="color: #64748b;">GST (10%):</td>
          <td style="text-align: right;">$${gstAmount.toFixed(2)} AUD</td>
        </tr>
        <tr class="grand-total">
          <td>Total (inc. GST):</td>
          <td style="text-align: right; color: #00aeef;">$${totalAmount.toFixed(2)} AUD</td>
        </tr>
        <tr>
          <td style="color: #64748b;">Amount Paid:</td>
          <td style="text-align: right; font-weight: 700; color: ${isPaid ? '#16a34a' : '#64748b'};">$${(isPaid ? totalAmount : 0).toFixed(2)} AUD</td>
        </tr>
        <tr>
          <td style="font-weight: 700;">Balance Due:</td>
          <td style="text-align: right; font-weight: 800; color: ${balanceDue > 0 ? '#dc2626' : '#16a34a'};">$${balanceDue.toFixed(2)} AUD</td>
        </tr>
      </table>
    </div>
    </div>

    <div class="footer-container">
      <img src="${INVOICE_FOOTER_BANNER}" alt="HandCleaned Footer" class="footer-img" />
      <div class="footer-overlay">
        <p class="highlight">Thank you for choosing HandCleaned. We appreciate your business.</p>
        <p>All cleaning services are delivered in accordance with HandCleaned standard terms. Tax invoice generated under Australian GST legislation.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const handlePrint = () => {
    // Generate clean single-page printable iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(generateSinglePageInvoiceHtml());
    doc.close();

    if (iframe.contentWindow?.document) {
      iframe.contentWindow.document.title = pdfFileName;
    }

    iframe.contentWindow?.focus();
    setTimeout(() => {
      try {
        iframe.contentWindow?.print();
      } catch {
        window.print();
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1500);
      }
    }, 250);
  };

  const handleCopySummary = async () => {
    const summaryText = `TAX INVOICE: ${invoiceNumber}
Client: ${booking.first_name} ${booking.last_name}
Service: ${booking.service} (${booking.package_name})
Scheduled: ${booking.booking_date} at ${booking.booking_time}
Property: ${booking.property_address}
Total: $${totalAmount.toFixed(2)} AUD (inc. GST)
Payment Status: ${booking.payment_status.toUpperCase()}
Balance Due: $${balanceDue.toFixed(2)} AUD
Mayra Bedoya Quintero | ABN: 51164078848 | 3 Sunbeam Street Campsie, NSW 2194 | contact@handcleaned.com.au | 0406898997`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadHtml = () => {
    const htmlContent = generateSinglePageInvoiceHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pdfFileName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const modalNode = (
    <div id="invoice-modal-root">
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[92vh] my-auto">
          {/* Top Action Toolbar (Hidden during print) */}
          <div className="no-print bg-slate-900 text-white px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#00AEEF]/20 flex items-center justify-center text-[#00AEEF]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">
                    Tax Invoice
                  </span>
                  <span className="text-xs font-mono font-bold text-[#00AEEF] bg-[#00AEEF]/10 px-2 py-0.5 rounded-md border border-[#00AEEF]/30">
                    {invoiceNumber}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  GST Compliant Australian Tax Receipt (Single-Page A4)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Copy Summary Button */}
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer border border-slate-700"
                title="Copy invoice summary to clipboard"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span className="hidden sm:inline">Copy Summary</span>
                  </>
                )}
              </button>

              {/* Download HTML Button */}
              <button
                type="button"
                onClick={handleDownloadHtml}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer border border-slate-700"
                title="Download standalone HTML invoice"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Download</span>
              </button>

              {/* Print / Save PDF Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#00AEEF] hover:bg-[#17739C] text-white shadow-xs hover:shadow-md transition-all cursor-pointer"
                title="Print or Save as 1-Page PDF"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print / Save PDF</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
                aria-label="Close invoice"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Printable Invoice Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50/50">
            <div
              id="invoice-printable-card"
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-8 max-w-3xl mx-auto text-slate-800"
            >
              {/* Top Banner Header */}
              <div className="-mx-5 -mt-5 sm:-mx-8 sm:-mt-8 mb-5 overflow-hidden rounded-t-2xl">
                <img
                  src="/images/invoice-header-logo.png"
                  alt="HandCleaned — Clean with a side of WOW"
                  className="w-full h-auto block"
                />
              </div>

              {/* Header: Company & Invoice Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b-2 border-slate-100">
                <div>
                  <p className="font-extrabold text-sm text-[#1A2E44]">Mayra Bedoya Quintero</p>
                  <div className="mt-1 text-xs text-slate-500 space-y-0.5 leading-relaxed">
                    <p>ABN: 51164078848</p>
                    <p>3 Sunbeam Street Campsie, NSW 2194</p>
                    <p>contact@handcleaned.com.au &bull; 0406898997</p>
                    <p>Web: https://handcleaned.com.au</p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="inline-block">
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        PAID IN FULL
                      </span>
                    ) : booking.payment_status === 'failed' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        PAYMENT FAILED
                      </span>
                    ) : booking.payment_status === 'refunded' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-300">
                        REFUNDED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        PAYMENT DUE
                      </span>
                    )}
                  </div>

                  <h1 className="text-xl font-black text-[#1A2E44] tracking-tight mt-2">
                    TAX INVOICE
                  </h1>
                  <div className="mt-1.5 text-xs text-slate-600 space-y-0.5">
                    <p>
                      <span className="text-slate-400">Invoice Number: </span>
                      <span className="font-mono font-bold text-slate-900">{invoiceNumber}</span>
                    </p>
                    <p>
                      <span className="text-slate-400">Issue Date: </span>
                      <span className="font-medium text-slate-900">{invoiceDate}</span>
                    </p>
                    <p>
                      <span className="text-slate-400">Booking Reference: </span>
                      <span className="font-mono font-bold text-[#00AEEF]">
                        {booking.booking_reference}
                      </span>
                    </p>
                    <p>
                      <span className="text-slate-400">Scheduled Date: </span>
                      <span className="font-medium text-slate-900">
                        {booking.booking_date} ({booking.booking_time})
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bill To & Property Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                <div className="bg-[#ebf7fc] rounded-xl p-3.5 border border-[#cbeaf6]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#19739d] block mb-1">
                    Billed To
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    {booking.first_name} {booking.last_name}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{booking.email}</p>
                  <p className="text-xs text-slate-600">{booking.phone}</p>
                </div>

                <div className="bg-[#ebf7fc] rounded-xl p-3.5 border border-[#cbeaf6]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#19739d] block mb-1">
                    Service Property Address
                  </span>
                  <p className="text-xs font-bold text-slate-900 leading-snug">
                    {booking.property_address}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600">
                    <span>
                      {booking.bedrooms === 0 ? 'Studio' : `${booking.bedrooms} Bed`}
                    </span>
                    <span>&bull;</span>
                    <span>
                      {booking.bathrooms} Bath{booking.bathrooms > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#19739d] text-[10px] font-bold text-white uppercase tracking-wider">
                      <th className="py-2.5 px-3 font-bold text-white">Item & Description</th>
                      <th className="py-2.5 px-3 text-center font-bold text-white">Date</th>
                      <th className="py-2.5 px-3 text-center font-bold text-white">Qty</th>
                      <th className="py-2.5 px-3 text-right font-bold text-white">Rate</th>
                      <th className="py-2.5 px-3 text-right font-bold text-white">Amount (AUD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    <tr>
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-900">
                          {booking.service}
                        </p>
                        <p className="text-slate-500 font-medium text-[11px] mt-0.5">
                          Package: {booking.package_name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {booking.bedrooms === 0 ? 'Studio' : `${booking.bedrooms} Bedroom`}, {booking.bathrooms} Bathroom(s)
                        </p>
                        {booking.notes && (
                          <p className="text-[10px] text-slate-500 italic mt-1 bg-slate-50 p-1 rounded">
                            Notes: {booking.notes}
                          </p>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600 font-medium">
                        {booking.booking_date}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600 font-medium">
                        1
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 font-medium">
                        ${totalAmount.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        ${totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary & Totals */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mt-4 pt-3 border-t border-slate-100">
                {/* Payment Info / Bank Details & Signature */}
                <div className="w-full sm:max-w-xs text-xs space-y-3">
                  {isPaid ? (
                    <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 text-emerald-900">
                      <p className="font-bold flex items-center gap-1.5 text-emerald-800 text-xs">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Payment Recorded
                      </p>
                      <p className="text-[11px] text-emerald-700 mt-1">
                        Paid in full via Stripe Card Checkout. Ref: {booking.booking_reference}.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-amber-900">
                      <p className="font-bold text-amber-800 text-xs">Direct Deposit / Bank Details</p>
                      <div className="text-[11px] text-amber-900 mt-1 space-y-0.5">
                        <p><strong>Account Name:</strong> Mayra Bedoya Quintero</p>
                        <p><strong>Bank:</strong> Commonwealth Bank Of Australia</p>
                        <p><strong>BSB:</strong> 062006</p>
                        <p><strong>Account Number:</strong> 1343 6065</p>
                        <p><strong>Reference:</strong> {booking.booking_reference}</p>
                      </div>
                    </div>
                  )}

                  {/* Authorized Signature */}
                  <div className="pt-4 sm:pt-6">
                    <img
                      src="/images/myra-sign.png"
                      alt="Mayra Bedoya Q."
                      className="h-10 w-auto object-contain mix-blend-multiply"
                    />
                    <div className="border-b-2 border-[#17739C] w-48 mt-1 mb-1.5" />
                    <p className="text-[11px] font-bold text-[#1A2E44] tracking-wider uppercase">
                      Mayra Bedoya Quintero
                    </p>
                  </div>
                </div>

                {/* Financial Breakdown Table */}
                <div className="w-full sm:w-64 space-y-1 text-xs">
                  <div className="flex justify-between py-0.5 text-slate-500">
                    <span>Subtotal (excl. GST):</span>
                    <span className="font-medium text-slate-700">${subtotal.toFixed(2)} AUD</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-slate-500">
                    <span>GST (10%):</span>
                    <span className="font-medium text-slate-700">${gstAmount.toFixed(2)} AUD</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-t-2 border-slate-200 font-extrabold text-sm text-[#1A2E44]">
                    <span>Total (inc. GST):</span>
                    <span className="text-[#00AEEF]">${totalAmount.toFixed(2)} AUD</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-slate-600">
                    <span>Amount Paid:</span>
                    <span className={`font-bold ${isPaid ? 'text-emerald-600' : 'text-slate-600'}`}>
                      ${(isPaid ? totalAmount : 0).toFixed(2)} AUD
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-slate-200 font-bold text-xs">
                    <span>Balance Due:</span>
                    <span className={`font-extrabold ${balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ${balanceDue.toFixed(2)} AUD
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Banner with Centered Text */}
              <div className="relative -mx-5 -mb-5 sm:-mx-8 sm:-mb-8 mt-12 sm:mt-16 overflow-hidden rounded-b-2xl">
                <img
                  src="/images/invoice-footer-bg.png"
                  alt="HandCleaned Footer"
                  className="w-full h-auto block"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 space-y-1">
                  <p className="font-bold text-slate-800 text-[11px] sm:text-xs">
                    Thank you for choosing HandCleaned. We appreciate your business.
                  </p>
                  <p className="text-[10px] text-slate-600 max-w-lg leading-relaxed">
                    All cleaning services are delivered in accordance with HandCleaned standard terms. Tax invoice generated under Australian GST legislation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Bottom Bar (Hidden during print) */}
          <div className="no-print bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
            <span className="text-slate-500">
              Invoice for booking <strong className="text-slate-800">{booking.booking_reference}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl font-bold bg-[#00AEEF] hover:bg-[#17739C] text-white shadow-xs transition-colors cursor-pointer"
              >
                Print / Save PDF (1 Page)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
}
