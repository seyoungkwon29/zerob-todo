import { Info, User, RefreshCw, Heart, ExternalLink } from 'lucide-react';

export default function Settings() {
  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-5">설정</h1>

      {/* App Info */}
      <Section title="앱 정보">
        <InfoRow icon={<Info size={18} />} label="버전" value="1.0.0" />
        <InfoRow icon={<RefreshCw size={18} />} label="최근 업데이트" value="2026.04.18" />
      </Section>

      {/* About */}
      <Section title="소개">
        <div className="px-4 py-3">
          <p className="text-sm text-gray-600 leading-relaxed">
            ZeroB Todo는 매일의 루틴 관리, 일정 관리, 연간 목표 추적을 하나의 앱에서 할 수 있도록 만든 개인용 할 일 관리 앱입니다.
          </p>
        </div>
      </Section>

      {/* Developer */}
      <Section title="만든 사람">
        <InfoRow icon={<User size={18} />} label="개발자" value="seyoungkwon29" />
        <InfoRow icon={<Heart size={18} />} label="만든 이유" value="나를 위한 생산성 도구" />
      </Section>

      {/* Update Log */}
      <Section title="업데이트 기록">
        <UpdateRow version="1.0.0" date="2026.04.18" description="첫 번째 릴리즈" />
      </Section>

      {/* Tech Stack */}
      <Section title="기술 스택">
        <div className="px-4 py-3">
          <div className="flex flex-wrap gap-1.5">
            {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand', 'date-fns', 'PWA'].map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Links */}
      <Section title="링크">
        <a
          href="https://github.com/seyoungkwon29/zerob-todo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-3 active:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ExternalLink size={18} className="text-gray-400" />
            <span className="text-sm text-gray-700">GitHub 저장소</span>
          </div>
          <ChevronRightIcon />
        </a>
      </Section>

      <p className="text-center text-xs text-gray-400 mt-6 mb-4">
        Made for personal productivity
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">{title}</h2>
      <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-gray-400">{icon}</span>
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <span className="text-sm text-gray-400">{value}</span>
    </div>
  );
}

function UpdateRow({ version, date, description }: { version: string; date: string; description: string }) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-800">v{version}</span>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
