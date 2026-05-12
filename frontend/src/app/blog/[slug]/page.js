import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Search,
  Tag,
  User,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { notFound } from "next/navigation";

async function getBlog(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/blogs/slug/${slug}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data?.blog || null;
  } catch {
    return null;
  }
}

async function getBlogs() {
  try {
    const res = await fetch(`${API_BASE}/api/blogs?limit=12`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data?.blogs || [];
  } catch {
    return [];
  }
}

async function getRelatedBlogs(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/blogs/related/${slug}`, {
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

function siteUrl(path = "") {
  return `https://www.royalsmd.com${path}`;
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
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | Royal Trading Component",
    };
  }

  const canonical = blog.canonicalUrl || siteUrl(`/blog/${blog.slug}`);

  return {
    title: blog.metaTitle || blog.title,
    description:
      blog.metaDescription ||
      blog.excerpt ||
      "Industrial electronics blog by Royal Trading Component.",
    keywords: blog.metaKeywords || blog.tags || [],
    alternates: { canonical },
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt || "",
      url: canonical,
      type: "article",
      images: [
        {
          url: getImageUrl(blog.bannerImage || blog.featuredImage),
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
  };
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;

  const [blog, allBlogs, relatedBlogs, categories] = await Promise.all([
    getBlog(slug),
    getBlogs(),
    getRelatedBlogs(slug),
    getCategories(),
  ]);

  if (!blog) notFound();

  const recentPosts = allBlogs.filter((b) => b.slug !== blog.slug).slice(0, 4);
  const finalRelated =
    relatedBlogs.length > 0
      ? relatedBlogs.filter((b) => b.slug !== blog.slug).slice(0, 6)
      : recentPosts.slice(0, 6);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.metaDescription || blog.excerpt,
    image: getImageUrl(blog.bannerImage || blog.featuredImage),
    author: {
      "@type": "Organization",
      name: blog.authorName || "Royal Trading Component",
    },
    publisher: {
      "@type": "Organization",
      name: "Royal Trading Component",
      logo: {
        "@type": "ImageObject",
        url: siteUrl("/logo.png"),
      },
    },
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": siteUrl(`/blog/${blog.slug}`),
    },
  };

  const faqSchema =
    blog.faqs?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: blog.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <Navbar />

      <main className="bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}

        <section className="mx-auto max-w-[1500px] px-5 py-8 xl:px-8">
          <div className="mb-4 text-sm font-semibold text-slate-500">
            <Link href="/blog" className="hover:text-blue-700">
              Blog
            </Link>{" "}
            »{" "}
            <Link
              href={`/blog/category/${blog.category}`}
              className="hover:text-blue-700"
            >
              {blog.category}
            </Link>{" "}
            » {blog.title}
          </div>

          <div className="grid gap-9 lg:grid-cols-[1fr_380px]">
            {/* LEFT ARTICLE */}
            <article>
              <Link
                href="/blog"
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft size={16} />
                Back to Blog
              </Link>

              <h1 className="max-w-5xl text-4xl font-black leading-tight text-slate-950 md:text-5xl">
                {blog.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <User size={16} />
                  {blog.authorName || "Royal Trading Component"}
                </span>

                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Clock size={16} />
                  {blog.readTime || 5} min read
                </span>
              </div>

              <div className="mt-6 overflow-hidden rounded-sm border border-slate-200">
                <img
                  src={getImageUrl(blog.bannerImage || blog.featuredImage)}
                  alt={blog.title}
                  className="h-[360px] w-full object-cover md:h-[520px]"
                />
              </div>

              <div className="prose-blog mt-8">
                {blog.excerpt && (
                  <p className="text-xl leading-9 text-slate-700">
                    {blog.excerpt}
                  </p>
                )}

                <div className="mt-7 whitespace-pre-line text-lg leading-9 text-slate-800">
                  {blog.content}
                </div>

                {(blog.sections || []).map((section, index) => (
                  <section key={index} className="mt-9">
                    <h2 className="mb-4 text-3xl font-black leading-tight text-slate-950">
                      {section.heading}
                    </h2>

                    {section.image && (
                      <div className="my-6 overflow-hidden rounded-sm border border-slate-200">
                        <img
                          src={getImageUrl(section.image)}
                          alt={section.heading}
                          className="max-h-[460px] w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="whitespace-pre-line text-lg leading-9 text-slate-800">
                      {section.content}
                    </div>
                  </section>
                ))}

                {blog.faqs?.length > 0 && (
                  <section className="mt-12">
                    <h2 className="mb-5 flex items-center gap-2 text-3xl font-black text-slate-950">
                      <HelpCircle className="text-blue-700" />
                      FAQs
                    </h2>

                    <div className="space-y-4">
                      {blog.faqs.map((faq, index) => (
                        <div
                          key={index}
                          className="rounded-sm border border-slate-200 bg-slate-50 p-5"
                        >
                          <h3 className="text-lg font-black text-slate-950">
                            {faq.question}
                          </h3>
                          <p className="mt-2 text-base leading-8 text-slate-700">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <div className="mt-12 border-y border-slate-200 py-6">
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm bg-blue-700 text-xl font-black text-white">
                      RC
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-950">
                        {blog.authorName || "Royal Trading Component"}
                      </h3>
                      <p className="text-sm font-bold text-blue-700">
                        {blog.authorRole ||
                          "Industrial Electronics Procurement Team"}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        Royal Trading Component publishes industrial electronics
                        guides for engineers, OEM buyers, panel builders,
                        maintenance teams and procurement departments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* RIGHT SIDEBAR */}
            <aside>
              <div className="sticky top-24 space-y-8">
                <div className="flex h-14 items-center rounded-full border border-slate-200 bg-white px-5 shadow-sm">
                  <input
                    placeholder="Search the Blog"
                    className="w-full bg-transparent text-sm font-semibold outline-none"
                  />
                  <Search className="text-slate-400" size={20} />
                </div>

                <SidebarBox title="Recent Post">
                  <div className="space-y-5">
                    {recentPosts.map((item) => (
                      <Link
                        key={item._id}
                        href={`/blog/${item.slug}`}
                        className="grid grid-cols-[90px_1fr] gap-4"
                      >
                        <img
                          src={getImageUrl(item.featuredImage || item.bannerImage)}
                          alt={item.title}
                          className="h-24 w-full rounded-sm object-cover"
                        />
                        <div>
                          <h3 className="line-clamp-2 text-base font-bold leading-6 text-slate-950 hover:text-blue-700">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-400">
                            {formatDate(item.publishedAt || item.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </SidebarBox>

                <SidebarBox title="Categories">
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/blog/category/${cat.slug}`}
                        className="block text-base font-semibold text-blue-700 hover:text-slate-950"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </SidebarBox>

                {blog.tags?.length > 0 && (
                  <SidebarBox title="Tags">
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 border-b-2 border-blue-600 text-sm font-bold text-blue-700"
                        >
                          <Tag size={13} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </SidebarBox>
                )}

                <div className="rounded-[28px] border border-sky-200 bg-gradient-to-br from-sky-100 via-sky-200 to-cyan-200 p-6 shadow-[0_15px_40px_rgba(14,165,233,0.18)]">
                  <h2 className="text-2xl font-black text-slate-950">
                    Need Components?
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    Send BOM, part number, quantity or datasheet. We help with
                    industrial electronics sourcing.
                  </p>
                  <Link
                    href="/request-component"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-blue-800"
                  >
                    Request Now <ArrowRight size={17} />
                  </Link>
                </div>

                <SidebarBox title="Buyer Support">
                  <div className="space-y-3">
                    {[
                      "Bulk quantity sourcing",
                      "MOQ and RFQ support",
                      "Part-number based assistance",
                      "Industrial-grade components",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-sm bg-blue-50 px-4 py-3 text-sm font-black text-slate-700"
                      >
                        <ShieldCheck size={16} className="text-blue-700" />
                        {item}
                      </div>
                    ))}
                  </div>
                </SidebarBox>
              </div>
            </aside>
          </div>

          {/* RELATED POSTS */}
          {finalRelated.length > 0 && (
            <section className="mt-14">
              <div className="mb-5 flex items-center justify-between border-b border-slate-300 pb-3">
                <h2 className="border-b-2 border-slate-950 pb-2 text-2xl font-black text-slate-950">
                  Related Post
                </h2>
                <Link href="/blog" className="text-sm font-bold text-slate-950">
                  View All
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {finalRelated.slice(0, 4).map((item) => (
                  <RelatedCard key={item._id} blog={item} />
                ))}
              </div>
            </section>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

function SidebarBox({ title, children }) {
  return (
    <div>
      <h2 className="mb-4 border-b border-slate-300 pb-3 text-2xl font-black text-slate-950">
        {title}
      </h2>
      {children}
    </div>
  );
}

function RelatedCard({ blog }) {
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