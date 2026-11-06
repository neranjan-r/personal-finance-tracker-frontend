import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { getTransactions } from '../api/transactions';
import SummaryCards from '../components/SummaryCards';
import BudgetWarningCard from '../components/BudgetWarningCard';
import CategoryPieChart from '../components/CategoryPieChart';
import MonthlyBarChart from '../components/MonthlyBarChart';
import TransactionList from '../components/TransactionList';

const getTimeOfDayGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { user } = useAuth();
  const { dataVersion, deleteTransaction } = useTransactions();

  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRecent = async () => {
      setLoadingRecent(true);
      try {
        const data = await getTransactions({ page: 1, limit: 5 });
        if (isMounted) {
          setRecentTransactions(data.items || []);
        }
      } catch (err) {
        console.error('Failed to load recent transactions:', err);
      } finally {
        if (isMounted) setLoadingRecent(false);
      }
    };

    fetchRecent();

    return () => {
      isMounted = false;
    };
  }, [dataVersion]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
      {/* Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {getTimeOfDayGreeting()}, {user?.name || 'there'}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is your financial pulse and spending summary.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/transactions"
            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
          >
            + New Transaction
          </Link>
        </div>
      </div>

      {/* Budget Warning if any */}
      <BudgetWarningCard selectedMonth={selectedMonth} />

      {/* Summary Cards */}
      <SummaryCards selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

      {/* Charts Section: Side by Side on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart selectedMonth={selectedMonth} />
        <MonthlyBarChart />
      </div>

      {/* Recent Transactions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
            <p className="text-xs text-slate-500">Showing the latest 5 records</p>
          </div>
          <Link
            to="/transactions"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1"
          >
            View all transactions &rarr;
          </Link>
        </div>

        <TransactionList
          items={recentTransactions}
          onDelete={deleteTransaction}
          loading={loadingRecent}
          emptyMessage="No transactions yet. Start by adding one on the Transactions page."
          compact={true}
        />
      </div>
    </div>
  );
};

export default Dashboard;
