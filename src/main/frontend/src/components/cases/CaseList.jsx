import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../common/Header";

const cases = [
    {
        id: "#24901",
        pan: "1024",
        patient: "Alice Smith",
        product: "Zirconia Crown - #14",
        doctor: "Dr. Sarah Jenkins",
        process: "Sintering",
        progress: 60,
        progressSteps: 3,
        timeline: "2 Days Overdue",
        timelineType: "overdue",
    },
    {
        id: "#24915",
        pan: "1052",
        patient: "Robert Smith",
        product: "Implant Abutment - #19",
        doctor: "Dr. Michael Chen",
        process: "Finishing",
        progress: 80,
        progressSteps: 4,
        timeline: "Due Today (4h)",
        timelineType: "today",
    },
    {
        id: "#24952",
        pan: "1098",
        patient: "Michael Smithson",
        product: "Full Denture Upper",
        doctor: "Dr. Amanda Lee",
        process: "Scanning",
        progress: 20,
        progressSteps: 1,
        timeline: "Due in 3 Days",
        timelineType: "upcoming",
    },
    {
        id: "#24988",
        pan: "1144",
        patient: "John P. Smith",
        product: "Bridge - #3, #4, #5",
        doctor: "Dr. Sarah Jenkins",
        process: "Design",
        progress: 40,
        progressSteps: 2,
        timeline: "Due in 5 Days",
        timelineType: "upcoming",
    },
];

const TimelineIcon = ({ type }) => {
    if (type === "overdue")
        return (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
        );
    if (type === "today")
        return (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
            </svg>
        );
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
        </svg>
    );
};

const timelineColor = {
    overdue: "text-red-500",
    today: "text-amber-500",
    upcoming: "text-slate-500",
};

export default function CaseList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get("q") || "";
    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    const filteredCases = cases.filter((c) => {
        if (!query) return true;
        const keyword = query.toLowerCase();
        return (
            c.patient.toLowerCase().includes(keyword) ||
            c.doctor.toLowerCase().includes(keyword) ||
            c.product.toLowerCase().includes(keyword) ||
            c.id.includes(keyword)
        );
    });

    return (
        <div className="min-h-screen font-sans text-slate-900">
            {/* Header */}
            <Header/>

            {/* Main */}
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{query ? `Results for '${query}'` : "All Cases"}</h1>
                            <p className="text-slate-500 mt-1">{filteredCases.length} active cases found matching your criteria.</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm self-start md:self-auto">
                            <a href="/cases/AddCase" className="flex">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            New Case
                            </a>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium pr-3 border-r border-slate-200">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        <span>Filters</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: "Status", value: "All" },
                            { label: "Current Process", value: "All" },
                            { label: "Due", value: "This Week" },
                        ].map(({ label, value }) => (
                            <button key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors">
                                {label}: <span className="text-blue-600 font-semibold">{value}</span>
                                <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                        ))}
                    </div>
                    <div className="ml-auto">
                        <button className="text-slate-400 hover:text-blue-600 text-sm font-medium underline underline-offset-4 transition-colors">
                            Clear All
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                {["Case #", "Pan #", "Patient & Product", "Doctor Name", "Workflow Progress", "Timeline", ""].map((col, i) => (
                                    <th key={i} className={`px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${i === 6 ? "text-right" : ""}`}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {filteredCases.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 font-mono text-xs font-bold rounded border border-slate-200">
                        {c.id}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 font-mono text-xs font-bold rounded border border-slate-200">
                        {c.pan}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-semibold">{c.patient}</span>
                                            <span className="text-slate-500 text-xs">{c.product}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-slate-600 text-sm">{c.doctor}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2 w-48">
                                            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                                                <span>{c.process}</span>
                                                <span>{c.progress}%</span>
                                            </div>
                                            <div className="flex gap-1 h-1.5 w-full">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`flex-1 rounded-full ${i < c.progressSteps ? "bg-blue-600" : "bg-slate-200"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`flex items-center gap-1.5 font-semibold text-sm ${timelineColor[c.timelineType]}`}>
                                            <TimelineIcon type={c.timelineType} />
                                            <span>{c.timeline}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a
                                            href="#"
                                            className="inline-flex items-center justify-center w-8 h-8 border border-slate-200 rounded-lg text-slate-400 bg-white hover:bg-slate-50 hover:text-blue-600 transition-all group-hover:border-blue-200"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                        <div className="text-sm text-slate-500">
                            Showing <span className="font-medium text-slate-900">1</span> to{" "}
                            <span className="font-medium text-slate-900">4</span> of{" "}
                            <span className="font-medium text-slate-900">24</span> results
                        </div>
                        <div className="flex gap-2">
                            <button
                                disabled
                                className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-300 cursor-not-allowed text-sm"
                            >
                                Previous
                            </button>
                            {[1, 2, 3].map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 border rounded text-sm font-medium transition-colors ${
                                        currentPage === page
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 text-sm">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}