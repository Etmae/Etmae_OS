import React from 'react'

function Chrome() {
  return (
    <div className="w-full h-full min-h-[220px] bg-white text-gray-900 flex flex-col">
      <header className="h-10 sm:h-11 md:h-12 flex items-center px-3 sm:px-4 border-b border-gray-200 bg-[#f3f3f3] text-xs sm:text-sm">
        <div className="flex items-center gap-2 truncate">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span className="font-semibold truncate">Chrome</span>
        </div>
      </header>
      <main className="flex-1 overflow-auto px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm">
        <p className="text-gray-700">
          This is a placeholder for a Chrome-like browser window. Resize the window to see how the content adapts.
        </p>
      </main>
    </div>
  );
}

export default Chrome;