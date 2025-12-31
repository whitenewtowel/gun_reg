import { Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';

export default function DashboardRedirectHandler() {
    // Check onboarding context to determine if user needs to complete onboarding
    const onboardingContextStr = localStorage.getItem('onboarding_context');

    if (onboardingContextStr) {
        try {
            const onboardingContext = JSON.parse(onboardingContextStr);

            // If type is "NONE", user hasn't selected their user type yet
            if (onboardingContext.type === 'NONE') {
                return <Navigate to="/onboarding/select-user-type" replace />;
            }
        } catch (error) {
            console.error('Failed to parse onboarding context:', error);
        }
    }

    // If no onboarding context or type is not "NONE", show dashboard
    return <Dashboard />;
}
