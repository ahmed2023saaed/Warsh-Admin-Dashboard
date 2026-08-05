import { useState } from "react";
import useAppTranslation from "../../hooks/useAppTranslation";
import { useAuth } from "../../context/AuthContext";
import {Link, useParams, useNavigate} from "react-router-dom";


export default function Register() {

    const { t } = useAppTranslation();
    const { lang = 'en' } = useParams();
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || `/${lang}/`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        if(password !== confirmPassword){
            setError(t('register.passwordMismatch'));
            setLoading(false);
            return;
        }
        if(password.length < 6){
            setError(t('register.passwordTooShort'));
            setLoading(false);
            return;
        }
        try{
            await register({name, email, password});
            navigate(from, { replace: true });
        }catch(e){
            setError(t('register.failed'));
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="flex min-h-screen items-center justify-center bg-slate-100" >
            <div className="w-full min-w-md border border-gray-300 shadow-lg bg-white p-8 rounded-xl">
                <form className="space-y-4" onSubmit={handleSubmit} >
                    {error && (
                        <div className="text-red-500 bg-red-100 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className= "flex items-center justify-center flex-col mb-6">
                        <h1 className="text-2xl font-bold mb-1.5">{t('register.title')}</h1>
                        <p className="text-gray-600 text-sm">{t('register.subtitle')}</p>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            {t('register.fullName')}
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            {t('register.email')}
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            {t('register.password')}
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            {t('register.confirmPassword')}
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 w-full block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? t('register.loading') : t('register.submit')}
                        </button>
                    </div>
                </form>

                <p className="text-center mt-4 text-sm text-gray-600"> 
                        {t('register.hasAccount')}{' '}
                    <Link to={`/${lang}/login`} className="font-medium text-blue-600 hover:text-blue-500">
                        {t('register.loginLink')}
                    </Link>
                </p>
            </div>

        </div>
    )
}