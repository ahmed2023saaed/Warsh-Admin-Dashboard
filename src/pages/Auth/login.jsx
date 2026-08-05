import { useState } from "react";
import useAppTranslation from "../../hooks/useAppTranslation";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {useParams, useNavigate} from "react-router-dom";

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useAppTranslation();
    const { lang = 'en' } = useParams();
    const { login } = useAuth();
    const { navigate } = useNavigate();

    const from = location.state?.from?.pathname || `/${lang}/`;

    const handelSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setError('');

        try{
            // Simulate an API call
           await login({email, password});
           console.log('Login successful');
           navigate(from, { replace: true });

        }catch(e){
            setError(t('login.failed'));
        }finally{
            setLoading(false);
        }
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <div className="w-full min-w-md border border-gray-300 shadow-lg bg-white p-8 rounded-xl">
                <form className="space-y-6" onSubmit={handelSubmit} >

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-center flex-col mb-6">
                        <h1 className="text-2xl font-bold mb-1.5">{t('login.title')}</h1>
                        <p className="text-gray-600 text-sm">{t('login.subtitle')}</p>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('login.email')}</label>
                        <input type="email" id="email" placeholder={t('login.emailPlaceholder')} required value={email} onChange={(e)=> setEmail(e.target.value)} 
                        className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('login.password')}</label>
                        <input type="password" id="password" placeholder={t('login.passwordPlaceholder')} required value={password} onChange={(e)=> setPassword(e.target.value)} 
                        className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        {loading ? t('login.loading') : t('login.submit')}
                        
                    </button>


                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    {t('login.forgotPassword')}
                    <Link to={`/${lang}/register`} className="text-blue-500 hover:text-blue-700 ml-1">
                        {t('login.registerLink')}
                    </Link>
                </p>
            </div>

        </div>
    )
}