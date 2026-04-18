import { Outlet } from 'react-router-dom';
import TabBar from './TabBar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <main className="pb-24 max-w-lg mx-auto">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}
