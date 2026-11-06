import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { getCategories } from '../api/transactions';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionList from '../components/TransactionList';

const Transactions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { transactions, pagination, loading, fetchTransactions, deleteTransaction } = useTransactions();

  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Read URL query params
  const typeParam = searchParams.get('type') || 'all';
  const categoryParam = searchParams.get('category') || 'all';
  const fromParam = searchParams.get('from') || '';
  const toParam = searchParams.get('to') || '';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Local state for search input debounce
  const [searchInput, setSearchInput] = useState(searchParam);
  const debounceTimerRef = useRef(null);

  // Load available categories
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (isMounted) setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync search input state if URL param changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Fetch transactions when filters change
  useEffect(() => {
    const params = {
      page: pageParam,
      limit: 10,
    };
    if (typeParam && typeParam !== 'all') params.type = typeParam;
    if (categoryParam && categoryParam !== 'all') params.category = categoryParam;
    if (fromParam) params.from = fromParam;
    if (toParam) params.to = toParam;
    if (searchParam) params.search = searchParam;

    fetchTransactions(params);
  }, [pageParam, typeParam, categoryParam, fromParam, toParam, searchParam, fetchTransactions]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    // Changing filters resets to page 1
    if (key !== 'page') {
      next.delete('page');
    }
    setSearchParams(next);
  };

  const handleSearchChange = (val) => {
    setSearchInput(val);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      updateParam('search', val.trim());
    }, 400); // 400ms debounce
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    (typeParam && typeParam !== 'all') ||
    (categoryParam && categoryParam !== 'all') ||
    fromParam ||
    toParam ||
    searchParam
  );

  const allAvailableCategories = useMemo(() => {
    if (typeParam === 'income') return categories.income || [];
    if (typeParam === 'expense') return categories.expense || [];
    return Array.from(new Set([...(categories.income || []), ...(categories.expense || [])]));
  }, [typeParam, categories]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage.toString());
    setSearchParams(next);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Transactions
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Record, track, and filter your daily income and expense entries.
        </p>
      </div>

      {/* Add Transaction Section */}
      <AddTransactionForm />

      {/* Filters & Search Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-800">Filter Transactions</h2>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                Filters Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded min-h-[36px] focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                Clear filters
              </button>
            )}

            {/* Mobile filter accordion toggle */}
            <button
              type="button"
              onClick={() => setShowFiltersMobile((prev) => !prev)}
              className="md:hidden text-xs font-semibold px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-expanded={showFiltersMobile}
            >
              {showFiltersMobile ? 'Hide Filters' : 'Filters'}
            </button>
          </div>
        </div>

        {/* Filter controls container: responsive drawer/grid */}
        <div className={`space-y-3 ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Type */}
            <div>
              <label htmlFor="filter-type" className="block text-xs font-medium text-slate-600 mb-1">
                Type
              </label>
              <select
                id="filter-type"
                value={typeParam}
                onChange={(e) => updateParam('type', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
              >
                <option value="all">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="filter-category" className="block text-xs font-medium text-slate-600 mb-1">
                Category
              </label>
              <select
                id="filter-category"
                value={categoryParam}
                onChange={(e) => updateParam('category', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
              >
                <option value="all">All Categories</option>
                {allAvailableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* From Date */}
            <div>
              <label htmlFor="filter-from" className="block text-xs font-medium text-slate-600 mb-1">
                From Date
              </label>
              <input
                id="filter-from"
                type="date"
                value={fromParam}
                onChange={(e) => updateParam('from', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
              />
            </div>

            {/* To Date */}
            <div>
              <label htmlFor="filter-to" className="block text-xs font-medium text-slate-600 mb-1">
                To Date
              </label>
              <input
                id="filter-to"
                type="date"
                value={toParam}
                onChange={(e) => updateParam('to', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
              />
            </div>

            {/* Search Note (400ms debounce) */}
            <div>
              <label htmlFor="filter-search" className="block text-xs font-medium text-slate-600 mb-1">
                Search Note
              </label>
              <input
                id="filter-search"
                type="text"
                placeholder="Search note keyword..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table & Pagination */}
      <div className="space-y-4">
        <TransactionList
          items={transactions}
          onDelete={deleteTransaction}
          loading={loading}
          emptyMessage={
            hasActiveFilters
              ? 'No transactions found matching your filters.'
              : 'No transactions yet. Add your first one above.'
          }
        />

        {/* Pagination controls */}
        {pagination.total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs sm:text-sm font-medium text-slate-600">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total transactions)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
                className="px-3.5 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[40px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Previous page"
              >
                &larr; Previous
              </button>

              <button
                type="button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="px-3.5 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[40px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Next page"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
