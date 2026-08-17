'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Building2, Calendar, CircleCheck as CheckCircle, Clock, Trash2, TriangleAlert as AlertTriangle, Shield, Ban } from 'lucide-react';
import { contactSubmissionAPI, type ContactSubmission, supabase } from '@/lib/admin-data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ContactSubmissionsManager() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await contactSubmissionAPI.getAll();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await contactSubmissionAPI.updateStatus(id, status);
      await fetchSubmissions();
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const toggleSpamFlag = async (id: string, current: boolean) => {
    try {
      await contactSubmissionAPI.toggleSpamFlag(id, !current);
      await fetchSubmissions();
      if (selected?.id === id) setSelected({ ...selected, spam_flagged: !current });
    } catch (error) {
      console.error('Error toggling spam flag:', error);
    }
  };

  const blockEmail = async (email: string) => {
    if (!confirm(`Block all future submissions from ${email}?`)) return;
    try {
      const { data: authData } = await supabase.auth.getUser();
      await contactSubmissionAPI.blockEmail(email, 'Blocked from admin panel', authData.user?.id || null);
      alert(`Email ${email} has been blocked.`);
    } catch (error) {
      console.error('Error blocking email:', error);
      alert('Failed to block email. It may already be blocked.');
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    try {
      await contactSubmissionAPI.delete(id);
      await fetchSubmissions();
      if (selected?.id === id) setSelected(null);
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const filteredSubmissions =
    filter === 'all'
      ? submissions
      : filter === 'spam'
      ? submissions.filter((s) => s.spam_flagged)
      : submissions.filter((s) => s.status === filter);

  const getSpamIndicators = (s: ContactSubmission): string[] => {
    const indicators: string[] = [];
    if (s.recaptcha_score !== null && s.recaptcha_score < 0.5) {
      indicators.push(`Low reCAPTCHA score: ${s.recaptcha_score.toFixed(2)}`);
    }
    if (s.submission_time_seconds !== null && s.submission_time_seconds < 5) {
      indicators.push(`Fast submission: ${s.submission_time_seconds}s`);
    }
    if (s.honeypot_triggered) indicators.push('Honeypot triggered');
    return indicators;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-fahrenheit text-white';
      case 'contacted':
        return 'bg-sol text-zero';
      case 'completed':
        return 'bg-aluminum text-white';
      default:
        return 'bg-muted text-zero';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl font-bold text-zero">Contact Submissions</h2>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'all', label: 'All' },
            { id: 'new', label: 'New' },
            { id: 'contacted', label: 'Contacted' },
            { id: 'completed', label: 'Completed' },
            { id: 'spam', label: 'Spam' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                filter === f.id
                  ? f.id === 'spam'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-fahrenheit text-white'
                  : 'bg-white text-zero border border-zero/15 hover:bg-muted'
              }`}
            >
              {f.label} (
              {f.id === 'spam'
                ? submissions.filter((s) => s.spam_flagged).length
                : f.id === 'all'
                ? submissions.length
                : submissions.filter((s) => s.status === f.id).length}
              )
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 bg-white border border-zero/10 rounded-lg">
              <p className="text-zero/50">No submissions found</p>
            </div>
          ) : (
            filteredSubmissions.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelected(s)}
                className={`p-4 bg-white border rounded-lg cursor-pointer transition-all hover:border-fahrenheit ${
                  selected?.id === s.id
                    ? 'border-fahrenheit shadow-md'
                    : s.spam_flagged
                    ? 'border-destructive/30 bg-destructive/5'
                    : 'border-zero/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zero">{s.name}</h3>
                      {s.spam_flagged && <AlertTriangle className="w-4 h-4 text-destructive" />}
                    </div>
                    <p className="text-sm text-zero/50">{s.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(s.status)}`}
                  >
                    {s.status}
                  </span>
                </div>
                <p className="text-sm text-zero/60 line-clamp-2 mb-2">{s.message}</p>
                <div className="flex items-center justify-between text-xs text-zero/40">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(s.created_at).toLocaleDateString()}
                  </span>
                  {s.recaptcha_score !== null && (
                    <span
                      className={`flex items-center gap-1 ${
                        s.recaptcha_score < 0.5 ? 'text-destructive font-semibold' : 'text-green-600'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {s.recaptcha_score.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:sticky lg:top-6 h-fit">
          {selected ? (
            <div className="bg-white border border-zero/10 rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-zero">Submission Details</h3>
                <button
                  onClick={() => deleteSubmission(selected.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zero/50">Name</label>
                  <p className="text-zero font-medium">{selected.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zero/50 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-fahrenheit hover:underline font-medium"
                  >
                    {selected.email}
                  </a>
                </div>
                {selected.phone && (
                  <div>
                    <label className="text-sm font-medium text-zero/50 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Phone
                    </label>
                    <a
                      href={`tel:${selected.phone}`}
                      className="text-fahrenheit hover:underline font-medium"
                    >
                      {selected.phone}
                    </a>
                  </div>
                )}
                {selected.company && (
                  <div>
                    <label className="text-sm font-medium text-zero/50 flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      Company
                    </label>
                    <p className="text-zero font-medium">{selected.company}</p>
                  </div>
                )}
                {selected.service && (
                  <div>
                    <label className="text-sm font-medium text-zero/50">Service Interested In</label>
                    <p className="text-zero font-medium">{selected.service}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-zero/50">Message</label>
                  <p className="text-zero whitespace-pre-wrap">{selected.message}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zero/50">Submitted</label>
                  <p className="text-zero">{new Date(selected.created_at).toLocaleString()}</p>
                </div>

                {(selected.recaptcha_score !== null ||
                  selected.submission_time_seconds !== null) && (
                  <div className="pt-4 border-t border-zero/10">
                    <label className="text-sm font-medium text-zero/50 mb-2 block">
                      Spam Indicators
                    </label>
                    <div className="space-y-2">
                      {selected.recaptcha_score !== null && (
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm text-zero/60">reCAPTCHA Score</span>
                          <span
                            className={`text-sm font-semibold ${
                              selected.recaptcha_score < 0.5
                                ? 'text-destructive'
                                : selected.recaptcha_score < 0.7
                                ? 'text-yellow-600'
                                : 'text-green-600'
                            }`}
                          >
                            {selected.recaptcha_score.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {selected.submission_time_seconds !== null && (
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm text-zero/60">Form Fill Time</span>
                          <span
                            className={`text-sm font-semibold ${
                              selected.submission_time_seconds < 5
                                ? 'text-destructive'
                                : 'text-green-600'
                            }`}
                          >
                            {selected.submission_time_seconds}s
                          </span>
                        </div>
                      )}
                      {getSpamIndicators(selected).length > 0 && (
                        <div className="p-2 bg-destructive/5 border border-destructive/20 rounded">
                          <div className="text-sm font-medium text-destructive mb-1">
                            Suspicious Activity:
                          </div>
                          {getSpamIndicators(selected).map((ind, i) => (
                            <div key={i} className="text-xs text-destructive/80">
                              {ind}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-zero/10">
                  <label className="text-sm font-medium text-zero/50 mb-2 block">Spam Management</label>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => toggleSpamFlag(selected.id, selected.spam_flagged)}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                        selected.spam_flagged
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 inline mr-1" />
                      {selected.spam_flagged ? 'Mark as Not Spam' : 'Mark as Spam'}
                    </button>
                    <button
                      onClick={() => blockEmail(selected.email)}
                      className="flex-1 px-4 py-2 text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors rounded-lg"
                    >
                      <Ban className="w-4 h-4 inline mr-1" />
                      Block Email
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-zero/10">
                  <label className="text-sm font-medium text-zero/50 mb-2 block">Update Status</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'new', label: 'New', icon: Clock },
                      { id: 'contacted', label: 'Contacted', icon: Mail },
                      { id: 'completed', label: 'Completed', icon: CheckCircle },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => updateStatus(selected.id, s.id)}
                        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                          selected.status === s.id
                            ? 'bg-fahrenheit text-white'
                            : 'bg-muted text-zero hover:bg-muted/80'
                        }`}
                      >
                        <s.icon className="w-4 h-4 inline mr-1" />
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-zero/10 rounded-lg p-12 text-center">
              <p className="text-zero/50">Select a submission to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
