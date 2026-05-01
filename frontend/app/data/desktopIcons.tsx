import React from 'react';
import { FileText } from 'lucide-react'; 
import AboutIcon from '../assets/icons/AboutIcon.svg?react';
import ContactIcon from '../assets/icons/ContactIcon.svg?react';
import ProjectIcon from '../assets/icons/Project.svg?react';
import VSCodeIcon from '../assets/svgs/vs-code-svgrepo-com.svg?react';
import ChromeIcon from '../assets/svgs/chrome-logo-8793.svg?react';
import StoreIcon from '../assets/svgs/microsoft-store-2022.svg?react';
import ExplorerIcon from '../assets/svgs/file-explorer-windows-25539.svg?react';
import EdeIcon from '../assets/icons/EdgeIcon.svg?react';
import PortIcon from '../assets/svgs/Logoimage.svg?react';
import ChatIcon from '../assets/svgs/Chatbox.svg?react';
import PaintIcon from '../assets/icons/PaintIcon.svg?react';


export interface DesktopIconData {
  appId: string; // The "Key" that matches the Registry
  icon: React.ReactNode;
  label: string;
  size?: number;
}

export const desktopIcons: DesktopIconData[] = [
  { appId: 'portfolio', icon: <PortIcon width={92} height={92} />, label: 'My Portfolio App' },
  { appId: 'about', icon: <AboutIcon width={32} height={32} />, label: 'About' },
  { appId: 'projects', icon: <ProjectIcon width={32} height={32} />, label: 'Projects' },
  { appId: 'contact', icon: <ContactIcon width={32} height={32} />, label: 'Contact' },
  { appId: 'resume', icon: <FileText width={52} height={52} color='yellow'/>, label: 'Resume' },
  { appId: 'edge', icon: <EdeIcon width={32} height={32} />, label: 'Microsoft Edge' },
  { appId: 'store', icon: <StoreIcon width={32} height={32} />, label: 'Microsoft Store' },
  { appId: 'chrome', icon: <ChromeIcon width={32} height={32} />, label: 'Google Chrome' },
  { appId: 'vscode', icon: <VSCodeIcon width={32} height={32} />, label: 'VS Code' },
  { appId: 'explorer', icon: <ExplorerIcon width={32} height={32} />, label: 'File Explorer' },
  {appId: 'assistant', icon: <ChatIcon width={42} height={42} />, label: 'Etmae AI Assistant' },
  {appId: 'paint', icon: <PaintIcon width={42} height={42} />, label: 'Paint' },

];