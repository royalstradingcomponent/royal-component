"use client";

import { useEffect, useMemo, useState } from "react";
import { adminRequest } from "@/lib/api";
import CalendarStatsCard from "@/components/admin/calendar/CalendarStatsCard";
import CalendarRequestCard from "@/components/admin/calendar/CalendarRequestCard";

export default function RequestCalendarPage() {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date();

    const [month, setMonth] = useState(
        today.getMonth()
    );

    const [year, setYear] = useState(
        today.getFullYear()
    );

    const [selectedDate, setSelectedDate] =
        useState(null);

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const loadRequests = async () => {

        try {

            const data = await adminRequest(
                "/api/component-requests/admin"
            );

            setRequests(data.requests || []);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadRequests();

    }, []);

    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const firstDay = new Date(
        year,
        month,
        1
    ).getDay();

    const filteredRequests = useMemo(() => {

        return requests.filter((req) => {

            const d = new Date(req.createdAt);

            return (
                d.getMonth() === month &&
                d.getFullYear() === year
            );

        });

    }, [requests, month, year]);

    const getRequestsByDay = (day) => {

        return filteredRequests.filter((req) => {

            const d = new Date(req.createdAt);

            return d.getDate() === day;

        });

    };

    const selectedRequests =
        selectedDate !== null
            ? getRequestsByDay(selectedDate)
            : [];

    const totalRevenue =
        filteredRequests.reduce(
            (acc, item) =>
                acc + Number(item.adminPrice || 0),
            0
        );

    const quotedCount =
        filteredRequests.filter(
            (r) => r.status === "quoted"
        ).length;

    if (loading) {

        return (
            <div className="p-10 text-2xl font-bold">
                Loading calendar...
            </div>
        );

    }

    return (

        <div className="min-h-screen bg-slate-100 p-6">

            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

                <div>

                    <h1 className="text-5xl font-black text-[#102033]">
                        Request Calendar
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Track all BOM requests day wise
                    </p>

                </div>

                <div className="flex gap-3">

                    <select
                        value={month}
                        onChange={(e) =>
                            setMonth(Number(e.target.value))
                        }
                        className="rounded-2xl border bg-white px-5 py-3 font-bold shadow-sm"
                    >

                        {monthNames.map((m, i) => (

                            <option key={i} value={i}>
                                {m}
                            </option>

                        ))}

                    </select>

                    <select
                        value={year}
                        onChange={(e) =>
                            setYear(Number(e.target.value))
                        }
                        className="rounded-2xl border bg-white px-5 py-3 font-bold shadow-sm"
                    >

                        {Array.from(
                            {
                                length: 15,
                            },
                            (_, i) =>
                                new Date().getFullYear() - 5 + i
                        ).map((y) => (

                            <option key={y} value={y}>
                                {y}
                            </option>

                        ))}

                    </select>

                </div>

            </div>

            <div className="mb-8 grid gap-5 md:grid-cols-3">

                <CalendarStatsCard
                    title="Total Requests"
                    value={filteredRequests.length}
                />

                <CalendarStatsCard
                    title="Quoted Requests"
                    value={quotedCount}
                    color="text-green-600"
                />

                <CalendarStatsCard
                    title="Revenue"
                    value={`₹${totalRevenue.toLocaleString("en-IN")}`}
                    color="text-blue-600"
                />

            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">

                <div className="mb-6 grid grid-cols-7 gap-4 text-center text-lg font-bold text-slate-500">

                    {[
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                    ].map((day) => (

                        <div key={day}>
                            {day}
                        </div>

                    ))}

                </div>

                <div className="grid grid-cols-7 gap-4">

                    {Array.from({
                        length: firstDay,
                    }).map((_, i) => (

                        <div key={i}></div>

                    ))}

                    {Array.from({
                        length: daysInMonth,
                    }).map((_, i) => {

                        const day = i + 1;

                        const dayRequests =
                            getRequestsByDay(day);

                        const revenue =
                            dayRequests.reduce(
                                (acc, item) =>
                                    acc +
                                    Number(
                                        item.adminPrice || 0
                                    ),
                                0
                            );

                        return (

                            <button
                                key={day}
                                onClick={() =>
                                    setSelectedDate(day)
                                }
                                className={`min-h-[130px] rounded-3xl border p-4 text-left transition-all hover:shadow-xl ${selectedDate === day
                                        ? "border-blue-500 bg-blue-50"
                                        : "bg-slate-50"
                                    }`}
                            >

                                <div className="text-2xl font-black text-[#102033]">
                                    {day}
                                </div>

                                <div className="mt-3 text-sm font-semibold text-slate-500">

                                    {dayRequests.length}
                                    {" "}
                                    Requests

                                </div>

                                <div className="mt-2 text-lg font-black text-green-600">

                                    ₹
                                    {revenue.toLocaleString(
                                        "en-IN"
                                    )}

                                </div>

                            </button>

                        );

                    })}

                </div>

            </div>

            <div className="mt-10">

                <h2 className="mb-5 text-3xl font-black text-[#102033]">

                    {selectedDate
                        ? `Requests on ${selectedDate} ${monthNames[month]}`
                        : "Select a date"}

                </h2>

                <div className="space-y-5">

                    {selectedRequests.map((request) => (

                        <CalendarRequestCard
                            key={request._id}
                            request={request}
                        />

                    ))}

                </div>

            </div>

        </div>

    );

}