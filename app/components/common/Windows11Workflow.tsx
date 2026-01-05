import React, { useState, useEffect } from 'react';

// Import your existing components
import Windows11Loader from './Windows11Loader';
import { Windows11Lockscreen } from './Windows11Lockscreen';
import { WindowsSignIn } from './WindowsSignIn';
import { Windows11Desktop } from '../../Pages/WindowsDesktop';

/**
 * WORKFLOW MANAGEMENT COMPONENT
 *
 * This component manages the complete Windows 11 boot sequence with session persistence.
 *
 * WORKFLOW:
 * 1. First visit: Loader → Lockscreen → SignIn → Desktop
 * 2. After reaching desktop + refresh: Goes directly to Desktop (skips loader/lockscreen)
 * 3. Lock button clicked: Goes to SignIn page (keeps session)
 * 4. Restart button clicked: Clears session, goes back to Loader
 * 5. Shutdown button clicked: Shows shutdown screen, attempts to close tab
 *
 * SESSION STORAGE KEYS:
 * - 'windows11-booted': 'true' when user has completed boot sequence
 * - 'windows11-signed-in': 'true' when user is signed in
 */

type ScreenType = 'loader' | 'lockscreen' | 'signin' | 'desktop';

export const Windows11Workflow: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('loader');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session state on mount
    // Use a small delay to ensure sessionStorage is accessible
    const checkSession = () => {
      try {
        const hasBooted = sessionStorage.getItem('windows11-booted') === 'true';
        const isSignedIn = sessionStorage.getItem('windows11-signed-in') === 'true';

        if (hasBooted && isSignedIn) {
          // User has already gone through the workflow, go directly to desktop
          setCurrentScreen('desktop');
        } else if (hasBooted && !isSignedIn) {
          // User has booted but not signed in (e.g., clicked lock)
          setCurrentScreen('signin');
        } else {
          // First time visit, start from loader
          setCurrentScreen('loader');
        }
      } catch (error) {
        // If sessionStorage is not available, start from loader
        console.warn('sessionStorage not available, starting from loader');
        setCurrentScreen('loader');
      }

      setIsLoading(false);
    };

    // Small delay to ensure DOM and sessionStorage are ready
    const timer = setTimeout(checkSession, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLoaderComplete = () => {
    try {
      sessionStorage.setItem('windows11-booted', 'true');
      setCurrentScreen('lockscreen');
    } catch (error) {
      console.warn('Failed to save session state:', error);
      setCurrentScreen('lockscreen');
    }
  };

  const handleLockscreenUnlock = () => {
    setCurrentScreen('signin');
  };

  const handleSignIn = () => {
    try {
      sessionStorage.setItem('windows11-signed-in', 'true');
      sessionStorage.setItem('windows11-booted', 'true'); // Ensure booted is also set
      setCurrentScreen('desktop');
    } catch (error) {
      console.warn('Failed to save session state:', error);
      setCurrentScreen('desktop');
    }
  };

  const handleLock = () => {
    try {
      // Keep booted state, only clear signed-in state
      sessionStorage.setItem('windows11-signed-in', 'false');
      setCurrentScreen('signin');
    } catch (error) {
      console.warn('Failed to update session state:', error);
      setCurrentScreen('signin');
    }
  };

  const handleRestart = () => {
    // Clear all session data
    sessionStorage.clear();
    localStorage.clear();

    // Reset to loader
    setCurrentScreen('loader');
  };

  const handleShutdown = () => {
    // Show shutdown screen
    const shutdownOverlay = document.createElement('div');
    shutdownOverlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: black;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      animation: fadeIn 0.3s ease;
    `;

    const spinner = document.createElement('div');
    spinner.style.cssText = `
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    `;

    const text = document.createElement('div');
    text.style.cssText = `
      color: white;
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 20px;
      font-weight: 300;
    `;
    text.textContent = 'Shutting down...';

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    shutdownOverlay.appendChild(spinner);
    shutdownOverlay.appendChild(text);
    document.body.appendChild(shutdownOverlay);

    // Clear session and reset to loader (like restart but with shutdown animation)
    sessionStorage.clear();
    localStorage.clear();

    // After shutdown animation, reset to loader
    setTimeout(() => {
      try {
        // Attempt to close the window (only works if opened by script)
        window.close();
      } catch (e) {
        // ignore errors when attempting to close
      }

      // If window wasn't closed, reset to loader
      if (!window.closed) {
        document.body.removeChild(shutdownOverlay);
        setCurrentScreen('loader');
      }
    }, 2000);
  };

  if (isLoading) {
    return <div style={{ background: 'black', minHeight: '100vh' }} />;
  }

  // Render current screen
  switch (currentScreen) {
    case 'loader':
      return <Windows11Loader onComplete={handleLoaderComplete} />;

    case 'lockscreen':
      return <Windows11Lockscreen onUnlock={handleLockscreenUnlock} />;

    case 'signin':
      return <WindowsSignIn onSuccess={handleSignIn} />;

    case 'desktop':
      return (
        <Windows11Desktop
          onLock={handleLock}
          onRestart={handleRestart}
          onShutdown={handleShutdown}
        />
      );

    default:
      return null;
  }
};

// Placeholder components - Replace these with your actual components
const LoaderPlaceholder: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    // Simulate loader finishing after 3 seconds
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'black',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Segoe UI, sans-serif',
      gap: '20px'
    }}>
      <div style={{ fontSize: '48px' }}>Windows 11 Loader</div>
      <div style={{ fontSize: '16px', opacity: 0.7 }}>
        Replace this with your Windows11Loader component
      </div>
      {/* Replace with: <Windows11Loader /> */}
    </div>
  );
};

const LockscreenPlaceholder: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onUnlock();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onUnlock]);

  return (
    <div
      onClick={onUnlock}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Segoe UI, sans-serif',
        cursor: 'pointer',
        gap: '20px'
      }}
    >
      <div style={{ fontSize: '96px', fontWeight: 300 }}>13:45</div>
      <div style={{ fontSize: '24px' }}>Friday, November 26</div>
      <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '40px' }}>
        Click or press Enter/Space to unlock
      </div>
      <div style={{ fontSize: '12px', opacity: 0.5 }}>
        Replace with your Lockscreen component
      </div>
      {/* Replace with: <Lockscreen onUnlock={onUnlock} /> */}
    </div>
  );
};

const SignInPlaceholder: React.FC<{ onSignIn: () => void }> = ({ onSignIn }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Segoe UI, sans-serif',
      gap: '30px'
    }}>
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px'
      }}>
        U
      </div>
      <div style={{ fontSize: '32px' }}>Blue Edge</div>
      <button
        onClick={onSignIn}
        style={{
          padding: '12px 48px',
          background: '#0078d4',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
          fontFamily: 'Segoe UI, sans-serif'
        }}
      >
        Sign in
      </button>
      <div style={{ fontSize: '12px', opacity: 0.5, marginTop: '20px' }}>
        Replace with your SignIn component
      </div>
      {/* Replace with: <SignIn onSignIn={onSignIn} /> */}
    </div>
  );
};

const DesktopPlaceholder: React.FC<{
  onLock: () => void;
  onRestart: () => void;
  onShutdown: () => void;
}> = ({ onLock, onRestart, onShutdown }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      position: 'relative',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Windows 11 Desktop</div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>
          Replace with your Windows11Desktop component
        </div>
        <div style={{ fontSize: '12px', opacity: 0.6 }}>
          Pass onLock, onRestart, and onShutdown props
        </div>
      </div>

      {/* Demo Power Menu */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
      }}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            padding: '12px 24px',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'Segoe UI',
            fontSize: '14px'
          }}
        >
          Power Menu (Demo)
        </button>

        {showMenu && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            marginBottom: '10px',
            background: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
            minWidth: '200px'
          }}>
            <button
              onClick={onLock}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'Segoe UI',
                fontSize: '14px'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              🔒 Lock
            </button>
            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '0 8px' }} />
            <button
              onClick={onRestart}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'Segoe UI',
                fontSize: '14px'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              🔄 Restart
            </button>
            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '0 8px' }} />
            <button
              onClick={onShutdown}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'Segoe UI',
                fontSize: '14px'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              ⏻ Shut down
            </button>
          </div>
        )}
      </div>

      {/* Session info */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        color: 'white',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <div>Session Status:</div>
        <div>Booted: {sessionStorage.getItem('windows11-booted') || 'false'}</div>
        <div>Signed In: {sessionStorage.getItem('windows11-signed-in') || 'false'}</div>
      </div>
    </div>
  );
};

export default Windows11Workflow;
