interface UsePowerManagementProps {
  onLock?: () => void;
  onRestart?: () => void;
  onShutdown?: () => void;
}

export const usePowerManagement = ({ onLock, onRestart, onShutdown }: UsePowerManagementProps) => {
  const handleLock = () => {
    if (onLock) {
      onLock();
    } else {
      // Fallback: Navigate to sign-in page
      window.location.href = '/signin';
    }
  };

  const handleRestart = () => {
    if (onRestart) {
      onRestart();
    } else {
      // Fallback: Clear session and go back to loader
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const handleShutdown = () => {
    if (onShutdown) {
      onShutdown();
    } else {
      // Fallback: Show shutdown screen then redirect
      document.body.style.background = 'black';
      const shutdownDiv = document.createElement('div');
      shutdownDiv.style.cssText = 'position:fixed;inset:0;background:black;display:flex;align-items:center;justify-content:center;z-index:9999';
      shutdownDiv.innerHTML = '<div style="color:white;font-family:Segoe UI;font-size:24px">Shutting down...</div>';
      document.body.appendChild(shutdownDiv);

      setTimeout(() => {
        try {
          window.close();
        } catch {
          // ignore any errors from window.close()
        }
        if (!window.closed) {
          window.location.href = 'about:blank';
        }
      }, 2000);
    }
  };

  return {
    handleLock,
    handleRestart,
    handleShutdown,
  };
};