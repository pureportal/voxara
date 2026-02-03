import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  isNavigationBarVisible: boolean;
  toggleNavigationBar: () => void;
  scanHistory: string[];
  addScanHistory: (path: string) => void;
  clearScanHistory: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isNavigationBarVisible: false,
      toggleNavigationBar: () =>
        set((state) => ({
          isNavigationBarVisible: !state.isNavigationBarVisible,
        })),
      scanHistory: [],
      addScanHistory: (path) =>
        set((state) => {
          const newHistory = [
            path,
            ...state.scanHistory.filter((p) => p !== path),
          ].slice(0, 10);
          return { scanHistory: newHistory };
        }),
      clearScanHistory: () => set({ scanHistory: [] }),
    }),
    {
      name: "voxara-ui-storage",
    },
  ),
);
