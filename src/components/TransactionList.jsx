import { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/format';

const TransactionList = ({
  items = [],
  onDelete,
  loading = false,
  emptyMessage = 'No transactions yet. Add your first one above.',
}) => {
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="animate-pulse flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
              <div className="space-y-1">
                <div className="h-4 w-28 bg-slate-200 rounded"></div>
                <div className="h-3 w-16 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="h-5 w-20 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-700">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Desktop Table View (>= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-label="Transactions Table">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Note</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              {onDelete && <th className="py-3.5 px-4 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {items.map((tx) => {
              const isIncome = tx.type === 'income';
              const isDeleting = deletingId === tx.id;
              const isConfirming = confirmDeleteId === tx.id;

              return (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {tx.note || <span className="text-slate-300 italic">—</span>}
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-bold whitespace-nowrap ${
                      isIncome ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isIncome ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                  </td>
                  {onDelete && (
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isConfirming ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleDelete(tx.id)}
                            disabled={isDeleting}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[36px]"
                            aria-label={`Confirm delete transaction from ${formatDate(tx.date)}`}
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
                          onClick={() => setConfirmDeleteId(tx.id)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[40px]"
                          aria-label={`Delete transaction: ${tx.category} ${formatCurrency(tx.amount)}`}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View (< 768px) */}
      <div className="md:hidden divide-y divide-slate-100">
        {items.map((tx) => {
          const isIncome = tx.type === 'income';
          const isDeleting = deletingId === tx.id;
          const isConfirming = confirmDeleteId === tx.id;

          return (
            <div key={tx.id} className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tx.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{formatDate(tx.date)}</span>
                </div>
                <span
                  className={`text-base font-bold ${
                    isIncome ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {isIncome ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                </span>
              </div>

              {tx.note && <p className="text-xs text-slate-600 line-clamp-2">{tx.note}</p>}

              {onDelete && (
                <div className="mt-1 flex justify-end">
                  {isConfirming ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        disabled={isDeleting}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white min-h-[40px]"
                        aria-label="Confirm delete"
                      >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={isDeleting}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 border border-slate-200 min-h-[40px]"
                        aria-label="Cancel delete"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(tx.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 font-medium py-1 px-2 rounded min-h-[40px] flex items-center"
                      aria-label={`Delete ${tx.category}`}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionList;
