import { create } from 'zustand';
import type { Position } from '../common/desktopUtils';

interface DesktopState {
  // Icon management
  selectedIconIndex: number | null;
  setSelectedIconIndex: (index: number | null) => void;
  iconPositions: Position[];
  setIconPositions: (positions: Position[]) => void;
  updateIconPosition: (index: number, position: Position) => void;

  // Panel states
  startMenuOpen: boolean;
  setStartMenuOpen: (open: boolean) => void;
  toggleStartMenu: () => void;

  quickSettingsOpen: boolean;
  setQuickSettingsOpen: (open: boolean) => void;

  notificationOpen: boolean;
  setNotificationOpen: (open: boolean) => void;

  widgetsOpen: boolean;
  setWidgetsOpen: (open: boolean) => void;

  powerMenuOpen: boolean;
  setPowerMenuOpen: (open: boolean) => void;

  // Settings
  brightness: number;
  setBrightness: (brightness: number) => void;

  volume: number;
  setVolume: (volume: number) => void;

  hasNotifications: boolean;
  setHasNotifications: (has: boolean) => void;

  // Background and general
  backgroundImage: string;
  setBackgroundImage: (image: string) => void;
  darkBackgroundImage: string;
  lightBackgroundImage: string;
  showDesktop: boolean;
  setShowDesktop: (show: boolean) => void;
}

export const useDesktopStore = create<DesktopState>((set, get) => ({
  // Icon management
  selectedIconIndex: null,
  setSelectedIconIndex: (index) => set({ selectedIconIndex: index }),
  iconPositions: [
    { x: 32, y: 32 },
    { x: 32, y: 140 },
    { x: 32, y: 248 },
    { x: 32, y: 356 },
    { x: 32, y: 464 },
    { x: 32, y: 572 },
    { x: 32, y: 680 },
    { x: 32, y: 788 },
    { x: 32, y: 896 },
  ],
  setIconPositions: (positions) => set({ iconPositions: positions }),
  updateIconPosition: (index, position) => {
    const { iconPositions } = get();
    const newPositions = [...iconPositions];
    newPositions[index] = position;
    set({ iconPositions: newPositions });
  },

  // Panel states
  startMenuOpen: false,
  setStartMenuOpen: (open) => set({ startMenuOpen: open }),
  toggleStartMenu: () => set((state) => ({ startMenuOpen: !state.startMenuOpen })),

  quickSettingsOpen: false,
  setQuickSettingsOpen: (open) => set({ quickSettingsOpen: open }),

  notificationOpen: false,
  setNotificationOpen: (open) => set({ notificationOpen: open }),

  widgetsOpen: false,
  setWidgetsOpen: (open) => set({ widgetsOpen: open }),

  powerMenuOpen: false,
  setPowerMenuOpen: (open) => set({ powerMenuOpen: open }),

  // Settings
  brightness: 70,
  setBrightness: (brightness) => set({ brightness }),

  volume: 50,
  setVolume: (volume) => set({ volume }),

  hasNotifications: true,
  setHasNotifications: (has) => set({ hasNotifications: has }),

  // Background and general
  backgroundImage: '',
  setBackgroundImage: (image) => set({ backgroundImage: image }),
  darkBackgroundImage: 'https://images.wallpapersden.com/image/download/windows-11-4k-green-glow_bW5qbW2UmZqaraWkpJRnamtlrWZpaWU.jpg',
  lightBackgroundImage: 'https://via.placeholder.com/1920x1080/ffffff/000000?text=Light+Theme+Background', // Placeholder for light theme
  showDesktop: true,
  setShowDesktop: (show) => set({ showDesktop: show }),
}));














