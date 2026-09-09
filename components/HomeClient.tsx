"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { DealGrid, DenimBrandRails, Rail } from "@/components/CatalogRails";
import DealCard from "@/components/DealCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import VipNewsletter from "@/components/VipNewsletter";
import { classifyListing, listingMatchesCategory, type CatalogCategory } from "@/lib/classify";
import {
  COLLECTIBLE_RAILS,
  SNEAKER_RAILS,
  STREETWEAR_RAILS,
  WATCH_RAILS,
  listingApparel,
  listingCollectibleKind,
  listingFamily,
  listingWatchTier,
  mixHero
} from "@/lib/merchandise";
import type { Deal } from "@/lib/types";

const CATEGORIES: { id: CatalogCategory; label: string }[] = [
  { id: "sneakers", label: "Sneakers" },
  { id: "streetwear", label: "Streetwear" },
  { id: "collectibles", label: "Collectibles" },
  { id: "watches", label: "Watches" }
];

const HUBS = [
  { href: "/footwear/jordans", label: "Jordan 1–14" },
  { href: "/footwear/travis-scott", label: "Travis Scott" },
  { href: "/footwear/kobes", label: "Kobes" },
  { href: "/footwear/nike-core", label: "Nike Core" },
  { href: "/streetwear", label: "Streetwear" },
  { href: "/streetwear/denim", label: "Denim" },
  { href: "/watches/rolex", label: "Rolex" },
  { href: "/watches/patek", label: "Patek" },
  { href: "/watches/ap", label: "AP" },
  { href: "/watches/richard-mille", label: "Richard Mille" },
  { href: "/collectibles", label: "Cards & Memorabilia" }
];

const SITE = "https://flipcultureusa.vercel.app/";
const SHARE = encodeURIComponent(SITE);
const SHARE_TEXT = encodeURIComponent("Flip Culture — sneakers, streetwear, collectibles, watches.");

export default function HomeClient() {
  const [featured, setFeatured] = useState<Deal[]>([]);
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [category, setCategory] = useState<CatalogCategory>("sneakers");
  const [rail, setRail] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [featRes, allRes] = await Promise.all([
          fetch("/api/deals?featured=true", { cache: "no-store" }),
          fetch("/api/deals", { cache: "no-store" })
        ]);
        const featJson = await featRes.json();
        const allJson = await allRes.json();
        if (Array.isArray(featJson)) setFeatured(featJson.slice(0, 3));
        if (Array.isArray(allJson)) setAllDeals(allJson);
      } catch (err) {
        console.error("Failed to load featured deals:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const consumerDeals = useMemo(
    () => allDeals.filter((d) => Boolean(classifyListing(d.title, d.category))),
    [allDeals]
  );
  const { rarest, cheapest } = useMemo(() => mixHero(consumerDeals), [consumerDeals]);
  const wallDeals = useMemo(
    () =>
      submitted
        ? consumerDeals.filter((d) => d.title.toLowerCase().includes(submitted.toLowerCase()))
        : consumerDeals.filter((d) => d.category === category && listingMatchesCategory(d.title, d.category, category)),
    [consumerDeals, category, submitted]
  );

  const subchips =
    category === "sneakers"
      ? SNEAKER_RAILS
      : category === "streetwear"
        ? STREETWEAR_RAILS
        : category === "collectibles"
          ? COLLECTIBLE_RAILS
          : WATCH_RAILS;

  const filteredWall = useMemo(() => {
    if (submitted || rail === "all") return wallDeals;
    if (category === "sneakers") return wallDeals.filter((d) => listingFamily(d) === rail);
    if (category === "streetwear") return wallDeals.filter((d) => listingApparel(d) === rail);
    if (category === "collectibles") return wallDeals.filter((d) => listingCollectibleKind(d) === rail);
    return wallDeals.filter((d) => listingWatchTier(d) === rail);
  }, [wallDeals, submitted, rail, category]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) setSubmitted(query.trim());
  }

  function renderRails() {
    if (category === "sneakers") {
      return (
        <>
          <Rail title="Jordan 1–14" deals={wallDeals.filter((d) => listingFamily(d) === "jordan")} />
          <Rail title="Travis Scott" deals={wallDeals.filter((d) => listingFamily(d) === "travis")} />
          <Rail title="Kobes" deals={wallDeals.filter((d) => listingFamily(d) === "kobe")} />
          <Rail title="Trending" deals={wallDeals.filter((d) => listingFamily(d) === "trending")} />
        </>
      );
    }
    if (category === "streetwear") {
      return (
        <>
          <Rail title="Tees" deals={wallDeals.filter((d) => listingApparel(d) === "tees")} />
          <Rail title="Hoodies" deals={wallDeals.filter((d) => listingApparel(d) === "hoodies")} />
          <DenimBrandRails deals={wallDeals} />
        </>
      );
    }
    if (category === "collectibles") {
      return (
        <>
          <Rail title="Sports cards" deals={wallDeals.filter((d) => listingCollectibleKind(d) === "cards")} />
          <Rail title="Memorabilia" deals={wallDeals.filter((d) => listingCollectibleKind(d) === "memorabilia")} />
        </>
      );
    }
    return (
      <>
        <Rail title="Trending" deals={wallDeals.filter((d) => listingWatchTier(d) === "trending")} />
        <Rail title="Grail" deals={wallDeals.filter((d) => listingWatchTier(d) === "grail")} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans scroll-smooth selection:bg-purple-500 selection:text-white">
      <SiteHeader brandAs="h1" />

      <main>
        <section className="max-w-7xl mx-auto px-6 pt-8">
          <nav aria-label="Culture hubs" className="flex gap-2 overflow-x-auto pb-2">
            {HUBS.map((h) => (
              <Link
                key={h.href}
                href={h.href}
                className="shrink-0 px-3 py-1.5 rounded-full border border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white hover:border-purple-500"
              >
                {h.label}
              </Link>
            ))}
          </nav>
        </section>

        <section id="hero-grid" className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-black tracking-tight mb-8">Rarest Grails vs Lowest BIN</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-neutral-800 rounded-3xl p-6 bg-neutral-900/40" data-hero="rarest">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">Rarest Grails</span>
              <h3 className="text-2xl font-black mt-1 mb-6">One from each wall</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rarest.map((d) => (
                  <DealCard key={d.itemId} deal={d} metric="value" />
                ))}
              </div>
            </div>
            <div className="border border-neutral-800 rounded-3xl p-6 bg-neutral-900/40" data-hero="bin">
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
                Lowest Buy-It-Now Deals
              </span>
              <h3 className="text-2xl font-black mt-1 mb-6">One from each wall</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cheapest.map((d) => (
                  <DealCard key={d.itemId} deal={d} metric="bin" />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="spotlight" className="max-w-7xl mx-auto px-6 pb-4">
          <article className="relative aspect-video rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-neutral-950 to-amber-900" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.35),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(251,191,36,0.2),transparent_40%)]" />
            <div className="relative h-full flex flex-col justify-end p-8 md:p-12 max-w-3xl">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">16:9 Editorial</span>
              <h2 className="text-3xl md:text-5xl font-black mt-2">Four walls. One culture.</h2>
              <p className="text-neutral-200 text-sm md:text-base mt-3">
                Athletic footwear, streetwear and denim by brand, sports cards & memorabilia, and watches from
                Submariners to Nautilus — never mixed, never tech.
              </p>
            </div>
          </article>
        </section>

        <section id="featured" className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-purple-400 font-bold text-xs uppercase tracking-widest block mb-1">
                PROMOTED SELECTION
              </span>
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">The Vault Top 3 Drops</h2>
            </div>
            <p className="text-neutral-400 text-xs max-w-md">
              Hand-picked verified grails with real-time valuation metrics. Updated daily.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((deal, i) => (
              <DealCard key={deal.itemId} deal={deal} vaultIndex={i + 1} />
            ))}
          </div>
        </section>

        <section id="feed" className="max-w-7xl mx-auto px-6 py-12 border-t border-neutral-800/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-black tracking-tight mb-2">Explore The Live Catalog</h2>
            <p className="text-neutral-400 text-xs">
              Four walls only: athletic sneakers, streetwear, sports collectibles, watches. Electronics never land here.
            </p>
          </div>
          <form onSubmit={onSearch} className="max-w-2xl mx-auto flex gap-3 mb-10">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search grails (e.g. 'Jordan 4', 'Rolex Sub', 'Panini Prizm')..."
              className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl px-5 py-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:opacity-90 transition shadow-lg shadow-purple-600/20"
            >
              Search
            </button>
          </form>
          <div className="flex justify-center gap-3 mb-6 flex-wrap" role="tablist" aria-label="Live catalog categories">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={category === c.id && !submitted}
                onClick={() => {
                  setQuery("");
                  setSubmitted("");
                  setCategory(c.id);
                  setRail("all");
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  category === c.id && !submitted
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40 scale-105"
                    : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          {!submitted ? (
            <div className="flex justify-center gap-2 mb-10 flex-wrap" aria-label={`${category} rails`}>
              <button
                type="button"
                onClick={() => setRail("all")}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  rail === "all" ? "bg-white text-neutral-950" : "border border-neutral-800 text-neutral-400"
                }`}
              >
                All
              </button>
              {subchips.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setRail(c.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    rail === c.id ? "bg-white text-neutral-950" : "border border-neutral-800 text-neutral-400"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          ) : null}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-neutral-900/50 animate-pulse rounded-2xl border border-neutral-800/80" />
              ))}
            </div>
          ) : submitted ? (
            filteredWall.length ? (
              <DealGrid deals={filteredWall} />
            ) : (
              <p className="text-center text-neutral-500 text-sm">No matches for that search.</p>
            )
          ) : !wallDeals.length ? (
            <div className="text-center border border-dashed border-neutral-800 rounded-3xl py-16 px-6">
              <p className="text-sm font-bold uppercase tracking-widest text-neutral-300">
                No live {category} in the feed yet
              </p>
              <p className="text-neutral-500 text-xs mt-2 max-w-md mx-auto">
                The resale ingest is wiring {category}. We will not fill this wall with sneakers, tech, or placeholder
                SKUs.
              </p>
            </div>
          ) : rail === "all" ? (
            <div data-wall={category} data-count={wallDeals.length}>
              {renderRails()}
            </div>
          ) : category === "streetwear" && rail === "denim" ? (
            <DenimBrandRails deals={wallDeals} />
          ) : filteredWall.length ? (
            <DealGrid deals={filteredWall} />
          ) : (
            <p className="text-center text-neutral-500 text-sm">Nothing on this rail yet.</p>
          )}
        </section>

        <section id="about" className="max-w-7xl mx-auto px-6 py-12 border-t border-neutral-800/80">
          <span className="text-purple-400 font-bold text-xs uppercase tracking-widest">About Flip Culture</span>
          <h2 className="text-3xl font-black mt-2 mb-4">A consumer desk for culture, not computers.</h2>
          <p className="text-neutral-400 text-sm max-w-3xl leading-relaxed">
            Flip Culture tracks live marketplace bins across four walls: athletic sneakers (Jordan 1–14, Kobes, Dunks,
            Yeezy footwear), streetwear and denim grouped by brand (True Religion, Evisu, Levi&apos;s, Diesel), sports
            cards and game-used memorabilia, and watches from daily Rolex Sub/Datejust and Omega through Patek Nautilus,
            AP Royal Oak, Richard Mille, and vintage Daytona. Every View Drop button is eBay Partner Network tagged
            (campid 5339168299).
          </p>
        </section>

        <section id="share" className="max-w-7xl mx-auto px-6 pb-4">
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest">
            <span className="text-neutral-500">Share</span>
            <a
              className="px-3 py-2 rounded-xl border border-neutral-800 hover:border-purple-500"
              href={`https://twitter.com/intent/tweet?url=${SHARE}&text=${SHARE_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
            <a
              className="px-3 py-2 rounded-xl border border-neutral-800 hover:border-purple-500"
              href={`https://www.facebook.com/sharer/sharer.php?u=${SHARE}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <button
              type="button"
              className="px-3 py-2 rounded-xl border border-neutral-800 hover:border-purple-500"
              onClick={() => navigator.clipboard?.writeText(SITE)}
            >
              Copy link
            </button>
          </div>
        </section>

        <VipNewsletter />
      </main>

      <SiteFooter />
    </div>
  );
}
