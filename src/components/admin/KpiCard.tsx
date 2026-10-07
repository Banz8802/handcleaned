import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  textColor?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-[#2CBAE8]/10 text-[#17739C]',
  textColor = 'text-[#1A2E44]',
}: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgColor}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textColor}`}>
          {value}
        </h3>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
