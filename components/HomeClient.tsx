"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import DealCard from "@/components/DealCard";
import VipNewsletter from "@/components/VipNewsletter";
import { classifyListing, listingMatchesCategory, type CatalogCategory } from "@/lib/classify";
import type { Deal } from "@/lib/types";

const CATEGORIES: { id: CatalogCategory; label: string }[] = [
  { id: "sneakers", label: "Sneakers" },
  { id: "streetwear", label: "Streetwear" },
  { id: "collectibles", label: "Collectibles" },
  { id: "watches", label: "Watches" }
];

const COHORTS = [
  {
    id: "genz",
    label: "Gen Z 15–24",
    blurb: "Graphic hoodies, Jordan 1 Lows/Mids, viral colorways, bins under $150."
  },
  {
    id: "millennial",
    label: "Millennials 25–34",
    blurb: "Retro highs, denim collabs, Jordan 3/4/11 grails, value-tracking metrics."
  },
  {
    id: "og",
    label: "OG Collectors 35–45",
    blurb: "Heritage streetwear, 1985–1999 originals, deadstock grails, vintage provenance."
  }
] as const;

const HUBS = [
  { href: "/footwear/jordans/jordan-1", label: "Jordan 1" },
  { href: "/footwear/jordans/jordan-4", label: "Jordan 4" },
  { href: "/footwear/jordans/jordan-11", label: "Jordan 11" },
  { href: "/footwear/travis-scott", label: "Travis Scott" },
  { href: "/footwear/kobes", label: "Kobes" },
  { href: "/footwear/nike-core", label: "Nike Core" },
  { href: "/streetwear", label: "Streetwear / Denim" },
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
  const [catalog, setCatalog] = useState<Deal[]>([]);
  const [category, setCategory] = useState<CatalogCategory>("sneakers");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [loading, setLoading] = useState(true);
  const [cohort, setCohort] = useState<(typeof COHORTS)[number]["id"]>("genz");

  useEffect(() => {
    (async () => {
      try {
        const [featRes, allRes] = await Promise.all([fetch("/api/deals?featured=true"), fetch("/api/deals")]);
        const featJson = await featRes.json();
        const allJson = await allRes.json();
        if (Array.isArray(featJson)) setFeatured(featJson.slice(0, 3));
        if (Array.isArray(allJson)) setAllDeals(allJson);
      } catch (err) {
        console.error("Failed to load featured deals:", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const url = submitted
          ? `/api/deals?q=${encodeURIComponent(submitted)}`
          : `/api/deals?category=${category}`;
        const res = await fetch(url);
        const json = await res.json();
        const rows: Deal[] = Array.isArray(json) ? json : [];
        const wall = submitted
          ? rows.filter((d) => classifyListing(d.title, d.category))
          : rows.filter((d) => listingMatchesCategory(d.title, d.category, category));
        setCatalog(wall);
      } catch (err) {
        console.error("Failed to load category deals:", err);
        setCatalog([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [category, submitted]);

  const consumerDeals = useMemo(
    () => allDeals.filter((d) => Boolean(classifyListing(d.title, d.category))),
    [allDeals]
  );
  const rarest = useMemo(
    () => [...consumerDeals].sort((a, b) => parseFloat(b.price.value) - parseFloat(a.price.value)).slice(0, 4),
    [consumerDeals]
  );
  const cheapest = useMemo(
    () => [...consumerDeals].sort((a, b) => parseFloat(a.price.value) - parseFloat(b.price.value)).slice(0, 4),
    [consumerDeals]
  );
  const cohortDeals = useMemo(() => {
    const street = consumerDeals.filter((d) => listingMatchesCategory(d.title, d.category, "streetwear"));
    const rows = (street.length ? street : consumerDeals).filter((d) => !d.cohort || d.cohort === cohort);
    if (cohort === "genz") {
      return rows
        .filter((d) => parseFloat(d.price.value) < 150 || /low|mid|hoodie|tee/i.test(d.title))
        .concat(rows)
        .filter((d, i, arr) => arr.findIndex((x) => x.itemId === d.itemId) === i)
        .slice(0, 4);
    }
    return rows.slice(0, 4);
  }, [consumerDeals, cohort]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) setSubmitted(query.trim());
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans scroll-smooth selection:bg-purple-500 selection:text-white">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-2.5 text-center text-xs font-black uppercase tracking-widest flex justify-between px-6 items-center flex-wrap gap-2 shadow-md">
        <span className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          LIVE VAULT DROP: SNEAKERS · STREETWEAR · COLLECTIBLES · WATCHES
        </span>
        <div className="flex gap-6 mx-auto sm:mx-0 font-bold">
          <Link href="/blog" className="hover:text-neutral-200 transition underline underline-offset-4">
            Legit Check Blog
          </Link>
          <a href="#about" className="hover:text-neutral-200 transition">
            About
          </a>
        </div>
      </div>

      <header className="max-w-7xl mx-auto px-6 py-8 border-b border-neutral-800/80 flex flex-col md:flex-row justify-between items-center gap-6 backdrop-blur-md sticky top-0 z-50 bg-neutral-950/80">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Flip Culture Logo"
              className="relative h-14 w-14 rounded-full border border-neutral-800 object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight italic bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-500">
              FLIP CULTURE
            </h1>
            <p className="text-neutral-400 text-[10px] font-bold tracking-widest uppercase mt-0.5">
              Sneakers · Streetwear · Collectibles · Watches
            </p>
          </div>
        </div>
        <nav className="flex gap-8 text-xs font-black uppercase tracking-widest items-center flex-wrap justify-center">
          <a href="#featured" className="text-neutral-400 hover:text-purple-400 transition">
            Featured
          </a>
          <a href="#hero-grid" className="text-neutral-400 hover:text-purple-400 transition">
            Grails vs Deals
          </a>
          <a href="#feed" className="text-neutral-400 hover:text-purple-400 transition">
            Live Feed
          </a>
          <Link href="/blog" className="text-neutral-400 hover:text-purple-400 transition">
            Blog
          </Link>
        </nav>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {HUBS.map((h) => (
            <Link
              key={h.href}
              href={h.href}
              className="shrink-0 px-3 py-1.5 rounded-full border border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white hover:border-purple-500"
            >
              {h.label}
            </Link>
          ))}
        </div>
      </section>

      <section id="hero-grid" className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-neutral-800 rounded-3xl p-6 bg-neutral-900/40">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">Rarest Grails</span>
            <h2 className="text-2xl font-black mt-1 mb-6">Deadstock & vintage provenance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rarest.map((d) => (
                <DealCard key={d.itemId} deal={d} metric="value" />
              ))}
            </div>
          </div>
          <div className="border border-neutral-800 rounded-3xl p-6 bg-neutral-900/40">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
              Lowest Buy-It-Now Deals
            </span>
            <h2 className="text-2xl font-black mt-1 mb-6">Active BIN prices, EPN tagged</h2>
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
              Athletic footwear, age-true streetwear, sports cards & memorabilia, and watches from Submariners to Nautilus — never mixed, never tech.
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

      <section id="cohorts" className="max-w-7xl mx-auto px-6 py-12 border-t border-neutral-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-purple-400 font-bold text-xs uppercase tracking-widest block mb-1">
              Shop by collector
            </span>
            <h2 className="text-3xl font-black tracking-tight">Gen Z, Millennial, OG</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {COHORTS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCohort(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                  cohort === c.id
                    ? "bg-purple-600 text-white"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-neutral-400 text-sm mb-6">{COHORTS.find((c) => c.id === cohort)?.blurb}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cohortDeals.map((d) => (
            <DealCard key={d.itemId} deal={d} />
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
        <div className="flex justify-center gap-3 mb-10 flex-wrap" role="tablist" aria-label="Live catalog categories">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={category === c.id && !submitted}
              onClick={() => {
                setQuery("");
                setSubmitted("");
                setCategory(c.id);
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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-neutral-900/50 animate-pulse rounded-2xl border border-neutral-800/80" />
            ))}
          </div>
        ) : catalog.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {catalog.map((deal) => (
              <DealCard key={deal.itemId} deal={deal} metric="bin" />
            ))}
          </div>
        ) : (
          <div className="text-center border border-dashed border-neutral-800 rounded-3xl py-16 px-6">
            <p className="text-sm font-bold uppercase tracking-widest text-neutral-300">
              No live {category} in the feed yet
            </p>
            <p className="text-neutral-500 text-xs mt-2 max-w-md mx-auto">
              The resale ingest is wiring {category}. We will not fill this wall with sneakers, tech, or placeholder SKUs.
            </p>
          </div>
        )}
      </section>

      <section id="about" className="max-w-7xl mx-auto px-6 py-12 border-t border-neutral-800/80">
        <span className="text-purple-400 font-bold text-xs uppercase tracking-widest">About Flip Culture</span>
        <h2 className="text-3xl font-black mt-2 mb-4">A consumer desk for culture, not computers.</h2>
        <p className="text-neutral-400 text-sm max-w-3xl leading-relaxed">
          Flip Culture tracks live marketplace bins across four walls: athletic sneakers (Jordan 1–14, Kobes, Dunks, Yeezy
          footwear), streetwear cut for 15–24 / 25–34 / 35–45, sports cards and game-used memorabilia, and watches from
          daily Rolex Sub/Datejust and Omega through Patek Nautilus, AP Royal Oak, Richard Mille, and vintage Daytona.
          Every View Drop button is eBay Partner Network tagged (campid 5339168299).
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

      <footer className="border-t border-neutral-800/80 py-12 text-center text-neutral-500 text-xs">
        <p>© {new Date().getFullYear()} Flip Culture. All rights reserved. eBay Partner Network campaign 5339168299.</p>
      </footer>
    </main>
  );
}
