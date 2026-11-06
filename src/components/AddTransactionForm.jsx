import { useState, useEffect } from 'react';
import { getCategories } from '../api/transactions';
import { useTransactions } from '../context/TransactionContext';

const getTodayString = () => {
  return new Date().toISOString().slice(0, 10);
};

const AddTransactionForm = ({ onSuccess }) => {
  const { addTransaction } = useTransactions();
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [note, setNote] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (isMounted) {
          setCategories(data);
          if (data.expense && data.expense.length > 0) {
            setCategory(data.expense[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update default category when type switches
  const handleTypeChange = (newType) => {
    setType(newType);
    const available = newType === 'income' ? categories.income : categories.expense;
    if (available && available.length > 0) {
      setCategory(available[0]);
    }
    setErrors((prev) => ({ ...prev, category: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    } else {
      const parts = amount.toString().split('.');
      if (parts[1] && parts[1].length > 2) {
        newErrors.amount = 'Amount cannot have more than 2 decimal places';
      }
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    } else {
      const selected = new Date(date).getTime();
      const maxAllowed = Date.now() + 24 * 60 * 60 * 1000;
      if (selected > maxAllowed) {
        newErrors.date = 'Date cannot be more than 1 day in the future';
      }
    }

    if (note && note.length > 200) {
      newErrors.note = 'Note cannot exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await addTransaction({
        type,
        category,
        amount: parseFloat(amount),
        date,
        note: note.trim(),
      });

      // Reset form
      setAmount('');
      setNote('');
      setDate(getTodayString());
      setErrors({});
      if (onSuccess) onSuccess();
    } catch {
      // Error is toasted in context
    } finally {
      setSubmitting(false);
    }
  };

  const activeCategories = type === 'income' ? categories.income : categories.expense;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm" noValidate>
      <h3 className="text-base font-semibold text-slate-800 mb-4">Add New Transaction</h3>

      {/* Type Toggle */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-slate-500 mb-2">Transaction Type</label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl" role="radiogroup" aria-label="Transaction Type">
          <button
            type="button"
            role="radio"
            aria-checked={type === 'expense'}
            onClick={() => handleTypeChange('expense')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all min-h-[40px] focus:outline-none focus:ring-2 focus:ring-rose-500 ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={type === 'income'}
            onClick={() => handleTypeChange('income')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all min-h-[40px] focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              type === 'income'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Category */}
        <div>
          <label htmlFor="tx-category" className="block text-xs font-medium text-slate-600 mb-1">
            Category
          </label>
          <select
            id="tx-category"
            value={category}
            disabled={loadingCategories || submitting}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
          >
            {activeCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-rose-500 mt-1" role="alert">{errors.category}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="tx-amount" className="block text-xs font-medium text-slate-600 mb-1">
            Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
            <input
              id="tx-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              disabled={submitting}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-rose-500 mt-1" role="alert">{errors.amount}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="tx-date" className="block text-xs font-medium text-slate-600 mb-1">
            Date
          </label>
          <input
            id="tx-date"
            type="date"
            value={date}
            disabled={submitting}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
          />
          {errors.date && (
            <p className="text-xs text-rose-500 mt-1" role="alert">{errors.date}</p>
          )}
        </div>
      </div>

      {/* Note */}
      <div className="mt-4">
        <label htmlFor="tx-note" className="block text-xs font-medium text-slate-600 mb-1">
          Note (Optional, max 200 chars)
        </label>
        <input
          id="tx-note"
          type="text"
          maxLength={200}
          placeholder="e.g. Grocery trip to DMart, Client invoice #102..."
          value={note}
          disabled={submitting}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
        />
        {errors.note && (
          <p className="text-xs text-rose-500 mt-1" role="alert">{errors.note}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Saving Transaction...
            </span>
          ) : (
            `+ Add ${type === 'income' ? 'Income' : 'Expense'}`
          )}
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
