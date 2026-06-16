"use client";

import { useEffect, useState } from "react";
import { adminRequest, API_BASE } from "@/lib/api";

const defaultBanner = {
  title: "",
  subtitle: "",
  desktopImage: "",
  mobileImage: "",
  buttonText: "",
  buttonLink: "",
};

export default function HomepageBuilderPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    sectionName: "",
    sectionType: "single-banner",
    sortOrder: 1,
    active: true,
    banners: [{ ...defaultBanner }],
  });

  useEffect(() => {
    loadSections();
  }, []);

  async function loadSections() {
    try {
      const res = await adminRequest("/api/homepage-builder");

      setSections(res.sections || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function uploadImage(file) {
    const fd = new FormData();

    fd.append("image", file);
    fd.append("type", "homepage-builder");

    const res = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    return data.url;
  }

  async function handleImage(index, field, file) {
    if (!file) return;

    setLoading(true);

    try {
      const imageUrl = await uploadImage(file);
      alert("Image Uploaded Successfully");
      console.log("UPLOADED URL =", imageUrl);

      const updated = [...form.banners];

      updated[index][field] = imageUrl;
      console.log("UPDATED BANNER =", updated);

      setForm({
        ...form,
        banners: updated,
      });
    } finally {
      setLoading(false);
    }
  }

  function getBannerCount(type) {
    switch (type) {
      case "single-banner":
        return 1;

      case "two-banner":
        return 2;

      case "three-banner":
        return 3;

      case "four-banner":
        return 4;

      case "slider":
        return 5;

      case "video-banner":
        return 1;

      default:
        return 1;
    }
  }

  function changeSectionType(type) {
    const count = getBannerCount(type);

    setForm({
      ...form,
      sectionType: type,
      banners: Array(count)
        .fill(null)
        .map(() => ({
          ...defaultBanner,
        })),
    });
  }

  async function updateSection() {
    try {
      await adminRequest(`/api/homepage-builder/${editId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      alert("Updated Successfully");

      setEditId(null);

      loadSections();
    } catch (error) {
      alert(error.message);
    }
  }

  async function createSection() {
    try {
      console.log("FINAL FORM =", form);
      await adminRequest("/api/homepage-builder", {
        method: "POST",
        body: JSON.stringify(form),
      });

      alert("Section Created Successfully");

      setForm({
        sectionName: "",
        sectionType: "single-banner",
        sortOrder: 1,
        active: true,
        banners: [
          {
            ...defaultBanner,
          },
        ],
      });

      loadSections();
    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteSection(id) {
    if (!confirm("Delete this section?")) return;

    await adminRequest(`/api/homepage-builder/${id}`, {
      method: "DELETE",
    });

    loadSections();
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Homepage Builder</h1>

      <div className="bg-white border rounded-xl p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border p-3 rounded"
            placeholder="Section Name"
            value={form.sectionName}
            onChange={(e) =>
              setForm({
                ...form,
                sectionName: e.target.value,
              })
            }
          />

          <input
            type="number"
            className="border p-3 rounded"
            placeholder="Sort Order"
            value={form.sortOrder}
            onChange={(e) =>
              setForm({
                ...form,
                sortOrder: Number(e.target.value),
              })
            }
          />

          <select
            className="border p-3 rounded"
            value={form.sectionType}
            onChange={(e) => changeSectionType(e.target.value)}
          >
            <option value="single-banner">Single Banner</option>

            <option value="two-banner">Two Banner</option>

            <option value="three-banner">Three Banner</option>

            <option value="four-banner">Four Banner</option>

            <option value="slider">Slider Banner</option>

            <option value="video-banner">Video Banner</option>
          </select>
        </div>

        <div className="mt-8 space-y-8">
          {form.banners.map((banner, index) => (
            <div key={index} className="border rounded-xl p-5">
              <h3 className="font-bold mb-4">Banner {index + 1}</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Title"
                  className="border p-3 rounded"
                  value={banner.title}
                  onChange={(e) => {
                    const updated = [...form.banners];

                    updated[index].title = e.target.value;

                    setForm({
                      ...form,
                      banners: updated,
                    });
                  }}
                />

                <input
                  placeholder="Subtitle"
                  className="border p-3 rounded"
                  value={banner.subtitle}
                  onChange={(e) => {
                    const updated = [...form.banners];

                    updated[index].subtitle = e.target.value;

                    setForm({
                      ...form,
                      banners: updated,
                    });
                  }}
                />

                <input
                  placeholder="Button Text"
                  className="border p-3 rounded"
                  value={banner.buttonText}
                  onChange={(e) => {
                    const updated = [...form.banners];

                    updated[index].buttonText = e.target.value;

                    setForm({
                      ...form,
                      banners: updated,
                    });
                  }}
                />

                <input
                  placeholder="Button Link"
                  className="border p-3 rounded"
                  value={banner.buttonLink}
                  onChange={(e) => {
                    const updated = [...form.banners];

                    updated[index].buttonLink = e.target.value;

                    setForm({
                      ...form,
                      banners: updated,
                    });
                  }}
                />

                <div>
                  <label className="block mb-2">Desktop Image</label>

                  <input
                    type="file"
                    onChange={(e) =>
                      handleImage(index, "desktopImage", e.target.files?.[0])
                    }
                  />

                  {banner.desktopImage && (
                    <img
                      src={banner.desktopImage}
                      alt=""
                      className="w-40 h-24 object-cover mt-2 rounded border"
                    />
                  )}
                </div>

                <div>
                  <label className="block mb-2">Mobile Image</label>

                  <input
                    type="file"
                    onChange={(e) =>
                      handleImage(index, "mobileImage", e.target.files?.[0])
                    }
                  />

                  {banner.mobileImage && (
                    <img
                      src={banner.mobileImage}
                      alt=""
                      className="w-40 h-24 object-cover mt-2 rounded border"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={editId ? updateSection : createSection}
          disabled={loading}
          className="mt-8 bg-black text-white px-6 py-3 rounded-lg"
        >
          {editId ? "Update Section" : "Save Section"}
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Existing Sections</h2>

        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section._id}
              className="border rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{section.sectionName}</h3>

                <p>{section.sectionType}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setForm(section);
                    setEditId(section._id);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteSection(section._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
