import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getMonthly } from '../api/stats';
import { formatCurrency } from '../utils/format';
import { useTransactions } from '../context/TransactionContext';

const MonthlyBarChart = () => {
  const { dataVersion } = useTransactions();
  const currentYear = new Date().getUTCFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMonthlyData = async () => {
      setLoading(true);
      try {
        const result = await getMonthly({ year: selectedYear });
        if (isMounted) {
          setData(result || []);
        }
      } catch (err) {
        console.error('Failed to load monthly statistics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMonthlyData();

    return () => {
      isMounted = false;
    };
  }, [selectedYear, dataVersion]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-lg border border-slate-700">
          <p className="font-semibold text-slate-200">{label} {selectedYear}</p>
          {payload.map((item, index) => (
            <p key={index} className="mt-1 flex items-center justify-between gap-4">
              <span className={item.dataKey === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                {item.name}:
              </span>
              <span className="font-bold">{formatCurrency(item.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Monthly Cashflow</h3>
          <p className="text-xs text-slate-500">Income vs Expenses over 12 months</p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="barchart-year-select" className="text-xs font-medium text-slate-500">
            Year:
          </label>
          <select
            id="barchart-year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="text-xs font-semibold px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 min-h-[40px]"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-[260px] flex items-center justify-center">
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            Loading monthly data...
          </div>
        ) : (
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="monthName"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={30}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-slate-600 font-medium capitalize">{value}</span>}
                />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyBarChart;
