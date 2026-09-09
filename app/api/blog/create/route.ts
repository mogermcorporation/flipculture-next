import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { isWallId, slugify, type WallId } from "@/lib/journal";
import { parsePost, serializeFrontmatter } from "@/lib/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOW = "POST";
const JOURNAL_DIR = path.join(process.cwd(), "content/journal");
const PUBLIC_DIR = path.join(process.cwd(), "public/journal");

function methodNotAllowed() {
  return NextResponse.json({ error: "Method not allowed", allow: ["POST"] }, { status: 405, headers: { Allow: ALLOW } });
}

export async function GET() {
  return methodNotAllowed();
}

export async function OPTIONS() {
  return methodNotAllowed();
}

function bearerToken(req: NextRequest): string | null {
  const header = req.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function extFromType(type: string, fallbackUrl = ""): string {
  if (type.includes("png")) return ".png";
  if (type.includes("webp")) return ".webp";
  if (type.includes("gif")) return ".gif";
  if (type.includes("jpeg") || type.includes("jpg")) return ".jpg";
  const fromUrl = fallbackUrl.split("?")[0].split(".").pop()?.toLowerCase();
  if (fromUrl && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromUrl)) {
    return fromUrl === "jpeg" ? ".jpg" : `.${fromUrl}`;
  }
  return ".jpg";
}

async function persistImage(opts: {
  slug: string;
  image?: string;
  file?: File | null;
}): Promise<{ publicPath: string } | { error: string; status: number }> {
  if (opts.file && opts.file.size > 0) {
    const ext = extFromType(opts.file.type || "", opts.file.name);
    const filename = `${opts.slug}${ext}`;
    const dest = path.join(PUBLIC_DIR, filename);
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    const buf = Buffer.from(await opts.file.arrayBuffer());
    fs.writeFileSync(dest, buf);
    return { publicPath: `/journal/${filename}` };
  }

  const image = (opts.image || "").trim();
  if (!image) return { error: "image is required", status: 400 };

  if (image.startsWith("/journal/")) {
    const local = path.join(process.cwd(), "public", image.replace(/^\//, ""));
    if (!fs.existsSync(local)) return { error: "image file not found under public/journal/", status: 400 };
    return { publicPath: image };
  }

  if (image.startsWith("data:")) {
    const match = image.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!match) return { error: "invalid data URL for image", status: 400 };
    const ext = extFromType(match[1]);
    const filename = `${opts.slug}${ext}`;
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    fs.writeFileSync(path.join(PUBLIC_DIR, filename), Buffer.from(match[2], "base64"));
    return { publicPath: `/journal/${filename}` };
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    const res = await fetch(image);
    if (!res.ok) return { error: "failed to download image URL", status: 400 };
    const type = res.headers.get("content-type") || "";
    const ext = extFromType(type, image);
    const filename = `${opts.slug}${ext}`;
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    fs.writeFileSync(path.join(PUBLIC_DIR, filename), Buffer.from(await res.arrayBuffer()));
    return { publicPath: `/journal/${filename}` };
  }

  return { error: "image must be a /journal path, http(s) URL, data URL, or uploaded file", status: 400 };
}

export async function POST(req: NextRequest) {
  const secret = process.env.AGENT_BLOG_SECRET;
  if (!secret) {
    return NextResponse.json(
      {
        ok: false,
        error: "AGENT_BLOG_SECRET is unset",
        hint: "Add AGENT_BLOG_SECRET in Vercel project env (Production + Preview) and locally in .env.local. The route exists; publishing is disabled until the secret is set."
      },
      { status: 503 }
    );
  }

  const token = bearerToken(req);
  if (!token || token !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let title = "";
    let slug = "";
    let excerpt = "";
    let body = "";
    let image = "";
    let imageAlt = "";
    let tags: string[] = [];
    let relatedWalls: WallId[] = [];
    let featured = false;
    let file: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      title = String(form.get("title") || "");
      slug = String(form.get("slug") || "");
      excerpt = String(form.get("excerpt") || form.get("description") || "");
      body = String(form.get("body") || "");
      image = String(form.get("image") || "");
      imageAlt = String(form.get("imageAlt") || "");
      tags = String(form.get("tags") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      relatedWalls = String(form.get("relatedWalls") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(isWallId);
      featured = String(form.get("featured") || "") === "true";
      const uploaded = form.get("file") || form.get("imageFile");
      if (uploaded instanceof File) file = uploaded;
    } else {
      const json = await req.json();
      title = String(json.title || "");
      slug = String(json.slug || "");
      excerpt = String(json.excerpt || json.description || "");
      body = String(json.body || "");
      image = String(json.image || "");
      imageAlt = String(json.imageAlt || "");
      tags = Array.isArray(json.tags) ? json.tags.map(String) : [];
      relatedWalls = Array.isArray(json.relatedWalls) ? json.relatedWalls.map(String).filter(isWallId) : [];
      featured = Boolean(json.featured);
    }

    title = title.trim();
    excerpt = excerpt.trim();
    body = body.trim();
    imageAlt = imageAlt.trim();
    slug = slugify(slug || title);
    if (!title) return NextResponse.json({ ok: false, error: "title is required" }, { status: 400 });
    if (!slug) return NextResponse.json({ ok: false, error: "slug is required" }, { status: 400 });
    if (!excerpt) return NextResponse.json({ ok: false, error: "excerpt is required" }, { status: 400 });
    if (!body) return NextResponse.json({ ok: false, error: "body markdown is required" }, { status: 400 });
    if (!image && !file) return NextResponse.json({ ok: false, error: "image is required" }, { status: 400 });

    const saved = await persistImage({ slug, image, file });
    if ("error" in saved) return NextResponse.json({ ok: false, error: saved.error }, { status: saved.status });

    const date = new Date().toISOString().slice(0, 10);
    const fm = serializeFrontmatter({
      title,
      excerpt,
      date,
      author: "Flip Culture",
      image: saved.publicPath,
      imageAlt: imageAlt || title,
      tags,
      relatedWalls,
      featured
    });
    const markdown = `${fm}\n${body}\n`;
    const parsed = parsePost(slug, markdown);
    if (!parsed?.image) {
      return NextResponse.json({ ok: false, error: "image is required" }, { status: 400 });
    }

    fs.mkdirSync(JOURNAL_DIR, { recursive: true });
    const mdPath = path.join(JOURNAL_DIR, `${slug}.md`);
    fs.writeFileSync(mdPath, markdown, "utf8");

    return NextResponse.json({
      ok: true,
      slug,
      path: `/blog/${slug}`,
      image: saved.publicPath,
      file: `content/journal/${slug}.md`,
      note: process.env.VERCEL
        ? "Vercel serverless filesystems are ephemeral. Commit content/journal and public/journal to restore-deals for a lasting publish."
        : undefined
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid request";
    const readOnly = /erofs|read-only/i.test(message);
    return NextResponse.json(
      {
        ok: false,
        error: readOnly
          ? "Filesystem is read-only on this host. Commit Markdown under content/journal/ with a required image under public/journal/."
          : message
      },
      { status: 400 }
    );
  }
}
