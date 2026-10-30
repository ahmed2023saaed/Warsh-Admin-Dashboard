import { useState } from 'react';
import useAppTranslation from '../../hooks/useAppTranslation';
import { useAuth } from '../../context/AuthContext';
import { Link, useParams, useNavigate } from 'react-router-dom';

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
    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch'));
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError(t('register.passwordTooShort'));
      setLoading(false);
      return;
    }
    try {
      await register({ name, email, password });
      navigate(from, { replace: true });
    } catch (e) {
      setError(t('register.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 px-4 py-6">
      <div className="w-full max-w-[480px] rounded-xl border border-gray-300 bg-white p-5 shadow-lg sm:p-10">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="rounded-lg bg-red-100 p-4 text-red-500">{error}</div>}

          <div className="mb-6 flex flex-col items-center justify-center">
            <h1 className="mb-1.5 text-2xl font-bold">{t('register.title')}</h1>
            <p className="text-sm text-gray-600">{t('register.subtitle')}</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {t('register.fullName')}
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 sm:text-sm focus:ring-blue-500"
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
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 sm:text-sm focus:ring-blue-500"
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 sm:text-sm focus:ring-blue-500"
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
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 sm:text-sm focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {loading ? t('register.loading') : t('register.submit')}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {t('register.hasAccount')}{' '}
          <Link to={`/${lang}/login`} className="font-medium text-blue-600 hover:text-blue-500">
            {t('register.loginLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
