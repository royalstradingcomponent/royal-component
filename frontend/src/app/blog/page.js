import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  Search,
  Tag,
} from "lucide-react";

async function getBlogs() {
  try {
    const res = await fetch(`${API_BASE}/api/blogs?limit=60`, {
      cache: "no-store",
    });

    const data = await res.json();
    return data?.blogs || [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/blog-categories`, {
      cache: "no-store",
    });

    const data = await res.json();
    return data?.categories || [];
  } catch {
    return [];
  }
}

function getImageUrl(url) {
  if (!url) return "/banner/royal-hero-banner.jpg";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

function formatDate(date) {
  if (!date) return "Recently";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getByCategory(blogs, slug, limit = 2) {
  return blogs.filter((b) => b.category === slug).slice(0, limit);
}

export const metadata = {
  title:
    "Industrial Electronics Blog | Semiconductors, Automation & Components Guide",
  description:
    "Read expert blogs on industrial electronics, semiconductors, automation components, sensors, relays, power supplies, PCB parts and electronic component sourcing by Royal Trading Component.",
  keywords: [
    "industrial electronics blog",
    "electronic components guide",
    "semiconductor supplier India",
    "automation components",
    "industrial components supplier",
    "electronics procurement guide",
    "Royal Trading Component",
  ],
  alternates: {
    canonical: "https://www.royalsmd.com/blog",
  },
};

export default async function BlogPage() {
  const [blogs, categories] = await Promise.all([getBlogs(), getCategories()]);

  const recentPosts = blogs.slice(0, 4);
  const popularPosts =
    blogs.filter((b) => b.isTrending).slice(0, 4).length > 0
      ? blogs.filter((b) => b.isTrending).slice(0, 4)
      : blogs.slice(0, 4);

  const featuredBlog =
    blogs.find((b) => b.isFeatured) || blogs[0] || null;

  const semiconductorBlogs =
    getByCategory(blogs, "semiconductors", 2).length > 0
      ? getByCategory(blogs, "semiconductors", 2)
      : blogs.slice(0, 2);

  const automationBlogs =
    getByCategory(blogs, "industrial-automation", 2).length > 0
      ? getByCategory(blogs, "industrial-automation", 2)
      : blogs.slice(2, 4);

  const buyingGuideBlogs =
    blogs
      .filter(
        (b) =>
          b.tags?.some((t) =>
            t.toLowerCase().includes("buy")
          ) ||
          b.title?.toLowerCase().includes("buy") ||
          b.title?.toLowerCase().includes("guide")
      )
      .slice(0, 2);

  const procurementBlogs =
    blogs
      .filter(
        (b) =>
          b.tags?.some((t) =>
            t.toLowerCase().includes("procurement")
          ) ||
          b.title?.toLowerCase().includes("procurement") ||
          b.title?.toLowerCase().includes("supplier")
      )
      .slice(0, 2);

  return (
    <>
      <Navbar />

      <main className="bg-white">
        {/* TOP MAGAZINE HERO */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-8 lg:grid-cols-[1fr_360px] xl:px-8">
            <div className="relative min-h-[420px] overflow-hidden rounded-sm bg-[#072e5d] md:min-h-[520px]">
              <img
                src={getImageUrl(
                  featuredBlog?.bannerImage || featuredBlog?.featuredImage
                )}
                alt={featuredBlog?.title || "Royal Component Blog"}
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#021b38]/95 via-[#063b74]/70 to-transparent" />

              <div className="relative flex h-full max-w-3xl flex-col justify-end p-8 text-white md:p-12">
                <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-blue-800">
                  <BookOpen size={17} />
                  Royal Component Magazine
                </p>

                <h1 className="text-4xl font-black leading-tight md:text-6xl">
                  Industrial Electronics, Semiconductors & Automation Blog
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-blue-50">
                  Expert articles for engineers, buyers and procurement teams
                  on electronic components, ICs, sensors, relays, connectors,
                  power supplies, PCB parts and industrial sourcing.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-black text-white shadow-[0_10px_30px_rgba(14,165,233,0.35)] transition-all duration-300 hover:bg-sky-600 hover:scale-[1.03]"
                  >
                    Explore Products <ArrowRight size={17} />
                  </Link>

                  <Link
                    href="/request-component"
                    className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur"
                  >
                    Request BOM
                  </Link>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="flex h-14 items-center rounded-full border border-slate-200 bg-white px-5 shadow-sm">
                <input
                  placeholder="Search the Blog"
                  className="w-full bg-transparent text-sm font-semibold outline-none"
                />
                <Search className="text-slate-400" size={20} />
              </div>

              <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
                <div className="h-[420px] overflow-hidden">
                  <img
                    src={getImageUrl(
                      featuredBlog?.featuredImage || featuredBlog?.bannerImage
                    )}
                    alt="Industrial electronics guide"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">
                    Featured Guide
                  </p>
                  <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950">
                    {featuredBlog?.title ||
                      "Industrial Component Buying Guide"}
                  </h2>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* RECENT POSTS */}
        <MagazineSection title="Recent Posts" viewLink="/blog">
          {recentPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {recentPosts.map((blog) => (
                <SmallMagazineCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </MagazineSection>

        {/* MOST POPULAR */}
        <MagazineSection title="Most Popular Posts" viewLink="/blog">
          {popularPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {popularPosts.map((blog) => (
                <SmallMagazineCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </MagazineSection>

        {/* CATEGORY STRIP */}
        <section className="bg-[#f4f8ff] py-8">
          <div className="mx-auto max-w-[1500px] px-5 xl:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.slice(0, 10).map((cat) => (
                <Link
                  key={cat._id}
                  href={`/blog/category/${cat.slug}`}
                  className="rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-sm hover:bg-blue-700 hover:text-white"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* TWO COLUMN BIG SECTIONS */}
        <section className="mx-auto max-w-[1500px] px-5 py-10 xl:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <BigBlock title="Semiconductor Guides" blogs={semiconductorBlogs} />
            <BigBlock title="Automation Guides" blogs={automationBlogs} />
            <BigBlock
              title="Buying Guide"
              blogs={buyingGuideBlogs.length ? buyingGuideBlogs : blogs.slice(0, 2)}
            />
            <BigBlock
              title="Procurement Guide"
              blogs={procurementBlogs.length ? procurementBlogs : blogs.slice(1, 3)}
            />
          </div>
        </section>

        {/* ALL CATEGORIES WITH POSTS */}
        <section className="bg-[#f4f8ff] py-10">
          <div className="mx-auto max-w-[1500px] px-5 xl:px-8">
            <div className="mb-8 flex items-end justify-between border-b border-slate-300 pb-3">
              <h2 className="text-3xl font-black text-slate-950">
                Explore by Department
              </h2>
              <Link
                href="/products"
                className="text-sm font-black text-blue-700"
              >
                Shop Components
              </Link>
            </div>

            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat._id}
                  href={`/blog/category/${cat.slug}`}
                  className="group overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={getImageUrl(cat.image)}
                      alt={cat.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-2xl font-black text-slate-950">
                      {cat.name}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                      {cat.description ||
                        "Read industrial electronics buying guides, component selection tips and sourcing knowledge."}
                    </p>
                    <p className="mt-4 text-sm font-black text-blue-700">
                      {cat.blogCount || 0} Articles
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-[1500px] px-5 py-12 xl:px-8">
          <div className="grid overflow-hidden rounded-sm bg-gradient-to-r from-[#062a54] via-[#075b9d] to-[#13b8f0] text-white lg:grid-cols-[1fr_420px]">
            <div className="p-8 md:p-12">
              <h2 className="text-4xl font-black leading-tight">
                Need Industrial Electronic Components?
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-8 text-blue-50">
                Share your BOM, part number, image or datasheet. Royal Trading
                Component helps businesses source semiconductors, sensors,
                relays, connectors, power supplies and hard-to-find industrial
                components.
              </p>

              <Link
                href="/request-component"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-sky-500 px-7 py-3 text-sm font-black text-white shadow-[0_10px_30px_rgba(14,165,233,0.35)] transition-all duration-300 hover:bg-sky-600 hover:scale-[1.03]"
              >
                Request Component <ArrowRight size={17} />
              </Link>
            </div>

            <div className="min-h-[280px]">
              <img
                src="/banner/procurement-support-banner.png"
                alt="Royal Component procurement support"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function MagazineSection({ title, viewLink, children }) {
  return (
    <section className="mx-auto max-w-[1500px] px-5 py-8 xl:px-8">
      <div className="mb-5 flex items-center justify-between border-b border-slate-300 pb-3">
        <h2 className="border-b-2 border-slate-950 pb-2 text-2xl font-black text-slate-950">
          {title}
        </h2>

        <Link href={viewLink} className="text-sm font-bold text-slate-950">
          View All
        </Link>
      </div>

      {children}
    </section>
  );
}

function SmallMagazineCard({ blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="h-44 overflow-hidden bg-slate-100">
        <img
          src={getImageUrl(blog.featuredImage || blog.bannerImage)}
          alt={blog.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 min-h-[54px] text-lg font-black leading-7 text-slate-950">
          {blog.title}
        </h3>

        <p className="mt-3 text-sm font-bold text-blue-700">
          {blog.readTime || 5} min read
        </p>

        <p className="mt-1 text-sm text-slate-700">
          {formatDate(blog.publishedAt || blog.createdAt)}
        </p>
      </div>
    </Link>
  );
}

function BigBlock({ title, blogs = [] }) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between border-b border-slate-300 pb-3">
        <h2 className="border-b-2 border-slate-950 pb-2 text-2xl font-black text-slate-950">
          {title}
        </h2>

        <Link href="/blog" className="text-sm font-bold text-slate-950">
          View All
        </Link>
      </div>

      <div className="space-y-6">
        {blogs.map((blog) => (
          <Link
            key={blog._id}
            href={`/blog/${blog.slug}`}
            className="group block overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
          >
            <div className="h-[310px] overflow-hidden bg-slate-100">
              <img
                src={getImageUrl(blog.bannerImage || blog.featuredImage)}
                alt={blog.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-5">
              <h3 className="line-clamp-2 text-2xl font-black leading-8 text-slate-950">
                {blog.title}
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {(blog.tags || []).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 border-b-2 border-blue-600 text-sm font-bold text-blue-700"
                  >
                    <Tag size={13} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-sm border border-slate-200 bg-white p-10 text-center">
      <h3 className="text-xl font-black text-slate-950">
        No published blogs found.
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Publish blogs from admin panel to show here.
      </p>
    </div>
  );
}