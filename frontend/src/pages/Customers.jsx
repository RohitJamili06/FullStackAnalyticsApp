import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToastState } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/format';
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiMapPin,
} from 'react-icons/fi';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Search & Filters state
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    city: '',
    createdAt: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const { showToast, ToastComponent } = useToastState();

  // Static/Dynamic list of cities for filtering
  const cities = ['All', 'New York', 'San Francisco', 'Chicago', 'Seattle', 'Boston', 'Los Angeles', 'Austin', 'Denver'];

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search,
        city,
        sortBy,
      };

      const res = await api.get('/customers', { params });
      if (res.data.success) {
        setCustomers(res.data.data);
        setTotal(res.data.pagination.total);
        setPages(res.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      showToast(error.response?.data?.message || 'Error loading customers list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, city, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomers();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCity('All');
    setSortBy('newest');
    setCurrentPage(1);
    setTimeout(() => fetchCustomers(), 50);
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      customerName: '',
      email: '',
      city: '',
      createdAt: new Date().toISOString().split('T')[0],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      customerName: customer.customerName,
      email: customer.email,
      city: customer.city,
      createdAt: new Date(customer.createdAt).toISOString().split('T')[0],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.customerName.trim()) errors.customerName = 'Customer name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = 'Email format is invalid';
    }
    if (!formData.city.trim()) errors.city = 'City is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      if (editingCustomer) {
        const res = await api.put(`/customers/${editingCustomer._id}`, formData);
        if (res.data.success) {
          showToast('Customer profile updated successfully', 'success');
          setIsModalOpen(false);
          fetchCustomers();
        }
      } else {
        const res = await api.post('/customers', formData);
        if (res.data.success) {
          showToast('Customer record created successfully', 'success');
          setIsModalOpen(false);
          fetchCustomers();
        }
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      showToast(error.response?.data?.message || 'Error occurred while saving.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer record?')) return;
    try {
      const res = await api.delete(`/customers/${id}`);
      if (res.data.success) {
        showToast('Customer record deleted successfully', 'success');
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      showToast(error.response?.data?.message || 'Error occurred while deleting.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {ToastComponent}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Customer Database</h1>
          <p className="text-sm text-slate-500 dark:text-darkbg-muted mt-1">
            Browse and organize your client list and geographic profiles
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all shadow-premium hover:shadow-premium-hover"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Customer Profile</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card rounded-2xl p-6 shadow-premium dark:shadow-premium-dark">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FiSearch className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search customers by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* City Select */}
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                City: {c}
              </option>
            ))}
          </select>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          >
            <option value="newest">Recently Registered</option>
            <option value="oldest">Early Registered</option>
          </select>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold rounded-xl transition-all"
            >
              Apply Filter
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl transition-all border border-slate-100 dark:border-darkbg-border"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Main Customers List */}
      <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card rounded-2xl shadow-premium dark:shadow-premium-dark overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading customers records..." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 dark:text-darkbg-muted uppercase bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="px-6 py-4">Customer Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">City</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm">
                  {customers.map((customer) => (
                    <tr key={customer._id} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50/40 dark:hover:bg-slate-800/10">
                      <td className="px-6 py-4.5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-sm">
                            {customer.customerName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-100">
                            {customer.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 font-medium text-slate-500 dark:text-slate-400">{customer.email}</td>
                      <td className="px-6 py-4.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/20">
                          <FiMapPin className="w-3.5 h-3.5" /> {customer.city}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 font-medium">{formatDate(customer.createdAt)}</td>
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(customer)}
                            className="p-1.5 text-slate-400 hover:text-brand-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-slate-400 dark:text-darkbg-muted">
                        No customer profiles found matching selection.
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
                {editingCustomer ? 'Edit Customer Profile' : 'Register New Customer'}
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
              {/* Customer Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-darkbg-muted uppercase">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Alice Smith"
                />
                {formErrors.customerName && <p className="text-xs text-rose-500">{formErrors.customerName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-darkbg-muted uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. alice@gmail.com"
                />
                {formErrors.email && <p className="text-xs text-rose-500">{formErrors.email}</p>}
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-darkbg-muted uppercase">
                  Geographical City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Chicago"
                />
                {formErrors.city && <p className="text-xs text-rose-500">{formErrors.city}</p>}
              </div>

              {/* Joined Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-darkbg-muted uppercase">
                  Registration Date
                </label>
                <input
                  type="date"
                  value={formData.createdAt}
                  onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
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
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
