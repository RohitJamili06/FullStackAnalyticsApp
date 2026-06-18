import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToastState } from '../components/Toast';
import { formatCurrency, formatNumber } from '../utils/format';
import { FiBox, FiLayers, FiDollarSign, FiTag } from 'react-icons/fi';
import { Doughnut, Bar } from 'react-chartjs-2';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast, ToastComponent } = useToastState();

  useEffect(() => {
    const fetchProductMetrics = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.get('/analytics/products'),
          api.get('/analytics/sales'),
        ]);

        if (prodRes.data.success) setProducts(prodRes.data.data);
        if (catRes.data.success) setCategorySales(catRes.data.data);
      } catch (error) {
        console.error('Error fetching product metrics:', error);
        showToast(error.response?.data?.message || 'Error loading product metrics.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProductMetrics();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading product inventory metrics..." />;
  }

  // Find max revenue among products to calculate relative percentages
  const maxRevenue = products.length > 0 ? Math.max(...products.map((p) => p.totalRevenue)) : 1;

  // Chart: Product share (Quantity vs Revenue)
  const chartColors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#14b8a6'];
  const categoryQtyChartData = {
    labels: categorySales.map((c) => c._id),
    datasets: [
      {
        label: 'Total Units Sold',
        data: categorySales.map((c) => c.totalQuantity),
        backgroundColor: chartColors.slice(0, categorySales.length),
        borderRadius: 6,
      },
    ],
  };

  const categoryQtyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1e293b', padding: 12, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } },
      y: { grid: { color: 'rgba(148, 163, 184, 0.05)' }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } },
    },
  };

  return (
    <div className="space-y-8">
      {ToastComponent}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Product Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-darkbg-muted mt-1">
          Perform depth analysis of individual product performance and sales contributions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Leaderboard List */}
        <div className="lg:col-span-2 border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card p-6 rounded-2xl shadow-premium dark:shadow-premium-dark space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FiBox className="text-brand-500" />
              Product Performance Leaderboard
            </h3>
            <p className="text-xs text-slate-400 dark:text-darkbg-muted mt-1">
              Top items ranked by total gross revenue contribution
            </p>
          </div>

          <div className="space-y-5">
            {products.map((prod, index) => {
              const pct = (prod.totalRevenue / maxRevenue) * 100;
              return (
                <div key={prod._id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-3">
                      <span className="w-5 text-xs font-bold text-slate-400 dark:text-darkbg-muted">
                        #{index + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">{prod._id}</h4>
                        <span className="text-xs text-slate-400 dark:text-darkbg-muted font-medium">
                          {prod.category} • {formatNumber(prod.totalQuantity)} units sold
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {formatCurrency(prod.totalRevenue)}
                      </span>
                      <p className="text-2xs text-slate-400 dark:text-darkbg-muted">
                        {prod.salesCount} orders
                      </p>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-indigo-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {products.length === 0 && (
              <p className="text-center py-6 text-slate-400">No product records logged.</p>
            )}
          </div>
        </div>

        {/* Category Share Chart */}
        <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card p-6 rounded-2xl shadow-premium dark:shadow-premium-dark flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FiLayers className="text-brand-500" />
              Units Sold by Category
            </h3>
            <p className="text-xs text-slate-400 dark:text-darkbg-muted mt-1">
              Quantity shares across inventory areas
            </p>
          </div>

          <div className="h-64 my-6">
            {categorySales.length > 0 ? (
              <Bar data={categoryQtyChartData} options={categoryQtyChartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No category data found
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="border-t border-slate-50 dark:border-slate-800/80 pt-4 grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <span className="text-2xs font-semibold text-slate-400 dark:text-darkbg-muted uppercase flex items-center justify-center gap-1">
                <FiTag /> Unique Items
              </span>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {products.length}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-2xs font-semibold text-slate-400 dark:text-darkbg-muted uppercase flex items-center justify-center gap-1">
                <FiDollarSign /> Avg Rev / Item
              </span>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {products.length > 0
                  ? formatCurrency(
                      products.reduce((acc, p) => acc + p.totalRevenue, 0) / products.length
                    )
                  : '$0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
