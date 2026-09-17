export interface BookingEmailData {
  bookingReference: string;
  service: string;
  packageName: string;
  price: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  bedrooms?: number;
  bathrooms?: number;
  cleaners?: number;
  notes?: string;
  bookingDate: string;
  bookingTime: string;
  createdAt?: string;
}

export function generateCustomerReceiptEmail(data: BookingEmailData) {
  const customerName = `${data.firstName} ${data.lastName}`.trim();
  const formattedPrice = `$${data.price.toFixed(2)}`;
  const specs = [];
  if (data.bedrooms !== undefined && data.bedrooms > 0) specs.push(`${data.bedrooms} Bed`);
  if (data.bathrooms !== undefined && data.bathrooms > 0) specs.push(`${data.bathrooms} Bath`);
  if (data.cleaners !== undefined && data.cleaners > 0) specs.push(`${data.cleaners} Cleaner${data.cleaners > 1 ? 's' : ''}`);
  const specsStr = specs.length > 0 ? specs.join(' • ') : 'N/A';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Receipt / Invoice — HandCleaned</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #0f172a; color: #ffffff; padding: 28px 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; tracking: -0.5px; color: #38bdf8; }
    .header p { margin: 6px 0 0 0; font-size: 14px; color: #94a3b8; }
    .badge { display: inline-block; background-color: #fef3c7; color: #92400e; font-weight: 700; padding: 4px 12px; border-radius: 9999px; font-size: 13px; margin-top: 12px; }
    .content { padding: 32px; }
    .alert-box { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px; }
    .alert-box h3 { margin: 0 0 6px 0; color: #1e40af; font-size: 15px; }
    .alert-box p { margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.5; }
    .section-title { font-size: 16px; font-weight: 700; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; }
    .table-details { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .table-details td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .table-details td.label { color: #64748b; font-weight: 500; width: 40%; }
    .table-details td.value { color: #0f172a; font-weight: 600; text-align: right; }
    .price-row td { font-size: 18px; font-weight: 700; color: #0f172a; border-top: 2px solid #e2e8f0; border-bottom: none; padding-top: 14px; }
    .price-row td.value { color: #0284c7; }
    .payment-instructions { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-top: 24px; }
    .payment-instructions h4 { margin: 0 0 10px 0; font-size: 15px; color: #0f172a; }
    .payment-instructions p { margin: 0 0 10px 0; font-size: 14px; color: #475569; line-height: 1.5; }
    .payment-instructions ul { margin: 0; padding-left: 20px; color: #475569; font-size: 14px; }
    .payment-instructions li { margin-bottom: 6px; }
    .footer { background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; }
    .footer p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>HandCleaned</h1>
      <p>Premium Cleaning Services</p>
      <div class="badge">Booking Receipt / Invoice</div>
    </div>
    
    <div class="content">
      <div class="alert-box">
        <h3>Booking Request Received</h3>
        <p>Your booking request has been received. This email serves as your booking receipt/invoice for the requested cleaning service. <strong>Please note: Payment has not yet been processed.</strong></p>
      </div>

      <div class="section-title">Booking Details</div>
      <table class="table-details">
        <tr>
          <td class="label">Booking Reference</td>
          <td class="value">${data.bookingReference}</td>
        </tr>
        <tr>
          <td class="label">Customer Name</td>
          <td class="value">${customerName}</td>
        </tr>
        <tr>
          <td class="label">Service</td>
          <td class="value">${data.service}</td>
        </tr>
        <tr>
          <td class="label">Package</td>
          <td class="value">${data.packageName}</td>
        </tr>
        <tr>
          <td class="label">Property Address</td>
          <td class="value">${data.propertyAddress}</td>
        </tr>
        <tr>
          <td class="label">Specifications</td>
          <td class="value">${specsStr}</td>
        </tr>
        <tr>
          <td class="label">Scheduled Date</td>
          <td class="value">${data.bookingDate}</td>
        </tr>
        <tr>
          <td class="label">Scheduled Time</td>
          <td class="value">${data.bookingTime}</td>
        </tr>
        <tr>
          <td class="label">Payment Status</td>
          <td class="value" style="color: #d97706; font-weight: 700;">PENDING (Manual Payment)</td>
        </tr>
        <tr class="price-row">
          <td class="label">Total Amount Due</td>
          <td class="value">${formattedPrice}</td>
        </tr>
      </table>

      <div class="payment-instructions">
        <h4>How to Complete Payment</h4>
        <p>Payment is currently handled manually. Once your payment has been completed, please reply directly to this email or contact HandCleaned with your payment confirmation.</p>
        <ul>
          <li><strong>Reference to use:</strong> ${data.bookingReference}</li>
          <li><strong>Support Email:</strong> contact@handcleaned.com.au</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p><strong>HandCleaned Cleaning Services</strong></p>
      <p>If you have any questions, reply directly to this email or reach out to our team.</p>
      <p style="margin-top: 12px; font-size: 11px; color: #94a3b8;">&copy; ${new Date().getFullYear()} HandCleaned. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    subject: `Booking Receipt / Invoice — HandCleaned — ${data.bookingReference}`,
    html,
  };
}

export function generateAdminNotificationEmail(data: BookingEmailData) {
  const customerName = `${data.firstName} ${data.lastName}`.trim();
  const formattedPrice = `$${data.price.toFixed(2)}`;
  const specs = [];
  if (data.bedrooms !== undefined && data.bedrooms > 0) specs.push(`${data.bedrooms} Bed`);
  if (data.bathrooms !== undefined && data.bathrooms > 0) specs.push(`${data.bathrooms} Bath`);
  if (data.cleaners !== undefined && data.cleaners > 0) specs.push(`${data.cleaners} Cleaner${data.cleaners > 1 ? 's' : ''}`);
  const specsStr = specs.length > 0 ? specs.join(' • ') : 'N/A';
  const timestamp = data.createdAt || new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Notification</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #0f172a; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #0284c7; color: #ffffff; padding: 24px 32px; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; }
    .content { padding: 32px; }
    .status-banner { background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; font-size: 14px; color: #92400e; }
    .section-title { font-size: 15px; font-weight: 700; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 20px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .table-details { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .table-details td { padding: 8px 0; border-bottom: 1px solid #f8fafc; font-size: 14px; }
    .table-details td.label { color: #64748b; font-weight: 500; width: 40%; }
    .table-details td.value { color: #0f172a; font-weight: 600; text-align: right; }
    .notes-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 14px; color: #334155; margin-top: 12px; white-space: pre-wrap; }
    .footer { background-color: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Booking Request</h2>
      <p>Reference: ${data.bookingReference} | ${timestamp}</p>
    </div>

    <div class="content">
      <div class="status-banner">
        <strong>Payment Status:</strong> PENDING &nbsp;|&nbsp; <strong>Booking Status:</strong> PENDING
      </div>

      <div class="section-title">Customer Contact</div>
      <table class="table-details">
        <tr>
          <td class="label">Name</td>
          <td class="value">${customerName}</td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="value"><a href="mailto:${data.email}" style="color: #0284c7; text-decoration: none;">${data.email}</a></td>
        </tr>
        <tr>
          <td class="label">Phone</td>
          <td class="value"><a href="tel:${data.phone}" style="color: #0284c7; text-decoration: none;">${data.phone}</a></td>
        </tr>
      </table>

      <div class="section-title">Service & Property</div>
      <table class="table-details">
        <tr>
          <td class="label">Service</td>
          <td class="value">${data.service}</td>
        </tr>
        <tr>
          <td class="label">Package</td>
          <td class="value">${data.packageName}</td>
        </tr>
        <tr>
          <td class="label">Address</td>
          <td class="value">${data.propertyAddress}</td>
        </tr>
        <tr>
          <td class="label">Specifications</td>
          <td class="value">${specsStr}</td>
        </tr>
        <tr>
          <td class="label">Date</td>
          <td class="value">${data.bookingDate}</td>
        </tr>
        <tr>
          <td class="label">Time</td>
          <td class="value">${data.bookingTime}</td>
        </tr>
        <tr>
          <td class="label">Quoted Price</td>
          <td class="value" style="color: #0284c7; font-weight: 700; font-size: 16px;">${formattedPrice}</td>
        </tr>
      </table>

      ${
        data.notes
          ? `
      <div class="section-title">Special Notes / Requests</div>
      <div class="notes-box">${data.notes}</div>
      `
          : ''
      }
    </div>

    <div class="footer">
      Automated Notification from HandCleaned Booking System
    </div>
  </div>
</body>
</html>
  `;

  return {
    subject: `New Booking — ${data.bookingReference} — ${customerName}`,
    html,
  };
}

// ---------------------------------------------------------------------------
// Service Inquiry Email Templates
// ---------------------------------------------------------------------------
export interface InquiryEmailData {
  inquiryReference: string;
  name: string;
  email: string;
  phone: string;
  date?: string;
  service: string;
  message?: string;
  createdAt?: string;
}

export function generateInquiryAdminEmail(data: InquiryEmailData) {
  const timestamp = data.createdAt || new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Service Inquiry</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #0f172a; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #1A2E44; color: #ffffff; padding: 24px 32px; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 700; color: #00AEEF; }
    .header p { margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; color: #cbd5e1; }
    .content { padding: 32px; }
    .section-title { font-size: 15px; font-weight: 700; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 10px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
    .table-details { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .table-details td { padding: 10px 0; border-bottom: 1px solid #f8fafc; font-size: 14px; }
    .table-details td.label { color: #64748b; font-weight: 500; width: 40%; }
    .table-details td.value { color: #0f172a; font-weight: 600; text-align: right; }
    .notes-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 14px; color: #334155; margin-top: 12px; white-space: pre-wrap; }
    .footer { background-color: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Service Inquiry</h2>
      <p>Ref: ${data.inquiryReference} | ${timestamp}</p>
    </div>

    <div class="content">
      <div class="section-title">Inquiry Contact Details</div>
      <table class="table-details">
        <tr>
          <td class="label">Customer Name</td>
          <td class="value">${data.name}</td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:${data.email}" style="color: #00AEEF; text-decoration: none;">${data.email}</a></td>
        </tr>
        <tr>
          <td class="label">Phone Number</td>
          <td class="value"><a href="tel:${data.phone}" style="color: #00AEEF; text-decoration: none;">${data.phone}</a></td>
        </tr>
        <tr>
          <td class="label">Requested Service</td>
          <td class="value" style="color: #00AEEF; font-weight: 700;">${data.service}</td>
        </tr>
        <tr>
          <td class="label">Preferred Date</td>
          <td class="value">${data.date || 'Not specified'}</td>
        </tr>
      </table>

      ${
        data.message
          ? `
      <div class="section-title">Message / Additional Details</div>
      <div class="notes-box">${data.message}</div>
      `
          : ''
      }
    </div>

    <div class="footer">
      Automated Service Inquiry from HandCleaned Website
    </div>
  </div>
</body>
</html>
  `;

  return {
    subject: `New Service Inquiry — ${data.inquiryReference} — ${data.name}`,
    html,
  };
}

export function generateInquiryCustomerEmail(data: InquiryEmailData) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Received — HandCleaned</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #1A2E44; color: #ffffff; padding: 28px 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #00AEEF; }
    .header p { margin: 6px 0 0 0; font-size: 14px; color: #cbd5e1; }
    .content { padding: 32px; }
    .alert-box { background-color: #f0f9ff; border-left: 4px solid #00AEEF; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px; }
    .alert-box h3 { margin: 0 0 6px 0; color: #0369a1; font-size: 15px; }
    .alert-box p { margin: 0; font-size: 14px; color: #0c4a6e; line-height: 1.5; }
    .section-title { font-size: 16px; font-weight: 700; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; }
    .table-details { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .table-details td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .table-details td.label { color: #64748b; font-weight: 500; width: 40%; }
    .table-details td.value { color: #0f172a; font-weight: 600; text-align: right; }
    .footer { background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; }
    .footer p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>HandCleaned</h1>
      <p>Premium Cleaning Services</p>
    </div>
    
    <div class="content">
      <div class="alert-box">
        <h3>Thank you for your inquiry, ${data.name}!</h3>
        <p>We have received your request for <strong>${data.service}</strong>. Our team will review your details and get back to you promptly with further information or a tailored quote.</p>
      </div>

      <div class="section-title">Inquiry Summary</div>
      <table class="table-details">
        <tr>
          <td class="label">Reference Code</td>
          <td class="value">${data.inquiryReference}</td>
        </tr>
        <tr>
          <td class="label">Name</td>
          <td class="value">${data.name}</td>
        </tr>
        <tr>
          <td class="label">Service</td>
          <td class="value">${data.service}</td>
        </tr>
        <tr>
          <td class="label">Preferred Date</td>
          <td class="value">${data.date || 'Flexible / Not specified'}</td>
        </tr>
        <tr>
          <td class="label">Phone</td>
          <td class="value">${data.phone}</td>
        </tr>
      </table>
    </div>

    <div class="footer">
      <p><strong>HandCleaned Cleaning Services</strong></p>
      <p>Questions? Contact us anytime at contact@handcleaned.com.au</p>
      <p style="margin-top: 12px; font-size: 11px; color: #94a3b8;">&copy; ${new Date().getFullYear()} HandCleaned. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    subject: `Inquiry Confirmation — HandCleaned — ${data.inquiryReference}`,
    html,
  };
}

