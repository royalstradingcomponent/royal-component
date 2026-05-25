export default function CalendarStatsCard({
  title,
  value,
  color = "text-[#102033]",
}) {

  return (

    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <h3 className="text-slate-500">
        {title}
      </h3>

      <h2 className={`mt-3 text-5xl font-black ${color}`}>
        {value}
      </h2>

    </div>

  );

}