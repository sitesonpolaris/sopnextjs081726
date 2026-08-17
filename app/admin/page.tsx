'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import PortfolioManager from '@/components/admin/PortfolioManager';
import BlogManager from '@/components/admin/BlogManager';
import ClientProjectManager from '@/components/admin/ClientProjectManager';
import ConsultationManager from '@/components/admin/ConsultationManager';
import ContactSubmissionsManager from '@/components/admin/ContactSubmissionsManager';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import EmailAutomationManager from '@/components/admin/EmailAutomationManager';
import { useAdminAuth, AdminLoginScreen } from '@/components/admin/AdminAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AdminPage() {
  const { loading, authed } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('clients');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] pt-32">
        <div className="text-center">
          <LoadingSpinner size="large" className="mx-auto mb-4" />
          <p className="text-zero/60">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return <AdminLoginScreen />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'portfolio':
        return <PortfolioManager />;
      case 'blog':
        return <BlogManager />;
      case 'clients':
        return <ClientProjectManager />;
      case 'consultations':
        return <ConsultationManager />;
      case 'contact':
        return <ContactSubmissionsManager />;
      case 'email-automation':
        return <EmailAutomationManager />;
      case 'analytics':
        return <AnalyticsDashboard />;
      default:
        return <ClientProjectManager />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTabContent()}
    </AdminLayout>
  );
}
