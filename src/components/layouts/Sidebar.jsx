import {useLanguage} from "../../context/languageContext";
import { useParams, NavLink } from "react-router-dom";
import { X , ChevronLeft, ChevronRight} from "lucide-react";
import logo from "../../assets/warsha_logo.png";
import UseAppTranslation  from "../../hooks/useAppTranslation";
import navItems from "../../utils/NavItem";


export default function Sidebar({ collapsed, onCollapse, onMobileSidebarClose, mobileOpen }) {
    const { isRTL } = useLanguage();
    const { lang } = useParams();
    const { t } = UseAppTranslation('common');
    

    return (
        <aside 
        className={[
            "flex h-full flex-col bg-[#1c1712] text-[#a89a8a] transition-all duration-300 ease-in-out",
            collapsed ? "w-20" : "w-[240px]",
            "fixed inset-y-0 z-50 lg:static",
            isRTL ? `right-0 transition-transform ${mobileOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`
            : `left-0 transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`
        ].join(" ")}
        aria-label="Main navigation"
        >

        <div
        className={[
            "flex h-24 items-center justify-between border-b border-white/10 px-4",
            collapsed ? "justify-center px-2" : "px-5",
        ].join(" ")}
        >
            <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                    <img src={logo} alt="Logo" className="h-8 w-8" />
                </div>
                {!collapsed && (
                    <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-white">
                            {t("sidebar.title", { defaultValue: "Warsha" })}
                        </p>
                        <p className="truncate text-xs text-gray-300">
                            {t("sidebar.subtitle", { defaultValue: "Admin Panel" })}
                        </p>
                    </div>
                )}
            </div>
            <button className="text-white/70 hover:bg-white/10 p-2 lg:hidden rounded-full" onClick={onMobileSidebarClose} aria-label="Close menu">
                <X className="h-5 w-5" />   
            </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <li key={item.key}>
                            <NavLink
                                end={item.path === ''}
                                onClick={onMobileSidebarClose}
                                title={t(`sidebar.${item.key}`, { defaultValue: item.title })}
                                to={`/${lang}/${item.path}`}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 relative py-2 text-sm font-medium transition-colors duration-200 ${
                                        isActive ? "bg-[#2a2119] text-white" : "text-[#a89a8a] hover:bg-white/10 hover:text-white"
                                    } ${collapsed ? "justify-center" : ""}`
                                }
                            >
                                {({ isActive }) =>
                                (
                                    <>
                                    {isActive && (
                                        <span
                                            aria-hidden="true"
                                            className={`absolute inset-y-0 w-1 rounded-full overflow:hidden bg-[#e08b2f] ${isRTL ? 'right-0' : 'left-0'}`}
                                        />
                                    )}

                                    <Icon className={`h-5 w-5 ${isActive ? 'text-[#e08b2f]' : '' } `} />
                                    {!collapsed && <span className="truncate">{t(`sidebar.${item.key}`, { defaultValue: item.title })}</span>}

                                    </>
                                )
                                }
                                
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </nav>

        <div className="flex items-center justify-center border-t border-white/10 p-4">
            <button
                onClick={onCollapse}
                className="rounded-full bg-[#2a2119] p-2 text-white/70 hover:bg-[#3a2b1f] hover:text-white"
                aria-label={collapsed ? t("sidebar.expand", { defaultValue: "Expand sidebar" }) : t("sidebar.collapse", { defaultValue: "Collapse sidebar" })}
            >
                { isRTL ? collapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
                : collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}

            </button>
        </div>
        
        </aside>
    );
}          
