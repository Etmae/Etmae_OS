import React, { useEffect } from 'react';
import { DesktopGrid } from '../components/desktop/DesktopGrid';
import { useWindowStore } from '../state/useWindowStore';
import { useDesktopStore } from '../state/useDesktopStore'; // Import the desktop store

export const Windows11Desktop: React.FC = () => {
  const [selectedIconIndex, setSelectedIconIndex] = React.useState<number | null>(null);
  const [showDisclaimer, setShowDisclaimer] = React.useState(false);
  const openWindow = useWindowStore((s) => s.openWindow);

  // 1. Pull the background image from your store
  const backgroundImage = useDesktopStore((s) => s.backgroundImage);

  // 2. Immersive Mode Check (Logic moved from utility to component)
  useEffect(() => {
    const isFullscreenAvailable = document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isBooted = sessionStorage.getItem('system_booted') === 'true';
    const disclaimerShown = sessionStorage.getItem('desktopDisclaimerShown') === 'true';

    if (isBooted && !disclaimerShown) {
      setShowDisclaimer(true);
      sessionStorage.setItem('desktopDisclaimerShown', 'true');
    }
  }, []);

  const handleIconClick = (appId: string) => {
    openWindow(appId);
    setSelectedIconIndex(null);
  };

  return (
    <div
      className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700"
      style={{
        // 3. Apply the background image here
        backgroundImage: `url(${backgroundImage})`,
        // Ensures the desktop stays fixed behind windows
        position: 'fixed',
        inset: 0,
        zIndex: -1
      }}
    >
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#1c1c1c]/95 p-6 shadow-[0_16px_40px_rgb(0,0,0,0.5)] backdrop-blur-2xl text-gray-100 font-['Segoe_UI',sans-serif]">

            <div className="flex items-start gap-4">
              {/* System Info Icon */}
              <div className="mt-1 shrink-0 text-[#298603]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Text Content */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Simulated Desktop Environment</h2>
                <p className="text-sm leading-relaxed text-white/80 mb-3">
                  Welcome to my interactive portfolio. Please note that this interface is a web-based simulation created strictly for design and development demonstration purposes.
                </p>
                <p className="text-sm leading-relaxed text-white/80 mb-6">
                  While heavily inspired by Windows 11, this is an independent project with no affiliation to Microsoft Corporation. Your actual local system, files, and privacy are completely secure and are not being accessed.
                </p>
              </div>
            </div>

            {/* Action Footer  */}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end border-t border-white/10 pt-5 mt-2">
              <button
                type="button"
                onClick={() => {
                  window.close();
                  if (!window.closed) {
                    window.location.href = 'about:blank';
                  }
                }}
                className="rounded px-6 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/5 border border-transparent focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                Exit site
              </button>
              <button
                type="button"
                onClick={() => setShowDisclaimer(false)}
                className="rounded px-6 py-1.5 text-sm font-medium text-black bg-[#068106] transition-colors hover:bg-[#60cdff]/90 border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-[#60cdff]/50"
              >
                I understand
              </button>
            </div>

          </div>
        </div>
      )}
      <DesktopGrid
        selectedIconIndex={selectedIconIndex}
        onIconSelect={setSelectedIconIndex}
        onIconClick={handleIconClick}
      />
    </div>
  );
};

export default Windows11Desktop;