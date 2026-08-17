'use client';

import { useState } from 'react';
import { ChartBar as BarChart3, FileText, Briefcase, MessageSquare, Users, Mail, Send, ChevronDown } from 'lucide-react';
import { AdminSignOutButton } from './AdminAuth';

interface AdminLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const tabs = [
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'consultations', label: 'Consultations', icon: MessageSquare },
  { id: 'contact', label: 'Contact Submissions', icon: Mail },
  { id: 'email-automation', label: 'Email Automation', icon: Send },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout({ activeTab, onTabChange, children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-28 md:pt-32">
      <div className="bg-white/95 backdrop-blur-sm border-b border-zero/10 sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-between py-3">
            <div className="flex items-center gap-1 lg:gap-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-fahrenheit text-white shadow-sm'
                        : 'text-zero/70 hover:text-fahrenheit hover:bg-fahrenheit/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm lg:text-base">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <AdminSignOutButton />
          </div>

          <div className="md:hidden py-3 flex items-center justify-between">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-between w-full px-4 py-3 bg-fahrenheit text-white rounded-lg shadow-sm min-h-[44px]"
            >
              <span className="flex items-center gap-2">
                {activeTabData && <activeTabData.icon className="w-5 h-5" />}
                <span className="font-medium text-sm">{activeTabData?.label || 'Select Tab'}</span>
              </span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AdminSignOutButton />
          </div>

          {mobileOpen && (
            <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white border border-zero/10 rounded-lg overflow-hidden z-50 shadow-xl max-h-[60vh] overflow-y-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setMobileOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-4 text-left transition-all min-h-[48px] ${
                      activeTab === tab.id
                        ? 'bg-fahrenheit text-white'
                        : 'text-zero/80 hover:bg-fahrenheit/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-6 sm:p-6 max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
