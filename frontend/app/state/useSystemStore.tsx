// // app/state/useSystemStore.ts
// import { create } from 'zustand';

// type PowerState = 'on' | 'off' | 'restarting';

// interface SystemStore {
//   powerState: PowerState;
//   shutdown: () => void;
//   restart: () => void;
// }

// export const useSystemStore = create<SystemStore>((set) => ({
//   powerState: 'on',
//   shutdown: () => {
//     sessionStorage.removeItem("system_active"); // Remove persistence
//     window.location.reload(); // Force a clean boot state
//   },
//   restart: () => {
//     sessionStorage.removeItem("system_active");
//     window.location.reload();
//   }
// }));