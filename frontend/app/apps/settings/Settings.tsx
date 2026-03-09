import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[220px] bg-white flex flex-col">
      <header className="h-10 sm:h-11 md:h-12 flex items-center px-3 sm:px-4 border-b border-gray-200 bg-[#f3f3f3] text-xs sm:text-sm">
        <span className="font-semibold truncate">Settings</span>
      </header>
      <main className="flex-1 overflow-auto px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm">
        <p className="text-gray-700">
          Settings placeholder. Layout remains usable inside small windows and on mobile-like viewports.
        </p>
      </main>
    </div>
  );
};

export default Settings;















