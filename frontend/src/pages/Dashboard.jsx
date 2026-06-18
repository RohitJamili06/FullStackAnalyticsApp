import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner, { CardSkeleton } from '../components/LoadingSpinner';
import { useToastState } from '../components/Toast';
import { formatCurrency, formatNumber, getMonthName } from '../utils/format';
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiPercent,
  FiTrendingUp,
  FiLayers,
} from 'react-icons/fi';

// Chart.js imports and registers
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [kpiData, setKpiData] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast, ToastComponent } = useToastState();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard statistics in parallel
        const [kpiRes, revenueRes, salesRes, productsRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/revenue'),
          api.get('/analytics/sales'),
          api.get('/analytics/products'),
        ]);

        if (kpiRes.data.success) setKpiData(kpiRes.data.data);
        if (revenueRes.data.success) setRevenueTrend(revenueRes.data.data);
        if (salesRes.data.success) setCategorySales(salesRes.data.data);
        if (productsRes.data.success) setTopProducts(productsRes.data.data);
      } catch (error) {
        console.error('Error loading dashboard analytics:', error);
        showToast(
          error.response?.data?.message || 'Failed to fetch dashboard data. If database is not seeded, please configure MONGO_URI and run npm run seed.',
          'error'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {ToastComponent}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
          <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Formatting revenue line chart data
  const revenueChartData = {
    labels: revenueTrend.map((item) => `${getMonthName(item._id.month)} ${item._id.year}`),
    datasets: [
      {
        fill: true,
        label: 'Monthly Revenue',
        data: revenueTrend.map((item) => item.revenue),
        borderColor: '#6366f1', // Indigo
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        tension: 0.35,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `Revenue: ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.05)' },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 },
          callback: (value) => `$${value >= 1000 ? value / 1000 + 'k' : value}`,
        },
      },
    },
  };

  // Formatting category donut chart data
  const doughnutColors = [
    '#6366f1', // Indigo
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#8b5cf6', // Violet
  ];

  const categoryChartData = {
    labels: categorySales.map((c) => c._id),
    datasets: [
      {
        data: categorySales.map((c) => c.totalRevenue),
        backgroundColor: doughnutColors,
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 20,
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `Revenue: ${formatCurrency(context.parsed)}`,
        },
      },
    },
    cutout: '70%',
  };

  // Monthly Sales Quantities
  const salesQtyChartData = {
    labels: revenueTrend.map((item) => `${getMonthName(item._id.month)} ${item._id.year}`),
    datasets: [
      {
        label: 'Units Sold',
        data: revenueTrend.map((item) => item.quantity),
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        hoverBackgroundColor: '#6366f1',
        borderRadius: 8,
      },
    ],
  };

  const salesQtyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } },
      y: { grid: { color: 'rgba(148, 163, 184, 0.05)' }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } },
    },
  };

  return (
    <div className="space-y-8">
      {ToastComponent}

      {/* Greeting and Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Analytics Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-darkbg-muted mt-1">
          Monitor your key performance metrics, product sales, and growth trends
        </p>
      </div>

      {/* KPI Cards Grid */}
      {kpiData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <DashboardCard
            title="Total Revenue"
            value={kpiData.totalRevenue}
            type="currency"
            icon={<FiDollarSign className="w-5 h-5" />}
            trendValue={kpiData.monthlyGrowth}
            trendDirection={kpiData.monthlyGrowth >= 0 ? 'up' : 'down'}
            subtitle="vs Last Month"
          />
          <DashboardCard
            title="Total Sales"
            value={kpiData.totalSales}
            type="number"
            icon={<FiShoppingBag className="w-5 h-5" />}
            subtitle="Units sold"
          />
          <DashboardCard
            title="Total Customers"
            value={kpiData.totalCustomers}
            type="number"
            icon={<FiUsers className="w-5 h-5" />}
            subtitle="Active CRM list"
          />
          <DashboardCard
            title="Monthly Growth"
            value={`${kpiData.monthlyGrowth.toFixed(1)}%`}
            type="text"
            icon={<FiPercent className="w-5 h-5" />}
            trendValue={kpiData.monthlyGrowth}
            trendDirection={kpiData.monthlyGrowth >= 0 ? 'up' : 'down'}
            subtitle="Revenue diff"
          />
          <DashboardCard
            title="Avg Order Value"
            value={kpiData.averageOrderValue}
            type="currency"
            icon={<FiTrendingUp className="w-5 h-5" />}
            subtitle="Per transaction"
          />
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Line Chart */}
        <div className="lg:col-span-2 border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card p-6 rounded-2xl shadow-premium dark:shadow-premium-dark">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <FiTrendingUp className="text-brand-500" />
            Revenue Trend (Last 12 Months)
          </h3>
          <div className="h-80">
            {revenueTrend.length > 0 ? (
              <Line data={revenueChartData} options={revenueChartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No trend data available</div>
            )}
          </div>
        </div>

        {/* Category Performance Pie Chart */}
        <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card p-6 rounded-2xl shadow-premium dark:shadow-premium-dark">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <FiLayers className="text-brand-500" />
            Product Category Breakdown
          </h3>
          <div className="h-80 relative">
            {categorySales.length > 0 ? (
              <Doughnut data={categoryChartData} options={categoryChartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No category data available</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Quantity Bar Chart */}
        <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card p-6 rounded-2xl shadow-premium dark:shadow-premium-dark">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-6">Units Sold monthly</h3>
          <div className="h-80">
            {revenueTrend.length > 0 ? (
              <Bar data={salesQtyChartData} options={salesQtyChartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No monthly data available</div>
            )}
          </div>
        </div>

        {/* Top Products Table */}
        <div className="lg:col-span-2 border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card p-6 rounded-2xl shadow-premium dark:shadow-premium-dark">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-6">Top Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 dark:text-darkbg-muted uppercase">
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Units Sold</th>
                  <th className="pb-3 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm">
                {topProducts.slice(0, 5).map((prod) => (
                  <tr key={prod._id} className="text-slate-700 dark:text-slate-200">
                    <td className="py-3.5 font-medium">{prod._id}</td>
                    <td className="py-3.5">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 border border-brand-100/20">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-medium">{formatNumber(prod.totalQuantity)}</td>
                    <td className="py-3.5 text-right font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(prod.totalRevenue)}
                    </td>
                  </tr>
                ))}
                {topProducts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
