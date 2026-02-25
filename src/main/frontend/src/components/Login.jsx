import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side */}
            <div className="hidden md:flex flex-1 relative items-center justify-center overflow-hidden bg-white">
                {/* Gradient overlay using mix-blend-mode:multiply equivalent */}
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        background:
                            "linear-gradient(90deg, #2B9ABD -71.25%, rgba(255,255,255,0.10) 100%)",
                        mixBlendMode: "multiply",
                    }}
                />
                <div className="relative z-0 flex items-center justify-center w-full h-full px-12">
                    <img
                        src="https://api.builder.io/api/v1/image/assets/TEMP/ef0a532bc946412c6a9eb353b9c9a69151ffaba7?width=1280"
                        alt="Smile Track Logo"
                        className="w-full max-w-xs object-contain"
                    />
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex flex-1 items-center justify-center px-6 py-16 md:px-16 bg-white">
                <div className="w-full max-w-[448px] flex flex-col gap-10">
                    {/* Title */}
                    <div className="flex flex-col gap-0">
                        <h1 className="text-[30px] font-bold leading-[36px] text-[#0F172A] mb-2">
                            Lab System Portal
                        </h1>
                        <p className="text-base font-normal leading-6 text-[#64748B]">
                            Internal management system for clinical operations.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-2">
                        {/* Username */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="username"
                                className="text-sm font-medium leading-5 text-[#334155]"
                            >
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 10 10"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1.59961 6.49414C2.66602 6.06576 3.69141 5.85156 4.67578 5.85156C5.66016 5.85156 6.68555 6.06576 7.75195 6.49414C8.81836 6.92253 9.35156 7.48307 9.35156 8.17578V9.35156H0V8.17578C0 7.48307 0.533203 6.92253 1.59961 6.49414ZM6.31641 3.99219C5.86068 4.44792 5.3138 4.67578 4.67578 4.67578C4.03776 4.67578 3.49089 4.44792 3.03516 3.99219C2.57943 3.53646 2.35156 2.98958 2.35156 2.35156C2.35156 1.71354 2.57943 1.16211 3.03516 0.697266C3.49089 0.232422 4.03776 0 4.67578 0C5.3138 0 5.86068 0.232422 6.31641 0.697266C6.77214 1.16211 7 1.71354 7 2.35156C7 2.98958 6.77214 3.53646 6.31641 3.99219Z"
                                            fill="#94A3B8"
                                        />
                                    </svg>
                                </span>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full pl-10 pr-3 py-[14px] rounded-lg border border-[#E2E8F0] bg-white text-base text-[#0F172A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#158CA4] focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium leading-5 text-[#334155]"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg
                                        width="14"
                                        height="16"
                                        viewBox="0 0 10 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M6.48047 4.10156V2.92578C6.48047 2.43359 6.30273 2.00977 5.94727 1.6543C5.5918 1.29883 5.16797 1.12109 4.67578 1.12109C4.18359 1.12109 3.75977 1.29883 3.4043 1.6543C3.04883 2.00977 2.87109 2.43359 2.87109 2.92578V4.10156H6.48047ZM3.85547 8.99609C4.09245 9.23307 4.36589 9.35156 4.67578 9.35156C4.98568 9.35156 5.25911 9.23307 5.49609 8.99609C5.73307 8.75911 5.85156 8.48568 5.85156 8.17578C5.85156 7.86589 5.73307 7.59245 5.49609 7.35547C5.25911 7.11849 4.98568 7 4.67578 7C4.36589 7 4.09245 7.11849 3.85547 7.35547C3.61849 7.59245 3.5 7.86589 3.5 8.17578C3.5 8.48568 3.61849 8.75911 3.85547 8.99609ZM8.17578 4.10156C8.48568 4.10156 8.75911 4.21549 8.99609 4.44336C9.23307 4.67122 9.35156 4.9401 9.35156 5.25V11.1016C9.35156 11.4115 9.23307 11.6803 8.99609 11.9082C8.75911 12.1361 8.48568 12.25 8.17578 12.25H1.17578C0.865885 12.25 0.592448 12.1361 0.355469 11.9082C0.11849 11.6803 0 11.4115 0 11.1016V5.25C0 4.9401 0.11849 4.67122 0.355469 4.44336C0.592448 4.21549 0.865885 4.10156 1.17578 4.10156H1.75V2.92578C1.75 2.1237 2.03711 1.43555 2.61133 0.861328C3.18555 0.287109 3.8737 0 4.67578 0C5.47786 0 6.16602 0.287109 6.74023 0.861328C7.31445 1.43555 7.60156 2.1237 7.60156 2.92578V4.10156H8.17578Z"
                                            fill="#94A3B8"
                                        />
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-3 py-[14px] rounded-lg border border-[#E2E8F0] bg-white text-base text-[#0F172A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#158CA4] focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Remember device */}
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="w-4 h-4 rounded border border-[#CBD5E1] bg-white accent-[#158CA4] cursor-pointer"
                            />
                            <label
                                htmlFor="remember"
                                className="ml-2 text-sm font-normal leading-5 text-[#475569] cursor-pointer select-none"
                            >
                                Remember this device
                            </label>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className="w-full relative flex items-center justify-center rounded-2xl py-4 text-base font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
                            style={{
                                background:
                                    "linear-gradient(97deg, #0A4B5D 0%, #158CA4 50%, #4DC9E1 100%)",
                                boxShadow:
                                    "0 10px 15px -3px rgba(21,140,164,0.25), 0 4px 6px -4px rgba(21,140,164,0.25)",
                            }}
                        >
                            Sign In to Dashboard
                        </button>
                    </form>

                    {/* Support Note */}
                    <div className="flex flex-col gap-0 border-t border-[#F1F5F9] pt-8">
                        <div className="flex items-start gap-3">
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mt-0.5 shrink-0"
                            >
                                <path
                                    d="M8.22656 5.23828V3.72656H6.75V5.23828H8.22656ZM8.22656 11.25V6.75H6.75V11.25H8.22656ZM2.19727 2.19727C3.66211 0.732422 5.42578 0 7.48828 0C9.55078 0 11.3145 0.732422 12.7793 2.19727C14.2441 3.66211 14.9766 5.42578 14.9766 7.48828C14.9766 9.55078 14.2441 11.3145 12.7793 12.7793C11.3145 14.2441 9.55078 14.9766 7.48828 14.9766C5.42578 14.9766 3.66211 14.2441 2.19727 12.7793C0.732422 11.3145 0 9.55078 0 7.48828C0 5.42578 0.732422 3.66211 2.19727 2.19727Z"
                                    fill="#94A3B8"
                                />
                            </svg>
                            <p className="text-sm font-normal text-[#64748B] leading-[22.75px]">
                                Please contact the administrator for ID/Password inquiries.{" "}
                                <br className="hidden sm:block" />
                                Use your assigned credentials for tracking.
                            </p>
                        </div>
                    </div>

                    {/*/!* Footer Copyright *!/*/}
                    {/*<div className="pt-6">*/}
                    {/*    <p className="text-xs font-semibold tracking-[1.2px] uppercase text-[#94A3B8]">*/}
                    {/*        © 2024 Dental Lab Systems Inc.*/}
                    {/*    </p>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
}