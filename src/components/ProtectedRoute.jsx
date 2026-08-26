import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ user, allowedRoles, children }) {
    const location = useLocation();

    if (!user) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        const fallback = user.role === "admin" ? "/admin" : "/student";
        return <Navigate to={fallback} replace />;
    }

    return children;
}
