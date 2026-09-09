export const CATALOG_CATEGORIES = ["sneakers", "streetwear", "collectibles", "watches"] as const;
export type CatalogCategory = (typeof CATALOG_CATEGORIES)[number];

const ELECTRONICS =
  /\b(laptop|notebook|macbook|chromebook|motherboard|lcd display|screen assembly|rtx\s?\d{3,}|gtx\s?\d{3,}|rx\s?\d{3,}|gpu|graphics card|steam deck|rog ally|zephyrus|victus|strix|blade\s?1[456]|battlestation|mechanical keyboard|gaming headset|iphone|ipad|handheld)\b/i;

const WATCH_PARTS =
  /\b(bezel insert|faded insert|\binsert\b|caseback|coaster|teardown|acrylic display|compatible to|replacement|glide lock|bracelet for\b|bracelet\s+\d+\s*mm|oyster bracelet pj|dial\s+\d{5,})\b/i;

const WATCH_SIGNAL =
  /\b(rolex|patek|philippe|audemars|piguet|royal oak|richard mille|omega|cartier|tudor|submariner|datejust|daytona|nautilus|gmt[- ]master|speedmaster|timepiece|chronograph|\bwatch(?:es)?\b)\b/i;

const COLLECTIBLE_SIGNAL =
  /\b(sports card|trading card|panini|topps|prizm|bowman|upper deck|psa\s?\d|bgs\s?\d|sgc\s?\d|game[- ]used|autograph|memorabilia|rookie card|pokemon|yu-?gi-oh|graded card|hobby box|breaker)\b/i;

const APPAREL_SIGNAL =
  /\b(hoodie|hooded|t-shirt|\btee\b|crewneck|sweatshirt|jacket|parka|denim|jeans|pants|shorts|\bshirt\b|apparel|supreme|bape|stüssy|stussy|box logo|trucker|graphic tee|cargo)\b/i;

const FOOTWEAR_SIGNAL =
  /\b(air jordan|jordan\s?(?:1[0-4]|[1-9])\b|dunk|yeezy|kobe\s?\d|samba|gazelle|new balance|\bnb\s?\d|air force|af[- ]?1|travis scott|sneaker|nike sb|boost|foamposite|air max|vapormax|pegasus|cortez|slide|foam rnnr|yeezy slide)\b/i;

const API_ALIAS: Record<string, CatalogCategory | "drop"> = {
  sneakers: "sneakers",
  streetwear: "streetwear",
  collectibles: "collectibles",
  watches: "watches",
  luxury: "watches",
  tech: "drop",
  laptops: "drop",
  handhelds: "drop",
  battlestation: "drop"
};

function norm(raw?: string | null): string {
  return (raw || "").toLowerCase().trim();
}

export function isElectronics(title: string): boolean {
  return ELECTRONICS.test(title);
}

export function classifyListing(title: string, rawCategory?: string | null): CatalogCategory | null {
  const t = title || "";
  if (!t.trim()) return null;
  if (isElectronics(t)) return null;

  const alias = API_ALIAS[norm(rawCategory)];
  if (alias === "drop") return null;

  const garment =
    /\b(hoodie|hooded|t-shirt|\btee\b|crewneck|sweatshirt|jacket|parka|denim|jeans|pants|shorts|\bshirt\b|apparel|graphic tee)\b/i.test(
      t
    );
  const apparel = garment || APPAREL_SIGNAL.test(t);
  const footwear = FOOTWEAR_SIGNAL.test(t);
  const collectible = COLLECTIBLE_SIGNAL.test(t);
  const hasMm = /\b\d{2}\s*mm\b/i.test(t);
  const hasWatchWord = /\bwatch(?:es)?\b/i.test(t);
  const watchPart = WATCH_PARTS.test(t) || (/\bbracelet\b/i.test(t) && !hasMm);
  const watch =
    WATCH_SIGNAL.test(t) &&
    !watchPart &&
    (hasWatchWord ||
      hasMm ||
      /submariner|gmt[- ]master|datejust|daytona|nautilus|royal oak|box and papers/i.test(t));

  if (watch && !garment && !footwear && !collectible) return "watches";
  if (collectible && !footwear) return "collectibles";
  if (garment && !footwear) return "streetwear";
  if (footwear && !watch && !collectible) {
    if (garment && !/\b(sneaker|dunk|yeezy|kobe|sz\s?\d|size\s?\d)\b/i.test(t)) return "streetwear";
    return "sneakers";
  }
  if (apparel && !footwear && !watch && !collectible) return "streetwear";

  if (alias === "sneakers" && !watch && !collectible && !apparel) return "sneakers";
  if (alias === "streetwear" && !watch && !footwear && !collectible) return "streetwear";
  if (alias === "collectibles" && !watch && !footwear && !apparel) return "collectibles";
  if (alias === "watches" && watch) return "watches";

  return null;
}

export function listingMatchesCategory(
  title: string,
  rawCategory: string | null | undefined,
  wanted: CatalogCategory
): boolean {
  return classifyListing(title, rawCategory) === wanted;
}
