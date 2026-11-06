import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileTabBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabClasses = ({ isActive }) =>
    `flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg ${
      isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
    }`;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 shadow-lg px-2 py-1 flex items-center justify-around"
      role="navigation"
      aria-label="Mobile Navigation"
    >
      <NavLink to="/" className={tabClasses} aria-label="Dashboard">
        <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/transactions" className={tabClasses} aria-label="Transactions">
        <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <span>Transactions</span>
      </NavLink>

      <NavLink to="/budgets" className={tabClasses} aria-label="Budgets">
        <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span>Budgets</span>
      </NavLink>

      <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium text-rose-500 hover:text-rose-700 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-lg"
        aria-label="Logout"
      >
        <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default MobileTabBar;
