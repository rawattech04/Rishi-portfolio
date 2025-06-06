'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiFolder, FiFileText, FiSettings, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { checkAuth, removeAuthToken } from '@/lib/auth';

const SIDEBAR_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/admin/projects', label: 'Projects', icon: FiFolder },
  { href: '/admin/blog', label: 'Blogs', icon: FiFileText },
  // { href: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check system preference for dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }

    if (pathname?.includes('/admin/signin')) {
      setIsLoading(false);
      return;
    }

    // const isAuthenticated = checkAuth();
    // if (!isAuthenticated) {
    //   router.push('/admin/signin');
    // }
    setIsLoading(false);
  }, [pathname, router]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/admin/signout', {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to sign out');
      removeAuthToken();
      router.push('/admin/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  // Return signin page without layout
  if (pathname?.includes('/admin/signin')) {
    return <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>{children}</div>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className={`flex items-center justify-between px-4 h-16 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Admin Panel</h1>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className={`p-2 rounded-md lg:hidden ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Sidebar Links */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={toggleDarkMode}
                className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md mb-2 ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {isDarkMode ? (
                  <><FiSun className="mr-3 h-5 w-5" /> Light Mode</>
                ) : (
                  <><FiMoon className="mr-3 h-5 w-5" /> Dark Mode</>
                )}
              </button>
              <button
                onClick={handleSignOut}
                className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FiLogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`fixed top-4 left-4 p-2 rounded-md shadow-lg lg:hidden z-50 ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        {/* Main Content */}
        <div
          className={`${
            isSidebarOpen ? 'lg:pl-64' : ''
          } flex flex-col min-h-screen transition-all duration-300`}
        >
          <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
} 