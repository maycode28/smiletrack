import {useState, useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";

export default function Header() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();  // 현재 URL 감지

    // 네비 링크 목록
    const navLinks = [
        {label: "Dashboard", path: "/"},
        {label: "Cases", path: "/cases"},
        {label: "Assignment", path: "/assignment"},
        {label: "Staff", path: "/staff"},
        {label: "Doctors", path: "/doctors"},
    ];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-50">
            <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-12">

                {/* 로고 + 네비 */}
                <div className="flex items-center gap-10 h-16">
                    <div className="flex items-center gap-3 min-w-max h-16">
                        <img src="/logo-text.png" className="h-8" alt="로고"/>
                    </div>
                    <nav className="flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isActive = link.path === "/"
                                ? location.pathname === "/"
                                : location.pathname.startsWith(link.path);
                            return (<a
                                    key={link.path}
                                    href={link.path}
                                    className={`text-sm h-16 flex items-center transition-colors
                                        ${isActive
                                        ? "font-bold text-main border-b-2 border-main"
                                        : "font-medium text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    {link.label}
                                </a>
                            );
                        })}
                    </nav>
                </div>

                {/* 검색창 */}
                <div className="flex-1 relative max-w-2xl">
                    <span
                        className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                        search
                    </span>
                    <input
                        className="w-full bg-slate-50 border border-[#e2e8f0] rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-main focus:border-main outline-none transition-all"
                        placeholder="Search Case ID, Patient Name, or Product..."
                        type="text"
                    />
                </div>

                {/* 유저 정보 */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                            TECHNICIAN
                        </p>
                        <p className="text-sm font-bold text-slate-900 leading-none">Marcus V.</p>
                    </div>

                    {/* 프로필 + 드롭다운 */}
                    <div className="relative cursor-pointer" ref={dropdownRef} onClick={() => setOpen(!open)}>
                        <div
                            className="w-9 h-9 rounded-full border border-[#e2e8f0] bg-slate-100 p-0.5 overflow-visible">
                            <img
                                alt="User Profile"
                                className="w-full h-full rounded-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdiYEp4-un4iSw59EhFf-qO17jYJYQW8AlkkWQitKaSvB9jl8-6eepL1A06wRDaSu2D7G9vsp3Nuu5mYbpk_Nt5B5lePuet4xl1KqcaEcD1dgCsrhSUF58psj1S1xzaYpOKOMjVK07m2FlEO9sdvdNZcME1KIWytNglS98EqQ4KszEsrmKOngrWXGDESt1haxKOe0X8uuFRs5_8vzM-BRpqzhdAKmc5jPm4XXABemZrloLTRi2VKSMsVnYGtcquHg8EyA_JtfzYep7"
                            />
                            <span
                                className="absolute top-0 right-0 w-3 h-3 bg-[#dc2626] border-2 border-white rounded-full"></span>
                        </div>

                        {/* 드롭다운 */}
                        {open && (
                            <div
                                className="absolute right-0 mt-2 w-48 bg-white border border-[#e2e8f0] rounded-md shadow-lg py-1 z-50">
                                <a className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                   href="#">
                                    <span className="material-symbols-outlined text-[18px]">notifications</span>
                                    <span>Notifications</span>
                                    <span
                                        className="ml-auto bg-[#dc2626] text-white text-[10px] px-1.5 rounded-full">2</span>
                                </a>
                                <a className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                   href="#">
                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                    <span>My Profile</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </header>
    );
}