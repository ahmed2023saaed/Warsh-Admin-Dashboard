import { Outlet } from "react-router-dom";
import { LanguageProvider } from "../../context/languageContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
    return (
        <LanguageProvider>
            <InnerLayout/>
        </LanguageProvider>
    );
}

function InnerLayout() {
    return (
        <div className="flex h-screen  overflow-hidden bg-gray-50">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}