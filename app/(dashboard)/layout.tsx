'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useToast } from '@/lib/toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('organization');
      document.cookie = 'access_token=; path=/; max-age=0';
      showToast('Logged out successfully', 'success');
      router.push('/auth/login');
    }
  };

  const navItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/workflows', icon: 'account_tree', label: 'Workflows' },
    { path: '/executions', icon: 'history', label: 'Executions' },
    { path: '/credentials', icon: 'key', label: 'Credentials' },
    { path: '/templates', icon: 'library_books', label: 'Templates' },
    { path: '/webhooks', icon: 'webhook', label: 'Webhooks' },
    { path: '/variables', icon: 'code', label: 'Variables' },
    { path: '/settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <div className="relative h-screen bg-[#0a0e1a] text-gray-200 overflow-hidden">
      <div className="gradient-bg fixed inset-0" />
      <div className="flex h-full relative z-10">
        <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 bg-glass-nav flex flex-col transition-all duration-300`}>
          <div className="flex flex-col h-full p-4">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#607AFB] to-[#8B5CF6] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">account_tree</span>
              </div>
              {!sidebarCollapsed && <h1 className="text-white text-xl font-bold">n8njd</h1>}
            </div>
            <div className="border-t border-white/10 mb-4" />
            <nav className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-xl transition-all ${pathname === item.path ? 'bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white shadow-lg' : 'text-gray-300 hover:bg-white/10'}`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  {!sidebarCollapsed && <p className="text-sm font-semibold">{item.label}</p>}
                </Link>
              ))}
            </nav>
            <div className="border-t border-white/10 mt-4 pt-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} w-full px-3 py-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all`}
              >
                <span className="material-symbols-outlined text-xl">{sidebarCollapsed ? 'chevron_right' : 'chevron_left'}</span>
                {!sidebarCollapsed && <span className="text-sm font-medium">Collapse</span>}
              </button>
            </div>
          </div>
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between bg-glass-header px-6 h-16">
            <input className="w-full max-w-lg pl-10 pr-4 py-2 rounded-xl text-white bg-white/5 border border-white/10 focus:border-[#607AFB] placeholder:text-gray-500 text-sm" placeholder="Search..." />
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 bg-gradient-to-br from-[#607AFB] to-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold"
              >
                JD
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-white font-semibold text-sm">John Doe</p>
                    <p className="text-gray-400 text-xs">john@automation.com</p>
                  </div>
                  <div className="py-2">
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white">
                      <span className="material-symbols-outlined text-lg">settings</span>
                      <span className="text-sm">Settings</span>
                    </Link>
                  </div>
                  <div className="border-t border-white/10 py-2">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 text-red-400">
                      <span className="material-symbols-outlined text-lg">logout</span>
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
