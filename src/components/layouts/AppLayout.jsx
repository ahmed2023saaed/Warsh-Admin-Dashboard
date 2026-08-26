import { Outlet } from "react-router-dom";
import { LanguageProvider } from "../../context/languageContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";

export default function AppLayout() {
    return (
        <LanguageProvider>
            <InnerLayout/>
        </LanguageProvider>
    );
}

function InnerLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const onMobileSidebarClose = () => setMobileOpen(false);
    const onCollapse = () => setCollapsed((open) => !open);

    return (
        <div className="flex h-dvh overflow-hidden bg-[#f6f3ee]">
            <Sidebar 
             collapsed={collapsed}
             onCollapse={onCollapse} 
             onMobileSidebarClose={onMobileSidebarClose}
             mobileOpen={mobileOpen}
              />
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={onMobileSidebarClose}
                    className="fixed inset-0 z-40 bg-black/45 lg:hidden"
                />
            )}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Topbar onMenuOpen={() => setMobileOpen(true)} />
                <main className="flex-1 overflow-auto bg-[#f6f3ee] px-3 pb-8 pt-4 sm:px-6 sm:pb-12 sm:pt-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
