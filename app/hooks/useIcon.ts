// src/components/icons.tsx
import React from 'react';
import VSCodeIcon from '../assets/svgs/vs-code-svgrepo-com.svg?react';
import EdgeIcon from '../assets/svgs/microsoft-edge-svgrepo-com.svg?react';
import ChromeIcon from '../assets/svgs/chrome-logo-8793.svg?react';
import StoreIcon from '../assets/svgs/microsoft-store-2022.svg?react';
import ExplorerIcon from '../assets/svgs/file-explorer-windows-25539.svg?react';

interface SVGIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const withSize = (Icon: React.FC<React.SVGProps<SVGSVGElement>>) => {
  return ({ size = 24, ...props }: SVGIconProps) => React.createElement(Icon, { width: size, height: size, ...props });
};

// Wrapped SVGs
export const VSCode = withSize(VSCodeIcon);
export const Edge = withSize(EdgeIcon);
export const Chrome = withSize(ChromeIcon);
export const Store = withSize(StoreIcon);
export const Explorer = withSize(ExplorerIcon);
