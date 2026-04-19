import React, { memo, useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { useWindowStore, type WindowState } from '../../state/useWindowStore';
import { APP_REGISTRY } from '../../apps/registry';
import { SnapLayouts } from './SnapLayout';
import { X, Minus, Square, Copy } from 'lucide-react';
import { useViewport } from '../../hooks/useViewport';

const makeWindowSelector = (id: string) => (state: any) => state.windows[id];

interface WindowProps {
  id: string;
}

export const Window = memo(({ id }: WindowProps) => {
  const [snapMenuOpen, setSnapMenuOpen] = useState(false);
  const maximizeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const win: WindowState = useWindowStore(makeWindowSelector(id));
  const windowOrder = useWindowStore((s) => s.windowOrder);
  const {
    focusWindow,
    updateWindowPos,
    updateWindowSize,
    closeWindow,
    toggleMinimize,
    toggleMaximize
  } = useWindowStore();

  const { isMobile } = useViewport();

  if (!win) return null;

  const AppConfig = APP_REGISTRY[win.appId];
  const AppComponent = AppConfig ? AppConfig.component : null;

  const zIndex = windowOrder.indexOf(id) + 50;
  const isFocused = windowOrder[windowOrder.length - 1] === id;

  return (
    <Rnd
      size={{
        width: win.isMaximized ? '100%' : win.width,
        height: win.isMaximized ? '100%' : win.height
      }}
      position={{
        x: win.isMaximized ? 0 : win.x,
        y: win.isMaximized ? 0 : win.y
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
      className={`absolute bg-[#202020] border border-white/10 shadow-2xl rounded-lg transition-shadow duration-200 ${
        isFocused ? 'ring-1 ring-white/20 shadow-black/50' : 'shadow-black/20'
      }`}
      style={{
        zIndex,
        pointerEvents: 'auto',
        display: win.isMinimized ? 'none' : 'block'
      }}
    >
      {/*  CRITICAL: INNER CONTAINMENT LAYER */}
      <div className="flex flex-col h-full w-full overflow-hidden">

        {/* --- TITLE BAR --- */}
        <div
          className="window-titlebar h-10 shrink-0 bg-[#2d2d2d] flex items-center justify-between px-3 select-none cursor-default border-b border-white/5 z-10"
          onDoubleClick={() => toggleMaximize(id)}
        >
          <div className="flex items-center gap-2">
            {AppConfig?.icon && <img src={AppConfig.icon} alt="" className="w-4 h-4" />}
            <span className="text-[11px] font-medium text-gray-300 tracking-wide truncate">
              {win.title}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <WindowControl onClick={() => toggleMinimize(id)} icon={<Minus size={14} />} />

            {isMobile ? (
              <WindowControl
                ref={maximizeBtnRef}
                onClick={() => toggleMaximize(id)}
                icon={win.isMaximized ? <Copy size={12} /> : <Square size={12} />}
              />
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setSnapMenuOpen(true)}
                onMouseLeave={() => setSnapMenuOpen(false)}
              >
                <WindowControl
                  ref={maximizeBtnRef}
                  onClick={() => toggleMaximize(id)}
                  icon={win.isMaximized ? <Copy size={12} /> : <Square size={12} />}
                />

                {snapMenuOpen && (
                  <SnapLayouts
                    windowId={id}
                    buttonRect={maximizeBtnRef.current?.getBoundingClientRect() || null}
                    onClose={() => setSnapMenuOpen(false)}
                  />
                )}
              </div>
            )}

            <WindowControl onClick={() => closeWindow(id)} icon={<X size={14} />} isClose />
          </div>
        </div>

        {/* --- CLIENT AREA --- */}
        <div className="flex-1 min-h-0 relative overflow-hidden bg-[#1e1e1e]">

          {/* TRUE SCROLL CONTAINER */}
          <div
            ref={scrollContainerRef}
            onWheel={(e) => e.stopPropagation()}
            className="h-full w-full overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-behavior-contain"
          >
            {AppComponent ? (
              <div className="h-full w-full">
                <AppComponent
                  windowId={id}
                  scrollContainer={scrollContainerRef}
                  {...win.props}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-green-500 font-mono text-lg">
                Coming Soon 😁: {win.appId}
              </div>
            )}
          </div>

          {/* Unfocused overlay */}
          {!isFocused && (
            <div className="absolute inset-0 bg-black/5 pointer-events-none transition-opacity duration-300 z-20" />
          )}
        </div>
      </div>
    </Rnd>
  );
});

const WindowControl = React.forwardRef(({ onClick, icon, isClose = false }: any, ref: any) => (
  <button
    ref={ref}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`p-2 rounded-md transition-colors ${
      isClose
        ? 'hover:bg-[#c42b1c] hover:text-white text-gray-400'
        : 'hover:bg-white/10 text-gray-400 hover:text-white'
    }`}
  >
    {icon}
  </button>
));

WindowControl.displayName = 'WindowControl';