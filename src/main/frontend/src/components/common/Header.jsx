import {useState, useEffect, useRef} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [me, setMe] = useState(null);
    const dropdownRef = useRef(null);
    const location = useLocation();  // 현재 URL 감지
    const navigate = useNavigate();

    // 네비 링크 목록
    const navLinks = [
        {label: "Dashboard", path: "/dashboard"},
        {label: "Cases", path: "/cases/list"},
        {label: "Assignment", path: "/assignment", disabled: true},
        {label: "Staff", path: "/staff", disabled: true},
        {label: "Doctors", path: "/doctors", disabled: true},
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

    useEffect(() => {
        let ignore = false;

        const fetchMe = async () => {
            try {
                const res = await fetch("/api/employee/me");

                if (!res.ok) {
                    if (res.status === 401 && location.pathname !== "/") {
                        navigate("/", { replace: true });
                    }
                    return;
                }

                const data = await res.json();

                if (!ignore && data.resultCode === "S-1") {
                    setMe({
                        name: data.name,
                        role: data.role || "Employee",
                    });
                }
            } catch (error) {
                console.error("Failed to load logged-in user.", error);
            }
        };

        fetchMe();

        return () => {
            ignore = true;
        };
    }, [location.pathname, navigate]);

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter" && query.trim()) {
            navigate(`/cases/list?q=${encodeURIComponent(query)}`);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/employee/doLogout", { method: "POST" });
        window.location.href = "/";
    };

    const profileInitial = (me?.name || "U").trim().charAt(0).toUpperCase();

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

                            if (link.disabled) {
                                return (
                                    <span
                                        key={link.path}
                                        title="준비 중인 메뉴"
                                        className="text-sm h-16 flex items-center font-medium text-slate-400 cursor-default"
                                    >
                                        {link.label}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm h-16 flex items-center transition-colors
                                        ${isActive
                                        ? "font-bold text-[#1A485C] border-b-2 border-[#1A485C]"
                                        : "font-medium text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* 검색창 */}
                <div className="flex-1 relative max-w-2xl">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                        search
                    </span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        className="w-full bg-slate-50 border border-[#e2e8f0] rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-main focus:border-main outline-none transition-all"
                        placeholder="Search Case ID, Patient Name, or Product..."
                        type="text"
                    />
                </div>


                {/* 유저 정보 */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                            {me?.role || "Employee"}
                        </p>
                        <p className="text-sm font-bold text-slate-900 leading-none">{me?.name || "Loading..."}</p>
                    </div>

                    {/* 프로필 + 드롭다운 */}
                    <div className="relative cursor-pointer" ref={dropdownRef} onClick={() => setOpen(!open)}>
                        <div
                            className="w-9 h-9 rounded-full border border-[#e2e8f0] bg-slate-100 overflow-visible flex items-center justify-center text-sm font-bold text-slate-700">
                            {profileInitial}
                            <span
                                className="absolute top-0 right-0 w-3 h-3 bg-[#dc2626] border-2 border-white rounded-full"></span>
                        </div>

                        {/* 드롭다운 */}
                        {open && (
                            <div
                                className="absolute right-0 mt-2 w-48 bg-white border border-[#e2e8f0] rounded-md shadow-lg py-1 z-50">
                                <button
                                   type="button"
                                   className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left">
                                    <span className="material-symbols-outlined text-[18px]">notifications</span>
                                    <span>Notifications</span>
                                    <span
                                        className="ml-auto bg-[#dc2626] text-white text-[10px] px-1.5 rounded-full">2</span>
                                </button>
                                <button
                                   type="button"
                                   className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left">
                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                    <span>My Profile</span>
                                </button>
                                <hr/>
                                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-slate-50 text-left">
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </header>
    );
}
