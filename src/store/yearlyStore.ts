import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { YearlyGoal } from '../types';

interface YearlyState {
  goals: YearlyGoal[];
  year: number;
  addGoal: (title: string) => void;
  removeGoal: (id: string) => void;
  toggleGoal: (id: string) => void;
  setYear: (year: number) => void;
}

export const useYearlyStore = create<YearlyState>()(
  persist(
    (set) => ({
      goals: [],
      year: new Date().getFullYear(),

      addGoal: (title) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              id: crypto.randomUUID(),
              title,
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      toggleGoal: (id) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, completed: !g.completed } : g
          ),
        })),

      setYear: (year) => set({ year }),
    }),
    { name: 'zerob-yearly' }
  )
);
