import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Folder,
  Share2,
  Activity,
  Settings,
  FileCode,
  User,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  Sun,
  Moon,
  LogOut,
  Code,
  BarChart3,
  X,
  Plus,
  CreditCard,
  HelpCircle,
  BookOpen,
  Terminal,
  Database,
  Smartphone,
  Globe,
  Server,
  Cpu as CpuIcon,
  GitBranch,
  Rocket,
  FileText
} from 'lucide-react';
import { FaPython } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', active: location.pathname === '/dashboard' },
    { icon: Folder, label: 'My Projects', path: '/projects', active: location.pathname === '/projects' },
    { icon: Share2, label: 'Shared', path: '/shared', active: location.pathname.startsWith('/shared') },
    { icon: Users, label: 'Collaborators', path: '/collaborators', active: location.pathname === '/collaborators' },
    { icon: Activity, label: 'Activity', path: '/activity', active: location.pathname === '/activity' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', active: location.pathname === '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings', active: location.pathname === '/settings' },
  ];

  const templates = [
    { icon: Globe, label: 'React App', type: 'web' },
    { icon: Server, label: 'Node.js API', type: 'backend' },
    { icon: FaPython, label: 'Python Data', type: 'data' },
    { icon: Smartphone, label: 'Mobile App', type: 'mobile' },
    { icon: Database, label: 'Database', type: 'database' },
    { icon: CpuIcon, label: 'ML Model', type: 'ai' },
  ];

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Project Shared', message: 'Sarah shared "E-commerce Dashboard" with you', time: '5 min ago', read: false },
    { id: 2, title: 'Code Review', message: 'Mike requested a review on "API Integration"', time: '1 hour ago', read: false },
    { id: 3, title: 'Execution Complete', message: 'Python script "data_analysis.py" ran successfully', time: '2 hours ago', read: true },
    { id: 4, title: 'Storage Warning', message: 'You\'ve used 80% of your storage', time: '1 day ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`flex h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Sidebar */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col transition-all duration-300 z-30`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CodeFlow
                </h1>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
          {!isSidebarCollapsed && (
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Your coding playground
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} p-3 rounded-lg transition-colors ${theme === 'dark' 
                  ? `hover:bg-gray-700 hover:text-white ${item.active ? 'bg-gray-700 text-white' : 'text-gray-300'}` 
                  : `hover:bg-blue-50 hover:text-blue-600 ${item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}`}
              >
                <item.icon className="w-5 h-5" />
                {!isSidebarCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
              </Link>
            ))}
          </div>

          {/* Quick Templates Section */}
          {!isSidebarCollapsed && (
            <div className="mt-8">
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Quick Templates
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((template) => {
                  const Icon = template.icon === FaPython ? FaPython : template.icon;
                  return (
                    <button
                      key={template.label}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center ${theme === 'dark' 
                        ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                    >
                      {typeof Icon === 'function' ? (
                        <Icon className="w-4 h-4 mb-1" />
                      ) : (
                        React.createElement(Icon, { className: "w-4 h-4 mb-1" })
                      )}
                      <span className="text-xs text-center">{template.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Help Section */}
          {!isSidebarCollapsed && (
            <div className="mt-8">
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Help & Support
              </h3>
              <div className="space-y-1">
                <Link to="/docs" className={`flex items-center p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Documentation
                </Link>
                <Link to="/support" className={`flex items-center p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Support
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* User Profile in Sidebar */}
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
                <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className={`sticky top-0 z-20 border-b px-6 py-4 ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm' : 'bg-white/90 border-gray-200 backdrop-blur-sm'}`}>
          <div className="flex items-center justify-between">
            
            {/* Left: Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="search"
                  placeholder="Search projects, commands, or collaborators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4 ml-6">
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-lg relative ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg border py-2 z-50 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                              !notification.read ? theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {notification.time}
                              </span>
                            </div>
                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className={`px-4 py-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <button className={`text-sm w-full text-center py-2 rounded-lg ${
                          theme === 'dark' 
                            ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-700' 
                            : 'text-blue-600 hover:text-blue-800 hover:bg-gray-50'
                        }`}>
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center space-x-3 rounded-xl px-3 py-2 ${
                    theme === 'dark' 
                      ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600' 
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-sm font-medium">{user?.firstName} {user?.lastName}</div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user?.email}
                    </div>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserDropdown(false)}
                    />
                    <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border py-2 z-50 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    }`}>
                      
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user?.email}
                        </div>
                      </div>

                      {/* Dropdown Items */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className={`flex items-center px-4 py-2 text-sm ${
                            theme === 'dark' 
                              ? 'hover:bg-gray-700 text-gray-300' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Your Profile
                        </Link>
                        <Link
                          to="/settings"
                          className={`flex items-center px-4 py-2 text-sm ${
                            theme === 'dark' 
                              ? 'hover:bg-gray-700 text-gray-300' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        <Link
                          to="/billing"
                          className={`flex items-center px-4 py-2 text-sm ${
                            theme === 'dark' 
                              ? 'hover:bg-gray-700 text-gray-300' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <CreditCard className="w-4 h-4 mr-3" />
                          Billing
                        </Link>
                      </div>

                      {/* Logout Button */}
                      <div className={`border-t pt-1 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <button
                          onClick={handleLogout}
                          className={`flex items-center w-full px-4 py-2 text-sm ${
                            theme === 'dark' 
                              ? 'hover:bg-red-900/30 text-red-400' 
                              : 'hover:bg-red-50 text-red-600'
                          }`}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;