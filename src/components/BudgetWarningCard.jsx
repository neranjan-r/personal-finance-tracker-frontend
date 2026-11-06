import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBudgets } from '../api/budgets';
import { formatCurrency } from '../utils/format';
import { useTransactions } from '../context/TransactionContext';

const BudgetWarningCard = ({ selectedMonth }) => {
  const { dataVersion } = useTransactions();
  const [warnings, setWarnings] = useState([]);

  const currentMonth = selectedMonth || new Date().toISOString().slice(0, 7);

  useEffect(() => {
    let isMounted = true;
    const checkBudgetHealth = async () => {
      try {
        const budgets = await getBudgets({ month: currentMonth });
        if (isMounted) {
          const highRisk = (budgets || []).filter((b) => b.percentUsed >= 90);
          setWarnings(highRisk);
        }
      } catch (err) {
        console.error('Failed to check budget warnings:', err);
      }
    };

    checkBudgetHealth();

    return () => {
      isMounted = false;
    };
  }, [currentMonth, dataVersion]);

  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-amber-900">
            Budget Warning: {warnings.length} {warnings.length === 1 ? 'category is' : 'categories are'} near or over limit!
          </h4>
          <p className="text-xs text-amber-800 mt-0.5">
            {warnings.map((w) => `${w.category} (${w.percentUsed}% used - ${formatCurrency(w.spent)} / ${formatCurrency(w.limit)})`).join(' • ')}
          </p>
        </div>
      </div>
      <Link
        to="/budgets"
        className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[40px]"
        aria-label="View and adjust budgets"
      >
        Manage Budgets &rarr;
      </Link>
    </div>
  );
};

export default BudgetWarningCard;
