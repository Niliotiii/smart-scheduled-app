import { AppSidebar } from '@/components/AppSidebar';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
