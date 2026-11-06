import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from './format';

describe('Format Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats rupees with currency symbol and Indian grouping', () => {
      const formatted = formatCurrency(123456.78);
      // Clean non-breaking spaces if any from Intl
      const clean = formatted.replace(/\u00A0/g, ' ');
      expect(clean).toContain('₹');
      expect(clean).toContain('1,23,456.78');
    });

    it('formats 0 properly', () => {
      const formatted = formatCurrency(0).replace(/\u00A0/g, ' ');
      expect(formatted).toContain('0.00');
    });

    it('handles negative numbers', () => {
      const formatted = formatCurrency(-500).replace(/\u00A0/g, ' ');
      expect(formatted).toContain('500.00');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly in en-IN format', () => {
      const date = new Date(Date.UTC(2026, 9, 12)); // 12 Oct 2026
      const formatted = formatDate(date);
      expect(formatted).toContain('12');
      expect(formatted).toContain('Oct');
      expect(formatted).toContain('2026');
    });

    it('returns empty string for invalid date', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate('invalid-date')).toBe('');
    });
  });
});
