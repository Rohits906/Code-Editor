import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
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
  FileText,
  Menu,
  Home,
} from "lucide-react";
import {
  FaPython,
  FaJs,
  FaJava,
  FaHtml5,
  FaCss3Alt,
  FaReact,
} from "react-icons/fa";
import { SiTypescript, SiCplusplus, SiC } from "react-icons/si";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Folder, label: "My Projects", path: "/projects" },
    { icon: Share2, label: "Shared", path: "/shared" },
    { icon: Users, label: "Collaborators", path: "/collaborators" },
    { icon: Activity, label: "Activity", path: "/activity" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const templates = [
    { icon: Globe, label: "React", type: "web" },
    { icon: Server, label: "Node.js", type: "backend" },
    { icon: FaPython, label: "Python", type: "data" },
    { icon: Smartphone, label: "Mobile", type: "mobile" },
    { icon: Database, label: "DB", type: "database" },
    { icon: CpuIcon, label: "ML", type: "ai" },
  ];

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "Project Shared",
      message: 'Sarah shared "E-commerce Dashboard" with you',
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Code Review",
      message: 'Mike requested a review on "API Integration"',
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Execution Complete",
      message: 'Python script "data_analysis.py" ran successfully',
      time: "2 hours ago",
      read: true,
    },
    {
      id: 4,
      title: "Storage Warning",
      message: "You've used 80% of your storage",
      time: "1 day ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mobile Layout
  if (isMobile) {
    return (
      <div
        className={`h-screen flex flex-col ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        {/* Mobile Header */}
        <header
          className={`sticky top-0 z-20 border-b px-4 py-3 flex items-center justify-between ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div
                className={`p-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <img
                  src="/assests/codeflow_logo.png"
                  alt="CodeFlow Logo"
                  className="w-6 h-6"
                />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                CodeFlow
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 rounded-lg"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-0 left-0 right-0 z-40 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } border-b p-4`}
            >
              <div className="flex items-center space-x-3">
                <Search
                  className={`w-5 h-5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <input
                  type="search"
                  placeholder="Search projects..."
                  className={`flex-1 py-2 focus:outline-none ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "text-gray-900"
                  }`}
                  autoFocus
                />
                <button
                  onClick={() => setShowMobileSearch(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Side Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowMobileMenu(false)}
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className={`fixed top-0 left-0 bottom-0 w-64 z-50 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } border-r ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <img
                        src="/assests/codeflow_logo.png"
                        alt="CodeFlow Logo"
                        className="w-6 h-6"
                      />
                    </div>
                    <h2 className="font-bold text-lg">CodeFlow</h2>
                  </div>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setShowMobileMenu(false)}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        location.pathname === item.path
                          ? theme === "dark"
                            ? "bg-gray-700 text-white"
                            : "bg-blue-50 text-blue-600"
                          : theme === "dark"
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
                <div className="p-4 border-t space-y-2">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-3 p-3 rounded-lg w-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                    <span>Switch Theme</span>
                  </button>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 rounded-lg w-full hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Notifications */}
        <AnimatePresence>
          {showNotifications && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <motion.div
                initial={{ y: 300 }}
                animate={{ y: 0 }}
                exit={{ y: 300 }}
                className={`fixed bottom-0 left-0 right-0 z-50 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } rounded-t-2xl border-t ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto p-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg mb-2 ${
                        !notification.read
                          ? theme === "dark"
                            ? "bg-blue-900/20"
                            : "bg-blue-50"
                          : theme === "dark"
                          ? "bg-gray-700/50"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        <span
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {notification.time}
                        </span>
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav
          className={`sticky bottom-0 z-10 border-t ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-around items-center p-3">
            {navigationItems.slice(0, 4).map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  location.pathname === item.path
                    ? theme === "dark"
                      ? "text-blue-400"
                      : "text-blue-600"
                    : theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div
      className={`flex h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Desktop Sidebar */}
      <aside
        className={`${isSidebarCollapsed ? "w-20" : "w-64"} ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } border-r flex flex-col transition-all duration-300`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <img
                    src="/assests/codeflow_logo.png"
                    alt="CodeFlow Logo"
                    className="w-8 h-8"
                  />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CodeFlow
                </h1>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`p-2 rounded-lg ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
          {!isSidebarCollapsed && (
            <p
              className={`text-sm mt-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
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
                className={`flex items-center ${
                  isSidebarCollapsed ? "justify-center" : ""
                } p-3 rounded-lg transition-colors ${
                  theme === "dark"
                    ? `hover:bg-gray-700 hover:text-white ${
                        location.pathname === item.path
                          ? "bg-gray-700 text-white"
                          : "text-gray-300"
                      }`
                    : `hover:bg-blue-50 hover:text-blue-600 ${
                        location.pathname === item.path
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!isSidebarCollapsed && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </Link>
            ))}
          </div>

          {/* Quick Templates Section */}
          {!isSidebarCollapsed && (
            <div className="mt-8">
              <h3
                className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Quick Templates
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((template) => {
                  const Icon =
                    template.icon === FaPython ? FaPython : template.icon;
                  return (
                    <button
                      key={template.label}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center ${
                        theme === "dark"
                          ? "bg-gray-700/50 hover:bg-gray-700 text-gray-300"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      {typeof Icon === "function" ? (
                        <Icon className="w-4 h-4 mb-1" />
                      ) : (
                        React.createElement(Icon, { className: "w-4 h-4 mb-1" })
                      )}
                      <span className="text-xs text-center">
                        {template.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* User Profile */}
        <div
          className={`p-4 border-t ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div
            className={`flex items-center ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p
                  className={`text-xs truncate ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <header
          className={`sticky top-0 z-10 border-b px-6 py-4 ${
            theme === "dark"
              ? "bg-gray-800/90 border-gray-700 backdrop-blur-sm"
              : "bg-white/90 border-gray-200 backdrop-blur-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <input
                  type="search"
                  placeholder="Search projects, commands, or collaborators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4 ml-6">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  theme === "dark"
                    ? "hover:bg-gray-700 text-yellow-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-lg relative ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg border py-2 z-50 ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 border-b ${
                            theme === "dark"
                              ? "border-gray-700"
                              : "border-gray-200"
                          }`}
                        >
                          <h3 className="font-semibold">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                                !notification.read
                                  ? theme === "dark"
                                    ? "bg-blue-900/20"
                                    : "bg-blue-50"
                                  : ""
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">
                                  {notification.title}
                                </h4>
                                <span
                                  className={`text-xs ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {notification.time}
                                </span>
                              </div>
                              <p
                                className={`text-sm mt-1 ${
                                  theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-600"
                                }`}
                              >
                                {notification.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center space-x-3 rounded-xl px-3 py-2 ${
                    theme === "dark"
                      ? "bg-gray-700/50 hover:bg-gray-700 border border-gray-600"
                      : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium truncate max-w-[120px]">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      } truncate max-w-[120px]`}
                    >
                      {user?.email}
                    </div>
                  </div>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserDropdown && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserDropdown(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border py-2 z-50 ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="font-medium">
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {user?.email}
                          </div>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className={`flex items-center px-4 py-2 text-sm ${
                              theme === "dark"
                                ? "hover:bg-gray-700 text-gray-300"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            Your Profile
                          </Link>
                          <Link
                            to="/settings"
                            className={`flex items-center px-4 py-2 text-sm ${
                              theme === "dark"
                                ? "hover:bg-gray-700 text-gray-300"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            Settings
                          </Link>
                        </div>
                        <div
                          className={`border-t pt-1 ${
                            theme === "dark"
                              ? "border-gray-700"
                              : "border-gray-200"
                          }`}
                        >
                          <button
                            onClick={handleLogout}
                            className={`flex items-center w-full px-4 py-2 text-sm ${
                              theme === "dark"
                                ? "hover:bg-red-900/30 text-red-400"
                                : "hover:bg-red-50 text-red-600"
                            }`}
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
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
