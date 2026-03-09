import { create } from 'zustand';
import { APP_REGISTRY } from '../apps/registry';

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

const isMobileViewport = () =>
  typeof window !== 'undefined' ? window.innerWidth < 640 : false;

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: {},
  windowOrder: [],

openWindow: (appId, options = {}) => {
  const state = get();

  // If a window for this app already exists, reuse it instead of creating a new one
  const existing = Object.values(state.windows).find((w) => w.appId === appId);
  const mobile = isMobileViewport();

  if (existing) {
    set((state) => {
      // Optionally enforce a single visible window at a time by minimizing others
      const windows = Object.fromEntries(
        Object.entries(state.windows).map(([wid, win]) => [
          wid,
          { ...win, isMinimized: wid === existing.id ? false : (mobile ? true : win.isMinimized) },
        ])
      );

      return {
        windows,
        windowOrder: [
          ...state.windowOrder.filter((wid) => wid !== existing.id),
          existing.id,
        ],
      };
    });
    return;
  }

  const id = generateId();

  // Get the default config for this app from the registry
  const appConfig = APP_REGISTRY[appId];
  
  // Cascading logic
  const lastWindowId = state.windowOrder[state.windowOrder.length - 1];
  const lastWindow = state.windows[lastWindowId];
  
  let startX = 100;
  let startY = 50;

  if (lastWindow && !lastWindow.isMaximized) {
    startX = lastWindow.x + CASCADE_OFFSET;
    startY = lastWindow.y + CASCADE_OFFSET;
  }

  const screenW = typeof window !== 'undefined' ? window.innerWidth : DEFAULT_WIDTH;
  const screenH = typeof window !== 'undefined' ? window.innerHeight - TASKBAR_HEIGHT : DEFAULT_HEIGHT;

  // Determine initial maximized state using new `defaultMaximized` registry flag
  const initialMaximized = mobile ? true : (options.isMaximized ?? appConfig?.defaultMaximized ?? false);

  const baseWindow: WindowState = {
    id,
    appId,
    // Use registry defaults, but allow 'options' to override them
    title: options.title || appConfig?.title || appId,
    icon: options.icon || appConfig?.icon || '',
    x: initialMaximized ? 0 : (options.x ?? startX),
    y: initialMaximized ? 0 : (options.y ?? startY),
    width: initialMaximized ? screenW : (options.width ?? DEFAULT_WIDTH),
    height: initialMaximized ? screenH : (options.height ?? DEFAULT_HEIGHT),
    isMinimized: false,
    isMaximized: initialMaximized,
    // If opened maximized, remember a sensible last-floating geometry
    lastFloatingX: mobile ? 0 : (options.x ?? startX),
    lastFloatingY: mobile ? 0 : (options.y ?? startY),
    lastFloatingWidth: mobile ? screenW : (options.width ?? DEFAULT_WIDTH),
    lastFloatingHeight: mobile ? screenH : (options.height ?? DEFAULT_HEIGHT),
    props: options.props || {},
    ...options,
  };

  set((state) => {
    // On mobile, keep only one visible window at a time by minimizing others
    const updatedWindows = mobile
      ? Object.fromEntries(
          Object.entries(state.windows).map(([wid, win]) => [
            wid,
            { ...win, isMinimized: true },
          ])
        )
      : state.windows;

    return {
      windows: { ...updatedWindows, [id]: baseWindow },
      windowOrder: [...state.windowOrder, id],
    };
  });
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

    const mobile = isMobileViewport();

    set((state) => {
      const windows = mobile
        ? Object.fromEntries(
            Object.entries(state.windows).map(([wid, win]) => [
              wid,
              { ...win, isMinimized: wid === id ? false : true },
            ])
          )
        : {
            ...state.windows,
            [id]: { ...state.windows[id], isMinimized: false },
          };

      return { 
        windowOrder: [...state.windowOrder.filter(wid => wid !== id), id],
        windows,
      };
    });
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
      if (!win) return state;

      const becomingMaximized = !win.isMaximized;
      const mobile = isMobileViewport();

      if (becomingMaximized) {
        // Save current floating geometry and expand to full screen
        const screenW = typeof window !== 'undefined' ? window.innerWidth : win.width;
        const screenH = typeof window !== 'undefined' ? window.innerHeight - TASKBAR_HEIGHT : win.height;

        return {
          windows: {
            ...state.windows,
            [id]: { 
              ...win, 
              lastFloatingX: win.x,
              lastFloatingY: win.y,
              lastFloatingWidth: win.width,
              lastFloatingHeight: win.height,
              x: 0,
              y: 0,
              width: screenW,
              height: screenH,
              isMaximized: true,
              isMinimized: false
            },
          },
        };
      } else {
        // Restore saved floating geometry
        if (mobile) {
          // On mobile, "restore" should still be a full-screen page, just not marked maximized
          const screenW = typeof window !== 'undefined' ? window.innerWidth : win.width;
          const screenH = typeof window !== 'undefined' ? window.innerHeight - TASKBAR_HEIGHT : win.height;
          return {
            windows: {
              ...state.windows,
              [id]: {
                ...win,
                x: 0,
                y: 0,
                width: screenW,
                height: screenH,
                isMaximized: false,
                isMinimized: false,
              },
            },
          };
        }

        return {
          windows: {
            ...state.windows,
            [id]: { 
              ...win, 
              x: win.lastFloatingX ?? 100,
              y: win.lastFloatingY ?? 100,
              width: win.lastFloatingWidth ?? DEFAULT_WIDTH,
              height: win.lastFloatingHeight ?? DEFAULT_HEIGHT,
              isMaximized: false,
              isMinimized: false
            },
          },
        };
      }
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

    const screenW = typeof window !== 'undefined' ? window.innerWidth : DEFAULT_WIDTH;
    const screenH = typeof window !== 'undefined' ? window.innerHeight - TASKBAR_HEIGHT : DEFAULT_HEIGHT;
    const mobile = isMobileViewport();

    // Save current floating state before snapping if it's currently floating
    const memory = !win.isMaximized ? {
      lastFloatingX: win.x,
      lastFloatingY: win.y,
      lastFloatingWidth: win.width,
      lastFloatingHeight: win.height
    } : {};

    let nextState: Partial<WindowState> = {};

    if (mobile) {
      // On mobile, treat all snap layouts as full-screen pages,
      // but keep 'floating' logically distinct (not maximized)
      if (layout === 'floating') {
        nextState = { x: 0, y: 0, width: screenW, height: screenH, isMaximized: false };
      } else {
        nextState = { x: 0, y: 0, width: screenW, height: screenH, isMaximized: true };
      }
    } else {
      switch (layout) {
        case 'maximized':
          nextState = { x: 0, y: 0, width: screenW, height: screenH, isMaximized: true };
          break;
        case 'snap-left':
          nextState = { x: 0, y: 0, width: Math.floor(screenW / 2), height: screenH, isMaximized: false };
          break;
        case 'snap-right':
          nextState = { x: Math.floor(screenW / 2), y: 0, width: Math.ceil(screenW / 2), height: screenH, isMaximized: false };
          break;
        case 'snap-top':
          nextState = { x: 0, y: 0, width: screenW, height: Math.floor(screenH / 2), isMaximized: false };
          break;
        case 'snap-bottom':
          nextState = { x: 0, y: Math.floor(screenH / 2), width: screenW, height: Math.ceil(screenH / 2), isMaximized: false };
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
    }

    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...win, ...memory, ...nextState, isMinimized: false }
      }
    }));
  },
}));