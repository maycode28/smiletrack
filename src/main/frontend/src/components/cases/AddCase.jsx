import { useState } from "react";
import Header from "../common/Header";
import axios from "axios";

export default function AddCase() {
    const [selectedTeeth, setSelectedTeeth] = useState([]);

    const [steps, setSteps] = useState([
        { id: 1, processId: 1, name: "Scan", order: 1 },
        { id: 2, processId: 2, name: "Design", order: 2 },
        { id: 3, processId: 3, name: "Mill", order: 3 },
    ]);

    // DB에서 불러올 process 목록 (임시 더미)
    const availableProcesses = [
        { id: 4, name: "Glazing" },
        { id: 5, name: "Polish" },
        { id: 6, name: "Sintering" },
        { id: 7, name: "QC Check" },
    ];

    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState({
        panNumber: "",
        patientName: "",
        doctorClinic: "",
        category: "Fixed Prosthodontics",
        product: "Zirconia Crown",
        shade: "N/A",
        material: "Multi-layered Zirconia",
        dueDate: "",
        priority: "Normal",
        notes: "",
    });

    // 폼 필드 변경
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // 치아 선택
    const upperLeft  = [18,17,16,15,14,13,12,11];
    const upperRight = [21,22,23,24,25,26,27,28];
    const lowerLeft  = [48,47,46,45,44,43,42,41];
    const lowerRight = [31,32,33,34,35,36,37,38];

    const upper = [...upperLeft, ...upperRight];
    const lower = [...lowerLeft, ...lowerRight];
    const toggleTooth = (num) => {
        setSelectedTeeth((prev) =>
            prev.includes(num) ? prev.filter((t) => t !== num) : [...prev, num]
        );
    };

    const selectArch = (arch) => {
        const upper = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
        const lower = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
        const teeth = arch === "upper" ? upper : lower;
        setSelectedTeeth((prev) => {
            const allSelected = teeth.every((t) => prev.includes(t));
            if (allSelected) return prev.filter((t) => !teeth.includes(t));
            return [...new Set([...prev, ...teeth])];
        });
    };

    const toothClass = (num) =>
        `flex flex-col items-center justify-center text-[10px] font-bold border cursor-pointer transition-all duration-200 ${
            selectedTeeth.includes(num)
                ? "bg-[#137fec] text-white border-[#137fec] shadow-md scale-105 z-10"
                : "bg-white border-slate-200 hover:border-[#137fec] hover:bg-blue-50"
        }`;

    // 스텝 관리
    const addStepBetween = (index) => {
        const newOrder = steps[index].order + 1;
        const updated = steps.map((s) =>
            s.order >= newOrder ? { ...s, order: s.order + 1 } : s
        );
        const newStep = { id: Date.now(), processId: null, name: null, order: newOrder };
        updated.splice(index + 1, 0, newStep);
        setSteps(updated);
        setSearchQuery("");
    };

    const addStepAtEnd = () => {
        const maxOrder = steps.length > 0 ? Math.max(...steps.map((s) => s.order)) : 0;
        const newStep = { id: Date.now(), processId: null, name: null, order: maxOrder + 1 };
        setSteps((prev) => [...prev, newStep]);
        setSearchQuery("");
    };

    const selectProcess = (stepId, process) => {
        setSteps((prev) =>
            prev.map((s) =>
                s.id === stepId ? { ...s, name: process.name, processId: process.id } : s
            )
        );
        setSearchQuery("");
    };

    const removeStep = (id) => {
        setSteps((prev) => prev.filter((s) => s.id !== id));
    };

    // 서버 전송
    const handleSubmit = () => {
        const submitData = {
            ...formData,
            teeth: selectedTeeth.join(","),
            steps: steps
                .filter((s) => s.processId !== null)
                .map((s) => ({ processId: s.processId, sequenceOrder: s.order })),
        };
        axios.post("/api/cases", submitData);
    };

    const filteredProcesses = availableProcesses.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-32">
            <Header />
            {/* 브레드크럼 */}
            <div className="mb-8 mt-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Advanced New Case</h1>
                </div>
            </div>

            <div className="space-y-6">

                {/* Case Identification */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center space-x-2 mb-6 pb-2 border-b border-slate-100">
                        <span className="material-symbols-outlined text-[#137fec]">person_search</span>
                        <h2 className="text-lg font-semibold">Case Identification</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Case Number</label>
                            <input
                                className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none"
                                placeholder="e.g. 12345"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Pan Number</label>
                            <input
                                className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none"
                                placeholder="e.g. PAN-12"
                                type="text"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-slate-700">
                                Patient Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none"
                                placeholder="e.g. John Doe"
                                type="text"
                            />
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium mb-2 text-slate-700">
                                Doctor / Clinic <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <input
                                    className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] pr-10 text-sm px-3 py-2 outline-none"
                                    placeholder="Search doctor by name or clinic ID..."
                                    type="text"
                                />
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <div className="hidden group-focus-within:block absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                                    <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100">
                                        <p className="text-sm font-medium">Dr. Sarah Miller</p>
                                        <p className="text-xs text-slate-500">Riverside Dental Center</p>
                                    </div>
                                    <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer">
                                        <p className="text-sm font-medium">Dr. James Wilson</p>
                                        <p className="text-xs text-slate-500">City Orthodontics</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tooth Selection */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                            <span className="material-symbols-outlined text-[#137fec]">dentistry</span>
                            <h2 className="text-lg font-semibold">Tooth Selection</h2>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center space-x-1.5"
                                type="button"
                                onClick={() => selectArch("upper")}
                            >
                                <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
                                <span>Upper Arch</span>
                            </button>
                            <button
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center space-x-1.5"
                                type="button"
                                onClick={() => selectArch("lower")}
                            >
                                <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                                <span>Lower Arch</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2 py-4 overflow-x-auto">
                        {/* 상악 */}
                        <div className="flex items-end pb-4">
                            <div className="flex space-x-1">
                                <div className="flex space-x-1">
                                    {upperLeft.map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            className={`${toothClass(num)} w-9 h-14`}
                                            style={{ borderRadius: "40% 40% 15% 15%" }}
                                            onClick={() => toggleTooth(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                                <div className="w-px bg-slate-200 mx-4 h-full" />
                                <div className="flex space-x-1">
                                    {upperRight.map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            className={`${toothClass(num)} w-9 h-14`}
                                            style={{ borderRadius: "40% 40% 15% 15%" }}
                                            onClick={() => toggleTooth(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-between px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-2">
                            <span>Right</span>
                            <span>Left</span>
                        </div>
                        {/* 하악 */}
                        <div className="flex items-start pt-2">
                            <div className="flex space-x-1">
                                <div className="flex space-x-1">
                                    {lowerLeft.map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            className={`${toothClass(num)} w-9 h-14`}
                                            style={{ borderRadius: "15% 15% 40% 40%" }}
                                            onClick={() => toggleTooth(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                                <div className="w-px bg-slate-200 mx-4 h-full" />
                                <div className="flex space-x-1">
                                    {lowerRight.map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            className={`${toothClass(num)} w-9 h-14`}
                                            style={{ borderRadius: "15% 15% 40% 40%" }}
                                            onClick={() => toggleTooth(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <p className="text-[11px] text-slate-500 italic">
                            Click individual teeth to select. Use the buttons above for full arch selection.
                        </p>
                    </div>
                </section>

                {/* Product & Workflow */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center space-x-2 mb-6 pb-2 border-b border-slate-100">
                        <span className="material-symbols-outlined text-[#137fec]">category</span>
                        <h2 className="text-lg font-semibold">Product & Workflow</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Category</label>
                            <select className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none">
                                <option>Fixed Prosthodontics</option>
                                <option>Removable</option>
                                <option>Implantology</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Specific Product</label>
                            <select className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none">
                                <option>Zirconia Crown</option>
                                <option>PFM Crown</option>
                                <option>Veneer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Shade</label>
                            <select className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none">
                                <option>N/A</option>
                                <option>A1</option>
                                <option>A2</option>
                                <option>A3</option>
                                <option>B1</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Material</label>
                            <select className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none">
                                <option>Multi-layered Zirconia</option>
                                <option>E-Max</option>
                                <option>CoCr Alloy</option>
                            </select>
                        </div>
                    </div>
                    {/* Process Sequence */}
                    <div className="flex flex-wrap items-center gap-3">
                        {steps.map((step, i) => (
                            <div key={step.id} className="flex items-center gap-3">
                                {step.name === null ? (
                                    // 드롭다운
                                    <div className="relative">
                                        <input
                                            className="border border-[#137fec] rounded-lg px-3 py-2 text-sm outline-none"
                                            placeholder="Search process..."
                                            onChange={(e) => {/* 검색 필터 */}}
                                            autoFocus
                                        />
                                        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 w-48">
                                            {availableProcesses.map((p) => (
                                                <div
                                                    key={p.id}
                                                    className="px-4 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                                                    onClick={() => selectProcess(step.id, p)}
                                                >
                                                    {p.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2">
                                    <span className="text-xs font-bold text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="text-sm font-medium">{step.name}</span>
                                    <button onClick={() => removeStep(step.id)} className="ml-2 text-slate-400 hover:text-red-500" type="button">
                                        <span className="material-icons text-xs">close</span>
                                    </button>
                                </div>)}
                                {/* 스텝 사이 + 버튼 */}
                                {i < steps.length - 1 && (
                                    <button
                                        onClick={() => addStepBetween(i)}
                                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#137fec]/10 hover:border-[#137fec] text-slate-400 hover:text-[#137fec] transition-all"
                                        type="button"
                                    >
                                        <span className="material-icons text-sm">add</span>
                                    </button>
                                )}
                            </div>
                        ))}
                        {/* 맨 끝에 추가 버튼 */}
                        <div className="bg-[#137fec]/10 border border-dashed border-[#137fec]/20 px-4 py-2 rounded-lg text-[#137fec] text-sm font-medium flex items-center cursor-pointer hover:bg-[#137fec]/20 transition-colors">
                            <span className="material-icons text-xs mr-2">add</span> Add Step
                        </div>
                    </div>
                </section>

                {/* Scheduling & Notes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center space-x-2 mb-6 pb-2 border-b border-slate-100">
                            <span className="material-symbols-outlined text-[#137fec]">event_available</span>
                            <h2 className="text-lg font-semibold">Scheduling & Priority</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Due Date</label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none"
                                    type="date"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Priority</label>
                                <select className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none">
                                    <option>Normal</option>
                                    <option>Rush (Next Day)</option>
                                    <option>VIP Priority</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-start space-x-3">
                                <span className="material-symbols-outlined text-blue-500 text-lg mt-0.5">verified_user</span>
                                <div>
                                    <p className="text-xs font-bold text-blue-700 uppercase">Doctor Preferences (Auto-filled)</p>
                                    <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                                        "Prefers light occlusal contacts. All zirconia cases to be polished, not glazed unless specified."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center space-x-2 mb-6 pb-2 border-b border-slate-100">
                            <span className="material-symbols-outlined text-[#137fec]">rate_review</span>
                            <h2 className="text-lg font-semibold">Case Notes</h2>
                        </div>
                        <textarea
                            className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none"
                            placeholder="Add case-specific instructions, clinical photos description, or patient-specific requests..."
                            rows={6}
                        />
                    </section>
                </div>

            </div>

            {/* 하단 고정 바 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-30">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <p className="text-xs text-slate-500 font-medium uppercase">Selection Summary</p>
                        <p className="text-sm font-semibold text-[#137fec]">
                            Zirconia Crown • {selectedTeeth.length === 0 ? "No teeth selected" : `${selectedTeeth.length} teeth selected`} • Normal Priority
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            className="px-6 py-2.5 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-10 py-2.5 bg-[#137fec] hover:bg-[#137fec]/90 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center space-x-2"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-lg">save_as</span>
                            <span>Create Case Entry</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}