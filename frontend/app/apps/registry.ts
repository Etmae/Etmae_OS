// app/apps/registry.ts
import React from "react";
import { Terminal } from "./terminal/Terminal";
// import { Notepad } from './notepad/Notepad';
import Paint from "./paint/Paint";
// import { Browser } from './browser/Browser';
import Chrome from "./Chrome";
import { PortfolioShell } from "./portfolio/PortfolioShell";
import { User, FolderOpen, Mail, FileText, Component } from "lucide-react";
import { ContactPage } from "./portfolio/ContactPage";
import { AboutPage } from "./portfolio/About";
import { WorksPage } from "./portfolio/Works";
import Assistant from "./assistant/Assistant";
import ResumeApp from "./resume/resume";



// Taskbar and Windows titlebar Icon Imports
import AssistantIcon from "../assets/svgs/Chatbox.svg?react";
import TerminalIcon from "../assets/icons/TerminalIcon.svg?react";
import PortIcon from "../assets/svgs/Logoimage.svg?react";
import ContactIcon from "../assets/icons/ContactIcon.svg?react";
import AboutIcon from "../assets/icons/AboutIcon.svg?react";
import ProjectIcon from "../assets/icons/Project.svg?react";
import PaintIcon from "../assets/icons/PaintIcon.svg?react";
import type { DesktopIconData } from "@/data/desktopIcons";
import ResumeIcon from '../assets/icons/ResumeIcon.svg?react';



export interface AppConfig {
  component: React.ComponentType<any>;
  appId?: DesktopIconData['appId']; // Optional appId for easier reference, should match the desktop icon's appId if provided
  title: string;
  icon?: string | React.ComponentType<any>;
  defaultMaximized?: boolean; // New property to indicate if the app should open maximized by default
}

// Custom colored FileText icon for Resume
import { FileText as FileTextIcon } from 'lucide-react';

const ResumeIconColored = () => React.createElement(
  FileTextIcon, 
  { className: 'text-yellow-500', size: 24 }
);

export const APP_REGISTRY: Record<string, AppConfig> = {
  terminal: {
    component: Terminal,
    title: "Terminal",
    icon: TerminalIcon,
  },

  chrome: {
    component: Chrome,
    title: "Chrome",
    icon: "../assets/img/portfolio/windows-terminal.png",
  },

  assistant: {
    component: Assistant,
    title: "Etmae AI",
    icon: AssistantIcon,
    defaultMaximized: true, // This app will open maximized by default
  },

  paint: {
    component: Paint,
    title: "Paint",
    icon: PaintIcon,
    defaultMaximized: true, // This app will open maximized by default
  },

  portfolio: {
    component: PortfolioShell,
    title: " My Portfolio",
    icon: PortIcon,
    defaultMaximized: true, // This app will open maximized by default
  },
  contact: {
    component: ContactPage,
    title: "Contact",
    icon: ContactIcon,
    defaultMaximized: true, // This app will open maximized by default
  },
  about: {
    component: AboutPage,
    title: "About",
    icon: AboutIcon,
    defaultMaximized: true, // This app will open maximized by default
  },
  projects: {
    component: WorksPage,
    title: "Projects",
    icon: ProjectIcon,
    defaultMaximized: true, // This app will open maximized by default
  },
  resume: {
    component: ResumeApp,
    title: "Resume",
    icon: ResumeIconColored,
    defaultMaximized: true, // This app will open maximized by default
  },
};
