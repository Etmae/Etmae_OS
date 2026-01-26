import React from 'react';
import { User, FolderOpen, Mail, Code, FileText, Globe,  } from 'lucide-react';
import VSCodeIcon from '../assets/svgs/vs-code-svgrepo-com.svg?react';
import ChromeIcon from '../assets/svgs/chrome-logo-8793.svg?react';
import StoreIcon from '../assets/svgs/microsoft-store-2022.svg?react';
import ExplorerIcon from '../assets/svgs/file-explorer-windows-25539.svg?react';
import EdeIcon from '../assets/svgs/microsoft-edge-svgrepo-com.svg?react'





export interface DesktopIconData {
  id?: any;
  icon: React.ReactNode;
  label: string;
  route: string;
  size?: number;
}

export const desktopIcons: DesktopIconData[] = [
  { icon: React.createElement(User, { size: 32 }), label: 'About Me', route: '/hero',  },
  { icon: React.createElement(FolderOpen, { size: 32 }), label: 'Projects', route: '/projects' },
  { icon: React.createElement(Mail, { size: 32 }), label: 'Contact', route: '/contact' },
  { icon: React.createElement(FileText, { size: 32 }), label: 'Resume', route: '/resume' },
  { icon: React.createElement(EdeIcon, { width: 32, height: 32 }), label: 'Microsoft Edge', route: '/edge' },
  { icon: React.createElement(StoreIcon, { width: 32, height: 32 }), label: 'Microsoft Store', route: '/store' },
  { icon: React.createElement(ChromeIcon, { width: 32, height: 32 }), label: 'Google Chrome', route: '/chrome' },
  { icon: React.createElement(VSCodeIcon, { width: 32, height: 32 }), label: 'VS Code', route: '/apps/paint' },
  { icon: React.createElement(ExplorerIcon, { width: 32, height: 32 }), label: 'File Explorer', route: '/explorer' },
 

];