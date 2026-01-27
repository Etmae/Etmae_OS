import { create } from 'zustand';

export type WindowLayout = 'maximized' | 'snap-left' | 'snap-right' | 'snap-top' | 'snap-bottom' | 'floating';

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon?: string;
  
  // Current Geometry
  x: number;
  y: number;
  width: number;
  height: number;

  // Stored Geometry (To remember size before snapping/maximizing)
  lastFloatingX?: number;
  lastFloatingY?: number;
  lastFloatingWidth?: number;
  lastFloatingHeight?: number;
  
  isMinimized: boolean;
  isMaximized: boolean;
  props?: Record<string, any>; 
}

interface WindowStore {
  windows: Record<string, WindowState>;
  windowOrder: string[]; 
  
  openWindow: (appId: string, options?: Partial<WindowState>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updateWindowPos: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  snapWindow: (id: string, layout: WindowLayout) => void;
}

const TASKBAR_HEIGHT = 48;
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;
const CASCADE_OFFSET = 30;

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: {},
  windowOrder: [],

  openWindow: (appId, options = {}) => {
    const state = get();
    const id = generateId();
    
    // Cascading logic
    const lastWindowId = state.windowOrder[state.windowOrder.length - 1];
    const lastWindow = state.windows[lastWindowId];
    
    let startX = 100;
    let startY = 50;

    if (lastWindow && !lastWindow.isMaximized) {
      startX = lastWindow.x + CASCADE_OFFSET;
      startY = lastWindow.y + CASCADE_OFFSET;
    }

    const newWindow: WindowState = {
      id,
      appId,
      title: options.title || appId,
      icon: options.icon || '',
      x: startX,
      y: startY,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      isMinimized: false,
      isMaximized: false,
      props: options.props || {},
      ...options,
    };

    set((state) => ({
      windows: { ...state.windows, [id]: newWindow },
      windowOrder: [...state.windowOrder, id],
    }));
  },

  closeWindow: (id) => {
    set((state) => {
      const { [id]: _, ...remainingWindows } = state.windows;
      return {
        windows: remainingWindows,
        windowOrder: state.windowOrder.filter((windowId) => windowId !== id),
      };
    });
  },

  focusWindow: (id) => {
    const state = get();
    if (state.windowOrder[state.windowOrder.length - 1] === id && !state.windows[id].isMinimized) return;

    set((state) => ({ 
      windowOrder: [...state.windowOrder.filter(wid => wid !== id), id],
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: false }
      }
    }));
  },

  toggleMinimize: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: !state.windows[id].isMinimized },
      },
      // If we minimize, we essentially "blur" the window by keeping it in the stack but hidden
    }));
  },

  toggleMaximize: (id) => {
    set((state) => {
      const win = state.windows[id];
      const becomingMaximized = !win.isMaximized;

      return {
        windows: {
          ...state.windows,
          [id]: { 
            ...win, 
            isMaximized: becomingMaximized,
            // If maximizing, save current pos. If restoring, we don't need to save.
            ...(becomingMaximized ? {
              lastFloatingX: win.x,
              lastFloatingY: win.y,
              lastFloatingWidth: win.width,
              lastFloatingHeight: win.height
            } : {})
          },
        },
      };
    });
  },

  updateWindowPos: (id, x, y) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], x, y, isMaximized: false },
      },
    }));
  },

  updateWindowSize: (id, width, height) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], width, height, isMaximized: false },
      },
    }));
  },

  snapWindow: (id, layout) => {
    const { windows } = get();
    const win = windows[id];
    if (!win) return;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight - TASKBAR_HEIGHT;

    // Save current floating state before snapping if it's currently floating
    const memory = !win.isMaximized ? {
      lastFloatingX: win.x,
      lastFloatingY: win.y,
      lastFloatingWidth: win.width,
      lastFloatingHeight: win.height
    } : {};

    let nextState: Partial<WindowState> = {};

    switch (layout) {
      case 'maximized':
        nextState = { isMaximized: true };
        break;
      case 'snap-left':
        nextState = { x: 0, y: 0, width: screenW / 2, height: screenH, isMaximized: false };
        break;
      case 'snap-right':
        nextState = { x: screenW / 2, y: 0, width: screenW / 2, height: screenH, isMaximized: false };
        break;
      case 'snap-top':
        nextState = { x: 0, y: 0, width: screenW, height: screenH / 2, isMaximized: false };
        break;
      case 'snap-bottom':
        nextState = { x: 0, y: screenH / 2, width: screenW, height: screenH / 2, isMaximized: false };
        break;
      case 'floating':
        nextState = { 
          x: win.lastFloatingX ?? 100, 
          y: win.lastFloatingY ?? 100, 
          width: win.lastFloatingWidth ?? DEFAULT_WIDTH, 
          height: win.lastFloatingHeight ?? DEFAULT_HEIGHT, 
          isMaximized: false 
        };
        break;
    }

    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...win, ...memory, ...nextState, isMinimized: false }
      }
    }));
  },
}));
