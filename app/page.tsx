'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import executionsData from '../data/executions.json';
import credentialsData from '../data/credentials.json';
import templatesData from '../data/templates.json';
import WorkflowEditor from './components/WorkflowEditor';
import { DashboardContent, WorkflowsContent, ExecutionsContent, CredentialsContent, TemplatesContent, SettingsContent } from './components/DashboardComponents';
import { authAPI, workflowAPI } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState('Automation Inc.');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [workflowPagination, setWorkflowPagination] = useState<any>(null);
  const [executions, setExecutions] = useState(executionsData);
  const [credentials, setCredentials] = useState(credentialsData);
  const [showEditor, setShowEditor] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const organizations = [
    { name: 'Automation Inc.', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXy6_OiVXihCR01eP7vu_XdvWpcLTzQmSnVqLIZK18mfBSBhKwQ9xRgzxvblaOEOvJyksIyaMEJK7VTBTDs9oGx97bC18mFmW_qLAAkwslHQjOLucxgZOqMMIKSUx303wSzyoUo8acI1byfIdAl9ur5QWXh7JcdlTotqh7PvliBZVuwpumSWXbr6EBns47osUifvc3RnkDeB7hDAwhBPPsFZRb8TFk1Z6Z6Vqq664-I6F-wadA-hrye1lTY2-6jsejfBWaDJzYPcU' },
    { name: 'Tech Solutions', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXy6_OiVXihCR01eP7vu_XdvWpcLTzQmSnVqLIZK18mfBSBhKwQ9xRgzxvblaOEOvJyksIyaMEJK7VTBTDs9oGx97bC18mFmW_qLAAkwslHQjOLucxgZOqMMIKSUx303wSzyoUo8acI1byfIdAl9ur5QWXh7JcdlTotqh7PvliBZVuwpumSWXbr6EBns47osUifvc3RnkDeB7hDAwhBPPsFZRb8TFk1Z6Z6Vqq664-I6F-wadA-hrye1lTY2-6jsejfBWaDJzYPcU' },
    { name: 'Digital Agency', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXy6_OiVXihCR01eP7vu_XdvWpcLTzQmSnVqLIZK18mfBSBhKwQ9xRgzxvblaOEOvJyksIyaMEJK7VTBTDs9oGx97bC18mFmW_qLAAkwslHQjOLucxgZOqMMIKSUx303wSzyoUo8acI1byfIdAl9ur5QWXh7JcdlTotqh7PvliBZVuwpumSWXbr6EBns47osUifvc3RnkDeB7hDAwhBPPsFZRb8TFk1Z6Z6Vqq664-I6F-wadA-hrye1lTY2-6jsejfBWaDJzYPcU' },
  ];

  const currentOrg = organizations.find(org => org.name === selectedOrg) || organizations[0];

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const orgMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (orgMenuRef.current && !orgMenuRef.current.contains(event.target as Node)) {
        setShowOrgMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchWorkflows = async (page = 1) => {
    setLoading(true);
    try {
      const result = await workflowAPI.getAll(page);
      setWorkflows(result.data);
      setWorkflowPagination(result);
    } catch (err) {
      console.error('Failed to fetch workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  const openEditor = (workflow?: any) => {
    setEditingWorkflow(workflow);
    setShowEditor(true);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('organization');
      router.push('/auth/login');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent timeRange={timeRange} setTimeRange={setTimeRange} workflows={workflows} executions={executions} openEditor={openEditor} />;
      case 'workflows':
        return <WorkflowsContent workflows={workflows} setWorkflows={setWorkflows} openEditor={openEditor} pagination={workflowPagination} onPageChange={fetchWorkflows} loading={loading} />;
      case 'executions':
        return <ExecutionsContent executions={executions} />;
      case 'credentials':
        return <CredentialsContent credentials={credentials} setCredentials={setCredentials} />;
      case 'templates':
        return <TemplatesContent templates={templatesData} openEditor={openEditor} />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent timeRange={timeRange} setTimeRange={setTimeRange} workflows={workflows} executions={executions} openEditor={openEditor} />;
    }
  };

  return (
    <>
      {showEditor && <WorkflowEditor workflow={editingWorkflow} onClose={() => setShowEditor(false)} />}
      <div className="relative h-screen bg-[#0a0e1a] text-gray-200 overflow-hidden">
        <div className="gradient-bg fixed inset-0" />
        <div className="flex h-full relative z-10">
          <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 bg-glass-nav flex flex-col transition-all duration-300 relative h-full overflow-hidden`}>
            <div className="flex flex-col h-full p-4">
              <div className="relative mb-4" ref={orgMenuRef}>
                <button
                  onClick={() => !sidebarCollapsed && setShowOrgMenu(!showOrgMenu)}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} w-full p-3 rounded-xl hover:bg-gradient-to-r hover:from-[#607AFB]/10 hover:to-transparent transition-all duration-300 group border border-transparent hover:border-white/10`}
                >
                  <div className={`flex items-center ${sidebarCollapsed ? '' : 'gap-3'}`}>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex-shrink-0 ring-2 ring-[#607AFB]/30 group-hover:ring-[#607AFB]/60 transition-all" style={{ backgroundImage: `url("${currentOrg.logo}")` }} />
                    {!sidebarCollapsed && (
                      <div className="flex flex-col">
                        <h1 className="text-white text-sm font-bold whitespace-nowrap">{selectedOrg}</h1>
                        <p className="text-gray-400 text-xs whitespace-nowrap">Workspace</p>
                      </div>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors">
                      {showOrgMenu ? 'expand_less' : 'expand_more'}
                    </span>
                  )}
                </button>
                {showOrgMenu && !sidebarCollapsed && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50">
                    {organizations.map((org) => (
                      <button
                        key={org.name}
                        onClick={() => {
                          setSelectedOrg(org.name);
                          setShowOrgMenu(false);
                        }}
                        className={`flex items-center gap-3 w-full p-3 hover:bg-gradient-to-r hover:from-[#607AFB]/20 hover:to-transparent transition-all ${selectedOrg === org.name ? 'bg-gradient-to-r from-[#607AFB]/10 to-transparent' : ''}`}
                      >
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 flex-shrink-0 ring-2 ring-white/10" style={{ backgroundImage: `url("${org.logo}")` }} />
                        <span className="text-sm text-white font-medium">{org.name}</span>
                        {selectedOrg === org.name && (
                          <span className="material-symbols-outlined text-[#607AFB] ml-auto text-sm">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-white/10 mb-4" />
              <nav className="flex flex-col gap-2 flex-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-xl transition-all duration-300 group relative ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white shadow-lg shadow-[#607AFB]/30' : 'text-gray-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent hover:scale-105'}`}
                >
                  <span className="material-symbols-outlined text-xl flex-shrink-0 group-hover:scale-110 transition-transform">dashboard</span>
                  {!sidebarCollapsed && <p className="text-sm font-semibold whitespace-nowrap">Dashboard</p>}
                </button>
                <button
                  onClick={() => setActiveTab('workflows')}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-xl transition-all duration-300 group relative ${activeTab === 'workflows' ? 'bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white shadow-lg shadow-[#607AFB]/30' : 'text-gray-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent hover:scale-105'}`}
                >
                  <span className="material-symbols-outlined text-xl flex-shrink-0 group-hover:scale-110 transition-transform">account_tree</span>
                  {!sidebarCollapsed && <p className="text-sm font-semibold whitespace-nowrap">Workflows</p>}
                </button>
                <button
                  onClick={() => setActiveTab('executions')}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-xl transition-all duration-300 group relative ${activeTab === 'executions' ? 'bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white shadow-lg shadow-[#607AFB]/30' : 'text-gray-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent hover:scale-105'}`}
                >
                  <span className="material-symbols-outlined text-xl flex-shrink-0 group-hover:scale-110 transition-transform">history</span>
                  {!sidebarCollapsed && <p className="text-sm font-semibold whitespace-nowrap">Executions</p>}
                </button>
                <button
                  onClick={() => setActiveTab('credentials')}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-xl transition-all duration-300 group relative ${activeTab === 'credentials' ? 'bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white shadow-lg shadow-[#607AFB]/30' : 'text-gray-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent hover:scale-105'}`}
                >
                  <span className="material-symbols-outlined text-xl flex-shrink-0 group-hover:scale-110 transition-transform">key</span>
                  {!sidebarCollapsed && <p className="text-sm font-semibold whitespace-nowrap">Credentials</p>}
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-xl transition-all duration-300 group relative ${activeTab === 'templates' ? 'bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white shadow-lg shadow-[#607AFB]/30' : 'text-gray-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent hover:scale-105'}`}
                >
                  <span className="material-symbols-outlined text-xl flex-shrink-0 group-hover:scale-110 transition-transform">library_books</span>
                  {!sidebarCollapsed && <p className="text-sm font-semibold whitespace-nowrap">Templates</p>}
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-xl transition-all duration-300 group relative ${activeTab === 'settings' ? 'bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white shadow-lg shadow-[#607AFB]/30' : 'text-gray-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent hover:scale-105'}`}
                >
                  <span className="material-symbols-outlined text-xl flex-shrink-0 group-hover:scale-110 transition-transform">settings</span>
                  {!sidebarCollapsed && <p className="text-sm font-semibold whitespace-nowrap">Settings</p>}
                </button>
              </nav>
              <div className="border-t border-white/10 mt-4 pt-4">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} w-full px-3 py-2 rounded-xl hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent text-gray-400 hover:text-white transition-all duration-300 hover:scale-105`}
                >
                  <span className="material-symbols-outlined text-xl">{sidebarCollapsed ? 'chevron_right' : 'chevron_left'}</span>
                  {!sidebarCollapsed && <span className="text-sm font-medium">Collapse</span>}
                </button>
              </div>
            </div>
          </aside>
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex items-center justify-between whitespace-nowrap bg-glass-header px-6 h-16 flex-shrink-0 sticky top-0 z-10">
              <label className="relative flex-1 max-w-lg group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#607AFB] transition-colors">search</span>
                <input className="w-full pl-12 pr-4 py-3 rounded-xl text-white bg-white/5 border border-white/10 focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30 placeholder:text-gray-500 text-sm transition-all focus:bg-white/10 focus:shadow-lg focus:shadow-[#607AFB]/20" placeholder="Search workflows, executions..." />
              </label>
              <div className="flex items-center gap-3">
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative flex items-center justify-center size-11 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full animate-pulse ring-2 ring-red-500/30"></span>
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50">
                      <div className="p-4 border-b border-white/10">
                        <h3 className="text-white font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="p-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5">
                          <div className="flex items-start gap-3">
                            <div className="size-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                              <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-white font-medium">Workflow completed</p>
                              <p className="text-xs text-gray-400 mt-1">Daily Report Generation finished successfully</p>
                              <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border-t border-white/10">
                        <button className="text-sm text-[#607AFB] hover:text-[#4f68d9] font-medium w-full text-center">View all notifications</button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-11 ring-2 ring-[#607AFB]/30 hover:ring-[#607AFB] transition-all hover:scale-110 cursor-pointer shadow-lg"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB75SXsMPn4R6kiQmtDYDIQh2LqK79Fh1QaqYs2dcGbFlS6Ltars-u8I-ar8Xi0iFLoaWfyuleL4Bk5y1e-l0wcv7RFRj0H0uSdS9tT9Ah67xyR94oH6uXpnjVk6gsHTrhI8uCINfmzw-MnM1uTq_2khLWac0mmG1xU_Y5ieLYjWgkkOi4muMMCD9NnY4EcweZXmXJhDVs7F65rpfGXLIjpK4fKAUEhU5bbdXYM2eXx1uF-Ayg5JQq_tyKBq5CeKz4qeMHoJjCbVqk")' }}
                  />
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50">
                      <div className="p-3 border-b border-white/10">
                        <p className="text-white font-semibold text-sm">John Doe</p>
                        <p className="text-gray-400 text-xs">john@automation.com</p>
                      </div>
                      <div className="py-2">
                        <button onClick={() => router.push('/auth/change-password')} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 transition-colors text-gray-300 hover:text-white">
                          <span className="material-symbols-outlined text-lg">password</span>
                          <span className="text-sm">Change Password</span>
                        </button>
                        <button onClick={() => setActiveTab('settings')} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 transition-colors text-gray-300 hover:text-white">
                          <span className="material-symbols-outlined text-lg">settings</span>
                          <span className="text-sm">Settings</span>
                        </button>
                      </div>
                      <div className="border-t border-white/10 py-2">
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 transition-colors text-red-400 hover:text-red-300">
                          <span className="material-symbols-outlined text-lg">logout</span>
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}


