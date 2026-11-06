import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getByCategory } from '../api/stats';
import { formatCurrency } from '../utils/format';
import { useTransactions } from '../context/TransactionContext';

const PALETTE = [
  '#4f46e5', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#14b8a6', // Teal
  '#f97316', // Orange
];

const CategoryPieChart = ({ selectedMonth }) => {
  const { dataVersion } = useTransactions();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = selectedMonth || new Date().toISOString().slice(0, 7);

  useEffect(() => {
    let isMounted = true;
    const fetchCategoryStats = async () => {
      setLoading(true);
      try {
        const [yearStr, monthStr] = currentMonth.split('-');
        const year = parseInt(yearStr, 10);
        const monthIndex = parseInt(monthStr, 10) - 1;

        const from = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0)).toISOString();
        const to = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();

        const result = await getByCategory({ from, to, type: 'expense' });
        if (isMounted) {
          setData(result || []);
        }
      } catch (err) {
        console.error('Failed to load category stats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategoryStats();

    return () => {
      isMounted = false;
    };
  }, [currentMonth, dataVersion]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-lg border border-slate-700">
          <p className="font-semibold">{item.category}</p>
          <p className="text-slate-300 mt-1">
            Amount: <span className="text-white font-bold">{formatCurrency(item.total)}</span>
          </p>
          <p className="text-slate-300">
            Share: <span className="text-emerald-400 font-bold">{item.percent}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-800">Expenses by Category</h3>
        <span className="text-xs text-slate-500 font-medium">This Month</span>
      </div>

      <div className="flex-1 min-h-[260px] flex items-center justify-center">
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            Loading chart...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600">No expenses yet</p>
            <p className="text-xs text-slate-400 mt-1">Add expense transactions to see your spending breakdown.</p>
          </div>
        ) : (
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="total"
                  nameKey="category"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPieChart;
