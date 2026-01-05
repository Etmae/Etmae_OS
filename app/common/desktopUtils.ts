export interface Position {
  x: number;
  y: number;
}

export interface DesktopIconData {
  icon: React.ReactNode;
  label: string;
  route: string;
}

export interface TaskbarAppData {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

export interface RecentFile {
  name: string;
  time: string;
  icon: React.ReactNode;
}

// Desktop icons configuration
export const getDesktopIcons = (): DesktopIconData[] => [
  { icon: null, label: 'About Me', route: '/about' }, // Will be passed from parent
  { icon: null, label: 'Projects', route: '/projects' },
  { icon: null, label: 'Contact', route: '/contact' },
  { icon: null, label: 'Resume', route: '/resume' },
  { icon: null, label: 'Microsoft Edge', route: '/edge' },
  { icon: null, label: 'Microsoft Store', route: '/store' },
  { icon: null, label: 'Google Chrome', route: '/chrome' },
  { icon: null, label: 'VS Code', route: '/vscode' },
  { icon: null, label: 'File Explorer', route: '/explorer' },
];

// Taskbar apps configuration
export const getTaskbarApps = (): TaskbarAppData[] => [
  {
    icon: null, // Will be passed from parent
    label: 'Edge'
  },
  {
    icon: null,
    label: 'VS Code',
    isActive: true
  },
  {
    icon: null,
    label: 'GitHub'
  },
];

// Recent files for Start Menu
export const getRecentFiles = (): RecentFile[] => [
  { name: 'WindowsDesktop.tsx', time: '9h ago', icon: null },
  { name: 'Screenshot 2025-11-26 235312', time: '1m ago', icon: null },
  { name: 'Format_Character_In_Word', time: '13h ago', icon: null },
  { name: 'Screenshot 2025-11-26 234738', time: '6m ago', icon: null },
];

// Utility functions
export const formatTime = (date: Date): string =>
  `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

export const formatDate = (date: Date): string =>
  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

export const formatLongDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Default icon positions
export const getDefaultIconPositions = (): Position[] => [
  { x: 32, y: 32 },
  { x: 32, y: 140 },
  { x: 32, y: 248 },
  { x: 32, y: 356 },
  { x: 32, y: 464 },
  { x: 32, y: 572 },
  { x: 32, y: 680 },
  { x: 32, y: 788 },
  { x: 32, y: 896 },
];
