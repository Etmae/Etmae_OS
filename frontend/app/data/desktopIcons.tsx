import React from 'react';
import { User, FolderOpen, Mail, FileText } from 'lucide-react';
import VSCodeIcon from '../assets/svgs/vs-code-svgrepo-com.svg?react';
import ChromeIcon from '../assets/svgs/chrome-logo-8793.svg?react';
import StoreIcon from '../assets/svgs/microsoft-store-2022.svg?react';
import ExplorerIcon from '../assets/svgs/file-explorer-windows-25539.svg?react';
import EdeIcon from '../assets/svgs/microsoft-edge-svgrepo-com.svg?react';

export interface DesktopIconData {
  appId: string; // The "Key" that matches the Registry
  icon: React.ReactNode;
  label: string;
  size?: number;
}

export const desktopIcons: DesktopIconData[] = [
  { appId: 'about', icon: <User size={32} />, label: 'About Me' },
  { appId: 'projects', icon: <FolderOpen size={32} />, label: 'Projects' },
  { appId: 'contact', icon: <Mail size={32} />, label: 'Contact' },
  { appId: 'resume', icon: <FileText size={32} />, label: 'Resume' },
  { appId: 'edge', icon: <EdeIcon width={32} height={32} />, label: 'Microsoft Edge' },
  { appId: 'store', icon: <StoreIcon width={32} height={32} />, label: 'Microsoft Store' },
  { appId: 'chrome', icon: <ChromeIcon width={32} height={32} />, label: 'Google Chrome' },
  { appId: 'vscode', icon: <VSCodeIcon width={32} height={32} />, label: 'VS Code' },
  { appId: 'explorer', icon: <ExplorerIcon width={32} height={32} />, label: 'File Explorer' },
];