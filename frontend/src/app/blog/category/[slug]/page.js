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
import { notFound } from "next/navigation";

async function getCategory(slug) {
  try {
    const res = await fetch(
      `${API_BASE}/api/blog-categories/slug/${slug}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();
    return data?.category || null;
  } catch {
    return null;
  }
}

async function getBlogs(slug) {
  try {
    const res = await fetch(
      `${API_BASE}/api/blogs?category=${slug}&limit=100`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();
    return data?.blogs || [];
  } catch {
    return [];
  }
}

async function getAllCategories() {
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

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Category Not Found | Royal Trading Component",
    };
  }

  return {
    title:
      category.metaTitle ||
      `${category.name} Blog | Royal Trading Component`,
    description:
      category.metaDescription ||
      category.description ||
      `Read ${category.name} industrial electronics blogs, buying guides and procurement articles.`,
    keywords: category.metaKeywords || [],
    alternates: {
      canonical: `https://www.royalsmd.com/blog/category/${category.slug}`,
    },
  };
}

export default async function BlogCategoryPage({ params }) {
  const { slug } = await params;

  const [category, blogs, categories] = await Promise.all([
    getCategory(slug),
    getBlogs(slug),
    getAllCategories(),
  ]);

  if (!category) notFound();

  const featuredBlog = blogs[0] || null;
  const remainingBlogs = blogs.slice(1);

  return (
    <>
      <Navbar />

      <main className="bg-white">
        {/* HERO */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-8 lg:grid-cols-[1fr_360px] xl:px-8">
            <div className="relative min-h-[380px] overflow-hidden rounded-sm bg-[#072e5d] md:min-h-[500px]">
              <img
                src={getImageUrl(
                  category.bannerImage ||
                    featuredBlog?.bannerImage ||
                    featuredBlog?.featuredImage
                )}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#021b38]/95 via-[#063b74]/70 to-transparent" />

              <div className="relative flex h-full max-w-3xl flex-col justify-end p-8 text-white md:p-12">
                <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-blue-800">
                  <BookOpen size={17} />
                  Royal Component Magazine
                </p>

                <h1 className="text-4xl font-black leading-tight md:text-6xl">
                  {category.name}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-blue-50">
                  {category.description ||
                    "Industrial electronics blogs, procurement knowledge and engineering buying guides."}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-blue-800"
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

            {/* SIDEBAR */}
            <aside className="space-y-6">
              <div className="flex h-14 items-center rounded-full border border-slate-200 bg-white px-5 shadow-sm">
                <input
                  placeholder="Search the Blog"
                  className="w-full bg-transparent text-sm font-semibold outline-none"
                />
                <Search className="text-slate-400" size={20} />
              </div>

              {featuredBlog && (
                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="group overflow-hidden rounded-sm border border-slate-200 bg-white"
                >
                  <div className="h-[420px] overflow-hidden">
                    <img
                      src={getImageUrl(
                        featuredBlog.featuredImage ||
                          featuredBlog.bannerImage
                      )}
                      alt={featuredBlog.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">
                      Featured Article
                    </p>

                    <h2 className="mt-2 line-clamp-2 text-2xl font-black leading-tight text-slate-950">
                      {featuredBlog.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {featuredBlog.excerpt?.slice(0, 120)}...
                    </p>
                  </div>
                </Link>
              )}
            </aside>
          </div>
        </section>

        {/* CATEGORY NAV */}
        <section className="bg-[#f4f8ff] py-7">
          <div className="mx-auto max-w-[1500px] px-5 xl:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/blog/category/${cat.slug}`}
                  className={`rounded-full border px-5 py-3 text-sm font-black shadow-sm transition ${
                    cat.slug === slug
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-blue-100 bg-white text-slate-800 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BLOG GRID */}
        <section className="mx-auto max-w-[1500px] px-5 py-10 xl:px-8">
          <div className="mb-7 flex items-center justify-between border-b border-slate-300 pb-3">
            <h2 className="border-b-2 border-slate-950 pb-2 text-3xl font-black text-slate-950">
              {category.name} Articles
            </h2>

            <p className="text-sm font-bold text-slate-500">
              {blogs.length} Articles
            </p>
          </div>

          {blogs.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blog/${blog.slug}`}
                  className="group overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img
                      src={getImageUrl(
                        blog.featuredImage || blog.bannerImage
                      )}
                      alt={blog.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 shadow">
                      {category.name}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={13} />
                        {formatDate(
                          blog.publishedAt || blog.createdAt
                        )}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Clock size={13} />
                        {blog.readTime || 5} min read
                      </span>
                    </div>

                    <h3 className="mt-4 line-clamp-2 min-h-[68px] text-2xl font-black leading-8 text-slate-950">
                      {blog.title}
                    </h3>

                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">
                      {blog.excerpt ||
                        "Read industrial electronics procurement guides, sourcing knowledge and technical buying articles."}
                    </p>

                    {blog.tags?.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 border-b-2 border-blue-600 text-xs font-black text-blue-700"
                          >
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-slate-200 bg-white p-14 text-center">
              <h3 className="text-2xl font-black text-slate-950">
                No Blogs Found
              </h3>

              <p className="mt-3 text-base text-slate-600">
                Publish blogs in this category from admin panel.
              </p>
            </div>
          )}
        </section>

        {/* PROCUREMENT CTA */}
        <section className="mx-auto max-w-[1500px] px-5 pb-12 xl:px-8">
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
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-black text-blue-800"
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