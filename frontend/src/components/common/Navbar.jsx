import React, { useState, Fragment, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, LogIn, UserPlus } from "lucide-react";
import AppContext from "../../context/AppContext";
import { setAuthToken } from '../../serviceWorkers/api';
import { getNotifications, markNotificationRead } from '../../serviceWorkers/notificationServices';
import { Bell } from 'lucide-react';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAuthenticated, setUser, setIsAuthenticated } = useContext(AppContext) || {};
  const nav = useNavigate();
  const [notifications, setNotifications] = React.useState([]);
  const [showNot, setShowNot] = React.useState(false);
  const unreadCount = notifications.filter(n=>!n.read).length;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // fetch notifications for managers and super admins
  React.useEffect(()=>{
    const load = async ()=>{
      if (user && (user.role === 'SUPER_ADMIN' || user.role === 'BU_MANAGER')){
        try{ const res = await getNotifications(); setNotifications(res.notifications || []); }catch(e){ console.error(e); }
      } else {
        setNotifications([]);
      }
    };
    load();
  }, [user]);

  // Links adjust based on auth & role
  const links = [
    { to: "/", label: "Home", icon: <Home size={20} /> },
  ];

  if (!isAuthenticated) {
    links.push({ to: "/login", label: "Login", icon: <LogIn size={20} /> });
    links.push({ to: "/register", label: "Register", icon: <UserPlus size={20} /> });
  } else {
    if (user?.role === 'SUPER_ADMIN') {
      links.push({ to: "/admin/dashboard", label: "Dashboard" });
      links.push({ to: "/admin/business-units", label: "Business Units" });      links.push({ to: "/admin/managers", label: "Managers" });    } else if (user?.role === 'BU_MANAGER') {
      links.push({ to: "/manager/dashboard", label: "Dashboard" });
      links.push({ to: "/manager/invoices", label: "Invoices" });
    }
    if (user?.role === 'BU_USER') {
      links.push({ to: "/company/invoices", label: "Invoices" });
    }
    links.push({ to: "/profile", label: "Profile" });
    links.push({ to: "/", label: "Logout", action: () => {
      localStorage.removeItem('burolls-token');
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
      nav('/login');
    } });
  }

  return (
    <Fragment>
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">Br.</span>
            </div>
            <span className="font-bold text-2xl text-gray-700">BuRolls</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              link.action ? (
                <button key={link.label} onClick={link.action} className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">{link.label}</button>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              )
            ))}

            {/* Notifications for SUPER_ADMIN and BU_MANAGER */}
            {(user && (user.role === 'SUPER_ADMIN' || user.role === 'BU_MANAGER')) && (
              <div className="relative">
                <button onClick={()=>setShowNot(s=>!s)} className="p-2 rounded hover:bg-gray-100">
                  <Bell />
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">{unreadCount}</span>}
                </button>
                {showNot && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 p-2">
                    <div className="font-semibold mb-2">Notifications</div>
                    <div className="max-h-64 overflow-auto">
                      {notifications.length === 0 && <div className="text-sm text-gray-500">No notifications</div>}
                      {notifications.map(n => (
                        <div key={n._id} className={`p-2 border-b ${n.read? 'bg-white':'bg-emerald-50'}`}>
                          <div className="text-sm">{n.message}</div>
                          <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                          {!n.read && <button className="text-xs text-blue-600 mt-1" onClick={async ()=>{ await markNotificationRead(n._id); const res = await getNotifications(); setNotifications(res.notifications || []); }}>Mark read</button>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-700 hover:text-emerald-600 p-2 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Ud</span>
              </div>
              <span className="font-bold text-xl text-gray-800">Menu</span>
            </div>
            <button
              onClick={closeSidebar}
              className="text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  {link.action ? (
                    <button onClick={() => { link.action(); closeSidebar(); }} className="w-full flex items-center space-x-3 text-gray-700 hover:text-white hover:bg-emerald-600 px-4 py-3 rounded-lg transition-all duration-200">
                      <span className="font-medium">{link.label}</span>
                    </button>
                  ) : (
                    <Link
                      to={link.to}
                      onClick={closeSidebar}
                      className="flex items-center space-x-3 text-gray-700 hover:text-white hover:bg-emerald-600 px-4 py-3 rounded-lg transition-all duration-200"
                    >
                      {link.icon}
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </Fragment>
  );
};

export default Navbar;
