'use client';

import { useState } from 'react';
import { Mail, FileText, CircleCheck as CheckCircle, Clock, Bug, Users, Radio } from 'lucide-react';
import EmailApprovalManager from './email/EmailApprovalManager';
import EmailTemplateManager from './email/EmailTemplateManager';
import EmailHistoryManager from './email/EmailHistoryManager';
import EmailDiagnosticsManager from './email/EmailDiagnosticsManager';
import BulkEmailManager from './email/BulkEmailManager';
import BroadcastManager from './email/BroadcastManager';

const subTabs = [
  { id: 'pending', label: 'Pending Approval', icon: Clock },
  { id: 'bulk', label: 'Bulk Campaigns', icon: Users },
  { id: 'broadcasts', label: 'Broadcasts', icon: Radio },
  { id: 'templates', label: 'Email Templates', icon: FileText },
  { id: 'sent', label: 'Sent Emails', icon: CheckCircle },
  { id: 'diagnostics', label: 'Diagnostics', icon: Bug },
];

export default function EmailAutomationManager() {
  const [activeSubTab, setActiveSubTab] = useState('pending');

  const renderContent = () => {
    switch (activeSubTab) {
      case 'pending':
        return <EmailApprovalManager />;
      case 'bulk':
        return <BulkEmailManager />;
      case 'broadcasts':
        return <BroadcastManager />;
      case 'templates':
        return <EmailTemplateManager />;
      case 'sent':
        return <EmailHistoryManager />;
      case 'diagnostics':
        return <EmailDiagnosticsManager />;
      default:
        return <EmailApprovalManager />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-zero/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-8 h-8 text-fahrenheit" />
          <div>
            <h2 className="text-2xl font-bold text-zero">Email Automation</h2>
            <p className="text-zero/50 text-sm">
              Manage automated client check-ins and milestone emails
            </p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-zero/10 pb-2 overflow-x-auto scrollbar-hide">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeSubTab === tab.id
                    ? 'bg-fahrenheit text-white'
                    : 'text-zero/70 hover:text-fahrenheit hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
}
