"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Power,
  RefreshCcw,
} from "lucide-react";

import { adminRequest } from "@/lib/api";

export default function ReturnReasonsPage() {
  const [reasons, setReasons] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

    const [tab, setTab] = useState("reasons");

const [uiSaving, setUiSaving] =
  useState(false);

const [uiSettings, setUiSettings] =
  useState({
    heading: "",
    subHeading: "",

    stepLabels: [
      "Reason",
      "Issue",
      "Upload",
      "Details",
      "Review",
      "Submit",
    ],

    uploadImageTitle: "",
    uploadImageSubtitle: "",

    uploadVideoTitle: "",
    uploadVideoSubtitle: "",

    guidelineTitle: "",

    guidelines: [],

    cancelButtonText: "",

    submitButtonText: "",
  });

  const [form, setForm] = useState({
  title: "",
  icon: "RefreshCcw",
  color: "#f97316",
  type: "BOTH",
  sortOrder: 0,
});

const loadUISettings = async () => {
  try {
    const data = await adminRequest(
      "/api/return-reasons/ui/settings"
    );

    if (data?.settings?.uiSettings) {
      setUiSettings(data.settings.uiSettings);
    }
  } catch (err) {
    console.log(err);
  }
};

  const loadReasons = async () => {
    try {
      setLoading(true);

      const data =
        await adminRequest(
          "/api/return-reasons/admin/all"
        );

      setReasons(
  (data?.reasons || []).filter(
    (item) => item.type !== "UI_SETTINGS"
  )
);
    } catch (err) {
      toast.error(
        err.message
      );
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  loadReasons();
  loadUISettings();
}, []);

  const createReason =
    async () => {
      try {
        if (!form.title) {
          toast.error(
            "Title required"
          );
          return;
        }

        setSaving(true);

        await adminRequest(
          "/api/return-reasons/admin/create",
          {
            method: "POST",
            body: JSON.stringify(
              form
            ),
          }
        );

        toast.success(
          "Reason created"
        );

        setForm({
          title: "",
          icon: "RefreshCcw",
          color: "#f97316",
          type: "BOTH",
          sortOrder: 0,
        });

        loadReasons();
      } catch (err) {
        toast.error(
          err.message
        );
      } finally {
        setSaving(false);
      }
    };

  const deleteReason =
    async (id) => {
      if (
        !confirm(
          "Delete reason?"
        )
      )
        return;

      try {
        await adminRequest(
          `/api/return-reasons/admin/delete/${id}`,
          {
            method:
              "DELETE",
          }
        );

        toast.success(
          "Deleted"
        );

        loadReasons();
      } catch (err) {
        toast.error(
          err.message
        );
      }
    };

    const saveUISettings = async () => {
  try {
    setUiSaving(true);

    await adminRequest(
      "/api/return-reasons/admin/ui/settings",
      {
        method: "PUT",

        body: JSON.stringify({
          uiSettings,
        }),
      }
    );

    toast.success(
      "Return UI Updated"
    );
  } catch (err) {
    toast.error(err.message);
  } finally {
    setUiSaving(false);
  }
};

  const toggleReason =
    async (id) => {
      try {
        await adminRequest(
          `/api/return-reasons/admin/toggle/${id}`,
          {
            method: "PUT",
          }
        );

        loadReasons();
      } catch (err) {
        toast.error(
          err.message
        );
      }
    };

  return (
    <div className="p-6">

<div className="mb-8">

  <h1 className="text-3xl font-black">
    Return & Exchange Management
  </h1>

  <p className="mt-2 text-slate-500">
    Manage customer reasons & complete return page UI
  </p>

  <div className="mt-6 flex gap-4">

    <button
      onClick={() => setTab("reasons")}
      className={`rounded-xl px-6 py-3 font-bold transition ${
        tab === "reasons"
          ? "bg-orange-600 text-white shadow-lg"
          : "border bg-white"
      }`}
    >
      Return Reasons
    </button>

    <button
      onClick={() => setTab("ui")}
      className={`rounded-xl px-6 py-3 font-bold transition ${
        tab === "ui"
          ? "bg-blue-600 text-white shadow-lg"
          : "border bg-white"
      }`}
    >
      Return UI Settings
    </button>

  </div>

</div>

      {/* CREATE */}

    {tab === "reasons" && (

<div className="rounded-3xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xl font-black">
          Add New Reason
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          <input
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title:
                  e.target.value,
              })
            }
            placeholder="Reason Title"
            className="h-12 rounded-xl border px-4"
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type:
                  e.target.value,
              })
            }
            className="h-12 rounded-xl border px-4"
          >
            <option value="RETURN">
              RETURN
            </option>

            <option value="EXCHANGE">
              EXCHANGE
            </option>

            <option value="BOTH">
              BOTH
            </option>
          </select>

          <input
            type="color"
            value={form.color}
            onChange={(e) =>
              setForm({
                ...form,
                color:
                  e.target.value,
              })
            }
            className="h-12 rounded-xl border"
          />

          <input
            type="number"
            value={
              form.sortOrder
            }
            onChange={(e) =>
              setForm({
                ...form,
                sortOrder:
                  Number(
                    e.target
                      .value
                  ),
              })
            }
            placeholder="Sort Order"
            className="h-12 rounded-xl border px-4"
          />

        </div>

        <button
          onClick={
            createReason
          }
          disabled={saving}
          className="mt-5 flex h-12 items-center gap-2 rounded-xl bg-orange-600 px-5 font-black text-white"
        >
          <Plus size={18} />

          {saving
            ? "Saving..."
            : "Create Reason"}
        </button>

      </div>

      

      )}
{tab === "ui" && (

<div className="rounded-3xl border bg-white p-8 shadow-sm">

<h2 className="text-2xl font-black">
Return Page UI Settings
</h2>

<p className="mt-2 text-slate-500">
Everything on the customer Return page can be controlled from here.
</p>

<div className="mt-8 grid gap-6">

<div>

  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

<h3 className="text-xl font-black">
Return Steps
</h3>

<p className="mt-1 text-sm text-slate-600">
Customer ko Return process me ye 6 steps dikhte hain.
Yahan se aap unka text change kar sakte hain.
</p>

<div className="mt-6 grid grid-cols-2 gap-4">

{uiSettings.stepLabels.map((step,index)=>(
<div key={index}>

<label className="mb-2 block text-sm font-bold">
Step {index+1}
</label>

<input
className="h-11 w-full rounded-xl border px-4"
value={step}
onChange={(e)=>{

const labels=[...uiSettings.stepLabels];

labels[index]=e.target.value;

setUiSettings({
...uiSettings,
stepLabels:labels,
});

}}
/>

</div>
))}

</div>

</div>
<label className="mb-2 block font-bold">
Page Heading
</label>

<input
className="h-12 w-full rounded-xl border px-4"
value={uiSettings.heading}
onChange={(e)=>
setUiSettings({
...uiSettings,
heading:e.target.value,
})
}
/>

</div>

<div>

<label className="mb-2 block font-bold">
Page Sub Heading
</label>

<textarea
rows={3}
className="w-full rounded-xl border p-4"
value={uiSettings.subHeading}
onChange={(e)=>
setUiSettings({
...uiSettings,
subHeading:e.target.value,
})
}
/>

<div>

<label className="mb-2 mt-6 block font-bold">
Upload Image Subtitle
</label>

<textarea
rows={2}
className="w-full rounded-xl border p-4"
value={uiSettings.uploadImageSubtitle}
onChange={(e)=>
setUiSettings({
...uiSettings,
uploadImageSubtitle:e.target.value,
})
}
/>

</div>

<div>

<label className="mb-2 block font-bold">
Upload Video Subtitle
</label>

<textarea
rows={2}
className="w-full rounded-xl border p-4"
value={uiSettings.uploadVideoSubtitle}
onChange={(e)=>
setUiSettings({
...uiSettings,
uploadVideoSubtitle:e.target.value,
})
}
/>

</div>

<div>

<label className="mb-2 block font-bold">
Cancel Button Text
</label>

<input
className="h-12 w-full rounded-xl border px-4"
value={uiSettings.cancelButtonText}
onChange={(e)=>
setUiSettings({
...uiSettings,
cancelButtonText:e.target.value,
})
}
/>

</div>

<div>

<label className="mb-2 block font-bold">
Submit Button Text
</label>

<input
className="h-12 w-full rounded-xl border px-4"
value={uiSettings.submitButtonText}
onChange={(e)=>
setUiSettings({
...uiSettings,
submitButtonText:e.target.value,
})
}
/>

</div>

<div>

<label className="mb-2 block font-bold">
Return Guidelines
</label>

<textarea
rows={6}
className="w-full rounded-xl border p-4"
value={uiSettings.guidelines.join("\n")}
onChange={(e)=>
setUiSettings({
...uiSettings,
guidelines:e.target.value
.split("\n")
.filter(Boolean),
})
}
/>

<p className="mt-2 text-sm text-slate-500">
One guideline per line.
</p>

</div>

</div>

<div>

<label className="mb-2 block font-bold">
Upload Image Title
</label>

<input
className="h-12 w-full rounded-xl border px-4"
value={uiSettings.uploadImageTitle}
onChange={(e)=>
setUiSettings({
...uiSettings,
uploadImageTitle:e.target.value,
})
}
/>

</div>

<div>

<label className="mb-2 block font-bold">
Upload Video Title
</label>

<input
className="h-12 w-full rounded-xl border px-4"
value={uiSettings.uploadVideoTitle}
onChange={(e)=>
setUiSettings({
...uiSettings,
uploadVideoTitle:e.target.value,
})
}
/>

</div>

<div>

<label className="mb-2 block font-bold">
Guideline Title
</label>

<input
className="h-12 w-full rounded-xl border px-4"
value={uiSettings.guidelineTitle}
onChange={(e)=>
setUiSettings({
...uiSettings,
guidelineTitle:e.target.value,
})
}
/>

</div>

<div className="mt-10 rounded-3xl border bg-slate-50 p-6">

<h3 className="text-xl font-black">
Live Preview
</h3>

<p className="mb-6 text-sm text-slate-500">
Admin changes ka live preview.
Customer ko page isi tarah dikhega.
</p>

<h2 className="text-2xl font-black">
{uiSettings.heading}
</h2>

<p className="mt-2 text-slate-500">
{uiSettings.subHeading}
</p>

<div className="mt-8 flex flex-wrap gap-3">

{uiSettings.stepLabels.map((item,index)=>(

<div
key={index}
className="rounded-full border bg-white px-4 py-2 text-sm font-bold shadow-sm"
>

{index+1}. {item}

</div>

))}

</div>

<div className="mt-8 rounded-2xl border bg-white p-5">

<h4 className="font-black">
{uiSettings.uploadImageTitle}
</h4>

<p className="text-sm text-slate-500">
{uiSettings.uploadImageSubtitle}
</p>

</div>

<div className="mt-5 rounded-2xl border bg-white p-5">

<h4 className="font-black">
{uiSettings.uploadVideoTitle}
</h4>

<p className="text-sm text-slate-500">
{uiSettings.uploadVideoSubtitle}
</p>

</div>

<div className="mt-5 rounded-2xl border bg-white p-5">

<h4 className="font-black">
{uiSettings.guidelineTitle}
</h4>

<ul className="mt-3 list-disc space-y-2 pl-5">

{uiSettings.guidelines.map((g,i)=>(

<li key={i}>
{g}
</li>

))}

</ul>

</div>

<div className="mt-6 flex gap-4">

<button className="rounded-xl border px-5 py-3 font-bold">

{uiSettings.cancelButtonText}

</button>

<button className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">

{uiSettings.submitButtonText}

</button>

</div>

</div>

<button
onClick={saveUISettings}
className="h-12 rounded-xl bg-blue-600 font-bold text-white"
>

{uiSaving
? "Saving..."
: "Save UI Settings"}

</button>

</div>

</div>

)}

      {/* LIST */}
      {tab === "reasons" && (

      <div className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xl font-black">
          Existing Reasons
        </h2>

        {loading ? (
          <p>
            Loading...
          </p>
        ) : (
          <div className="space-y-4">

            {reasons.map(
              (
                reason
              ) => (
                <div
                  key={
                    reason._id
                  }
                  className="flex items-center justify-between rounded-2xl border p-4"
                >
                  <div>

                    <div className="flex items-center gap-3">

                      <div
                        className="h-5 w-5 rounded-full"
                        style={{
                          background:
                            reason.color,
                        }}
                      />

                      <h3 className="font-black">
                        {
                          reason.title
                        }
                      </h3>

                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Type :
                      {
                        reason.type
                      }
                    </p>

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        toggleReason(
                          reason._id
                        )
                      }
                      className="rounded-xl border p-3"
                    >
                      <Power
                        size={
                          18
                        }
                      />
                    </button>

                    <button
                      onClick={() =>
                        deleteReason(
                          reason._id
                        )
                      }
                      className="rounded-xl border border-red-200 p-3 text-red-600"
                    >
                      <Trash2
                        size={
                          18
                        }
                      />
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>
)}
    </div>
  );
}