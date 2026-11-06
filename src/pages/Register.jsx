import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const validate = () => {
    if (!name || name.trim().length < 2 || name.trim().length > 50) {
      setError('Name must be between 2 and 50 characters');
      if (nameRef.current) nameRef.current.focus();
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email address');
      if (emailRef.current) emailRef.current.focus();
      return false;
    }
    if (!password || password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must be at least 8 characters and contain at least one letter and one number');
      if (passwordRef.current) passwordRef.current.focus();
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/');
    } catch (err) {
      const serverMessage = err.response?.data?.error?.message || 'Registration failed';
      setError(serverMessage);
      if (err.response?.status === 409 && emailRef.current) {
        emailRef.current.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md shadow-indigo-200">
            ₹
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Start tracking expenses, setting budgets, and visualizing cashflow.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5"
          >
            <svg className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="reg-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              id="reg-name"
              ref={nameRef}
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base min-h-[44px]"
              placeholder="e.g. Asha Sharma"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              id="reg-email"
              ref={emailRef}
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base min-h-[44px]"
              placeholder="asha@example.com"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <input
              id="reg-password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base min-h-[44px]"
              placeholder="Min 8 chars, 1 letter, 1 number"
            />
            <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters with a letter and a number.</p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm sm:text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 transition-all min-h-[48px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
