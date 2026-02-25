// src/components/AddClinic.jsx
import { useState } from "react";
import Header from "./common/Header";

function AddClinic() {

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
            const response = await fetch("http://localhost:8080/api/clinic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("클리닉 등록 완료!");
                // 폼 초기화
                setFormData({
                    clinicName: "", alias: "", phone: "", email: "",
                    address: "", shippingNotes: "", accountManager: "",
                });
            }
        } catch (error) {
            alert("서버 연결 실패: " + error.message);
        }
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <Header />
                {/* Main */}
                <main className="flex flex-1 justify-center py-8 px-4 md:px-10">
                    <div className="layout-content-container flex flex-col max-w-[1000px] flex-1">

                        {/* Breadcrumb & Title */}
                        <div className="flex flex-col gap-2 mb-8">
                            <div className="flex items-center gap-2 text-sm text-[#4c739a] font-medium">
                                <a className="hover:text-primary" href="#">Management</a>
                                <span className="material-symbols-outlined text-xs">chevron_right</span>
                                <a className="hover:text-primary" href="#">Clinics</a>
                                <span className="material-symbols-outlined text-xs">chevron_right</span>
                                <span className="text-primary">Add New Clinic</span>
                            </div>
                            <h1 className="text-[#0d141b] text-3xl font-black leading-tight tracking-[-0.033em]">Register New Clinic</h1>
                            <p className="text-[#4c739a] text-base">Onboard a new dental practice to your laboratory management system.</p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-primary/10 overflow-hidden">
                            <form className="p-8 space-y-10" onSubmit={handleSubmit}>

                                {/* Basic Information */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6 text-primary">
                                        <span className="material-symbols-outlined">info</span>
                                        <h2 className="text-lg font-bold text-[#0d141b]">Basic Information</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-[#0d141b]">
                                                Clinic Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                className="form-input rounded-lg border-primary/20 focus:border-primary focus:ring-primary/20 bg-background-light text-[#0d141b]"
                                                placeholder="e.g. Bright Smiles Dental"
                                                type="text"
                                                name="clinicName"
                                                value={formData.clinicName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-[#0d141b]">Clinic Alias / Nickname</label>
                                            <input
                                                className="form-input rounded-lg border-primary/20 focus:border-primary focus:ring-primary/20 bg-background-light text-[#0d141b]"
                                                placeholder="e.g. Bright-West"
                                                type="text"
                                                name="alias"
                                                value={formData.alias}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Contact & Location */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6 text-primary">
                                        <span className="material-symbols-outlined">location_on</span>
                                        <h2 className="text-lg font-bold text-[#0d141b]">Contact &amp; Location</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-[#0d141b]">Phone Number</label>
                                            <div className="flex gap-2">
                                                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-primary/20 bg-primary/5 text-[#4c739a] text-sm">+1</span>
                                                <input
                                                    className="form-input flex-1 rounded-r-lg border-primary/20 focus:border-primary focus:ring-primary/20 bg-background-light text-[#0d141b]"
                                                    placeholder="(555) 000-0000"
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-[#0d141b]">Email Address</label>
                                            <input
                                                className="form-input rounded-lg border-primary/20 focus:border-primary focus:ring-primary/20 bg-background-light text-[#0d141b]"
                                                placeholder="contact@clinicname.com"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 md:col-span-2">
                                            <label className="text-sm font-semibold text-[#0d141b]">Full Office Address</label>
                                            <textarea
                                                className="form-input rounded-lg border-primary/20 focus:border-primary focus:ring-primary/20 bg-background-light text-[#0d141b]"
                                                placeholder="Street Address, Suite, City, State, Zip Code"
                                                rows="2"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Shipping & Delivery */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6 text-primary">
                                        <span className="material-symbols-outlined">local_shipping</span>
                                        <h2 className="text-lg font-bold text-[#0d141b]">Shipping &amp; Delivery</h2>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-[#0d141b]">Special Instructions</label>
                                        <textarea
                                            className="form-input rounded-lg border-primary/20 focus:border-primary focus:ring-primary/20 bg-background-light text-[#0d141b]"
                                            placeholder="e.g. Gate code: 1234. Only deliver before 4 PM. Reception is on the 3rd floor."
                                            rows="3"
                                            name="shippingNotes"
                                            value={formData.shippingNotes}
                                            onChange={handleChange}
                                        />
                                        <p className="text-xs text-[#4c739a]">These notes will be printed on delivery slips for couriers.</p>
                                    </div>
                                </section>

                                {/* Lab Management */}
                                <section>
                                    <div className="flex items-center gap-2 mb-6 text-primary">
                                        <span className="material-symbols-outlined">badge</span>
                                        <h2 className="text-lg font-bold text-[#0d141b]">Lab Management</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-[#0d141b]">Assigned Account Manager</label>
                                            <div className="relative">
                                                <select
                                                    className="form-select w-full rounded-lg border-primary/20 focus:border-primary focus:ring-primary/20 bg-background-light text-[#0d141b] appearance-none"
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
                                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#4c739a] pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-end pb-1">
                                            <div className="flex items-center gap-2 text-sm text-[#4c739a] italic bg-primary/5 p-3 rounded-lg border border-primary/10">
                                                <span className="material-symbols-outlined text-sm">lightbulb</span>
                                                The account manager will be the primary point of contact for this clinic.
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Buttons */}
                                <div className="pt-8 border-t border-primary/10 flex flex-col-reverse sm:flex-row justify-end gap-3">
                                    <button
                                        className="px-6 py-2.5 rounded-lg border border-slate-300 text-[#0d141b] font-semibold hover:bg-slate-50 transition-colors"
                                        type="button"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-8 py-2.5 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                        type="submit"
                                    >
                                        <span className="material-symbols-outlined text-xl">add_circle</span>
                                        Add Clinic
                                    </button>
                                </div>

                            </form>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 mb-12 flex items-center justify-between text-sm text-[#4c739a]">
                            <p>© 2024 Dental Laboratory Management System</p>
                            <div className="flex gap-4">
                                <a className="hover:underline" href="#">Need help?</a>
                                <a className="hover:underline" href="#">Quick Start Guide</a>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}

export default AddClinic;