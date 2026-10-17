import { useForm } from 'react-hook-form';
import useAppTranslation from '../../hooks/useAppTranslation';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loginAdmin } from '../../api/authApi';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();
  const { t } = useAppTranslation();
  const { lang = 'en' } = useParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || `/${lang}/`;

  const handleLoginSubmit = async ({ email, password }) => {
    clearErrors(['email', 'password', 'root']);

    try {
      const data = await loginAdmin({ email, password });
      login(data);
      console.log('Login successful');
      navigate(from, { replace: true });
    } catch (error) {
      const details = error.details || {};
      const rawFieldErrors = details.errors || details.validationErrors || {};
      // Normalize keys case-insensitively: backend returns Email/Password (PascalCase)
      const fieldErrors = {};
      for (const [k, v] of Object.entries(rawFieldErrors)) {
        fieldErrors[k.toLowerCase()] = Array.isArray(v) ? v[0] : String(v);
      }

      const message = error.message || t('login.failed');
      const lowerMessage = message.toLowerCase();
      let handled = false;

      if (fieldErrors.email || fieldErrors.password) {
        const emailMessage = fieldErrors.email || message;
        const passwordMessage = fieldErrors.password || message;
        setError('email', { type: 'server', message: emailMessage });
        setError('password', { type: 'server', message: passwordMessage });
        setError('root', { type: 'server', message: message });
        handled = true;
      }
      if (handled) return;

      if (lowerMessage.includes('email') || lowerMessage.includes('password')) {
        setError('email', { type: 'server', message });
        setError('password', { type: 'server', message });
        setError('root', { type: 'server', message });
      } else {
        // Generic failure (e.g. "Invalid email or password") -> show on both + root for toast
        setError('email', { type: 'server', message });
        setError('password', { type: 'server', message });
        setError('root', { type: 'server', message });
      }
    }
  };
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 px-4 py-6">
      <div className="w-full max-w-[480px] rounded-xl border border-gray-300 bg-white p-5 shadow-lg sm:p-10">
        <form className="space-y-6" onSubmit={handleSubmit(handleLoginSubmit)}>
          <div className="mb-6 flex flex-col items-center justify-center">
            <h1 className="mb-2 text-2xl font-bold">{t('login.title')}</h1>
            <p className="text-sm text-gray-600">{t('login.subtitle')}</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('login.email')}
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              placeholder={t('login.emailPlaceholder')}
              disabled={isSubmitting}
              {...register('email', { required: t('login.emailRequired') })}
              className={`mt-2 w-full rounded-md border px-4 py-3 text-base shadow-sm sm:text-sm focus:ring-blue-500 focus:outline-none ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-70`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t('login.password')}
            </label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              placeholder={t('login.passwordPlaceholder')}
              disabled={isSubmitting}
              {...register('password', { required: t('login.passwordRequired') })}
              className={`mt-2 w-full rounded-md border px-4 py-3 text-base shadow-sm sm:text-sm focus:ring-blue-500 focus:outline-none ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-70`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-500 px-4 py-3 text-sm text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} strokeWidth={2} className="animate-spin" />
                {t('login.loading')}
              </span>
            ) : (
              t('login.submit')
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          <Link to={`/${lang}/register`} className="ml-1 text-sm text-blue-500 hover:text-blue-700">
            {t('login.registerLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
