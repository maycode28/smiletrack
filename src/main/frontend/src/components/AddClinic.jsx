// src/components/AddClinic.jsx
import { useState } from "react";
import Header from "./common/Header";

function AddClinic() {
    const inputClass = "w-full border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#1A485C] focus:border-[#1A485C] text-sm px-3 py-2 outline-none";
    const sectionClass = "bg-white p-6 rounded-xl shadow-sm border border-slate-200";

    // 폼의 모든 입력값을 여기서 관리
    const [formData, setFormData] = useState({
        clinicName: "",
        alias: "",
        phone: "",
        email: "",
        address: "",
        shippingNotes: "",
        accountManagerId: "",
    });

    // 어떤 input이든 바뀌면 이 함수 하나로 처리
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 제출 버튼 클릭 시 Spring Boot로 전송
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/clinic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("클리닉 등록 완료!");
                // 폼 초기화
                setFormData({
                    clinicName: "", alias: "", phone: "", email: "",
                    address: "", shippingNotes: "", accountManagerId: "",
                });
            }
        } catch (error) {
            alert("서버 연결 실패: " + error.message);
        }
    };

    return (
        <div className="min-h-screen font-sans text-slate-900 bg-slate-50">
            <Header />
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 mt-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">Add New Clinic</h1>
                    </div>
                    <p className="text-slate-500 mt-2">Onboard a new dental practice to your laboratory management system.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <section className={sectionClass}>
                        <div className="flex items-center space-x-2 mb-6 pb-2 border-b border-slate-100">
                            <span className="material-symbols-outlined text-[#1A485C]">business</span>
                            <h2 className="text-lg font-semibold">Basic Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">
                                    Clinic Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={inputClass}
                                    placeholder="e.g. Bright Smiles Dental"
                                    type="text"
                                    name="clinicName"
                                    value={formData.clinicName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Clinic Alias / Nickname</label>
                                <input
                                    className={inputClass}
                                    placeholder="e.g. Bright-West"
                                    type="text"
                                    name="alias"
                                    value={formData.alias}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </section>

                    <section className={sectionClass}>
                        <div className="flex items-center space-x-2 mb-6 pb-2 border-b border-slate-100">
                            <span className="material-symbols-outlined text-[#1A485C]">contact_mail</span>
                            <h2 className="text-lg font-semibold">Contact & Address Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Email Address <span className="text-red-500">*</span></label>
                                <input
                                    className={inputClass}
                                    placeholder="clinic@clinic.com"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Phone Number</label>
                                <input
                                    className={inputClass}
                                    placeholder="+1 (555) 000-0000"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2 text-slate-700">Office Address</label>
                                <textarea
                                    className={inputClass}
                                    placeholder="Street address, suite, city, state, zip code"
                                    rows="3"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </section>

                    <section className={sectionClass}>
                        <div className="flex items-center space-x-2 mb-6 pb-2 border-b border-slate-100">
                            <span className="material-symbols-outlined text-[#1A485C]">local_shipping</span>
                            <h2 className="text-lg font-semibold">Shipping & Delivery</h2>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Special Instructions</label>
                            <textarea
                                className={inputClass}
                                placeholder="e.g. Gate code: 1234. Only deliver before 4 PM. Reception is on the 3rd floor."
                                rows="5"
                                name="shippingNotes"
                                value={formData.shippingNotes}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-slate-400 mt-2">These notes will be printed on delivery slips for couriers.</p>
                        </div>
                    </section>

                    <section className={sectionClass}>
                        <div className="flex items-center space-x-2 mb-6 pb-2 border-b border-slate-100">
                            <span className="material-symbols-outlined text-[#1A485C]">badge</span>
                            <h2 className="text-lg font-semibold">Lab Management</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Assigned Account Manager</label>
                                <select
                                    className={inputClass}
                                    name="accountManagerId"
                                    value={formData.accountManagerId}
                                    onChange={handleChange}
                                >
                                    <option value="">Select internal staff member...</option>
                                    <option value={1}>Sarah Jenkins (Senior Lab Tech)</option>
                                    <option value={2}>Michael Chen (Account Executive)</option>
                                    <option value={3}>David Miller (Customer Success)</option>
                                    <option value={4}>Elena Rodriguez (Lab Supervisor)</option>
                                </select>
                            </div>
                            <div className="bg-[#1A485C]/5 border border-[#1A485C]/15 rounded-lg p-4 text-sm text-slate-600 min-h-[46px] flex items-center">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#1A485C] text-base">lightbulb</span>
                                    <p className="leading-5">The account manager will be the primary point of contact for this clinic.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            className="px-6 py-2.5 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            type="button"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-8 py-2.5 bg-[#1A485C] hover:bg-[#1A485C]/90 text-white font-semibold rounded-lg shadow-md transition-all flex items-center gap-2"
                            type="submit"
                        >
                            <span className="material-symbols-outlined text-lg">domain_add</span>
                            <span>Add Clinic</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddClinic;
