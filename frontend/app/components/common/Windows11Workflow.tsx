import React, { useState, useEffect, useCallback } from 'react';
import Windows11Loader from './Windows11Loader';
import { Windows11Lockscreen } from './Windows11Lockscreen';
import { WindowsSignIn } from './WindowsSignIn';
import { Windows11Desktop } from '../../Pages/WindowsDesktop';
import { SystemShell } from '../../components/layout/SystemShell';

type ScreenType = 'loader' | 'lockscreen' | 'signin' | 'desktop';

export const Windows11Workflow: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('loader');
  const [isLoading, setIsLoading] = useState(true);

  // --- Session Management ---
  useEffect(() => {
    const checkSession = () => {
      try {
        const hasBooted = sessionStorage.getItem('windows11-booted') === 'true';
        const isSignedIn = sessionStorage.getItem('windows11-signed-in') === 'true';

        // Strict routing: If not booted, always show loader
        if (!hasBooted) {
          setCurrentScreen('loader');
        } else if (isSignedIn) {
          setCurrentScreen('desktop');
        } else {
          setCurrentScreen('signin');
        }
      } catch (error) {
        setCurrentScreen('loader');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // --- Handlers ---
  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem('windows11-booted', 'true');
    setCurrentScreen('lockscreen');
  }, []);

  const handleSignIn = useCallback(() => {
    sessionStorage.setItem('windows11-signed-in', 'true');
    setCurrentScreen('desktop');
  }, []);

  const handleLock = useCallback(() => {
    sessionStorage.setItem('windows11-signed-in', 'false');
    setCurrentScreen('signin');
  }, []);

  const handleRestart = useCallback(() => {
    sessionStorage.clear();
    setCurrentScreen('loader');
    setTimeout(() => window.location.reload(), 500);
  }, []);

  const handleShutdown = useCallback(() => {
    sessionStorage.clear();
    // Force a black screen via the root style
    const root = document.getElementById('root');
    if (root) root.style.backgroundColor = 'black';
    setCurrentScreen('loader'); // Redirect to loader which will now be empty/black
    
    setTimeout(() => {
      window.location.href = "about:blank";
    }, 1000);
  }, []);

  if (isLoading) return <div className="h-screen w-screen bg-black" />;

  // --- The Guarded Router ---
  // This ensures Taskbar/Shell code ONLY executes during 'desktop' state
  switch (currentScreen) {
    case 'loader':
      return <Windows11Loader onComplete={handleLoaderComplete} />;

    case 'lockscreen':
      return <Windows11Lockscreen onUnlock={() => setCurrentScreen('signin')} />;

    case 'signin':
      return <WindowsSignIn onSuccess={handleSignIn} />;

    case 'desktop':
      return (
        <SystemShell 
          onLock={handleLock}
          onRestart={handleRestart}
          onShutdown={handleShutdown}
        >
          <Windows11Desktop />
        </SystemShell>
      );

    default:
      return <div className="h-screen w-screen bg-black" />;
  }
};

export default Windows11Workflow;