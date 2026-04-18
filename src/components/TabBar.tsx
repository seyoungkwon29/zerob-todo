import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, CheckSquare, Target, Settings } from 'lucide-react';

const tabs = [
  { path: '/', icon: CheckSquare, label: '매일 할 일' },
  { path: '/calendar', icon: CalendarDays, label: '달력' },
  { path: '/goals', icon: Target, label: '목표' },
  { path: '/settings', icon: Settings, label: '설정' },
];

export default function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
                active ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              <tab.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
