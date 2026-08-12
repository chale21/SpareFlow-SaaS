import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-500">
      <p>© {new Date().getFullYear()} SpareFlow. All rights reserved.</p>
      <p className="text-xs">Built by Aliyah Technology</p>
      </div>
    </footer>
  );
};

export default Footer;
