import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabBar from './TabBar';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* iOS 상태바 영역을 가리는 고정 배경 */}
      <div
        className="fixed top-0 left-0 right-0 bg-[#f5f5f7] z-40"
        style={{ height: 'env(safe-area-inset-top, 0px)' }}
      />
      <main
        className="pb-24 max-w-lg mx-auto"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}
