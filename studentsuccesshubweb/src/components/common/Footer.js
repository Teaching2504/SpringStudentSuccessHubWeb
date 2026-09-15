import React from 'react';
import { GraduationCap, User } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="ou-footer py-3 px-6 md:px-8 mt-auto">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">

        <div className="flex items-center gap-2 font-medium">
          <span className="ou-footer-icon-circle text-white">
            <User className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold text-white tracking-wide">
            2351010216 - Nguyễn Thị Tuyết Trinh
          </span>
        </div>

        <div className="ou-footer-badge flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Đồ án tốt nghiệp</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
