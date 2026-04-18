import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DailyRoutine } from '../types';

interface DailyState {
  routines: DailyRoutine[];
  lastResetDate: string;
  addRoutine: (title: string) => void;
  removeRoutine: (id: string) => void;
  toggleRoutine: (id: string) => void;
  resetDaily: () => void;
}

const getToday = () => new Date().toISOString().split('T')[0];

export const useDailyStore = create<DailyState>()(
  persist(
    (set, get) => ({
      routines: [],
      lastResetDate: getToday(),

      addRoutine: (title) =>
        set((state) => ({
          routines: [
            ...state.routines,
            {
              id: crypto.randomUUID(),
              title,
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      removeRoutine: (id) =>
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
        })),

      toggleRoutine: (id) =>
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === id ? { ...r, completed: !r.completed } : r
          ),
        })),

      resetDaily: () => {
        const today = getToday();
        if (get().lastResetDate !== today) {
          set((state) => ({
            lastResetDate: today,
            routines: state.routines.map((r) => ({ ...r, completed: false })),
          }));
        }
      },
    }),
    { name: 'zerob-daily' }
  )
);
