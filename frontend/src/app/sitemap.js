const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.royalsmd.com";

async function fetchAPI(endpoint) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    return await res.json();
  } catch (error) {
    console.error("Sitemap API Error:", endpoint, error);
    return [];
  }
}

export default async function sitemap() {
  const currentDate = new Date();

  // =========================
  // STATIC PAGES
  // =========================
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/faq",
    "/products",
    "/wishlist",
    "/cart",
    "/checkout",
    "/track",
    "/request-component",
    "/buy-again",
    "/orders",
    "/account",
    "/coupons",
  ];

  const staticUrls = staticPages.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  // =========================
  // BLOGS
  // =========================
  const blogs = await fetchAPI("/api/blogs");

  const blogUrls = (blogs?.blogs || blogs || []).map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || blog.createdAt || currentDate),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // =========================
  // BLOG CATEGORIES
  // =========================
  const blogCategories = await fetchAPI("/api/blog-categories");

  const blogCategoryUrls = (
    blogCategories?.categories ||
    blogCategories ||
    []
  ).map((category) => ({
    url: `${BASE_URL}/blog/category/${category.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // =========================
  // PRODUCT CATEGORIES
  // =========================
  const categories = await fetchAPI("/api/categories");

  const categoryUrls = (
    categories?.categories ||
    categories ||
    []
  ).map((category) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastModified: new Date(
      category.updatedAt || category.createdAt || currentDate
    ),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // =========================
  // PRODUCTS
  // =========================
  const products = await fetchAPI("/api/products?limit=5000");

  const productUrls = (
  products?.products ||
  products ||
  []
)
.filter((product) => product.slug)
.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: new Date(
      product.updatedAt || product.createdAt || currentDate
    ),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // =========================
  // COMBINE ALL URLS
  // =========================
  return [
    ...staticUrls,
    ...blogUrls,
    ...blogCategoryUrls,
    ...categoryUrls,
    ...productUrls,
  ];
}