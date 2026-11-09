'use client';

import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import TaskBoard from '@/components/admin/tasks/TaskBoard';
import { useAdminAuth, AdminLoginScreen } from '@/components/admin/AdminAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AdminTasksPage() {
  const { loading, authed } = useAdminAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] pt-32">
        <LoadingSpinner size="large" className="mx-auto" />
      </div>
    );
  }

  if (!authed) {
    return <AdminLoginScreen />;
  }

  return (
    <AdminLayout activeTab="tasks" onTabChange={(tab) => router.push(`/admin?tab=${tab}`)}>
      <TaskBoard />
    </AdminLayout>
  );
}
