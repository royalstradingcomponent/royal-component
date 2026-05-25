export default function PdfPreviewCard({ request }) {

  return (

    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-black text-slate-900">
        PDF Preview
      </h2>

      <a
        href={`${process.env.NEXT_PUBLIC_API_URL}/api/component-requests/download-pdf/${request._id}`}
        target="_blank"
        className="mt-5 inline-flex rounded-2xl bg-red-600 px-6 py-3 font-bold text-white"
      >
        Download PDF
      </a>

    </div>

  );

}