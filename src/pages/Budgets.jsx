import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getBudgets, setBudget, deleteBudget } from '../api/budgets';
import { getCategories } from '../api/transactions';
import { formatCurrency } from '../utils/format';
import { useTransactions } from '../context/TransactionContext';

const getCurrentMonthString = () => {
  return new Date().toISOString().slice(0, 7);
};

const Budgets = () => {
  const { dataVersion } = useTransactions();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [category, setCategory] = useState('ALL');
  const [limit, setLimit] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete state
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Load expense categories
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (isMounted) {
          setCategories(data.expense || []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch budgets for the selected month
  const fetchBudgetData = async () => {
    setLoading(true);
    try {
      const data = await getBudgets({ month: selectedMonth });
      setBudgets(data || []);
    } catch {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, [selectedMonth, dataVersion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const parsedLimit = parseFloat(limit);
    if (!limit || isNaN(parsedLimit) || parsedLimit <= 0) {
      setFormError('Please enter a valid positive budget limit');
      return;
    }

    setSubmitting(true);
    try {
      await setBudget({
        month: selectedMonth,
        category,
        limit: parsedLimit,
      });
      toast.success(`Budget for ${category === 'ALL' ? 'Overall' : category} saved!`);
      setLimit('');
      await fetchBudgetData();
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to save budget';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteBudget(id);
      toast.success('Budget deleted');
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      setConfirmDeleteId(null);
    } catch {
      toast.error('Failed to delete budget');
    } finally {
      setDeletingId(null);
    }
  };

  const getProgressBarColor = (percent) => {
    if (percent >= 100) return 'bg-rose-500';
    if (percent >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getPercentBadgeColor = (percent) => {
    if (percent >= 100) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (percent >= 70) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Monthly Budgets
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Set expenditure targets, monitor limits, and prevent overspending.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="budget-month-select" className="text-xs font-semibold text-slate-600">
            Month:
          </label>
          <input
            id="budget-month-select"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
          />
        </div>
      </div>

      {/* Set Budget Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm" noValidate>
        <h2 className="text-base font-semibold text-slate-800 mb-4">
          Set Budget Limit for {selectedMonth}
        </h2>

        {formError && (
          <p className="text-xs text-rose-600 mb-3" role="alert">{formError}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Category */}
          <div>
            <label htmlFor="budget-category" className="block text-xs font-medium text-slate-600 mb-1">
              Category
            </label>
            <select
              id="budget-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={submitting}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
            >
              <option value="ALL">Overall (All Categories Combined)</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Limit Amount */}
          <div>
            <label htmlFor="budget-limit" className="block text-xs font-medium text-slate-600 mb-1">
              Monthly Limit (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
              <input
                id="budget-limit"
                type="number"
                step="0.01"
                placeholder="e.g. 10000"
                value={limit}
                disabled={submitting}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
            >
              {submitting ? 'Saving...' : 'Set / Update Budget'}
            </button>
          </div>
        </div>
      </form>

      {/* Budgets List with Progress Bars */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Active Budgets ({selectedMonth})
        </h2>

        {loading ? (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="animate-pulse space-y-2">
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                <div className="h-3 w-full bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">No budgets for this month yet</p>
            <p className="text-xs text-slate-400 mt-1">Use the form above to set your first category budget.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {budgets.map((b) => {
              const isDeleting = deletingId === b.id;
              const isConfirming = confirmDeleteId === b.id;
              const isOverBudget = b.percentUsed >= 100;

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">
                        {b.category === 'ALL' ? 'Overall Budget (All Categories)' : b.category}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getPercentBadgeColor(
                          b.percentUsed
                        )}`}
                      >
                        {b.percentUsed}% Used
                      </span>
                    </div>

                    {/* Delete with confirmation */}
                    <div>
                      {isConfirming ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDelete(b.id)}
                            disabled={isDeleting}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 min-h-[36px]"
                            aria-label={`Confirm delete budget for ${b.category}`}
                          >
                            {isDeleting ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={isDeleting}
                            className="px-2 py-1 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 min-h-[36px]"
                            aria-label="Cancel delete"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(b.id)}
                          className="text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded min-h-[36px]"
                          aria-label={`Delete budget for ${b.category}`}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${getProgressBarColor(
                        b.percentUsed
                      )}`}
                      style={{ width: `${Math.min(b.percentUsed, 100)}%` }}
                    ></div>
                  </div>

                  {/* Descriptive breakdown text */}
                  <div className="mt-2 flex items-center justify-between text-xs sm:text-sm text-slate-600">
                    <span>
                      <strong className="text-slate-900">{formatCurrency(b.spent)}</strong> of{' '}
                      <strong>{formatCurrency(b.limit)}</strong> used
                    </span>
                    <span>
                      {isOverBudget ? (
                        <strong className="text-rose-600">
                          {formatCurrency(Math.abs(b.remaining))} over limit
                        </strong>
                      ) : (
                        <strong className="text-emerald-600">
                          {formatCurrency(b.remaining)} left
                        </strong>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;
