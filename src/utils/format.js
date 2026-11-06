/**
 * Formats a numeric rupee amount into Indian Rupee currency format (e.g., ₹1,23,456.00)
 * Handles null, undefined, or invalid values safely.
 */
export const formatCurrency = (amount) => {
  const numericAmount = typeof amount === 'number' ? amount : Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

/**
 * Formats a Date object or ISO date string into Indian readable format (e.g., "12 Oct 2026")
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
};
