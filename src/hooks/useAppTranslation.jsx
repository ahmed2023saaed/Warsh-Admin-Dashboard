import { useTranslation } from 'react-i18next';

export default function useAppTranslation(nameSpace='common') {
    const {t, i18n, ready} = useTranslation(nameSpace, {
        defaultNS:'common',
        fallbackLang:'en'
    });

    return {t, i18n, ready};
}