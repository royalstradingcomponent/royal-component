export default function AdminNotes() {

  return (

    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-black text-slate-900">
        Admin Notes
      </h2>

      <textarea
        placeholder="Write internal admin notes..."
        className="mt-5 h-40 w-full rounded-2xl border p-4 outline-none"
      />

      <button
        className="mt-4 rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white"
      >
        Save Notes
      </button>

    </div>

  );

}