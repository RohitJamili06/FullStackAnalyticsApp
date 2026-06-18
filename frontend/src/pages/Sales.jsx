import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToastState } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/format';
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiFilter,
} from 'react-icons/fi';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Search & Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    quantity: 1,
    revenue: 0,
    saleDate: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const { showToast, ToastComponent } = useToastState();

  const categories = ['All', 'Electronics', 'Clothing', 'Office Supplies', 'Home & Kitchen'];
  const formCategories = ['Electronics', 'Clothing', 'Office Supplies', 'Home & Kitchen'];

  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search,
        category,
        startDate,
        endDate,
        sortBy,
      };

      const res = await api.get('/sales', { params });
      if (res.data.success) {
        setSales(res.data.data);
        setTotal(res.data.pagination.total);
        setPages(res.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      showToast(error.response?.data?.message || 'Error loading sales log.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [currentPage, category, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSales();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setStartDate('');
    setEndDate('');
    setSortBy('date_desc');
    setCurrentPage(1);
    // Trigger fetch directly after state updates using a reload or useEffect trigger
    setTimeout(() => fetchSales(), 50);
  };

  const openAddModal = () => {
    setEditingSale(null);
    setFormData({
      productName: '',
      category: formCategories[0],
      quantity: 1,
      revenue: 0,
      saleDate: new Date().toISOString().split('T')[0],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (sale) => {
    setEditingSale(sale);
    setFormData({
      productName: sale.productName,
      category: sale.category,
      quantity: sale.quantity,
      revenue: sale.revenue,
      saleDate: new Date(sale.saleDate).toISOString().split('T')[0],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.productName.trim()) errors.productName = 'Product name is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.quantity || formData.quantity < 1) errors.quantity = 'Quantity must be at least 1';
    if (formData.revenue === undefined || formData.revenue < 0) errors.revenue = 'Revenue cannot be negative';
    if (!formData.saleDate) errors.saleDate = 'Sale date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      if (editingSale) {
        // Edit Mode
        const res = await api.put(`/sales/${editingSale._id}`, formData);
        if (res.data.success) {
          showToast('Sale record updated successfully', 'success');
          setIsModalOpen(false);
          fetchSales();
        }
      } else {
        // Add Mode
        const res = await api.post('/sales', formData);
        if (res.data.success) {
          showToast('Sale record created successfully', 'success');
          setIsModalOpen(false);
          fetchSales();
        }
      }
    } catch (error) {
      console.error('Error saving sale:', error);
      showToast(error.response?.data?.message || 'Error occurred while saving.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sales record?')) return;
    try {
      const res = await api.delete(`/sales/${id}`);
      if (res.data.success) {
        showToast('Sale record deleted successfully', 'success');
        fetchSales();
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      showToast(error.response?.data?.message || 'Error occurred while deleting.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {ToastComponent}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Sales Log</h1>
          <p className="text-sm text-slate-500 dark:text-darkbg-muted mt-1">
            Manage your daily transactions and catalog entries
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all shadow-premium hover:shadow-premium-hover"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Sale Record</span>
        </button>
      </div>

      {/* Search and Filters Drawer/Card */}
      <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card rounded-2xl p-6 shadow-premium dark:shadow-premium-dark">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <FiSearch className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Category Select */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="date_desc">Newest Transactions</option>
              <option value="date_asc">Oldest Transactions</option>
              <option value="revenue_desc">Revenue: High to Low</option>
            </select>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold rounded-xl transition-all"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl transition-all border border-slate-100 dark:border-darkbg-border"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Date range row */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-50 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 dark:text-darkbg-muted uppercase tracking-wider flex items-center gap-1">
              <FiFilter /> Date Range:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200"
              />
              <span className="text-slate-400 text-xs font-semibold">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Main Table */}
      <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card rounded-2xl shadow-premium dark:shadow-premium-dark overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading transaction history..." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 dark:text-darkbg-muted uppercase bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Qty</th>
                    <th className="px-6 py-4 text-right">Revenue</th>
                    <th className="px-6 py-4">Sale Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm">
                  {sales.map((sale) => (
                    <tr key={sale._id} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50/40 dark:hover:bg-slate-800/10">
                      <td className="px-6 py-4.5 font-semibold text-slate-800 dark:text-slate-100">
                        {sale.productName}
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 border border-brand-100/20">
                          {sale.category}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right font-medium">{sale.quantity}</td>
                      <td className="px-6 py-4.5 text-right font-bold text-slate-800 dark:text-slate-100">
                        {formatCurrency(sale.revenue)}
                      </td>
                      <td className="px-6 py-4.5 font-medium">{formatDate(sale.saleDate)}</td>
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(sale)}
                            className="p-1.5 text-slate-400 hover:text-brand-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(sale._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-slate-400 dark:text-darkbg-muted">
                        No sales records matching selection.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex justify-between items-center px-6 py-4 border-t border-slate-50 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-500 dark:text-darkbg-muted">
                  Showing {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, total)} of {total} records
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-2 border border-slate-100 dark:border-darkbg-border bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-semibold px-3 text-slate-700 dark:text-slate-300">
                    {currentPage} / {pages}
                  </span>
                  <button
                    disabled={currentPage === pages}
                    onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                    className="p-2 border border-slate-100 dark:border-darkbg-border bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Custom Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white dark:bg-darkbg-card border border-slate-100 dark:border-darkbg-border w-full max-w-lg rounded-2xl shadow-premium dark:shadow-premium-dark relative z-10 overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                {editingSale ? 'Edit Sale Transaction' : 'Record New Sale'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-darkbg-muted uppercase">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Ergonomic Keyboard"
                />
                {formErrors.productName && <p className="text-xs text-rose-500">{formErrors.productName}</p>}
              </div>

              {/* Category Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-darkbg-muted uppercase">
                  Product Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {formCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {formErrors.category && <p className="text-xs text-rose-500">{formErrors.category}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Quantity */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-darkbg-muted uppercase">
                    Quantity Sold
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  {formErrors.quantity && <p className="text-xs text-rose-500">{formErrors.quantity}</p>}
                </div>

                {/* Revenue */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-darkbg-muted uppercase">
                    Total Revenue ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.revenue}
                    onChange={(e) => setFormData({ ...formData, revenue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  {formErrors.revenue && <p className="text-xs text-rose-500">{formErrors.revenue}</p>}
                </div>
              </div>

              {/* Sale Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-darkbg-muted uppercase">
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={formData.saleDate}
                  onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {formErrors.saleDate && <p className="text-xs text-rose-500">{formErrors.saleDate}</p>}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-all border border-slate-100 dark:border-darkbg-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all shadow-premium"
                >
                  {isSaving ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
