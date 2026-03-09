import React from 'react';
import { Code, FileText } from 'lucide-react';

export interface RecentFile {
  name: string;
  time: string;
  icon: React.ReactNode;
}

export const recentFiles: RecentFile[] = [
  { name: 'WindowsDesktop.tsx', time: '9h ago', icon: React.createElement(Code, { size: 20, className: "text-blue-400" }) },
  { name: 'Screenshot 2025-11-26 235312', time: '1m ago', icon: React.createElement(FileText, { size: 20, className: "text-green-400" }) },
  { name: 'Format_Character_In_Word', time: '13h ago', icon: React.createElement(FileText, { size: 20, className: "text-blue-500" }) },
  { name: 'Screenshot 2025-11-26 234738', time: '6m ago', icon: React.createElement(FileText, { size: 20, className: "text-green-400" }) },
];