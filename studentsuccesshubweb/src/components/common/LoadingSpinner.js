import React from 'react';

const LoadingSpinner = ({ text = 'Đang tải dữ liệu...' }) => (
  <div className="flex flex-col justify-center items-center py-12 gap-3">
    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    {text && <p className="text-sm font-medium text-slate-500">{text}</p>}
  </div>
);

export default LoadingSpinner;
