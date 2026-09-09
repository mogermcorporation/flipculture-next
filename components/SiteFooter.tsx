export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-800/80 py-12 text-center text-neutral-500 text-xs bg-neutral-950">
      <p>© {new Date().getFullYear()} Flip Culture. All rights reserved. eBay Partner Network campaign 5339168299.</p>
      <p className="mt-3">
        <a href="/rss.xml" className="text-neutral-400 hover:text-purple-300 underline underline-offset-4">
          RSS
        </a>
      </p>
    </footer>
  );
}
