import React, { memo, useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { motion, type Variants } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useWindowStore, type WindowState } from '../../state/useWindowStore';
import { APP_REGISTRY } from '../../apps/registry';
import { SnapLayouts } from './SnapLayout';
import { X, Minus, Square, Copy } from 'lucide-react';
import { useViewport } from '../../hooks/useViewport';

const makeWindowSelector = (id: string) => (state: any) => state.windows[id];

interface WindowProps {
  id: string;
}

/**
 * Window Variants
 * Defined with explicit 'Variants' type to prevent TS2322 'type: string' mismatch.
 */
const windowVariants: Variants = {
  standard: {
    opacity: 1,
    scale: 1,
    y: 0,
    display: 'flex',
    transition: { type: 'spring', stiffness: 350, damping: 28 },
  },
  minimized: {
    opacity: 0,
    scale: 0.85,
    y: 40,
    transition: { type: 'spring', stiffness: 350, damping: 28 },
    transitionEnd: {
      display: 'none',
    },
  },
};

export const Window = memo(({ id }: WindowProps) => {
  const [snapMenuOpen, setSnapMenuOpen] = useState(false);
  const maximizeBtnRef   = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const win: WindowState = useWindowStore(makeWindowSelector(id));
  const {
    windowOrder,
    focusWindow,
    updateWindowPos,
    updateWindowSize,
    closeWindow,
    toggleMinimize,
    toggleMaximize,
    updateWindowSnapshot,
  } = useWindowStore();
  const { isMobile } = useViewport();

  useEffect(() => {
    if (win && APP_REGISTRY[win.appId]?.defaultMaximized && !win.isMaximized) {
      toggleMaximize(id);
    }
  }, [id, win?.appId, toggleMaximize]);

  /**
   * Capture snapshot when the window first becomes visible.
   *
   * Fix: data-window-id is placed on an inner wrapper div rather than on the
   * Rnd component. react-rnd does not guarantee forwarding arbitrary HTML
   * attributes to its DOM wrapper, so the old querySelector('[data-window-id]')
   * often returned null and html2canvas was never invoked.
   */
  useEffect(() => {
    if (!win || win.isMinimized || win.snapshot) return;

    const normalizeCssValue = (property: string, value: string) => {
      if (!value || !/(oklab|lab|lch|color\(|hwb\()/i.test(value)) return value;
      try {
        const tester = document.createElement('div');
        tester.style.position = 'absolute';
        tester.style.visibility = 'hidden';
        tester.style.setProperty(property, value);
        document.body.appendChild(tester);
        const normalized = window.getComputedStyle(tester).getPropertyValue(property);
        document.body.removeChild(tester);
        if (normalized && !/(oklab|lab|lch|color\(|hwb\()/i.test(normalized)) {
          return normalized;
        }
      } catch {
        // ignore and fallback
      }
      return 'transparent';
    };

    const sanitizeClonedStyles = (source: HTMLElement, cloned: HTMLElement) => {
      const queue: Array<{ source: HTMLElement; cloned: HTMLElement }> = [{ source, cloned }];
      while (queue.length) {
        const { source: currentSource, cloned: currentCloned } = queue.shift()!;
        const computed = window.getComputedStyle(currentSource);
        for (let i = 0; i < computed.length; i += 1) {
          const prop = computed[i];
          const value = computed.getPropertyValue(prop);
          if (!value) continue;
          const normalized = normalizeCssValue(prop, value);
          if (normalized !== value) {
            currentCloned.style.setProperty(prop, normalized, computed.getPropertyPriority(prop));
          }
        }

        const sourceChildren = Array.from(currentSource.children) as HTMLElement[];
        const clonedChildren = Array.from(currentCloned.children) as HTMLElement[];
        for (let i = 0; i < sourceChildren.length; i += 1) {
          if (clonedChildren[i]) {
            queue.push({ source: sourceChildren[i], cloned: clonedChildren[i] });
          }
        }
      }
    };

    const captureSnapshot = async () => {
      // Selector targets the inner wrapper div that definitely owns the attribute
      const node = document.querySelector(
        `[data-window-id="${id}"] [data-window-content]`
      ) as HTMLElement | null;
      if (!node) return;

      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(node, {
          scale:           0.35,
          useCORS:         true,
          allowTaint:      true,
          logging:         false,
          backgroundColor: '#202020',
          ignoreElements:  (el) => el.tagName === 'IFRAME' || el.tagName === 'VIDEO',
          onclone: (clonedDoc) => {
            const clonedNode = clonedDoc.querySelector(
              `[data-window-id="${id}"] [data-window-content]`
            ) as HTMLElement | null;
            if (clonedNode) {
              sanitizeClonedStyles(node, clonedNode);
            }
          },
        });
        const dataUrl = canvas.toDataURL('image/webp', 0.75);
        if (dataUrl) updateWindowSnapshot(id, dataUrl);
      } catch (error) {
        console.error('Failed to capture window snapshot:', error);
        // Silent fail — thumbnail will show placeholder icon
      }
    };

    const timeout = setTimeout(captureSnapshot, 500);
    return () => clearTimeout(timeout);
  }, [id, win?.isMinimized, win?.snapshot, updateWindowSnapshot]);

  if (!win) return null;

  const AppConfig   = APP_REGISTRY[win.appId];
  const AppComponent = AppConfig ? AppConfig.component : null;
  const isFocused   = windowOrder[windowOrder.length - 1] === id;
  const zIndex      = windowOrder.indexOf(id) + 50;

  /**
   * Safe Icon Renderer
   * Handles strings (URLs), Components (Lucide), and pre-rendered JSX elements.
   */
  const renderTitleIcon = (icon: any) => {
    if (!icon) return null;
    if (typeof icon === 'string') return <img src={icon} alt="" className="w-4 h-4" />;
    if (React.isValidElement(icon)) return icon;
    return React.createElement(icon, { size: 16, className: 'text-gray-300' });
  };

  return (
    <Rnd
      size={{
        width:  win.isMaximized ? '100%' : win.width,
        height: win.isMaximized ? '100%' : win.height,
      }}
      position={{
        x: win.isMaximized ? 0 : win.x,
        y: win.isMaximized ? 0 : win.y,
      }}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      disableDragging={win.isMaximized}
      enableResizing={!win.isMaximized}
      dragHandleClassName="window-titlebar"
      onDragStop={(e, d) => updateWindowPos(id, d.x, d.y)}
      onResizeStop={(e, dir, ref, delta, pos) => {
        updateWindowSize(id, parseInt(ref.style.width), parseInt(ref.style.height));
        updateWindowPos(id, pos.x, pos.y);
      }}
      onMouseDown={() => focusWindow(id)}
      className={`absolute transition-shadow duration-200 ${
        isFocused
          ? 'ring-1 ring-white/20 shadow-2xl shadow-black/50'
          : 'shadow-xl shadow-black/20'
      }`}
      style={{
        zIndex,
        pointerEvents: win.isMinimized ? 'none' : 'auto',
        opacity:       win.isMinimized ? 0 : 1,
        transition:    'opacity 0.2s ease-in-out',
      }}
    >
      {/*
       * Inner wrapper carries data-window-id so the snapshot querySelector
       * reliably finds it — Rnd does not forward arbitrary HTML attributes
       * to its underlying DOM element.
       */}
      <div data-window-id={id} style={{ width: '100%', height: '100%' }}>
        <motion.div
          data-window-content
          className="flex flex-col h-full w-full overflow-hidden bg-[#202020] border border-white/10 rounded-lg shadow-2xl"
          initial="minimized"
          animate={win.isMinimized ? 'minimized' : 'standard'}
          variants={windowVariants}
          style={{
            transformOrigin: 'bottom center',
            opacity:         win.isMinimized ? 0 : 1,
            pointerEvents:   win.isMinimized ? 'none' : 'auto',
            transition:      'opacity 0.2s ease-in-out',
          }}
        >
          {/* --- TITLE BAR --- */}
          <div
            className="window-titlebar h-10 shrink-0 bg-[#2d2d2d] flex items-center justify-between px-3 select-none cursor-default border-b border-white/5 z-10"
            onDoubleClick={() => toggleMaximize(id)}
          >
            <div className="flex items-center gap-2">
              {renderTitleIcon(AppConfig?.icon)}
              <span className="text-[11px] font-medium text-gray-300 tracking-wide truncate">
                {win.title}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <WindowControl onClick={() => toggleMinimize(id)} icon={<Minus size={14} />} />
              <div
                className="relative"
                onMouseEnter={() => !isMobile && setSnapMenuOpen(true)}
                onMouseLeave={() => !isMobile && setSnapMenuOpen(false)}
              >
                <WindowControl
                  ref={maximizeBtnRef}
                  onClick={() => toggleMaximize(id)}
                  icon={win.isMaximized ? <Copy size={12} /> : <Square size={12} />}
                />
                {!isMobile && snapMenuOpen && (
                  <SnapLayouts
                    windowId={id}
                    buttonRect={maximizeBtnRef.current?.getBoundingClientRect() || null}
                    onClose={() => setSnapMenuOpen(false)}
                  />
                )}
              </div>
              <WindowControl onClick={() => closeWindow(id)} icon={<X size={14} />} isClose />
            </div>
          </div>

          {/* --- CLIENT AREA --- */}
          <div className="flex-1 min-h-0 relative overflow-hidden bg-[#1e1e1e]">
            <div
              ref={scrollContainerRef}
              className="h-full w-full overflow-y-auto custom-scrollbar"
            >
              {AppComponent ? (
                <AppComponent windowId={id} scrollContainer={scrollContainerRef} {...win.props} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 opacity-50">
                  <DotLottieReact
                    src="https://lottie.host/331af30b-c98e-42a4-9b77-c490cf9eef31/CAbj95X0Wd.lottie"
                    loop
                    autoplay
                  />
                  <p className="mt-4 font-mono text-sm uppercase tracking-widest text-green-500">
                    System Error: App Not Found
                  </p>
                </div>
              )}
            </div>
            {!isFocused && (
              <div className="absolute inset-0 bg-black/10 pointer-events-none z-20" />
            )}
          </div>
        </motion.div>
      </div>
    </Rnd>
  );
});

const WindowControl = React.forwardRef(
  ({ onClick, icon, isClose = false }: any, ref: any) => (
    <button
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`p-2 rounded-md transition-colors ${
        isClose
          ? 'hover:bg-[#c42b1c] hover:text-white'
          : 'hover:bg-white/10'
      } text-gray-400 hover:text-white`}
    >
      {icon}
    </button>
  )
);