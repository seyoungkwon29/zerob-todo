import { useEffect, useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { useDailyStore } from '../store/dailyStore';

export default function DailyRoutines() {
  const { routines, addRoutine, removeRoutine, toggleRoutine, resetDaily } = useDailyStore();
  const [input, setInput] = useState('');

  useEffect(() => {
    resetDaily();
  }, [resetDaily]);

  const completedCount = routines.filter((r) => r.completed).length;
  const total = routines.length;
  const progress = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addRoutine(trimmed);
    setInput('');
  };

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">매일 할 일</h1>
      <p className="text-sm text-gray-500 mb-5">오늘도 화이팅!</p>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-4 mb-5 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">오늘의 진척도</span>
          <span className="text-2xl font-bold text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gray-800 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {total === 0
            ? '할 일을 추가해보세요'
            : completedCount === total
              ? '모든 루틴을 완료했어요!'
              : `${completedCount}/${total} 완료`}
        </p>
      </div>

      {/* Add Input */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="새로운 루틴 추가..."
          className="flex-1 bg-white rounded-xl px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
        />
        <button
          onClick={handleAdd}
          className="bg-red-500 text-white rounded-xl px-4 py-3 active:bg-red-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Routine List */}
      <div className="space-y-2">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className="bg-white rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm"
          >
            <button
              onClick={() => toggleRoutine(routine.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                routine.completed
                  ? 'bg-gray-900 border-gray-900'
                  : 'border-gray-300'
              }`}
            >
              {routine.completed && <Check size={14} className="text-white" />}
            </button>
            <span
              className={`flex-1 text-sm transition-all ${
                routine.completed ? 'line-through-gray' : 'text-gray-800'
              }`}
            >
              {routine.title}
            </span>
            <button
              onClick={() => removeRoutine(routine.id)}
              className="text-gray-300 active:text-gray-600 transition-colors p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {routines.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <CheckSquareIcon />
          <p className="mt-3 text-sm">아직 등록된 루틴이 없습니다</p>
        </div>
      )}
    </div>
  );
}

function CheckSquareIcon() {
  return (
    <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
      <Check size={32} className="text-gray-300" />
    </div>
  );
}
