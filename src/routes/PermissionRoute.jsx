import { Navigate } from 'react-router-dom';
import { RouteFallback } from '../components/UI/fallback';
import { useAuth } from '../context/AuthContext';
import NotAllowed from '../pages/NotAllowed';

export default function PermissionRoute({ permissionId, children }) {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return <RouteFallback />;
  }

  if (!user) {
    return <Navigate to="/en/login" replace />;
  }

  if (!hasPermission(permissionId)) {
    return <NotAllowed />;
  }

  return children;
}
