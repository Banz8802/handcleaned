import { requireAdminSession } from '@/services/adminAuthService';
import { getAdminPricelistConfig } from '@/services/adminPricelistService';
import { PricelistDocument } from '../PricelistDocument';

export const dynamic = 'force-dynamic';

interface AdminPricelistPrintPageProps {
  searchParams: Promise<{ cards?: string }>;
}

export default async function AdminPricelistPrintPage({ searchParams }: AdminPricelistPrintPageProps) {
  await requireAdminSession();
  const config = await getAdminPricelistConfig();
  const resolvedParams = await searchParams;
  const selectedCategoryIds = resolvedParams?.cards
    ? resolvedParams.cards.split(',').filter(Boolean)
    : undefined;

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-slate-100 print:bg-white print:p-0">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm;
          }
          body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #printable-pricelist {
            padding: 2mm 4mm !important;
            box-shadow: none !important;
            border: none !important;
          }
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
          #printable-pricelist .pricelist-doc-header {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          #printable-pricelist .pricelist-cards-grid.multi-cards-grid,
          #printable-pricelist .pricelist-cards-grid:not(.single-card-grid) {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
            width: 100% !important;
            margin-bottom: 12px !important;
          }
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
        }
      `}</style>
      <PricelistDocument
        config={config}
        isPrintOnly
        selectedCategoryIds={selectedCategoryIds}
      />
    </div>
  );
}
