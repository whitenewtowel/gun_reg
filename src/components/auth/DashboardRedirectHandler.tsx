import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Dashboard from '@/pages/Dashboard';

export default function DashboardRedirectHandler() {
    const { user } = useAuth();

    // If user is logged in but has no role or is "INDIVIDUAL" without completed setup (if applicable)
    // For now, relying on "missing role" or specific condition as per user request.
    // Assuming "missing role" means checking if user.role is null/undefined or empty string?
    // User type defines role as UserRole enum.
    // The user request says: "check if they dont have role".

    if (user && !user.role) {
        return <Navigate to="/onboarding/select-user-type" replace />;
    }

    // Also if we have a flag hasCompletedOnboarding (which we don't have in type yet, but assuming we rely on role)
    // If role is present, proceed to dashboard.

    return <Dashboard />;
}
