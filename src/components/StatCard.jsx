const StatCard = ({ title, value, subtitle, icon, valueColor = 'text-slate-900', badgeColor = 'bg-slate-100 text-slate-700' }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${valueColor}`}>
          {value}
        </div>
        {subtitle && (
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent">
            <span className={`px-2 py-0.5 rounded-md ${badgeColor}`}>{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
