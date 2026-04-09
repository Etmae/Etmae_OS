import React from 'react';
import UserProfile from '../assets/svgs/AboutIcon.svg?react';
import Contact from '../assets/svgs/contactIcon.svg?react';
import ProjectIcon from '../assets/svgs/Project.svg?react';
import { User, FolderOpen, Mail, FileText } from 'lucide-react';
import VSCodeIcon from '../assets/svgs/vs-code-svgrepo-com.svg?react';
import ChromeIcon from '../assets/svgs/chrome-logo-8793.svg?react';
import StoreIcon from '../assets/svgs/microsoft-store-2022.svg?react';
import ExplorerIcon from '../assets/svgs/file-explorer-windows-25539.svg?react';
import EdeIcon from '../assets/svgs/microsoft-edge-svgrepo-com.svg?react';
import Resume from '../assets/svgs/ResumeIcon.svg?react';
import PortIcon from '../assets/svgs/Logoimage.svg?react';

export interface DesktopIconData {
  appId: string; // The "Key" that matches the Registry
  icon: React.ReactNode;
  label: string;
  size?: number;
}

export const desktopIcons: DesktopIconData[] = [
  { appId: 'portfolio', icon: <PortIcon width={92} height={92} />, label: 'My Portfolio App' },
  { appId: 'about', icon: <UserProfile width={32} height={32} />, label: 'About' },
  { appId: 'projects', icon: <ProjectIcon width={42} height={42} />, label: 'Projects' },
  { appId: 'contact', icon: <Contact width={32} height={32} />, label: 'Contact' },
  { appId: 'resume', icon: <Resume width={32} height={32} />, label: 'Resume' },
  { appId: 'edge', icon: <EdeIcon width={32} height={32} />, label: 'Microsoft Edge' },
  { appId: 'store', icon: <StoreIcon width={32} height={32} />, label: 'Microsoft Store' },
  { appId: 'chrome', icon: <ChromeIcon width={32} height={32} />, label: 'Google Chrome' },
  { appId: 'vscode', icon: <VSCodeIcon width={32} height={32} />, label: 'VS Code' },
  { appId: 'explorer', icon: <ExplorerIcon width={32} height={32} />, label: 'File Explorer' },
];