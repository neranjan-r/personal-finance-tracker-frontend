import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { getSummary } from '../api/stats';
import { formatCurrency } from '../utils/format';
import { useTransactions } from '../context/TransactionContext';

const SummaryCards = ({ selectedMonth, onMonthChange }) => {
  const { dataVersion } = useTransactions();
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  // Default month: YYYY-MM
  const currentMonth = selectedMonth || new Date().toISOString().slice(0, 7);

  useEffect(() => {
    let isMounted = true;
    const fetchSummaryData = async () => {
      setLoading(true);
      try {
        const [yearStr, monthStr] = currentMonth.split('-');
        const year = parseInt(yearStr, 10);
        const monthIndex = parseInt(monthStr, 10) - 1;

        const from = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0)).toISOString();
        const to = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();

        const data = await getSummary({ from, to });
        if (isMounted) {
          setSummary(data);
        }
      } catch (err) {
        console.error('Failed to load summary stats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSummaryData();

    return () => {
      isMounted = false;
    };
  }, [currentMonth, dataVersion]);

  const isPositiveBalance = summary.balance >= 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">Financial Snapshot</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="summary-month-select" className="text-xs font-medium text-slate-500">
            Selected Month:
          </label>
          <input
            id="summary-month-select"
            type="month"
            value={currentMonth}
            onChange={(e) => onMonthChange && onMonthChange(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 min-h-[40px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Income"
          value={loading ? '...' : formatCurrency(summary.totalIncome)}
          valueColor="text-emerald-600"
          badgeColor="bg-emerald-50 text-emerald-700"
          subtitle="Received this month"
          icon={
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          }
        />

        <StatCard
          title="Total Expenses"
          value={loading ? '...' : formatCurrency(summary.totalExpense)}
          valueColor="text-rose-600"
          badgeColor="bg-rose-50 text-rose-700"
          subtitle="Spent this month"
          icon={
            <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          }
        />

        <StatCard
          title="Net Balance"
          value={loading ? '...' : formatCurrency(summary.balance)}
          valueColor={isPositiveBalance ? 'text-emerald-700' : 'text-rose-600'}
          badgeColor={isPositiveBalance ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}
          subtitle={isPositiveBalance ? 'Net Savings' : 'Deficit'}
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

export default SummaryCards;
