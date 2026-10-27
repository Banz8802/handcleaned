import defaultPricelistData from './pricelistConfig.json';

export interface PricelistItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit?: string;
  isHighlighted?: boolean;
  badge?: string;
}

export interface PricelistCategory {
  id: string;
  title: string;
  badge?: string;
  description?: string;
  icon?: string;
  accentColor?: string;
  items: PricelistItem[];
}

export interface PricelistFooterConfig {
  phone: string;
  email: string;
  website: string;
  serviceArea: string;
  abn: string;
  termsNote: string;
}

export type BgThemeType = 'white' | 'slate' | 'cream' | 'tealTint' | 'navy' | 'custom';
export type CardStyleType = 'elevated' | 'bordered' | 'minimal';
export type HeaderLayoutType = 'split' | 'centered' | 'stacked';

export interface PricelistCustomization {
  title: string;
  subtitle: string;
  edition: string;
  badgeText: string;
  companyName: string;
  logoUrl: string;
  logoWidth: number;
  headerLayout: HeaderLayoutType;
  bgTheme: BgThemeType;
  customBgColor: string;
  accentColor: string;
  cardStyle: CardStyleType;
  cardColumns: 2 | 3;
  showItemDescriptions: boolean;
  footer: PricelistFooterConfig;
}

export interface PricelistConfig {
  customization: PricelistCustomization;
  categories: PricelistCategory[];
  updatedAt?: string;
  updatedBy?: string;
}

export const DEFAULT_PRICELIST_CONFIG: PricelistConfig = defaultPricelistData as PricelistConfig;

let activePricelistConfig: PricelistConfig = { ...DEFAULT_PRICELIST_CONFIG };

export function getPricelistConfig(): PricelistConfig {
  return activePricelistConfig;
}

export function setPricelistConfig(config: PricelistConfig): void {
  activePricelistConfig = {
    ...DEFAULT_PRICELIST_CONFIG,
    ...config,
    customization: {
      ...DEFAULT_PRICELIST_CONFIG.customization,
      ...(config.customization || {}),
      footer: {
        ...DEFAULT_PRICELIST_CONFIG.customization.footer,
        ...(config.customization?.footer || {}),
      },
    },
    categories: config.categories || DEFAULT_PRICELIST_CONFIG.categories,
  };
}
