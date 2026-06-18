import React from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/format';
import { FiUser, FiMail, FiShield, FiCalendar } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">User Profile</h1>
        <p className="text-sm text-slate-500 dark:text-darkbg-muted mt-1">
          Manage your account settings and credentials
        </p>
      </div>

      {/* Profile Details Card */}
      <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card rounded-2xl p-8 shadow-premium dark:shadow-premium-dark max-w-3xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar Graphic */}
          <div className="w-24 h-24 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-4xl border-2 border-brand-500/20 shadow-inner flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* Account Details Form/Grid */}
          <div className="flex-1 w-full space-y-6">
            <div className="border-b border-slate-100 dark:border-darkbg-border pb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user?.name}</h2>
              <p className="text-sm text-slate-400 dark:text-darkbg-muted capitalize font-medium mt-0.5">
                System {user?.role}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Display */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 dark:text-darkbg-muted uppercase tracking-wider flex items-center gap-1.5">
                  <FiUser className="w-4 h-4 text-slate-400" />
                  Full Name
                </span>
                <p className="text-slate-700 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 px-4 py-2.5 rounded-xl">
                  {user?.name}
                </p>
              </div>

              {/* Email Display */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 dark:text-darkbg-muted uppercase tracking-wider flex items-center gap-1.5">
                  <FiMail className="w-4 h-4 text-slate-400" />
                  Email Address
                </span>
                <p className="text-slate-700 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 px-4 py-2.5 rounded-xl">
                  {user?.email}
                </p>
              </div>

              {/* Role Display */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 dark:text-darkbg-muted uppercase tracking-wider flex items-center gap-1.5">
                  <FiShield className="w-4 h-4 text-slate-400" />
                  Access Level
                </span>
                <p className="text-slate-700 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 px-4 py-2.5 rounded-xl capitalize">
                  {user?.role}
                </p>
              </div>

              {/* CreatedAt Display */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 dark:text-darkbg-muted uppercase tracking-wider flex items-center gap-1.5">
                  <FiCalendar className="w-4 h-4 text-slate-400" />
                  Account Created
                </span>
                <p className="text-slate-700 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 px-4 py-2.5 rounded-xl">
                  {formatDate(user?.createdAt)}
                </p>
              </div>
            </div>

            {/* Premium Info Box */}
            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl">
              <h3 className="text-xs font-bold text-slate-500 dark:text-darkbg-muted uppercase tracking-wider mb-2">
                Security Information
              </h3>
              <p className="text-xs text-slate-400 dark:text-darkbg-muted leading-relaxed font-medium">
                Your connection is encrypted with JWT Auth credentials valid for 30 days. Log out using the navigation drawer to immediately clear credentials and destroy session references locally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
