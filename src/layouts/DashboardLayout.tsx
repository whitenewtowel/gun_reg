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
import logo from '@/assets/images/logo2.png';
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
            { icon: Shield, label: 'License Dealers', path: '/dealers' },
            { icon: CreditCard, label: 'Payments', path: '/payments' },
            { icon: Clock, label: 'History', path: '/history' },
            ...commonItems
        ];
    };

    const navItems = getNavItems();

    return (
        <div className="min-h-screen bg-[#1A2035] text-gray-900 font-sans selection:bg-[#1A2035] selection:text-white flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1A2035] border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-[#1A2035] text-white">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center ">
                                <img src={logo} alt="Logo" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white leading-none tracking-tight">NFLTMS</h1>
                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">Official Portal</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Main Menu</p>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                        ? 'bg-white text-[#1A2035]'
                                        : 'text-gray-500 hover:text-[#1A2035] hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? 'text-[#1A2035]' : 'text-gray-400 group-hover:text-[#1A2035]'} transition-colors`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer / User Profile Summary */}
                    <div className="p-4 border-t border-gray-200 bg-[#1A2035]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-9 w-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-[#1A2035] text-sm">
                                {user?.firstName?.charAt(0) || 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{`${user?.firstName || 'User'} ${user?.lastName || ''}`}</p>
                                <p className="text-xs text-gray-500 truncate capitalize">{user?.role?.replace('_', ' ').toLowerCase() || 'Guest'}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
                {/* Top Header */}
                <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden text-gray-500 hover:text-[#1A2035] transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="hidden md:flex items-center text-sm text-gray-500">
                            <span className="text-[#1A2035] font-semibold">Dashboard</span>
                            <span className="mx-2 text-gray-400">/</span>
                            <span className="text-gray-600">Overview</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search (Hidden on Mobile) */}
                        <div className="hidden md:block relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#1A2035] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search applications..."
                                className="bg-gray-100 border border-transparent rounded-full pl-9 pr-4 py-1.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:border-[#1A2035]/30 focus:ring-1 focus:ring-[#1A2035]/30 w-64 transition-all"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-500 hover:text-[#1A2035] transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        {/* User Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 pr-3 transition-colors border border-transparent hover:border-gray-200">
                                    <div className="h-8 w-8 rounded-full bg-[#1A2035] text-white flex items-center justify-center shadow-md">
                                        <UserIcon className="h-4 w-4" />
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200 text-gray-700 shadow-xl">
                                <DropdownMenuLabel className="text-[#1A2035]">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-gray-100" />
                                <DropdownMenuItem className="focus:bg-gray-50 focus:text-[#1A2035] cursor-pointer transition-colors">
                                    <UserIcon className="mr-2 h-4 w-4" /> Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-gray-50 focus:text-[#1A2035] cursor-pointer transition-colors">
                                    <Settings className="mr-2 h-4 w-4" /> Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-100" />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer transition-colors">
                                    <LogOut className="mr-2 h-4 w-4" /> Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-auto p-4 lg:p-8 relative">
                    {/* Background Texture for Dashboard Area */}
                    <div className="absolute inset-0 bg-gray-50 pointer-events-none -z-10">
                        {/* Subtle grid pattern for light mode */}
                        <div className="absolute inset-0 opacity-[0.4] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
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
