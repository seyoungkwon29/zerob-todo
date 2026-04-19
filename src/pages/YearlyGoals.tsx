import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { differenceInDays, endOfYear, startOfYear } from 'date-fns';
import { useYearlyStore } from '../store/yearlyStore';

function getEncouragement(progress: number, daysProgress: number): string {
  if (progress === 100) return '모든 목표를 달성했어요! 정말 대단합니다!';
  if (progress >= 80) return '거의 다 왔어요! 마지막까지 힘내세요!';
  if (progress >= 60) return '절반 이상 해냈어요! 이 기세를 유지하세요!';
  if (progress >= daysProgress) return '시간 대비 잘 하고 있어요! 꾸준히 가요!';
  if (progress >= 30) return '조금만 더 속도를 내볼까요? 할 수 있어요!';
  if (progress > 0) return '시작이 반이에요! 하나씩 해나가요!';
  return '올해의 목표를 세워보세요!';
}

export default function YearlyGoals() {
  const { goals, addGoal, removeGoal, toggleGoal } = useYearlyStore();
  const [input, setInput] = useState('');

  const now = new Date();
  const year = now.getFullYear();
  const yearStart = startOfYear(now);
  const yearEnd = endOfYear(now);
  const totalDays = differenceInDays(yearEnd, yearStart) + 1;
  const elapsedDays = differenceInDays(now, yearStart) + 1;
  const remainingDays = totalDays - elapsedDays;
  const daysProgress = Math.round((elapsedDays / totalDays) * 100);

  const completedCount = goals.filter((g) => g.completed).length;
  const total = goals.length;
  const progress = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addGoal(trimmed);
    setInput('');
  };

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{year}년 목표</h1>
      <p className="text-sm text-gray-500 mb-5">남은 날: {remainingDays}일</p>

      {/* Progress Card */}
      <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500">목표 달성률</p>
            <p className="text-3xl font-bold text-gray-900">{progress}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">시간 경과</p>
            <p className="text-3xl font-bold text-gray-300">{daysProgress}%</p>
          </div>
        </div>

        {/* Dual Progress Bars */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[11px] text-gray-400 mb-0.5">
              <span>목표 진척도</span>
              <span>{completedCount}/{total}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gray-800 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-gray-400 mb-0.5">
              <span>올해 경과</span>
              <span>{elapsedDays}/{totalDays}일</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gray-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${daysProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Encouragement */}
        <p className="text-sm text-center mt-4 font-medium text-gray-600">
          {getEncouragement(progress, daysProgress)}
        </p>
      </div>

      {/* Add Input */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="올해 이루고 싶은 목표..."
          className="flex-1 bg-white rounded-xl px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
        />
        <button
          onClick={handleAdd}
          className="bg-red-500 text-white rounded-xl px-4 py-3 active:bg-red-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm"
          >
            <button
              onClick={() => toggleGoal(goal.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                goal.completed ? 'bg-gray-900 border-gray-900' : 'border-gray-300'
              }`}
            >
              {goal.completed && <Check size={14} className="text-white" />}
            </button>
            <span
              className={`flex-1 text-sm transition-all ${
                goal.completed ? 'line-through-gray' : 'text-gray-800'
              }`}
            >
              {goal.title}
            </span>
            <button
              onClick={() => removeGoal(goal.id)}
              className="text-gray-300 active:text-gray-600 transition-colors p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
            <span className="text-3xl">-</span>
          </div>
          <p className="mt-3 text-sm">올해의 목표를 세워보세요</p>
        </div>
      )}
    </div>
  );
}
