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
        <div className="flex h-screen  overflow-hidden bg-gray-50">
            <Sidebar 
             collapsed={collapsed}
             onCollapse={onCollapse} 
             onMobileSidebarClose={onMobileSidebarClose}
             mobileOpen={MobileOpen}
              />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
