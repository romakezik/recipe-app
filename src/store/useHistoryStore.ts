import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HistoryState {
  historyIds: string[];
  add: (id: string) => void;
}

export const useHistory = create<HistoryState>()(
  persist(
    (set) => ({
      historyIds: [],
      add: (id) =>
        set((state) => {
          const filtered = state.historyIds.filter((i) => i !== id);
          return { historyIds: [id, ...filtered].slice(0, 20) };
        }),
    }),
    { name: "history-storage" },
  ),
);
