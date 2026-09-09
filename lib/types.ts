export type Deal = {
  itemId: string;
  title: string;
  itemWebUrl: string;
  price: { value: string; currency: string };
  image: { imageUrl: string };
  additionalImages: { imageUrl: string }[];
  featured: boolean;
  category: string;
  cohort?: "genz" | "millennial" | "og" | string;
  kind?: string;
  originalPrice?: number;
  discountPercent?: number;
  soldAvg?: number;
  condition?: string;
  authenticityGuarantee?: boolean;
};

export type ListingRow = {
  title: string;
  category?: string;
  item_type?: string;
  original_price?: number | string;
  sale_price?: number | string;
  discount_percent?: number | string;
  affiliate_url?: string;
  image_url?: string;
  source_platform?: string;
  currency?: string;
};

export type CohortRow = {
  ebay_id: string;
  title: string;
  model?: string | null;
  kind?: string | null;
  category?: string | null;
  price?: number | string | null;
  sold_avg?: number | string | null;
  discount_pct?: number | string | null;
  image_url?: string | null;
  product_url?: string | null;
  affiliate_url?: string | null;
  authenticity_guarantee?: boolean | null;
  ended?: boolean | null;
  cohort?: string | null;
  condition?: string | null;
  featured?: boolean | null;
  hero_role?: string | null;
};
