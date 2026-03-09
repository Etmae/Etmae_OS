// app/components/windows/WindowsManager.tsx
import React from 'react';
import { useWindowStore } from '../../state/useWindowStore';
import { Window } from './Window';

export const WindowsManager: React.FC = () => {
  // We grab the array of IDs. 
  // Because it's an array of strings, this component only re-renders 
  // if a window is opened, closed, or re-ordered (focus changed).
  const windowOrder = useWindowStore((state) => state.windowOrder);

  return (
    <div className="windows-container absolute inset-0 pointer-events-none">
      {/* pointer-events-none on the container ensures we can still 
          click desktop icons behind the windows. 
          The Window component itself will have pointer-events-auto.
      */}
      {windowOrder.map((id) => (
        <div key={id} className="pointer-events-auto">
          <Window id={id} />
        </div>
      ))}
    </div>
  );
};



// import React from 'react';
// import { useWindowStore } from '../../state/useWindowStore';
// import { Window } from './Window';

// export const WindowsManager: React.FC = () => {
//   const windowOrder = useWindowStore((state) => state.windowOrder);

//   return (
//     // The z-20 ensures windows stay above desktop icons but below taskbar
//     <div className="absolute inset-0 pointer-events-none z-20">
//       {windowOrder.map((id) => (
//         <div key={id} className="pointer-events-auto">
//           <Window id={id} />
//         </div>
//       ))}
//     </div>
//   );
// };