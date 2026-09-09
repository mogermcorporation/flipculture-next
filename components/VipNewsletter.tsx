"use client";

import { FormEvent, useState } from "react";

export default function VipNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value })
      });
      setStatus(res.ok ? "ok" : "err");
      if (res.ok) setEmail("");
    } catch {
      setStatus("err");
    }
  }

  return (
    <section id="vip" className="max-w-7xl mx-auto px-6 py-12">
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/80 to-neutral-950 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <span className="text-purple-300 font-bold text-xs uppercase tracking-widest">VIP list</span>
          <h2 className="text-3xl font-black mt-2">Flip Culture newsletter</h2>
          <p className="text-neutral-400 text-sm mt-2 max-w-lg">
            Restock alerts for sneakers, streetwear, sports cards, and watches. No laptops. No GPU drops.
          </p>
        </div>
        <form onSubmit={onSubmit} className="w-full md:w-[28rem] flex gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@inbox.com"
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-2xl px-4 py-3 text-sm"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-2xl"
          >
            Join
          </button>
        </form>
      </div>
      {status === "ok" ? (
        <p className="text-emerald-400 text-xs mt-3">You are on the list.</p>
      ) : null}
      {status === "err" ? (
        <p className="text-red-400 text-xs mt-3">Could not save that email. Try again.</p>
      ) : null}
    </section>
  );
}
