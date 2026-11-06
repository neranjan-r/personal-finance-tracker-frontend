import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-2xl mx-auto flex items-center justify-center mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Page Not Found</h1>
        <p className="text-sm text-slate-500 mt-2">
          The page or route you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
