export interface DailyRoutine {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface ThemeGroup {
  id: string;
  name: string;
  color: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  themeId: string;
  startDate: string;
  endDate: string;
  completed: boolean;
}

export interface YearlyGoal {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}
