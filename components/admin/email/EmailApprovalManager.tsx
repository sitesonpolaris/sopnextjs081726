'use client';

import { useState, useEffect } from 'react';
import { Mail, Check, X, RefreshCw, Eye, Clock, Calendar, Send } from 'lucide-react';
import { scheduledEmailAPI, supabase, type ScheduledEmail } from '@/lib/admin-data';

export default function EmailApprovalManager() {
  const [emails, setEmails] = useState<ScheduledEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ScheduledEmail | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    try {
      setLoading(true);
      const data = await scheduledEmailAPI.getPendingApproval();
      setEmails(data);
    } catch (error) {
      console.error('Error loading pending emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewEmail = (email: ScheduledEmail) => {
    setSelected(email);
    setEditedSubject(email.generated_subject || '');
    setEditedContent(email.generated_content || '');
    setShowModal(true);
  };

  const handleApprove = async () => {
    if (!selected) return;
    try {
      setProcessing(true);
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error('User not authenticated');
      const hasEdits =
        editedSubject !== selected.generated_subject ||
        editedContent !== selected.generated_content;
      await scheduledEmailAPI.approve(
        selected.id,
        data.user.id,
        hasEdits ? { subject: editedSubject, body: editedContent } : undefined
      );
      alert('Email approved successfully!');
      setShowModal(false);
      setSelected(null);
      loadEmails();
    } catch (error) {
      console.error('Error approving email:', error);
      alert('Failed to approve email');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selected || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    try {
      setProcessing(true);
      await scheduledEmailAPI.reject(selected.id, rejectionReason);
      alert('Email rejected');
      setShowModal(false);
      setSelected(null);
      setRejectionReason('');
      loadEmails();
    } catch (error) {
      console.error('Error rejecting email:', error);
      alert('Failed to reject email');
    } finally {
      setProcessing(false);
    }
  };

  const handleRegenerate = async () => {
    if (!selected) return;
    if (!confirm('Regenerate this email? Current content will be lost.')) return;
    try {
      setProcessing(true);
      await scheduledEmailAPI.delete(selected.id);
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('No active session');
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-client-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify({
          client_id: selected.client_id,
          project_id: selected.project_id,
          template_id: selected.template_id,
          scheduled_date: selected.scheduled_date,
        }),
      });
      if (!response.ok) throw new Error('Failed to regenerate email');
      alert('Email regenerated successfully!');
      setShowModal(false);
      setSelected(null);
      loadEmails();
    } catch (error) {
      console.error('Error regenerating email:', error);
      alert('Failed to regenerate email');
    } finally {
      setProcessing(false);
    }
  };

  const handleSendNow = async () => {
    if (!selected) return;
    if (!confirm('Send this email immediately after approval?')) return;
    try {
      setProcessing(true);
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error('User not authenticated');
      const hasEdits =
        editedSubject !== selected.generated_subject ||
        editedContent !== selected.generated_content;
      await scheduledEmailAPI.approve(
        selected.id,
        data.user.id,
        hasEdits ? { subject: editedSubject, body: editedContent } : undefined
      );
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('No active session');
      const sendResponse = await fetch(`${supabaseUrl}/functions/v1/send-approved-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify({ scheduled_email_id: selected.id }),
      });
      if (!sendResponse.ok) throw new Error('Failed to send email');
      alert('Email approved and sent successfully!');
      setShowModal(false);
      setSelected(null);
      loadEmails();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-zero/10 p-6">
        <p className="text-zero/50">Loading pending emails...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-zero/10 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-zero">Pending Approval</h3>
            <p className="text-zero/50 text-sm">
              {emails.length} email{emails.length !== 1 ? 's' : ''} waiting for review
            </p>
          </div>
          <button
            onClick={loadEmails}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-muted text-zero rounded-lg hover:bg-muted/80 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {emails.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-zero/30 mx-auto mb-4" />
            <p className="text-zero/50 text-lg">No emails pending approval</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emails.map((email) => (
              <div
                key={email.id}
                className="border border-zero/10 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-semibold text-zero text-sm">{email.client?.name}</span>
                      <span className="text-zero/40">•</span>
                      <span className="text-sm text-zero/50">{email.template?.name}</span>
                    </div>
                    <p className="text-sm font-medium text-zero mb-1 break-words">
                      {email.generated_subject}
                    </p>
                    <p className="text-xs text-zero/40 line-clamp-2">
                      {email.generated_content?.substring(0, 150)}...
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zero/40">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(email.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                      {email.scheduled_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(email.scheduled_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewEmail(email)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-fahrenheit text-white rounded-lg hover:bg-fahrenheit/90 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Review
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
                  <h3 className="text-xl font-bold text-zero">Review Email</h3>
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
              <div>
                <label className="block text-sm font-medium text-zero mb-2">Subject Line</label>
                <input
                  type="text"
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-zero/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-fahrenheit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zero mb-2">Email Content</label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-2 border border-zero/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-fahrenheit font-mono text-sm"
                />
              </div>
              <div className="bg-muted rounded-lg p-4">
                <h4 className="text-sm font-semibold text-zero mb-2">Client Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zero/50">Email:</span>{' '}
                    <span className="text-zero">{selected.client?.email}</span>
                  </div>
                  {selected.project && (
                    <div>
                      <span className="text-zero/50">Project:</span>{' '}
                      <span className="text-zero">{selected.project.title}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zero/10 bg-muted space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  Approve
                </button>
                <button
                  onClick={handleSendNow}
                  disabled={processing}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-fahrenheit text-white rounded-lg hover:bg-fahrenheit/90 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  Approve & Send Now
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={processing}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <RefreshCw className="w-5 h-5" />
                  Regenerate
                </button>
              </div>
              <div className="pt-4 border-t border-zero/10">
                <label className="block text-sm font-medium text-zero mb-2">
                  Or reject with reason:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="flex-1 px-4 py-2 border border-zero/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-fahrenheit"
                  />
                  <button
                    onClick={handleReject}
                    disabled={processing || !rejectionReason.trim()}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
