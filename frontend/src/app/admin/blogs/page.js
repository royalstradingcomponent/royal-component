"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Star,
  TrendingUp,
} from "lucide-react";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      if (status) params.set("status", status);

      const res = await fetch(`${API_BASE}/api/blogs/admin/all?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await res.json();
      setBlogs(data?.blogs || []);
    } catch (error) {
      console.error("Admin blogs fetch error:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [status]);

  const deleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/blogs/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        fetchBlogs();
      } else {
       toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Blog delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8ff] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700">
              Royal Trading Component CMS
            </p>

            <h1 className="text-3xl font-extrabold text-slate-900">
              Blog Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Create SEO blogs for semiconductors, industrial automation,
              electronics components, sensors, PLCs, relays and procurement
              guides.
            </p>
          </div>

          <Link
            href="/admin/blogs/create"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-800"
          >
            <Plus size={18} />
            Create New Blog
          </Link>
        </div>

        <div className="mb-6 grid gap-4 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-[1fr_220px_140px]">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
            <Search size={18} className="text-slate-500" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by title, slug, category..."
              className="h-12 w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <button
            onClick={fetchBlogs}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            Search
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <FileText size={20} />
              All Blogs
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading blogs...
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No blogs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Blog</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">SEO</th>
                    <th className="px-5 py-4">Views</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {blogs.map((blog) => (
                    <tr
                      key={blog._id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="h-14 w-16 overflow-hidden rounded-xl bg-slate-100">
                            {blog.featuredImage || blog.bannerImage ? (
                              <img
                                src={
                                  blog.featuredImage?.startsWith("http")
                                    ? blog.featuredImage
                                    : `${API_BASE}${
                                        blog.featuredImage || blog.bannerImage
                                      }`
                                }
                                alt={blog.title}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>

                          <div>
                            <p className="font-bold text-slate-900">
                              {blog.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              /blog/{blog.slug}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2">
                              {blog.isFeatured && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-700">
                                  <Star size={12} />
                                  Featured
                                </span>
                              )}

                              {blog.isTrending && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
                                  <TrendingUp size={12} />
                                  Trending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {blog.category}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            blog.status === "published"
                              ? "bg-green-50 text-green-700"
                              : blog.status === "draft"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        <p>{blog.metaTitle ? "Meta title ✅" : "Missing ❌"}</p>
                        <p className="text-xs">
                          {blog.metaDescription
                            ? "Description ✅"
                            : "Description missing ❌"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-bold text-slate-700">
                        {blog.views || 0}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString()
                          : new Date(blog.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {blog.status === "published" && (
                            <Link
                              href={`/blog/${blog.slug}`}
                              target="_blank"
                              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-white"
                            >
                              <Eye size={17} />
                            </Link>
                          )}

                          <Link
                            href={`/admin/blogs/edit/${blog._id}`}
                            className="rounded-xl border border-blue-100 bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"
                          >
                            <Edit size={17} />
                          </Link>

                          <button
                            onClick={() => deleteBlog(blog._id)}
                            className="rounded-xl border border-red-100 bg-red-50 p-2 text-red-700 hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}