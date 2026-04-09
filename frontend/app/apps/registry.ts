// app/apps/registry.ts
import { Terminal } from './terminal/Terminal';
// import { Notepad } from './notepad/Notepad';
import  Paint from './paint/Paint';
// import { Browser } from './browser/Browser';
import Chrome from './Chrome';
import { PortfolioShell } from './portfolio/PortfolioShell';
import { User, FolderOpen, Mail, FileText, Component } from 'lucide-react';
import { ContactPage } from './portfolio/ContactPage';
import { AboutPage } from './portfolio/About';
import { WorksPage } from './portfolio/Works';

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

  paint: {
    component: Paint,
    title: 'Paint',
    icon: '../assets/img/portfolio/windows-terminal.png',
  },

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
  "portfolio": {
    component: PortfolioShell,
    title: ' My Portfolio',
    icon: '../assets/img/portfolio/windows-terminal.png' ,
    defaultMaximized: true, // This app will open maximized by default
  },
  "contact": {
    component: ContactPage,
    title: 'Contact',
    icon: '../assets/img/portfolio/windows-terminal.png' ,
    defaultMaximized: true, // This app will open maximized by default
  },
  "about": {
    component: AboutPage,
    title: 'About',
    icon: '../assets/img/portfolio/windows-terminal.png' ,
    defaultMaximized: true, // This app will open maximized by default
  },
  "projects": {
    component: WorksPage,
    title: 'Projects',
    icon: '../assets/img/portfolio/windows-terminal.png' ,
    defaultMaximized: true, // This app will open maximized by default
  },

};