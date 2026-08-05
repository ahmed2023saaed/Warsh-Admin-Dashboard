import { RouteFallback } from "../components/UI/fallback";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import {useParams} from "react-router-dom";

export default function ProtectedRoutes({ children }) {
    const location = useLocation();
    const { lang = 'ar' } = useParams();

    const { user, loading } = useAuth();
    if (loading) {
        return <RouteFallback />;
    }

    if(!user) {
        return <Navigate to={`/${lang}/login`} state={{ from: location }} replace />;
    }
    return children;
}