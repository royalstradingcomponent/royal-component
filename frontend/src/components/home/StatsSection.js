const stats = [
  { value: "10,000+", label: "Industrial Products" },
  { value: "500+", label: "Supported Brands" },
  { value: "24/7", label: "Online Ordering" },
  { value: "PAN India", label: "Procurement Support" },
];

export default function StatsSection() {
  return (
    <section className="bg-white py-14">
      <div className="container-royal">
        <div className="grid gap-5 rounded-[34px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-[24px] bg-white p-6 text-center shadow-sm"
            >
              <h2 className="text-3xl font-extrabold text-[#0284c7]">
                {item.value}
              </h2>
              <p className="mt-2 text-sm font-bold text-[#52677d]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}