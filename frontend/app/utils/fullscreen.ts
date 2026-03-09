


/**
 * Requests the browser to enter immersive fullscreen mode.
 */
export const enterFullScreen = async () => {
  try {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        /* Safari / iOS Support */
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        /* IE11 Support */
        await (elem as any).msRequestFullscreen();
      }
    }
  } catch (err) {
    console.warn("Fullscreen request failed:", err);
  }
};

/**
 * Exits fullscreen mode and returns to standard windowed mode.
 */
export const exitFullScreen = async () => {
  try {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        /* Safari / iOS Support */
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        /* IE11 Support */
        await (document as any).msExitFullscreen();
      }
    }
  } catch (err) {
    console.warn("Failed to exit fullscreen:", err);
  }
};

/**
 * Helper to check current state (useful for UI icons)
 */
export const isSystemFullscreen = () => {
  return !!document.fullscreenElement;
}