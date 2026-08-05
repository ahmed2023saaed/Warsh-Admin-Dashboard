import { LanguageProvider } from "../../context/languageContext";


export default function AuthLayout({children}) {
    return <LanguageProvider>
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            {children}
        </div>
    </LanguageProvider>
}
