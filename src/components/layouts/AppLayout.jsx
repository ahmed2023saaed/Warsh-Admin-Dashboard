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
    const  [collapsed, setCollapsed] = useState(false);
    const onMobileSidebarClose = () => {setMobileOpen(false)};
    const [MobileOpen, setMobileOpen] = useState(false);
    const onCollapse = () => {setCollapsed((o)=>!o)};


    return (
        <div className="flex h-screen overflow-hidden bg-[#f6f3ee]">
            <Sidebar 
             collapsed={collapsed}
             onCollapse={onCollapse} 
             onMobileSidebarClose={onMobileSidebarClose}
             mobileOpen={MobileOpen}
              />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-auto bg-[#f6f3ee] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
