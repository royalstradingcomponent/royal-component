"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/api";

export default function LandingPageForm({
  mode = "add",
  pageId,
}) {


  const router = useRouter();

  const bannerInputRef = useRef(null);
  const productInputRef = useRef(null);

  const [bannerPreview, setBannerPreview] =
    useState("");

  const [productPreview, setProductPreview] =
    useState("");

  const [importLoading, setImportLoading] =
    useState(false);

 const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const res = await fetch(
    "http://localhost:5000/api/landing-pages/upload?type=landing-pages",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!data.success) {
    throw new Error(
      data.message || "Upload failed"
    );
  }

  return `http://localhost:5000${data.imageUrl}`;
};

  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    bannerImage: "",
    productImage: "",
    description: "",
    whatsappNumber: "8851149032",
    buyNowLink: "",
   linkedProduct: "",
    seoTitle: "",
    seoDescription: "",

    isActive: true,

    priceTiers: [
      {
        label: "1-5 Kits",
        price: 1399,
      },
    ],

    features: [""],

    kitIncludes: [""],

    applications: [""],
  });

  useEffect(() => {
    if (mode === "edit" && pageId) {
      fetchPage();
    }
  }, [pageId]);

  const fetchPage = async () => {
    try {
      const res = await adminRequest(
        `/api/landing-pages/id/${pageId}`
      );

      setFormData(res.page);

setBannerPreview(
  res.page.bannerImage || ""
);

setProductPreview(
  res.page.productImage || ""
);
    } catch (err) {
      alert(err.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (mode === "add") {
        await adminRequest(
          "/api/landing-pages",
          {
            method: "POST",
            body: JSON.stringify(formData),
          }
        );
      } else {
        await adminRequest(
          `/api/landing-pages/${pageId}`,
          {
            method: "PUT",
            body: JSON.stringify(formData),
          }
        );
      }

      alert("Saved Successfully");

      router.push(
        "/admin/landing-pages"
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (
    key,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addPriceTier = () => {
    setFormData((prev) => ({
      ...prev,
      priceTiers: [
        ...prev.priceTiers,
        {
          label: "",
          price: 0,
        },
      ],
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        "",
      ],
    }));
  };

  const addKitItem = () => {
    setFormData((prev) => ({
      ...prev,
      kitIncludes: [
        ...prev.kitIncludes,
        "",
      ],
    }));
  };

  const addApplication = () => {
    setFormData((prev) => ({
      ...prev,
      applications: [
        ...prev.applications,
        "",
      ],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 mb-8 text-white shadow-xl">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-4xl font-bold">
              Create Landing Page
            </h1>

            <p className="opacity-90 mt-2">
              Build High Converting Product Landing Pages
            </p>
          </div>


        <div className="flex gap-3">

  <label
    className="
      bg-white
      text-indigo-700
      px-6
      py-3
      rounded-xl
      cursor-pointer
      font-bold
      shadow-lg
    "
  >
    📥 Import JSON

    <input
      type="file"
      hidden
      accept=".json"
      onChange={async (e) => {
        try {
          const file = e.target.files[0];

          if (!file) return;

          const text = await file.text();

          const data = JSON.parse(text);

          setFormData((prev) => ({
            ...prev,
            ...data,
          }));

          alert("Imported Successfully");
        } catch {
          alert("Invalid JSON");
        }
      }}
    />
  </label>

  <button
    type="button"
    className="
      bg-yellow-400
      text-black
      px-6
      py-3
      rounded-xl
      font-bold
      shadow-lg
    "
  >
    🚀 AI Template
  </button>

</div>

      </div>
      </div>

      <form
        onSubmit={submitHandler}
        className="
  bg-white
  rounded-3xl
  shadow-xl
  p-8
  space-y-8
"
      >
        <input
          className="w-full border p-3"
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            updateField(
              "title",
              e.target.value
            )
          }
        />

        <input
          className="w-full border p-3"
          placeholder="Slug"
          value={formData.slug}
          onChange={(e) =>
            updateField(
              "slug",
              e.target.value
            )
          }
        />

        <div className="grid md:grid-cols-2 gap-6">

          {/* Banner */}

          <div className="
bg-gradient-to-br
from-white
to-slate-50
rounded-3xl
border
border-slate-200
shadow-xl
p-8
hover:shadow-2xl
transition-all
duration-300
">

            <h3 className="text-lg font-bold mb-4">
              Banner Image
            </h3>

            <input
              type="text"
              className="w-full border p-3 rounded-xl"
              placeholder="Paste Banner URL"


              value={formData.bannerImage}
              onChange={(e) => {
                updateField(
                  "bannerImage",
                  e.target.value
                );

                setBannerPreview(
                  e.target.value
                );
              }}
            />

            

            <div className="mt-4">
             <label
  className="
  mt-4
  flex
  items-center
  justify-center
  h-40
  border-2
  border-dashed
  border-indigo-300
  rounded-2xl
  cursor-pointer
  bg-indigo-50
  hover:bg-indigo-100
  transition
"
>
  <div className="text-center">
    <div className="text-4xl mb-2">
      📤
    </div>

    <p className="font-semibold">
      Upload Banner
    </p>

    <p className="text-sm text-gray-500">
      JPG PNG WEBP
    </p>
  </div>

  <input
    hidden
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      const url =
        await uploadImage(file);

      updateField(
        "bannerImage",
        url
      );

      setBannerPreview(url);
    }}
  />
</label>
            </div>

            {(bannerPreview ||
              formData.bannerImage) && (
                <img
                  src={
                    bannerPreview ||
                    formData.bannerImage
                  }
                  className="
          mt-4
          h-48
          w-full
          object-cover
          rounded-2xl
        "
                />
              )}

          </div>

          {/* Product */}

          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

            <h3 className="text-lg font-bold mb-4">
              Product Image
            </h3>

            <input
              type="text"
              className="w-full border p-3 rounded-xl"
              placeholder="Paste Product URL"
              value={formData.productImage}
              onChange={(e) => {
                updateField(
                  "productImage",
                  e.target.value
                );

                setProductPreview(
                  e.target.value
                );
              }}
            />

<label
  className="
  mt-4
  flex
  items-center
  justify-center
  h-40
  border-2
  border-dashed
  border-blue-300
  rounded-2xl
  cursor-pointer
  bg-blue-50
  hover:bg-blue-100
  transition
"
>
  <div className="text-center">
    <div className="text-4xl mb-2">
      🖼️
    </div>

    <p className="font-semibold">
      Upload Product Image
    </p>

    <p className="text-sm text-gray-500">
      JPG PNG WEBP
    </p>
  </div>

  <input
    hidden
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      const url =
        await uploadImage(file);

      updateField(
        "productImage",
        url
      );

      setProductPreview(url);
    }}
  />
</label>

            {(productPreview ||
              formData.productImage) && (
                <img
                  src={
                    productPreview ||
                    formData.productImage
                  }
                  className="
          mt-4
          h-48
          w-full
          object-cover
          rounded-2xl
        "
                />
              )}

          </div>

        </div>

        <textarea
          className="w-full border p-3"
          rows={5}
          placeholder="Description"
          value={
            formData.description
          }
          onChange={(e) =>
            updateField(
              "description",
              e.target.value
            )
          }
        />

        <input
          className="w-full border p-3"
          placeholder="WhatsApp Number"
          value={
            formData.whatsappNumber
          }
          onChange={(e) =>
            updateField(
              "whatsappNumber",
              e.target.value
            )
          }
        />

        <input
          className="w-full border p-3"
          placeholder="Buy Now Link"
          value={
            formData.buyNowLink
          }
          onChange={(e) =>
            updateField(
              "buyNowLink",
              e.target.value
            )
          }
        />

        <input
  className="w-full border p-3 mt-4"
  placeholder="Product ID"
  value={formData.linkedProduct || ""}
  onChange={(e) =>
    updateField(
      "linkedProduct",
      e.target.value
    )
  }
/>

        <div>
          <h2 className="font-bold text-xl mb-3">
            Price Tiers
          </h2>

          {formData.priceTiers.map(
            (tier, index) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-3 mb-3"
              >
                <input
                  className="border p-2"
                  value={tier.label}
                  onChange={(e) => {
                    const arr = [
                      ...formData.priceTiers,
                    ];

                    arr[index].label =
                      e.target.value;

                    updateField(
                      "priceTiers",
                      arr
                    );
                  }}
                />

                <input
                  type="number"
                  className="border p-2"
                  value={tier.price}
                  onChange={(e) => {
                    const arr = [
                      ...formData.priceTiers,
                    ];

                    arr[index].price =
                      Number(
                        e.target.value
                      );

                    updateField(
                      "priceTiers",
                      arr
                    );
                  }}
                />
              </div>
            )
          )}

          <button
            type="button"
            onClick={addPriceTier}
            className="bg-black text-white px-4 py-2"
          >
            Add Tier
          </button>
        </div>

        <div>
          <h2 className="font-bold text-xl mb-3">
            Features
          </h2>

          {formData.features.map(
            (item, index) => (
              <input
                key={index}
                className="border p-2 w-full mb-2"
                value={item}
                onChange={(e) => {
                  const arr = [
                    ...formData.features,
                  ];

                  arr[index] =
                    e.target.value;

                  updateField(
                    "features",
                    arr
                  );
                }}
              />
            )
          )}

          <button
            type="button"
            onClick={addFeature}
          >
            Add Feature
          </button>
        </div>

        <div>
          <h2 className="font-bold text-xl mb-3">
            Kit Includes
          </h2>

          {formData.kitIncludes.map(
            (item, index) => (
              <input
                key={index}
                className="border p-2 w-full mb-2"
                value={item}
                onChange={(e) => {
                  const arr = [
                    ...formData.kitIncludes,
                  ];

                  arr[index] =
                    e.target.value;

                  updateField(
                    "kitIncludes",
                    arr
                  );
                }}
              />
            )
          )}

          <button
            type="button"
            onClick={addKitItem}
          >
            Add Item
          </button>
        </div>

        <div>
          <h2 className="font-bold text-xl mb-3">
            Applications
          </h2>

          {formData.applications.map(
            (item, index) => (
              <input
                key={index}
                className="border p-2 w-full mb-2"
                value={item}
                onChange={(e) => {
                  const arr = [
                    ...formData.applications,
                  ];

                  arr[index] =
                    e.target.value;

                  updateField(
                    "applications",
                    arr
                  );
                }}
              />
            )
          )}

          <button
            type="button"
            onClick={addApplication}
          >
            Add Application
          </button>
        </div>

        <input
          className="w-full border p-3"
          placeholder="SEO Title"
          value={formData.seoTitle}
          onChange={(e) =>
            updateField(
              "seoTitle",
              e.target.value
            )
          }
        />

        <textarea
          className="w-full border p-3"
          rows={4}
          placeholder="SEO Description"
          value={
            formData.seoDescription
          }
          onChange={(e) =>
            updateField(
              "seoDescription",
              e.target.value
            )
          }
        />

        <button
          disabled={loading}
          className="
bg-gradient-to-r
from-indigo-600
to-blue-600
text-white
px-10
py-4
rounded-xl
font-bold
shadow-lg
hover:scale-105
transition
"
        >
          {loading
            ? "Saving..."
            : "Save Landing Page"}
        </button>
      </form>
    </div>
  );
}

