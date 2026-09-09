import Link from "next/link";

export default function SiteHeader({ brandAs = "p" }: { brandAs?: "h1" | "p" }) {
  const BrandTag = brandAs === "h1" ? "h1" : "p";
  return (
    <header className="bg-neutral-950 text-white">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-2.5 text-center text-xs font-black uppercase tracking-widest flex justify-between px-6 items-center flex-wrap gap-2 shadow-md">
        <span className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          LIVE VAULT DROP: SNEAKERS · STREETWEAR · COLLECTIBLES · WATCHES
        </span>
        <div className="flex gap-6 mx-auto sm:mx-0 font-bold">
          <Link href="/blog" className="hover:text-neutral-200 transition underline underline-offset-4">
            Legit Check Blog
          </Link>
          <a href="/#about" className="hover:text-neutral-200 transition">
            About
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 border-b border-neutral-800/80 flex flex-col md:flex-row justify-between items-center gap-6 backdrop-blur-md sticky top-0 z-50 bg-neutral-950/80">
        <Link href="/" className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Flip Culture logo"
              width={56}
              height={56}
              className="relative h-14 w-14 rounded-full border border-neutral-800 object-cover"
            />
          </div>
          <div>
            <BrandTag className="text-3xl font-black tracking-tight italic bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-500">
              FLIP CULTURE
            </BrandTag>
            <p className="text-neutral-400 text-[10px] font-bold tracking-widest uppercase mt-0.5">
              Sneakers · Streetwear · Collectibles · Watches
            </p>
          </div>
        </Link>
        <nav aria-label="Primary" className="flex gap-8 text-xs font-black uppercase tracking-widest items-center flex-wrap justify-center">
          <a href="/#featured" className="text-neutral-400 hover:text-purple-400 transition">
            Featured
          </a>
          <a href="/#hero-grid" className="text-neutral-400 hover:text-purple-400 transition">
            Grails vs Deals
          </a>
          <a href="/#feed" className="text-neutral-400 hover:text-purple-400 transition">
            Live Feed
          </a>
          <Link href="/blog" className="text-neutral-400 hover:text-purple-400 transition">
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
