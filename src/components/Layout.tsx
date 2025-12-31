import { IMAGES } from '@/assets/images'
import { Home, Box, Bell, LogOut, Menu } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white border-r border-gray-200 text-[#1A2035]">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-8">
        <img src={IMAGES.LOGO} alt="Logo" className="h-20 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <Link
          to="/dashboard"
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-[#1A2035] text-white shadow-md shadow-[#1A2035]/20' : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A2035]'
            }`}
        >
          <Home size={20} />
          Home
        </Link>
        <Link
          to="/licenses"
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive('/licenses') ? 'bg-[#1A2035] text-white shadow-md shadow-[#1A2035]/20' : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A2035]'
            }`}
        >
          <Box size={20} />
          License Management
        </Link>
        <Link
          to="/alerts"
          onClick={() => setIsOpen(false)}
          className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive('/alerts') ? 'bg-[#1A2035] text-white shadow-md shadow-[#1A2035]/20' : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A2035]'
            }`}
        >
          <div className="flex items-center gap-3">
            <Bell size={20} />
            Alerts & Reporting
          </div>
          <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${isActive('/alerts') ? 'bg-white text-[#1A2035]' : 'bg-red-600 text-white'}`}>
            2
          </span>
        </Link>
        {/* <Link
          to="/settings"
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
            isActive('/settings') ? 'bg-[#1A2035] text-white shadow-md shadow-[#1A2035]/20' : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A2035]'
          }`}
        >
          <Settings size={20} />
          Settings
        </Link> */}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600" onClick={() => navigate('/login')}>
          <LogOut size={20} />
          Logout
        </button>
        <div className="mt-4 flex items-center gap-3 px-3">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User"
            className="h-10 w-10 rounded-full border border-gray-200"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#1A2035]">Michael Adjei</span>
            <span className="text-xs text-gray-500">michaeladjei111@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="fixed top-0 z-30 flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm md:hidden">
        <img src={IMAGES.LOGO} alt="Logo" className="h-10 w-auto" />
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 border-r-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-80 transition-transform md:block">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="w-full p-4 pt-20 md:ml-80 md:p-8 md:pt-8 text-[#1A2035]">
        {children}
      </main>
    </div>
  )
}
