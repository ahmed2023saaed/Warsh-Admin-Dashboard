import { Navigate, useParams } from 'react-router-dom';
import { RouteFallback } from '../components/UI/fallback';
import { useAuth } from '../context/AuthContext';
import NotAllowed from '../pages/NotAllowed';

// page is a NavItem key, e.g. 'bookings'
export default function PermissionRoute({ page, children }) {
  const { lang = 'en' } = useParams();
  const { user, loading, canAccessPage, firstAllowedPage } = useAuth();

  if (loading) {
    return <RouteFallback />;
  }

  if (!user) {
    return <Navigate to={`/${lang}/login`} replace />;
  }

  if (!canAccessPage(page)) {
    // The dashboard is where login lands, so send users without access to their first page
    if (page === 'dashboard' && firstAllowedPage) {
      return <Navigate to={`/${lang}/${firstAllowedPage.path}`} replace />;
    }

    return <NotAllowed />;
  }

  return children;
}
