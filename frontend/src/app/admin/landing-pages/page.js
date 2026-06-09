"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminRequest } from "@/lib/api";

export default function LandingPagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await adminRequest(
        "/api/landing-pages"
      );

      setPages(res.pages || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id) => {
    if (!confirm("Delete Landing Page?")) return;

    try {
      await adminRequest(
        `/api/landing-pages/${id}`,
        {
          method: "DELETE",
        }
      );

      fetchPages();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Landing Pages
        </h1>

        <Link
          href="/admin/landing-pages/add"
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Create Landing Page
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">
                Title
              </th>

              <th className="p-4 text-left">
                Slug
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {pages.map((page) => (
              <tr
                key={page._id}
                className="border-t"
              >
                <td className="p-4">
                  {page.title}
                </td>

                <td className="p-4">
                  {page.slug}
                </td>

                <td className="p-4">
                  {page.isActive
                    ? "Active"
                    : "Inactive"}
                </td>

                <td className="p-4 flex gap-3 justify-center">
                  <Link
                    href={`/admin/landing-pages/edit/${page._id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      deletePage(page._id)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}