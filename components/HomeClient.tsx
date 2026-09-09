"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { withEpn, imageUrl } from "@/lib/epn";
import type { Deal } from "@/lib/types";

const CATEGORIES = [
  { id: "sneakers", label: "Sneakers" },
  { id: "streetwear", label: "Streetwear" },
  { id: "laptops", label: "Laptops" },
  { id: "handhelds", label: "Handhelds" },
  { id: "battlestation", label: "Battlestation" },
  { id: "collectibles", label: "Collectibles" }
];

const COHORTS = [
  {
    id: "genz",
    label: "Gen Z 15–25",
    blurb: "Steals under $150, Jordan 1 Lows/Mids, viral colorways."
  },
  {
    id: "millennial",
    label: "Millennials 25–35",
    blurb: "Retro highs, Jordan 3/4/11 grails, value-tracking metrics."
  },
  {
    id: "og",
    label: "OG Collectors 36–45",
    blurb: "1985–1999 originals, deadstock grails, vintage provenance."
  }
] as const;

function money(value?: string) {
  const n = parseFloat(String(value ?? ""));
  if (!Number.isFinite(n)) return "N/A";
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function DealCard({
  deal,
  vaultIndex,
  metric
}: {
  deal: Deal;
  vaultIndex?: number;
  metric?: "value" | "bin";
}) {
  const href = withEpn(deal.itemWebUrl);
  const label = metric === "bin" ? "BUY IT NOW" : "CURRENT VALUE";
  return (
    <div className="relative group bg-neutral-900/90 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-2xl hover:border-purple-500 transition-all duration-300 hover:-translate-y-1.5">
      <div className="relative z-10">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-56 bg-neutral-950 rounded-xl overflow-hidden mb-4 border border-neutral-800/80 flex items-center justify-center p-4 relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl(deal)}
            alt={deal.title}
            className="h-full w-full object-contain group-hover:scale-105 transition duration-500"
          />
          {typeof vaultIndex === "number" ? (
            <span className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase shadow-md">
              VAULT #{vaultIndex}
            </span>
          ) : (
            <span className="absolute top-2 left-2 bg-black/80 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
              VERIFIED
            </span>
          )}
        </a>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-base line-clamp-2 text-white hover:text-purple-400 transition leading-snug"
        >
          {deal.title}
        </a>
        {deal.soldAvg ? (
          <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-wider">
            Sold avg ${money(String(deal.soldAvg))}
            {deal.discountPercent ? ` · ${deal.discountPercent}% under` : ""}
          </p>
        ) : null}
      </div>
      <div className="relative z-10 mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">{label}</span>
          <span className="text-xl font-black text-emerald-400">${money(deal.price?.value)}</span>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/30 uppercase tracking-wider"
        >
          View Drop
        </a>
      </div>
    </div>
  );
}

export default function HomeClient() {
  const [featured, setFeatured] = useState<Deal[]>([]);
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [catalog, setCatalog] = useState<Deal[]>([]);
  const [category, setCategory] = useState("sneakers");
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
        setCatalog(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error("Failed to load category deals:", err);
        setCatalog([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [category, submitted]);

  const rarest = useMemo(
    () => [...allDeals].sort((a, b) => parseFloat(b.price.value) - parseFloat(a.price.value)).slice(0, 4),
    [allDeals]
  );
  const cheapest = useMemo(
    () => [...allDeals].sort((a, b) => parseFloat(a.price.value) - parseFloat(b.price.value)).slice(0, 4),
    [allDeals]
  );
  const cohortDeals = useMemo(() => {
    const rows = allDeals.filter((d) => d.cohort === cohort);
    if (cohort === "genz") {
      return rows
        .filter((d) => parseFloat(d.price.value) < 150 || /low|mid/i.test(d.title))
        .concat(rows)
        .filter((d, i, arr) => arr.findIndex((x) => x.itemId === d.itemId) === i)
        .slice(0, 4);
    }
    return rows.slice(0, 4);
  }, [allDeals, cohort]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) setSubmitted(query.trim());
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans scroll-smooth selection:bg-purple-500 selection:text-white">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-2.5 text-center text-xs font-black uppercase tracking-widest flex justify-between px-6 items-center flex-wrap gap-2 shadow-md">
        <span className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          LIVE VAULT DROP: REAL-TIME MARKETPLACE STREAMING
        </span>
        <div className="flex gap-6 mx-auto sm:mx-0 font-bold">
          <Link href="/blog" className="hover:text-neutral-200 transition underline underline-offset-4">
            Legit Check Blog
          </Link>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-200 transition"
          >
            Facebook Hub
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
              CURATED GRAILS • TECH • STREETWEAR
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
            Query thousands of live marketplace listings with instant authenticity filters applied.
          </p>
        </div>
        <form onSubmit={onSearch} className="max-w-2xl mx-auto flex gap-3 mb-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search grails (e.g. 'Jordan 4', 'RTX 4090')..."
            className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl px-5 py-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:opacity-90 transition shadow-lg shadow-purple-600/20"
          >
            Search
          </button>
        </form>
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {catalog.map((deal) => (
              <DealCard key={deal.itemId} deal={deal} metric="bin" />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-neutral-800/80 py-12 text-center text-neutral-500 text-xs">
        <p>© {new Date().getFullYear()} Flip Culture. All rights reserved. eBay Partner Network campaign 5339168299.</p>
      </footer>
    </main>
  );
}
