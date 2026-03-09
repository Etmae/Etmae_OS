// // import React from 'react';
// // import { useWindowStore,  } from '../../state/useWindowStore';
// // import type { WindowInstance } from '../../state/useWindowStore';
// // import Window from './Window';
// // import Terminal from '../../apps/terminal/Terminal';
// // import Paint from '../../apps/paint/Paint';
// // import Hero from '../../apps/portfolio/Hero';

// // const Windows: React.FC = () => {
// //   const { windows, previewLayout } = useWindowStore();

// //   const getAppContent = (appId: string) => {
// //     if (appId.includes('terminal')) return <Terminal />;
// //     if (appId.includes('paint')) return <Paint />;
// //     if (appId.includes('hero')) return <Hero />;
// //     return <div className="p-4">App loading...</div>;
// //   };

// //   // Logic for the "Ghost" blue box that appears when hovering over snap options
// //   const getPreviewStyle = () => {
// //     if (!previewLayout) return { display: 'none' };
    
// //     const { layout } = previewLayout;
// //     const base = { 
// //       position: 'fixed' as const, 
// //       zIndex: 9998, 
// //       backgroundColor: 'rgba(0, 103, 192, 0.15)', 
// //       border: '1.5px solid rgba(0, 103, 192, 0.4)', 
// //       transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
// //       backdropFilter: 'blur(4px)',
// //       borderRadius: '8px',
// //       pointerEvents: 'none' as const
// //     };

// //     const margin = 8;
// //     const taskbarHeight = 48; // Adjust based on your actual taskbar height

// //     switch (layout) {
// //       case 'maximized':
// //         return { ...base, top: margin, left: margin, width: `calc(100vw - ${margin * 2}px)`, height: `calc(100vh - ${taskbarHeight + margin}px)` };
// //       case 'snap-left':
// //         return { ...base, top: margin, left: margin, width: `calc(50vw - ${margin * 1.5}px)`, height: `calc(100vh - ${taskbarHeight + margin}px)` };
// //       case 'snap-right':
// //         return { ...base, top: margin, left: `calc(50vw + ${margin / 2}px)`, width: `calc(50vw - ${margin * 1.5}px)`, height: `calc(100vh - ${taskbarHeight + margin}px)` };
// //       default:
// //         return { display: 'none' };
// //     }
// //   };

// //   return (
// //     <div className="fixed inset-0 pointer-events-none">
// //       {/* Ghost Preview Box */}
// //       <div style={getPreviewStyle()} />
      
// //       {/* Active Windows */}
// //       {windows.filter(w => !w.isMinimized).map((win) => (
// //         <div key={win.id} className="pointer-events-auto">
// //           <Window window={win}>
// //             {getAppContent(win.id)}
// //           </Window>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default Windows;

// // FILE 1: app/components/windows/Windows.tsx
// import React from 'react';
// import { useWindowStore } from '../../state/useWindowStore';
// import Window from './Window';
// import Terminal from '../../apps/terminal/Terminal';
// import Paint from '../../apps/paint/Paint';
// import Hero from '../../apps/portfolio/Hero';

// const Windows: React.FC = () => {
//   const { windows, previewLayout } = useWindowStore();

//   const getAppContent = (appId: string) => {
//     if (appId.includes('terminal')) return <Terminal />;
//     if (appId.includes('paint')) return <Paint />;
//     if (appId.includes('hero')) return <Hero />;
//     return <div className="p-4">App loading...</div>;
//   };

//   const getPreviewStyle = () => {
//     if (!previewLayout) return { display: 'none' };
//     const { layout } = previewLayout;
//     const base = { 
//       position: 'fixed' as const, 
//       zIndex: 9998, 
//       backgroundColor: 'rgba(0, 103, 192, 0.1)', 
//       border: '2px solid rgba(0, 103, 192, 0.3)', 
//       transition: 'all 0.2s ease',
//       pointerEvents: 'none' as const
//     };
    
//     if (layout === 'maximized') {
//       return { ...base, top: 8, left: 8, width: 'calc(100vw - 16px)', height: 'calc(100vh - 64px)', borderRadius: 8 };
//     }
//     if (layout === 'snap-left') {
//       return { ...base, top: 8, left: 8, width: 'calc(50vw - 12px)', height: 'calc(100vh - 64px)', borderRadius: 8 };
//     }
//     if (layout === 'snap-right') {
//       return { ...base, top: 8, left: 'calc(50vw + 4px)', width: 'calc(50vw - 12px)', height: 'calc(100vh - 64px)', borderRadius: 8 };
//     }
//     return { display: 'none' };
//   };

//   return (
//     <>
//       {/* Preview overlay */}
//       <div style={getPreviewStyle()} />
      
//       {/* All windows */}
//       {windows.map((win) => (
//         <Window key={win.id} window={win}>
//           {getAppContent(win.id)}
//         </Window>
//       ))}
//     </>
//   );
// };

// export default Windows;
