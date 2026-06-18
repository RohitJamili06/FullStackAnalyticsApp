import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMenu, FiSun, FiMoon, FiActivity, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-darkbg-card border-b border-slate-100 dark:border-darkbg-border flex items-center justify-between px-6 shadow-sm">
      {/* Brand logo / Toggler */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="w-6 h-6" />
        </button>

        <Link to="/" className="flex items-center space-x-2">
          <div className="p-2 bg-brand-500 rounded-xl text-white shadow-premium">
            <FiActivity className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent hidden sm:inline-block">
            FullStack Insight
          </span>
        </Link>
      </div>

      {/* Action utilities */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggler Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-darkbg-muted bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-darkbg-border"
          aria-label="Toggle theme mode"
        >
          {theme === 'dark' ? (
            <FiSun className="w-5 h-5 text-amber-400" />
          ) : (
            <FiMoon className="w-5 h-5 text-slate-700" />
          )}
        </button>

        {/* User Info */}
        {user && (
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-100 dark:border-darkbg-border">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
              <p className="text-xs text-slate-400 dark:text-darkbg-muted truncate max-w-[150px]">{user.email}</p>
            </div>
            <Link to="/profile" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold border border-brand-500/20 hover:border-brand-500/50 transition-colors">
                <FiUser className="w-5 h-5" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
