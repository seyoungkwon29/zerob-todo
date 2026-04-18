import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DailyRoutines from './pages/DailyRoutines';
import CalendarPage from './pages/CalendarPage';
import YearlyGoals from './pages/YearlyGoals';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DailyRoutines />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/goals" element={<YearlyGoals />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
