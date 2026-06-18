import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToastState } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatNumber, formatDate } from '../utils/format';
import {
  FiFileText,
  FiDownload,
  FiCalendar,
  FiLayers,
  FiMapPin,
  FiTrendingUp,
} from 'react-icons/fi';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [cities, setCities] = useState([]);

  // Filter criteria
  const [reportType, setReportType] = useState('monthly'); // daily, weekly, monthly, yearly
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { showToast, ToastComponent } = useToastState();

  const categories = ['All', 'Electronics', 'Clothing', 'Office Supplies', 'Home & Kitchen'];

  // Fetch cities for city selector
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await api.get('/customers');
        if (res.data.success) {
          // Extract unique cities from customers database
          const uniqueCities = [...new Set(res.data.data.map((c) => c.city))];
          setCities(uniqueCities);
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    };
    fetchCities();
  }, []);

  const generateReport = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      // Fetch matching sales records based on filters
      // We will request a large limit (e.g. 500) to aggregate a comprehensive report
      const params = {
        limit: 500,
        category,
        startDate,
        endDate,
      };

      const res = await api.get('/sales', { params });
      if (res.data.success) {
        setReportData(res.data.data);
        showToast('Report generated successfully!', 'success');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      showToast(err.response?.data?.message || 'Error generating report.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set default date ranges based on reportType
    const now = new Date();
    let start = '';
    let end = now.toISOString().split('T')[0];

    if (reportType === 'daily') {
      start = end;
    } else if (reportType === 'weekly') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      start = weekAgo.toISOString().split('T')[0];
    } else if (reportType === 'monthly') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      start = monthAgo.toISOString().split('T')[0];
    } else if (reportType === 'yearly') {
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      start = yearAgo.toISOString().split('T')[0];
    }

    setStartDate(start);
    setEndDate(end);
  }, [reportType]);

  // Handle report generation automatically when date triggers
  useEffect(() => {
    if (startDate && endDate) {
      generateReport();
    }
  }, [startDate, endDate, category, city]);

  // Export report as CSV file
  const exportToCSV = () => {
    if (reportData.length === 0) {
      showToast('No data to export. Please generate report first.', 'warning');
      return;
    }

    // CSV Headers
    const headers = ['Product Name', 'Category', 'Quantity', 'Revenue ($)', 'Sale Date'];
    
    // CSV Rows
    const rows = reportData.map((item) => [
      `"${item.productName.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      item.quantity,
      item.revenue,
      new Date(item.saleDate).toLocaleDateString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `FullStack_Insight_Report_${reportType}_${category}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report CSV downloaded!', 'success');
  };

  // Aggregated sums
  const totalRevenue = reportData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalQuantity = reportData.reduce((acc, curr) => acc + curr.quantity, 0);
  const averageValue = reportData.length > 0 ? totalRevenue / reportData.length : 0;

  return (
    <div className="space-y-8">
      {ToastComponent}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Reports Panel</h1>
          <p className="text-sm text-slate-500 dark:text-darkbg-muted mt-1">
            Export raw transactions lists, configure intervals, and filter geographic outputs
          </p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={reportData.length === 0}
          className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-premium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiDownload className="w-5 h-5" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter and Config Bar */}
      <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card rounded-2xl p-6 shadow-premium dark:shadow-premium-dark">
        <form onSubmit={generateReport} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Interval Type */}
            <div className="space-y-1">
              <label className="text-2xs font-bold text-slate-400 dark:text-darkbg-muted uppercase flex items-center gap-1.5">
                <FiCalendar /> Report Frequency
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              >
                <option value="daily">Daily Report (Today)</option>
                <option value="weekly">Weekly Report (Last 7 Days)</option>
                <option value="monthly">Monthly Report (Last 30 Days)</option>
                <option value="yearly">Yearly Report (Last 365 Days)</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-2xs font-bold text-slate-400 dark:text-darkbg-muted uppercase flex items-center gap-1.5">
                <FiLayers /> Category Filter
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-2xs font-bold text-slate-400 dark:text-darkbg-muted uppercase flex items-center gap-1.5">
                <FiMapPin /> Geographic Location
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              >
                <option value="All">All Cities</option>
                {cities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Custom range fields */}
            <div className="space-y-1">
              <label className="text-2xs font-bold text-slate-400 dark:text-darkbg-muted uppercase flex items-center gap-1.5">
                Custom Date Window
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                />
                <span className="text-slate-400 text-xs font-semibold">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card p-6 rounded-2xl shadow-premium dark:shadow-premium-dark text-center">
          <p className="text-xs font-bold text-slate-400 dark:text-darkbg-muted uppercase">Gross Revenue</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card p-6 rounded-2xl shadow-premium dark:shadow-premium-dark text-center">
          <p className="text-xs font-bold text-slate-400 dark:text-darkbg-muted uppercase">Units Shipped</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
            {formatNumber(totalQuantity)}
          </p>
        </div>
        <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card p-6 rounded-2xl shadow-premium dark:shadow-premium-dark text-center">
          <p className="text-xs font-bold text-slate-400 dark:text-darkbg-muted uppercase">Transactions</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
            {reportData.length}
          </p>
        </div>
        <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card p-6 rounded-2xl shadow-premium dark:shadow-premium-dark text-center">
          <p className="text-xs font-bold text-slate-400 dark:text-darkbg-muted uppercase">AOV (Filtered)</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
            {formatCurrency(averageValue)}
          </p>
        </div>
      </div>

      {/* Report Summary Data Table */}
      <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card rounded-2xl shadow-premium dark:shadow-premium-dark overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Compiling matching data records..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 dark:text-darkbg-muted uppercase bg-slate-50/50 dark:bg-slate-900/30">
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Qty</th>
                  <th className="px-6 py-4 text-right">Revenue</th>
                  <th className="px-6 py-4">Sale Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm">
                {reportData.map((item) => (
                  <tr key={item._id} className="text-slate-700 dark:text-slate-200">
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-100">
                      {item.productName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 border border-brand-100/20">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{item.quantity}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="px-6 py-4 font-medium">{formatDate(item.saleDate)}</td>
                  </tr>
                ))}
                {reportData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400 dark:text-darkbg-muted">
                      No matching transaction metrics found for selected window.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
