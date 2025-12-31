import IndividualDashboard from '@/pages/dashboards/IndividualDashboard';

export default function DashboardRedirectHandler() {
    // Clear onboarding context to resolve stuck state
    localStorage.removeItem('onboarding_context');

    // Proceed directly to dashboard
    return <IndividualDashboard />;
}
