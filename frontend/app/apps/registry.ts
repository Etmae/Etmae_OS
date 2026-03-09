// app/apps/registry.ts
import { Terminal } from './terminal/Terminal';
// import { Notepad } from './notepad/Notepad';
import  Paint from './paint/Paint';
// import { Browser } from './browser/Browser';
import Chrome from './Chrome';
import { PortfolioShell } from './portfolio/PortfolioShell';
import { User, FolderOpen, Mail, FileText } from 'lucide-react';

export interface AppConfig {
  component: React.ComponentType<any>;
  title: string;
  icon?: string;
  isMaximized?: boolean;
  defaultMaximized?: boolean; // New property to indicate if the app should open maximized by default
  
}

export const APP_REGISTRY: Record<string, AppConfig> = {
  terminal: {
    component: Terminal,
    title: 'Terminal',
    icon: '../assets/img/portfolio/windows-terminal.png',
  },
//   notepad: {
//     component: Notepad,
//     title: 'Notepad',
//     icon: '/icons/notepad.png',
//   },
  paint: {
    component: Paint,
    title: 'Paint',
    icon: '../assets/img/portfolio/windows-terminal.png',
  },
//   browser: {
//     component: Browser,
//     title: 'Web Browser',
//     icon: '/icons/browser.png',
//   },
    chrome: {
    component: Chrome,
    title: 'Chrome',
    icon: '../assets/img/portfolio/windows-terminal.png',
  },
    hero: {
    component: PortfolioShell,
    title: 'Portfolio Hero',
    icon: '../assets/img/portfolio/windows-terminal.png',
  },
  "about": {
    component: PortfolioShell,
    title: 'hero',
    icon: '../assets/img/portfolio/windows-terminal.png' ,
    defaultMaximized: true, // This app will open maximized by default
  }
};