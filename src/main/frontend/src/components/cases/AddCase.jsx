import { useState, useEffect } from "react";
import Header from "../common/Header";
import axios from "axios";
import SearchableSelect from "../common/SearchableSelect";

export default function AddCase() {
    const [selectedTeeth, setSelectedTeeth] = useState([]);

    const [steps, setSteps] = useState([]);

    const [openSelectId, setOpenSelectId] = useState(null);

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [openDoctors, setOpenDoctors] = useState(false);
    const [doctors, setDoctors] = useState([]);

    const [availableProcesses, setAvailableProcesses] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openCategories, setOpenCategories] = useState(false);
    const [categories, setCategories] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openProducts, setOpenProducts] = useState(false);
    const [products, setProducts] = useState([]);
    const filteredProducts = selectedCategory ? products.filter(p => p.category === selectedCategory.name) : products;


    useEffect(() => {
        axios.get("/api/doctors").then(res => {
            setDoctors(res.data);
        });

        axios.get("/api/processes").then(res => {
            setAvailableProcesses(res.data);
        });

        axios.get("/api/products").then(res => {
            setProducts(res.data);

            // category만 추출하고 중복 제거
            const categoryNames = [...new Set(res.data.map(p => p.category))];
            const distinctCategories = [
                { id: "ALL", name: "All" },
                ...categoryNames.map(c => ({ id: c, name: c }))
            ];
            setCategories(distinctCategories);
        });
    }, []);


    // 폼 필드 변경
    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    // 치아 선택
    const upperLeft = [18, 17, 16, 15, 14, 13, 12, 11];
    const upperRight = [21, 22, 23, 24, 25, 26, 27, 28];
    const lowerLeft = [48, 47, 46, 45, 44, 43, 42, 41];
    const lowerRight = [31, 32, 33, 34, 35, 36, 37, 38];

    const upper = [...upperLeft, ...upperRight];
    const lower = [...lowerLeft, ...lowerRight];
    const toggleTooth = (num) => {
        setSelectedTeeth((prev) =>
            prev.includes(num) ? prev.filter((t) => t !== num) : [...prev, num]
        );
    };

    const selectArch = (arch) => {
        const upper = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
        const lower = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
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
            s.order >= newOrder ? {...s, order: s.order + 1} : s
        );
        const newStep = {id: Date.now(), processId: null, name: null, order: newOrder, isTemp: true};
        updated.splice(index + 1, 0, newStep);
        setSteps(updated);
        setOpenSelectId(newStep.id);
    };

    const addStepAtEnd = () => {
        const maxOrder = steps.length > 0 ? Math.max(...steps.map((s) => s.order)) : 0;
        const newStep = {id: Date.now(), processId: null, name: null, order: maxOrder + 1, isTemp: true};
        setSteps((prev) => [...prev, newStep]);
        setOpenSelectId(newStep.id);
    };

    const selectProcess = (stepId, process) => {
        setSteps((prev) =>
            prev.map((s) =>
                s.id === stepId ? {...s, name: process.name, processId: process.id, isTemp: false} : s
            )
        );
    };

    const removeStep = (id) => {
        setSteps((prev) => prev.filter((s) => s.id !== id));
    };

    const [formData, setFormData] = useState({
        caseNumber: "",
        panNumber: "",
        patientName: "",
        product: "Zirconia Crown",
        shade: "N/A",
        material: "Multi-layered Zirconia",
        dueDate: "",
        priority: "NORMAL",
        notes: "",
    });

    // 서버 전송
    const handleSubmit = async () => {
        // ── Validation ──────────────────────────────────────────
        if (!formData.patientName.trim()) {
            alert("Patient name is required.");
            return;
        }
        if (!selectedDoctor) {
            alert("Please select a doctor.");
            return;
        }
        if (selectedTeeth.length === 0) {
            alert("Please select at least one tooth.");
            return;
        }
        if (!selectedProduct) {
            alert("Please select a product type.");
            return;
        }
        if (!formData.dueDate) {
            alert("Due date is required.");
            return;
        }
        const validSteps = steps.filter(s => s.processId !== null);
        if (validSteps.length === 0) {
            alert("Please add at least one process step.");
            return;
        }

        // ── Payload ─────────────────────────────────────────────
        const payload = {
            caseNumber:  formData.caseNumber.trim(),
            panNumber:   formData.panNumber.trim(),
            patientName: formData.patientName.trim(),
            doctorId:    selectedDoctor.id,
            teeth:       selectedTeeth.join(","),
            productId:     selectedProduct.id,
            shade:       formData.shade,
            material:    formData.material,
            dueDate:     formData.dueDate,
            priority:    formData.priority,
            notes:       formData.notes.trim(),
            processes:   validSteps.map((s, i) => ({
                processId:     s.processId,
                sequenceOrder: i + 1,   // 삭제/삽입 후 order가 꼬일 수 있어서 index로 재계산
            })),
        };

        // ── Request ─────────────────────────────────────────────
        try {
            await axios.post("/api/cases", payload);
            alert("Case created successfully!");
            // 필요하면 navigate("/cases") 등으로 이동
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message ?? "Failed to create case. Please try again.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-32">
            <Header/>
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
                                name="caseNumber"
                                value={formData.caseNumber}
                                onChange={handleChange}
                                placeholder="e.g. 12345"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Pan Number</label>
                            <input
                                className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none"
                                name="panNumber"
                                value={formData.panNumber}
                                onChange={handleChange}
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
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                                type="text"
                            />
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium mb-2 text-slate-700">
                                Doctor / Clinic <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <SearchableSelect
                                    items={doctors}
                                    labelKey="name"
                                    valueKey="id"
                                    placeholder="Search doctor..."
                                    display={true}
                                    open={openDoctors}
                                    onSelect={(item) => {
                                        setSelectedDoctor(item);
                                        setOpenDoctors(false);
                                    }}
                                    onOpen={() => setOpenDoctors(true)}
                                    onClose={() => setOpenDoctors(false)}
                                    renderItem={(item) => (
                                        <div className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer">
                                            <p className="text-sm font-medium">{item.name}</p>
                                            <p className="text-xs text-slate-500">{item.clinicName}</p>
                                        </div>
                                    )}
                                />
                                <span
                                    className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>

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
                                            style={{borderRadius: "40% 40% 15% 15%"}}
                                            onClick={() => toggleTooth(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                                <div className="w-px bg-slate-200 mx-4 h-full"/>
                                <div className="flex space-x-1">
                                    {upperRight.map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            className={`${toothClass(num)} w-9 h-14`}
                                            style={{borderRadius: "40% 40% 15% 15%"}}
                                            onClick={() => toggleTooth(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div
                            className="w-full flex justify-between px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-2">
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
                                            style={{borderRadius: "15% 15% 40% 40%"}}
                                            onClick={() => toggleTooth(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                                <div className="w-px bg-slate-200 mx-4 h-full"/>
                                <div className="flex space-x-1">
                                    {lowerRight.map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            className={`${toothClass(num)} w-9 h-14`}
                                            style={{borderRadius: "15% 15% 40% 40%"}}
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
                            <div className="relative group">
                                <SearchableSelect
                                    selectedItem={selectedCategory}
                                    items={categories}
                                    labelKey="name"
                                    valueKey="id"
                                    display={true}
                                    open={openCategories}
                                    onSelect={(item) => {
                                        setSelectedCategory(item.id === "ALL" ? null : item);
                                        setSelectedProduct(null);
                                        setOpenCategories(false);
                                    }}
                                    onOpen={() => setOpenCategories(true)}
                                    onClose={() => setOpenCategories(false)}
                                    renderItem={(item) => (
                                        <div className="px-3 py-2 hover:bg-slate-50 cursor-pointer">
                                            <p className="text-sm font-medium">{item.name}</p>
                                        </div>
                                    )}
                                />
                                <span className="material-symbols-outlined text-sm absolute right-3 top-1/2 -translate-y-1/2">keyboard_arrow_down</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Specific Product</label>
                            <div className="relative group">

                                <SearchableSelect
                                    items={filteredProducts}
                                    labelKey="name"
                                    valueKey="id"
                                    display={true}
                                    open={openProducts}
                                    onSelect={(item) => {
                                        setSelectedProduct(item);
                                        const matchedCategory = categories.find(
                                            c => c.name === item.category
                                        );
                                        if (matchedCategory) {
                                            setSelectedCategory(matchedCategory);
                                        }
                                        setOpenProducts(false);
                                        axios.get(`/api/products/${item.id}/workflow`)
                                            .then(res => {
                                                const workflowSteps = res.data.map(w => ({
                                                    id: crypto.randomUUID(),
                                                    processId: w.processId,
                                                    name: w.name,
                                                    order: w.order
                                                }));
                                                setSteps(workflowSteps);
                                            });
                                    }}
                                    onOpen={() => setOpenProducts(true)}
                                    onClose={() => setOpenProducts(false)}
                                    renderItem={(item) => (
                                        <div className="px-3 py-2 hover:bg-slate-50 cursor-pointer">
                                            <p className="text-sm font-medium">{item.name}</p>
                                        </div>
                                    )}
                                />
                                <span className="material-symbols-outlined text-sm absolute right-3 top-1/2 -translate-y-1/2">keyboard_arrow_down</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Shade</label>
                            <select
                                name="shade"
                                value={formData.shade}
                                onChange={handleChange}
                                className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none">
                                <option value="1">N/A</option>
                                <option value="2">A1</option>
                                <option value="3">A2</option>
                                <option value="4">A3</option>
                                <option value="5">B1</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Material</label>
                            <select
                                name="material"
                                value={formData.material}
                                onChange={handleChange}
                                className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none">
                                <option value="1">Multi-layered Zirconia</option>
                                <option value="2">E-Max</option>
                                <option value="3">CoCr Alloy</option>
                            </select>
                        </div>
                    </div>
                    {/* Process Sequence */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <label
                            className="block text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300 uppercase tracking-wider">Process
                            Sequence</label>
                        <div className="flex flex-wrap items-center gap-3">
                            {steps.map((step, i) => (
                                <div key={step.id} className="flex items-center gap-3">
                                    {openSelectId === step.id ? (
                                        // 드롭다운
                                        <SearchableSelect
                                            items={availableProcesses}
                                            labelKey="name"
                                            valueKey="id"
                                            placeholder="Search process..."
                                            display={true}
                                            onClose={() => {
                                                setSteps((prev) => prev.filter(
                                                    (s) => !(s.id === step.id && s.isTemp)
                                                ));
                                                setOpenSelectId(null);
                                            }}
                                            onSelect={(item) => {
                                                selectProcess(step.id, item);
                                                setOpenSelectId(null);
                                            }}
                                            renderItem={(item) => (
                                                <div className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer">
                                                    {item.name}
                                                </div>
                                            )}
                                        />
                                    ) : (
                                        <div
                                            className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2">
                                            <span
                                                className="text-xs font-bold text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                                            <span className="text-sm font-medium">{step.name}</span>
                                            <button onClick={() => removeStep(step.id)}
                                                    className="ml-2 text-slate-400 hover:text-red-500" type="button">
                                                <span className="material-icons text-xs">close</span>
                                            </button>
                                        </div>)}
                                    {/* 스텝 사이 + 버튼 */}
                                    {i < steps.length - 1 && (
                                        <button
                                            onClick={() => {
                                                addStepBetween(i)
                                            }}
                                            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#137fec]/10 hover:border-[#137fec] text-slate-400 hover:text-[#137fec] transition-all"
                                            type="button"
                                        >
                                            <span className="material-icons text-sm">add</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                            {/* 맨 끝에 추가 버튼 */}
                            <button
                                onClick={() => addStepAtEnd()}
                                className="bg-[#137fec]/10 border border-dashed border-[#137fec]/20 px-4 py-2 rounded-lg text-[#137fec] text-sm font-medium flex items-center cursor-pointer hover:bg-[#137fec]/20 transition-colors"
                                type="button">
                                <span className="material-icons text-xs mr-2">add</span> Add Step
                            </button>
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
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Priority</label>
                                <select
                                    className="w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] text-sm px-3 py-2 outline-none"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}>
                                    <option value="NORMAL">Normal</option>
                                    <option value="RUSH">Rush (Next Day)</option>
                                    <option value="SPS">VIP Priority</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-start space-x-3">
                                <span
                                    className="material-symbols-outlined text-blue-500 text-lg mt-0.5">verified_user</span>
                                <div>
                                    <p className="text-xs font-bold text-blue-700 uppercase">Doctor Preferences
                                        (Auto-filled)</p>
                                    <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                                        "Prefers light occlusal contacts. All zirconia cases to be polished, not glazed
                                        unless specified."
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
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={6}
                        />
                    </section>
                </div>

            </div>

            {/* 하단 고정 바 */}
            <div
                className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-30">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <p className="text-xs text-slate-500 font-medium uppercase">Selection Summary</p>
                        <p className="text-sm font-semibold text-[#137fec]">
                            {selectedProduct?.name ?? "No product selected"}
                            • {selectedTeeth.length === 0 ? "No teeth selected" : `${selectedTeeth.length} teeth selected`} •
                            {formData.priority}
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
                            onClick={handleSubmit}
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