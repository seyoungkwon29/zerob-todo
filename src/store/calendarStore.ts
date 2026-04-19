import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalendarEvent, ThemeGroup } from '../types';

const DEFAULT_COLORS = ['#111827', '#4b5563', '#9ca3af', '#374151', '#6b7280', '#d1d5db', '#1f2937'];

interface CalendarState {
  events: CalendarEvent[];
  themes: ThemeGroup[];
  addTheme: (name: string) => void;
  removeTheme: (id: string) => void;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'completed'>) => void;
  removeEvent: (id: string) => void;
  toggleEvent: (id: string) => void;
  moveEvent: (id: string, newStartDate: string, newEndDate: string) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      events: [],
      themes: [],

      addTheme: (name) =>
        set((state) => ({
          themes: [
            ...state.themes,
            {
              id: crypto.randomUUID(),
              name,
              color: DEFAULT_COLORS[state.themes.length % DEFAULT_COLORS.length],
            },
          ],
        })),

      removeTheme: (id) =>
        set((state) => ({
          themes: state.themes.filter((t) => t.id !== id),
          events: state.events.filter((e) => e.themeId !== id),
        })),

      addEvent: (event) =>
        set((state) => ({
          events: [
            ...state.events,
            { ...event, id: crypto.randomUUID(), completed: false },
          ],
        })),

      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      toggleEvent: (id) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, completed: !e.completed } : e
          ),
        })),

      moveEvent: (id, newStartDate, newEndDate) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, startDate: newStartDate, endDate: newEndDate } : e
          ),
        })),
    }),
    { name: 'zerob-calendar' }
  )
);
