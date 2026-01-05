import React from 'react';
import ChromeIcon from '../assets/svgs/chrome-logo-8793.svg?react';
import Terminal from '../assets/img/portfolio/windows-terminal.png';
import { User } from 'lucide-react';

export interface TaskbarAppData {
  appId: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  route: string;
}

export const taskbarApps: TaskbarAppData[] = [
  {
    icon: React.createElement(ChromeIcon, { width: 32, height: 32 }), label: 'Google Chrome', route: '/chrome',
    appId: 'chrome'
  },
  
  {
    icon: React.createElement('img', { src: Terminal, alt: 'Terminal', className: 'w-10 h-10' }), label: 'Terminal', route: '/terminal',
    appId: 'terminal'
  },
  {
    icon: React.createElement(User, { size: 32 }), label: 'Portfolio Hero', route: '/hero',
    appId: 'hero'
  },
];