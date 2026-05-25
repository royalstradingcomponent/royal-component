export default function TimelineCard({ request }) {

  return (

    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-black text-slate-900">
        Timeline
      </h2>

      <div className="mt-5 space-y-4">

        {request.activityLogs?.length ? (

          request.activityLogs.map(
            (log, index) => (

              <div
                key={index}
                className="flex gap-4"
              >

                <div className="mt-2 h-3 w-3 rounded-full bg-blue-600" />

                <div>

                  <p className="font-semibold text-slate-800">
                    {log.message}
                  </p>

                  <p className="text-xs text-slate-500">

                    {new Date(
                      log.createdAt
                    ).toLocaleString()}

                  </p>

                </div>

              </div>
            )
          )

        ) : (

          <p className="text-slate-500">
            No timeline available.
          </p>

        )}

      </div>

    </div>

  );

}