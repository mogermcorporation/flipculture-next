export const EPN_CAMPID = "5339168299";
export const EPN_MKRID = "711-53200-19255-0";
export const EPN_CUSTOMID = "flipculture";

/** Keep existing EPN params; only fill missing campaign tags. Never strip campid/mkcid. */
export function withEpn(raw?: string | null): string {
  if (!raw) return "https://www.ebay.com";
  try {
    const u = new URL(raw);
    if (!/(^|\.)ebay\.(com|ca|co\.uk|de|fr|it|es|com\.au)$/i.test(u.hostname)) {
      return raw;
    }
    if (!u.searchParams.get("campid")) u.searchParams.set("campid", EPN_CAMPID);
    if (!u.searchParams.get("mkcid")) u.searchParams.set("mkcid", "1");
    if (!u.searchParams.get("mkrid")) u.searchParams.set("mkrid", EPN_MKRID);
    if (!u.searchParams.get("mkevt")) u.searchParams.set("mkevt", "1");
    if (!u.searchParams.get("toolid")) u.searchParams.set("toolid", "10001");
    if (!u.searchParams.get("customid")) u.searchParams.set("customid", EPN_CUSTOMID);
    return u.toString();
  } catch {
    return raw;
  }
}

export function imageUrl(deal: {
  image?: { imageUrl?: string } | null;
  additionalImages?: { imageUrl?: string }[];
  image_url?: string;
}): string {
  if (deal.image?.imageUrl) return deal.image.imageUrl;
  if (deal.additionalImages && deal.additionalImages.length > 0) {
    return deal.additionalImages[0].imageUrl || "/logo.png";
  }
  if (deal.image_url) return deal.image_url;
  return "/logo.png";
}
