import { createContext, useCallback } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const languageContext = createContext(null)

export function LanguageProvider({children}) {
    const location = useLocation();
    const navigate = useNavigate();
    const { i18n } = useTranslation();


    const urlLang = location.pathname.split('/')[1];
    const initailLang = urlLang === 'ar' ? 'ar' : 'en';
    const [lang, setLang] = useState(initailLang);

    useEffect(() => {
        if(urlLang === 'ar' || urlLang === 'en') {
            i18n.changeLanguage(urlLang);
            setLang(urlLang);
            document.documentElement.lang = urlLang;
            document.documentElement.dir = urlLang === 'ar' ? 'rtl' : 'ltr';
        }
    }, [urlLang, i18n]);


    const changeLanguage =  useCallback((newLang) => {
        const currentPath = location.pathname;
        const newPath = currentPath.replace(/^\/(ar|en)/, `/${newLang}`);
        navigate(newPath);
    }, [location.pathname, navigate]);

    const toggleLanguage = useCallback(() => {
        changeLanguage(urlLang === 'ar' ? 'en' : 'ar');
    },[changeLanguage, lang]);

    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    const isRTL = dir === 'rtl';

    return <languageContext.Provider value={{lang, changeLanguage, toggleLanguage, dir, isRTL}}>
        {children}
    </languageContext.Provider>
}