import React from 'react';
import { GraduationCap, User } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary-900 via-primary-800 to-slate-900 text-white py-3.5 px-6 md:px-8 mt-auto border-t border-primary-800/60 shadow-lg">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        {/* Bên trái: Tên sinh viên & MSSV */}
        <div className="flex items-center gap-2 font-medium">
          <span className="w-6 h-6 rounded-full bg-white/10 text-primary-200 flex items-center justify-center border border-white/15">
            <User className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold text-white tracking-wide">
            2351010216 - Nguyễn Thị Tuyết Trinh
          </span>
        </div>

        {/* Bên phải: Đồ án tốt nghiệp */}
        <div className="flex items-center gap-1.5 font-semibold text-primary-200 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-xs">
          <GraduationCap className="w-3.5 h-3.5 text-primary-300" />
          <span>Đồ án tốt nghiệp</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
