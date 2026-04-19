import { useState, useRef } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  parseISO,
  differenceInDays,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Trash2, Check, X, Tag, GripVertical } from 'lucide-react';
import { useCalendarStore } from '../store/calendarStore';

export default function CalendarPage() {
  const {
    events, themes,
    addTheme, removeTheme,
    addEvent, removeEvent, toggleEvent, moveEvent,
  } = useCalendarStore();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddTheme, setShowAddTheme] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTheme, setNewEventTheme] = useState('');
  const [newEventStart, setNewEventStart] = useState('');
  const [newEventEnd, setNewEventEnd] = useState('');

  // Long press for moving events
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [movingEvent, setMovingEvent] = useState<string | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDay = (date: Date) =>
    events.filter((e) =>
      isWithinInterval(date, {
        start: parseISO(e.startDate),
        end: parseISO(e.endDate),
      })
    );

  const getThemeColor = (themeId: string) =>
    themes.find((t) => t.id === themeId)?.color || '#6b7280';

  const handleDayClick = (date: Date) => {
    if (movingEvent) {
      const evt = events.find((e) => e.id === movingEvent);
      if (evt) {
        const duration = differenceInDays(parseISO(evt.endDate), parseISO(evt.startDate));
        const newStart = format(date, 'yyyy-MM-dd');
        const newEnd = format(addDays(date, duration), 'yyyy-MM-dd');
        moveEvent(movingEvent, newStart, newEnd);
      }
      setMovingEvent(null);
      return;
    }
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    if (!newEventTitle.trim() || !newEventTheme || !newEventStart || !newEventEnd) return;
    addEvent({
      title: newEventTitle.trim(),
      themeId: newEventTheme,
      startDate: newEventStart,
      endDate: newEventEnd,
    });
    setNewEventTitle('');
    setNewEventTheme('');
    setNewEventStart('');
    setNewEventEnd('');
    setShowAddEvent(false);
  };

  const handleAddTheme = () => {
    if (!newThemeName.trim()) return;
    addTheme(newThemeName.trim());
    setNewThemeName('');
    setShowAddTheme(false);
  };

  const handleEventLongPress = (eventId: string) => {
    longPressTimer.current = setTimeout(() => {
      setMovingEvent(eventId);
    }, 600);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-5">달력</h1>

      {movingEvent && (
        <div className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-700">이동할 날짜를 선택하세요</span>
          <button onClick={() => setMovingEvent(null)} className="text-gray-500">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Calendar Header */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-5">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 text-gray-500">
            <ChevronLeft size={20} />
          </button>
          <span className="text-base font-semibold text-gray-800">
            {format(currentMonth, 'yyyy년 M월', { locale: ko })}
          </span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 text-gray-500">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 border-t border-gray-100">
          {weekDays.map((d, i) => (
            <div key={d} className={`text-center text-xs font-medium py-2 ${i === 0 ? 'text-gray-500' : i === 6 ? 'text-gray-500' : 'text-gray-400'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((d, i) => {
            const isCurrentMonth = isSameMonth(d, currentMonth);
            const isToday = isSameDay(d, new Date());
            const isSelected = selectedDate && isSameDay(d, selectedDate);
            const dayEvents = getEventsForDay(d);

            return (
              <button
                key={i}
                onClick={() => handleDayClick(d)}
                className={`relative h-12 flex flex-col items-center justify-start pt-1.5 transition-colors ${
                  !isCurrentMonth ? 'opacity-30' : ''
                } ${isSelected ? 'bg-gray-100' : ''}`}
              >
                <span
                  className={`text-xs w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-gray-900 text-white font-bold' : 'text-gray-700'
                  }`}
                >
                  {format(d, 'd')}
                </span>
                <div className="flex gap-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: getThemeColor(e.themeId) }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme & Add Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowAddTheme(true)}
          className="flex-1 bg-white rounded-xl py-2.5 text-sm font-medium text-gray-600 shadow-sm active:bg-gray-50 flex items-center justify-center gap-1.5"
        >
          <Tag size={16} /> 테마 관리
        </button>
        <button
          onClick={() => {
            if (themes.length === 0) {
              alert('먼저 테마를 추가해주세요!');
              return;
            }
            setShowAddEvent(true);
            if (selectedDate) {
              setNewEventStart(format(selectedDate, 'yyyy-MM-dd'));
              setNewEventEnd(format(selectedDate, 'yyyy-MM-dd'));
            }
          }}
          className="flex-1 bg-red-500 rounded-xl py-2.5 text-sm font-medium text-white shadow-sm active:bg-red-600 flex items-center justify-center gap-1.5"
        >
          <Plus size={16} /> 할 일 추가
        </button>
      </div>

      {/* Theme Management Modal */}
      {showAddTheme && (
        <Modal onClose={() => setShowAddTheme(false)} title="테마 관리">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTheme()}
              placeholder="테마 이름 (예: 운동, 공부)"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
            <button onClick={handleAddTheme} className="bg-red-500 text-white rounded-lg px-3 py-2">
              <Plus size={18} />
            </button>
          </div>
          <div className="space-y-2">
            {themes.map((theme) => (
              <div key={theme.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.color }} />
                  <span className="text-sm">{theme.name}</span>
                </div>
                <button onClick={() => removeTheme(theme.id)} className="text-gray-400 active:text-gray-600">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {themes.length === 0 && <p className="text-sm text-gray-400 text-center py-4">등록된 테마가 없습니다</p>}
          </div>
        </Modal>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <Modal onClose={() => setShowAddEvent(false)} title="할 일 추가">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">테마</label>
              <select
                value={newEventTheme}
                onChange={(e) => setNewEventTheme(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
              >
                <option value="">테마 선택</option>
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">할 일</label>
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="할 일을 입력하세요"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <div className="overflow-hidden">
              <label className="text-xs font-medium text-gray-500 mb-1 block">시작일</label>
              <input
                type="date"
                value={newEventStart}
                onChange={(e) => setNewEventStart(e.target.value)}
                className="w-full max-w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 box-border"
              />
            </div>
            <div className="overflow-hidden">
              <label className="text-xs font-medium text-gray-500 mb-1 block">종료일</label>
              <input
                type="date"
                value={newEventEnd}
                onChange={(e) => setNewEventEnd(e.target.value)}
                className="w-full max-w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 box-border"
              />
            </div>
            <button
              onClick={handleAddEvent}
              className="w-full bg-red-500 text-white rounded-lg py-2.5 text-sm font-medium active:bg-red-600 mt-2"
            >
              추가하기
            </button>
          </div>
        </Modal>
      )}

      {/* Selected Day Events */}
      {selectedDate && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            {format(selectedDate, 'M월 d일 (EEEE)', { locale: ko })}
          </h2>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">이 날에 등록된 할 일이 없습니다</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm"
                  onTouchStart={() => handleEventLongPress(event.id)}
                  onTouchEnd={cancelLongPress}
                  onTouchCancel={cancelLongPress}
                  onMouseDown={() => handleEventLongPress(event.id)}
                  onMouseUp={cancelLongPress}
                  onMouseLeave={cancelLongPress}
                >
                  <div className="w-1 h-8 rounded-full" style={{ backgroundColor: getThemeColor(event.themeId) }} />
                  <button
                    onClick={() => toggleEvent(event.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      event.completed ? 'bg-gray-900 border-gray-900' : 'border-gray-300'
                    }`}
                  >
                    {event.completed && <Check size={12} className="text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${event.completed ? 'line-through-gray' : 'text-gray-800'}`}>
                      {event.title}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {themes.find((t) => t.id === event.themeId)?.name} · {event.startDate} ~ {event.endDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <GripVertical size={14} className="text-gray-300" />
                    <button onClick={() => removeEvent(event.id)} className="text-gray-300 active:text-gray-600 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative bg-white rounded-t-2xl w-full max-w-lg max-h-[85vh] flex flex-col mb-[calc(3.5rem+env(safe-area-inset-bottom,0px))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 pb-2 shrink-0">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400">
            <X size={20} />
          </button>
        </div>
        <div
          className="overflow-y-auto overflow-x-hidden px-4 pb-4"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 16px))' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
