'use client';

import { useState, useEffect } from 'react';
import { Mail, CircleCheck as CheckCircle, Calendar, Eye, X } from 'lucide-react';
import { scheduledEmailAPI, type ScheduledEmail } from '@/lib/admin-data';

export default function EmailHistoryManager() {
  const [emails, setEmails] = useState<ScheduledEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ScheduledEmail | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    try {
      setLoading(true);
      const data = await scheduledEmailAPI.getByStatus('sent');
      setEmails(data);
    } catch (error) {
      console.error('Error loading sent emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (email: ScheduledEmail) => {
    setSelected(email);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-zero/10 p-6">
        <p className="text-zero/50">Loading sent emails...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-zero/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-zero">Sent Emails</h3>
            <p className="text-zero/50 text-sm">
              {emails.length} email{emails.length !== 1 ? 's' : ''} sent
            </p>
          </div>
        </div>

        {emails.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-zero/30 mx-auto mb-4" />
            <p className="text-zero/50 text-lg">No emails sent yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emails.map((email) => (
              <div key={email.id} className="border border-zero/10 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-zero text-sm">{email.client?.name}</span>
                      <span className="text-zero/40">•</span>
                      <span className="text-sm text-zero/50">{email.template?.name}</span>
                    </div>
                    <p className="text-sm font-medium text-zero mb-1 break-words">
                      {email.generated_subject}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-zero/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Sent{' '}
                        {email.sent_at &&
                          new Date(email.sent_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleView(email)}
                    className="flex items-center gap-2 px-4 py-2 bg-muted text-zero rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-none sm:rounded-lg shadow-xl max-w-4xl w-full min-h-screen sm:min-h-0 sm:my-8">
            <div className="p-6 border-b border-zero/10">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-xl font-bold text-zero">Sent Email</h3>
                  <p className="text-zero/50 text-xs mt-1 truncate">
                    {selected.client?.name} • {selected.template?.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelected(null);
                  }}
                  className="text-zero/40 hover:text-zero p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Email Sent Successfully</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Sent to {selected.client?.email} on{' '}
                  {selected.sent_at &&
                    new Date(selected.sent_at).toLocaleString('en-US', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zero mb-2">Subject Line</label>
                <div className="px-4 py-3 bg-muted rounded-lg">{selected.generated_subject}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zero mb-2">Email Content</label>
                <div className="px-4 py-3 bg-muted rounded-lg whitespace-pre-wrap">
                  {selected.generated_content}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-zero/10 bg-muted flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelected(null);
                }}
                className="px-6 py-2 bg-muted text-zero rounded-lg hover:bg-zero/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
