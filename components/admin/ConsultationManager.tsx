'use client';

import { useState, useEffect } from 'react';
import { Eye, Calendar, User, Mail, Phone, Building, X } from 'lucide-react';
import { consultationAPI, type ConsultationSubmission } from '@/lib/admin-data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ConsultationManager() {
  const [consultations, setConsultations] = useState<ConsultationSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ConsultationSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const data = await consultationAPI.getAll();
      setConsultations(data);
    } catch (err) {
      setError('Failed to load consultations');
      console.error('Error loading consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await consultationAPI.updateStatus(id, status);
      await loadConsultations();
      if (selected?.id === id) {
        setSelected({ ...selected, status });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const filtered = statusFilter === 'all' ? consultations : consultations.filter((c) => c.status === statusFilter);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'contacted':
        return 'text-blue-600 bg-blue-100';
      case 'qualified':
        return 'text-green-600 bg-green-100';
      case 'converted':
        return 'text-purple-600 bg-purple-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="medium" className="mx-auto mb-4" />
        <p className="text-zero/60">Loading consultations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl font-bold text-zero">Consultation Management</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-white border border-zero/15 text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {['pending', 'contacted', 'qualified', 'converted', 'rejected'].map((status) => {
          const count = consultations.filter((c) => c.status === status).length;
          return (
            <div key={status} className="bg-white rounded-lg p-4 text-center border border-zero/10">
              <div className={`text-2xl font-bold mb-1 ${getStatusColor(status).split(' ')[0]}`}>
                {count}
              </div>
              <div className="text-zero/60 text-xs md:text-sm capitalize">{status}</div>
            </div>
          );
        })}
      </div>

      <div className="hidden lg:block">
        <div className="bg-white rounded-xl border border-zero/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-zero font-semibold text-sm">Contact</th>
                  <th className="px-6 py-4 text-left text-zero font-semibold text-sm">Company</th>
                  <th className="px-6 py-4 text-left text-zero font-semibold text-sm">Project Type</th>
                  <th className="px-6 py-4 text-left text-zero font-semibold text-sm">Score</th>
                  <th className="px-6 py-4 text-left text-zero font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 text-left text-zero font-semibold text-sm">Date</th>
                  <th className="px-6 py-4 text-left text-zero font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zero/5">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-fahrenheit rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-zero font-medium text-sm">
                            {c.first_name} {c.last_name}
                          </div>
                          <div className="text-zero/50 text-xs flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {c.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-zero text-sm">{c.company_name || 'Not specified'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-zero text-sm capitalize">
                        {c.project_type || 'Not specified'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-fahrenheit font-bold text-lg">{c.quiz_score}</span>
                      <span className="text-zero/40 text-xs ml-1">pts</span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={c.status || 'pending'}
                        onChange={(e) => updateStatus(c.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-fahrenheit ${getStatusColor(c.status || 'pending')}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-zero/60 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(c.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelected(c)}
                        className="p-2 rounded-lg hover:bg-zero/5 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-zero" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="lg:hidden space-y-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-lg p-4 border border-zero/10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-fahrenheit rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-zero font-medium truncate">
                    {c.first_name} {c.last_name}
                  </div>
                  <div className="text-zero/50 text-sm truncate">{c.email}</div>
                </div>
              </div>
              <button
                onClick={() => setSelected(c)}
                className="p-2 rounded-lg hover:bg-zero/5 transition-colors flex-shrink-0"
              >
                <Eye className="w-4 h-4 text-zero" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div>
                <div className="text-zero/50 text-xs">Company</div>
                <div className="text-zero truncate">{c.company_name || 'N/A'}</div>
              </div>
              <div>
                <div className="text-zero/50 text-xs">Score</div>
                <div className="text-fahrenheit font-bold">{c.quiz_score} pts</div>
              </div>
              <div>
                <div className="text-zero/50 text-xs">Date</div>
                <div className="text-zero text-xs">{formatDate(c.created_at)}</div>
              </div>
            </div>
            <select
              value={c.status || 'pending'}
              onChange={(e) => updateStatus(c.id, e.target.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-fahrenheit w-full ${getStatusColor(c.status || 'pending')}`}
            >
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-zero/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zero mb-2">No Consultations Found</h3>
          <p className="text-zero/50">
            {statusFilter === 'all' ? 'No consultation submissions yet.' : `No "${statusFilter}" consultations.`}
          </p>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-zero">Consultation Details</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="text-zero/40 hover:text-zero p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-fahrenheit mb-4">Personal Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-zero/50 text-sm">Name:</span>
                        <p className="text-zero">
                          {selected.first_name} {selected.last_name}
                        </p>
                      </div>
                      <div>
                        <span className="text-zero/50 text-sm">Email:</span>
                        <p className="text-zero">{selected.email}</p>
                      </div>
                      {selected.phone && (
                        <div>
                          <span className="text-zero/50 text-sm">Phone:</span>
                          <p className="text-zero">{selected.phone}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-zero/50 text-sm">How they found us:</span>
                        <p className="text-zero">{selected.how_did_you_find || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-fahrenheit mb-4">Company Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-zero/50 text-sm">Company:</span>
                        <p className="text-zero">{selected.company_name || 'Not specified'}</p>
                      </div>
                      {selected.business_description && (
                        <div>
                          <span className="text-zero/50 text-sm">Business Description:</span>
                          <p className="text-zero">{selected.business_description}</p>
                        </div>
                      )}
                      {selected.target_market && (
                        <div>
                          <span className="text-zero/50 text-sm">Target Market:</span>
                          <p className="text-zero">{selected.target_market}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-fahrenheit mb-4">Project Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-zero/50 text-sm">Project Type:</span>
                        <p className="text-zero capitalize">
                          {selected.project_type || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <span className="text-zero/50 text-sm">Quiz Score:</span>
                        <p className="text-fahrenheit font-bold">{selected.quiz_score} Points</p>
                      </div>
                      {selected.design_tone && (
                        <div>
                          <span className="text-zero/50 text-sm">Design Tone:</span>
                          <p className="text-zero">{selected.design_tone}</p>
                        </div>
                      )}
                      {(selected.standard_pages || []).length > 0 && (
                        <div>
                          <span className="text-zero/50 text-sm">Standard Pages:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(selected.standard_pages || []).map((page, i) => (
                              <span
                                key={i}
                                className="bg-fahrenheit/10 text-fahrenheit px-2 py-1 rounded text-xs"
                              >
                                {page}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {selected.has_domain && (
                    <div>
                      <h4 className="text-lg font-semibold text-fahrenheit mb-4">Domain Information</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-zero/50 text-sm">Has Domain:</span>
                          <p className="text-zero capitalize">{selected.has_domain}</p>
                        </div>
                        {selected.domain_name && (
                          <div>
                            <span className="text-zero/50 text-sm">Domain Name:</span>
                            <p className="text-zero">{selected.domain_name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {(selected.additional_services || []).length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-fahrenheit mb-4">Additional Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selected.additional_services || []).map((service, i) => (
                      <span
                        key={i}
                        className="bg-fahrenheit/10 text-fahrenheit px-3 py-1 rounded-lg text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-zero/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-zero/50 text-sm">Status:</span>
                    <select
                      value={selected.status || 'pending'}
                      onChange={(e) => updateStatus(selected.id, e.target.value)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-fahrenheit ${getStatusColor(selected.status || 'pending')}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <span className="text-zero/50 text-sm">
                    Submitted: {formatDate(selected.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
