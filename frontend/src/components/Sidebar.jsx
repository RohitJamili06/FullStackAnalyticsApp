import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid,
  FiShoppingBag,
  FiUsers,
  FiBox,
  FiFileText,
  FiUser,
  FiLogOut,
  FiActivity,
  FiX
} from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/', icon: <FiGrid className="w-5 h-5" /> },
    { name: 'Sales Log', path: '/sales', icon: <FiShoppingBag className="w-5 h-5" /> },
    { name: 'Customers', path: '/customers', icon: <FiUsers className="w-5 h-5" /> },
    { name: 'Products', path: '/products', icon: <FiBox className="w-5 h-5" /> },
    { name: 'Reports', path: '/reports', icon: <FiFileText className="w-5 h-5" /> },
    { name: 'User Profile', path: '/profile', icon: <FiUser className="w-5 h-5" /> },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-darkbg-card border-r border-slate-100 dark:border-darkbg-border
    transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-64px)]
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full justify-between p-4">
          <div className="space-y-6">
            {/* Header for Mobile only */}
            <div className="flex items-center justify-between lg:hidden border-b border-slate-100 dark:border-darkbg-border pb-4">
              <div className="flex items-center space-x-2">
                <FiActivity className="w-6 h-6 text-brand-500" />
                <span className="font-bold text-lg text-slate-800 dark:text-slate-200">FullStack Insight</span>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => {
                    // Close sidebar on mobile clicking
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-brand-500 text-white shadow-premium'
                        : 'text-slate-600 dark:text-darkbg-muted hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                    }
                  `}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User profile small panel and Logout */}
          <div className="border-t border-slate-100 dark:border-darkbg-border pt-4 space-y-3">
            {user && (
              <div className="flex items-center space-x-3 px-4 py-2">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-semibold text-lg border border-brand-500/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</h4>
                  <p className="text-xs text-slate-400 dark:text-darkbg-muted truncate capitalize">{user.role}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => {
                logout();
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className="flex items-center space-x-3 w-full px-4 py-3 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl font-medium transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
