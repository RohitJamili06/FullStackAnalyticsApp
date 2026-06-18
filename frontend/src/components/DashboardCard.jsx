import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { formatCurrency, formatNumber } from '../utils/format';

const DashboardCard = ({ title, value, icon, type = 'number', trendValue, trendDirection = 'up', subtitle }) => {
  const isTrendUp = trendDirection === 'up';

  const formatValue = (val) => {
    if (type === 'currency') return formatCurrency(val);
    if (type === 'number') return formatNumber(val);
    return val;
  };

  return (
    <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card rounded-2xl p-5 shadow-premium dark:shadow-premium-dark hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between min-w-0">
      <div>
        {/* Top Row: Title and Icon */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-2xs font-bold text-slate-400 dark:text-darkbg-muted uppercase tracking-wider truncate mr-2">
            {title}
          </p>
          <div className="p-2.5 bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 rounded-xl border border-brand-100/30 dark:border-brand-500/10 flex-shrink-0">
            {icon}
          </div>
        </div>

        {/* Value Row (Self-contained to prevent push-overflows) */}
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate">
          {formatValue(value)}
        </h3>
      </div>

      {/* Trend Row */}
      {(trendValue !== undefined || subtitle) && (
        <div className="mt-4 flex items-center space-x-2 flex-wrap gap-y-1">
          {trendValue !== undefined && (
            <span
              className={`flex items-center space-x-1 text-2xs font-semibold px-2 py-0.5 rounded-full ${
                isTrendUp
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
              }`}
            >
              {isTrendUp ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
              <span>{Math.abs(trendValue).toFixed(1)}%</span>
            </span>
          )}
          {subtitle && (
            <span className="text-3xs sm:text-2xs text-slate-400 dark:text-darkbg-muted font-medium truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
