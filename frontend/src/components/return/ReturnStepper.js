"use client";

import { CheckCircle2 } from "lucide-react";

export default function ReturnStepper({
    steps = [],
    currentStep = 0,
    onStepClick,
}) {
    return (
        <div className="rounded-3xl border border-sky-200 bg-gradient-to-r from-sky-100 via-sky-50 to-sky-100 px-8 py-6 shadow-xl shadow-sky-200/50">
            <div className="flex items-center">

                {steps.map((step, index) => {
                    const active = index === currentStep;
                    const completed = index < currentStep;

                    return (
                        <div
                            key={index}
                            className="flex flex-1 items-center"
                        >
                            <button
                                type="button"
                                onClick={() => onStepClick?.(index)}
                                className="flex items-center gap-3"
                            >

                                {/* Circle */}

                                <div
                                    className={`
                relative
                flex h-8 w-8 items-center justify-center
                rounded-full
                border-2
                transition-all
                duration-300

                ${completed
                                            ? "border-emerald-500 bg-emerald-500 text-white"
                                            : active
                                                ? "border-emerald-600 bg-emerald-600 text-white shadow-xl shadow-emerald-300"
                                                : "border-slate-300 bg-white text-slate-600"
                                        }
                `}
                                >
                                    {completed ? (
                                        <CheckCircle2 size={16} />
                                    ) : (
                                        <span className="text-sm font-bold">
                                            {index + 1}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}

                                <span
                                    className={`
                whitespace-nowrap
                text-sm
                font-semibold
                transition

                ${completed
                                            ? "text-emerald-600"
                                            : active
                                                ? "text-emerald-700"
                                                : "text-slate-700"
                                        }
                `}
                                >
                                    {step}
                                </span>

                            </button>

                            {index !== steps.length - 1 && (

                                <div className="mx-5 flex-1">

                                    <div
                                        className={`
                  h-[2px]
                  rounded-full
                  transition-all

                  ${completed
                                                ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300"
                                                : "bg-emerald-100"
                                            }
                  `}
                                    />

                                </div>

                            )}

                        </div>
                    );
                })}

            </div>

        </div>
    );
}