import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Shield,
    CreditCard,
    Clock,
    Settings,
    LogOut,
    Menu,
    Bell,
    Search,
    User as UserIcon,
    ShieldCheck,
    Package,
    TrendingUp,
    FileCheck,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Role-based navigation items
    const getNavItems = () => {
        const role = user?.role;
        const commonItems = [
            { icon: Settings, label: 'Settings', path: '/settings' },
        ];

        if (role === 'POLICE') {
            return [
                { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
                { icon: FileText, label: 'Review Queue', path: '/applications/review' },
                { icon: Search, label: 'Firearm Search', path: '/firearms/search' },
                { icon: Users, label: 'Dealers', path: '/dealers' },
                { icon: FileCheck, label: 'Reports', path: '/reports' },
                ...commonItems
            ];
        }

        if (role === 'GUN_DEALER') {
            return [
                { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
                { icon: Package, label: 'Inventory', path: '/dealer/inventory' },
                { icon: TrendingUp, label: 'Sales History', path: '/dealer/sales' },
                { icon: FileCheck, label: 'Imports', path: '/dealer/imports' },
                { icon: FileText, label: 'Documents', path: '/dealer/documents' },
                ...commonItems
            ];
        }

        if (role === 'ADMIN') {
            return [
                { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
                { icon: Users, label: 'Users', path: '/admin/users' },
                { icon: Shield, label: 'System', path: '/admin/system' },
                { icon: FileCheck, label: 'Reports', path: '/reports' },
                ...commonItems
            ];
        }

        // Default / Individual
        return [
            { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
            { icon: FileText, label: 'Applications', path: '/applications' },
            { icon: Shield, label: 'My Firearms', path: '/firearms' },
            { icon: CreditCard, label: 'Payments', path: '/payments' },
            { icon: Clock, label: 'History', path: '/history' },
            ...commonItems
        ];
    };

    const navItems = getNavItems();

    return (
        <div className="min-h-screen bg-[#0F1629] text-gray-100 font-sans selection:bg-[#D4AF37] selection:text-black flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B1021] border-r border-[#D4AF37]/20 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center px-6 border-b border-[#D4AF37]/20 bg-[#0B1021]">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-[#D4AF37] rounded flex items-center justify-center border border-[#B4941F] shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                                <ShieldCheck className="h-5 w-5 text-[#0B1021]" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-[#D4AF37] leading-none tracking-tight">NFLTMS</h1>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">Official Portal</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <p className="px-2 text-xs font-semibold text-[#D4AF37]/70 uppercase tracking-wider mb-4">Main Menu</p>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                        ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                        : 'text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10'
                                        }`}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-[#D4AF37]'} transition-colors`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer / User Profile Summary */}
                    <div className="p-4 border-t border-[#D4AF37]/20 bg-[#0B1021]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-9 w-9 rounded-full bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center font-bold text-[#D4AF37] text-sm shadow-inner">
                                {user?.firstName?.charAt(0) || 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{`${user?.firstName} ${user?.lastName}`}</p>
                                <p className="text-xs text-gray-400 truncate capitalize">{user?.role?.replace('_', ' ').toLowerCase() || 'Guest'}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-red-400 border-red-900/30 hover:bg-red-950/30 hover:text-red-300 hover:border-red-800/50 transition-colors"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0F1629]">
                {/* Top Header */}
                <header className="h-16 bg-[#0B1021]/95 backdrop-blur-sm border-b border-[#D4AF37]/20 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden text-gray-400 hover:text-[#D4AF37] transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="hidden md:flex items-center text-sm text-gray-400">
                            <span className="text-[#D4AF37] font-medium">Dashboard</span>
                            <span className="mx-2 text-gray-600">/</span>
                            <span className="text-gray-200">Overview</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search (Hidden on Mobile) */}
                        <div className="hidden md:block relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search applications..."
                                className="bg-[#1A2035] border border-[#D4AF37]/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 w-64 transition-all"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-[#D4AF37] transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-[#0B1021]"></span>
                        </button>

                        {/* User Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 hover:bg-[#D4AF37]/10 rounded-full p-1 pr-3 transition-colors border border-transparent hover:border-[#D4AF37]/20">
                                    <div className="h-8 w-8 rounded-full bg-[#1A2035] border border-[#D4AF37]/30 flex items-center justify-center">
                                        <UserIcon className="h-4 w-4 text-[#D4AF37]" />
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-[#0B1021] border-[#D4AF37]/20 text-gray-200 shadow-xl shadow-black/50">
                                <DropdownMenuLabel className="text-[#D4AF37]">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-[#D4AF37]/10" />
                                <DropdownMenuItem className="focus:bg-[#D4AF37] focus:text-black cursor-pointer transition-colors">
                                    <UserIcon className="mr-2 h-4 w-4" /> Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-[#D4AF37] focus:text-black cursor-pointer transition-colors">
                                    <Settings className="mr-2 h-4 w-4" /> Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[#D4AF37]/10" />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:bg-red-900/20 focus:text-red-300 cursor-pointer transition-colors">
                                    <LogOut className="mr-2 h-4 w-4" /> Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-auto p-4 lg:p-8 relative">
                    {/* Background Texture for Dashboard Area */}
                    <div className="absolute inset-0 bg-[#0F1629] pointer-events-none -z-10">
                        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1021]/50 to-transparent"></div>
                    </div>

                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
