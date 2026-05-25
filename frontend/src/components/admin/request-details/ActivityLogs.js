export default function ActivityLogs({ request }) {

  return (

    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-black text-slate-900">
        Activity Logs
      </h2>

      <div className="mt-5 space-y-4">

        {request.activityLogs?.length ? (

          request.activityLogs.map(
            (log, index) => (

              <div
                key={index}
                className="rounded-2xl bg-slate-50 p-4"
              >

                <p className="font-semibold text-slate-800">
                  {log.message}
                </p>

                <p className="mt-1 text-xs text-slate-500">

                  {new Date(
                    log.createdAt
                  ).toLocaleString()}

                </p>

              </div>
            )
          )

        ) : (

          <p className="text-slate-500">
            No activity logs found.
          </p>

        )}

      </div>

    </div>

  );

}