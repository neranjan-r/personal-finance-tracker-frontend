import { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  getTransactions as apiGetTransactions,
  createTransaction as apiCreateTransaction,
  deleteTransaction as apiDeleteTransaction,
} from '../api/transactions';

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await apiGetTransactions(params);
      setTransactions(data.items || []);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      });
      return data;
    } catch (error) {
      const msg = error.response?.data?.error?.message || 'Failed to load transactions';
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = async (transactionData) => {
    try {
      const newTx = await apiCreateTransaction(transactionData);
      setTransactions((prev) => [newTx, ...prev]);
      setDataVersion((v) => v + 1);
      toast.success('Transaction added successfully!');
      return newTx;
    } catch (error) {
      const msg = error.response?.data?.error?.message || 'Failed to add transaction';
      toast.error(msg);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    // Optimistic removal
    const previousTransactions = [...transactions];
    setTransactions((prev) => prev.filter((item) => item.id !== id));

    try {
      await apiDeleteTransaction(id);
      setDataVersion((v) => v + 1);
      toast.success('Transaction deleted');
    } catch (error) {
      // Rollback on failure
      setTransactions(previousTransactions);
      const msg = error.response?.data?.error?.message || 'Failed to delete transaction';
      toast.error(msg);
      throw error;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        pagination,
        loading,
        dataVersion,
        fetchTransactions,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
