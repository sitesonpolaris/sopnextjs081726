'use client';

import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { projectAPI, clientAPI, type Project, type Client } from '@/lib/admin-data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import PaymentManager from './PaymentManager';
import ClientModal from './ClientModal';

interface ProjectFormProps {
  project?: Project | null;
  clients: Client[];
  onSubmit: () => void;
  onCancel: () => void;
  onPaymentsChange?: () => void;
}

const projectStatuses = [
  { value: 'lead_identified', label: 'Lead Identified' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'loom_audit_sent', label: 'Loom Audit Sent' },
  { value: 'call_booked', label: 'Call Booked' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'deposit_received', label: 'Deposit Received' },
  { value: 'website_build', label: 'Website Build' },
  { value: 'retainer_active', label: 'Retainer Active' },
  { value: 'completed_ongoing', label: 'Completed / Ongoing' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function ProjectForm({
  project,
  clients,
  onSubmit,
  onCancel,
  onPaymentsChange,
}: ProjectFormProps) {
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    description: '',
    status: 'proposal_sent' as string,
    website_url: '',
    date_completed: '',
    value: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [localClients, setLocalClients] = useState<Client[]>(clients);

  useEffect(() => {
    setLocalClients(clients);
  }, [clients]);

  useEffect(() => {
    if (project) {
      setFormData({
        client_id: project.client_id,
        title: project.title,
        description: project.description || '',
        status: project.status,
        website_url: project.website_url || '',
        date_completed: project.date_completed || '',
        value: project.value ? project.value.toString() : '',
      });
    }
  }, [project]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'add_new') {
      setShowClientModal(true);
    } else {
      setFormData((prev) => ({ ...prev, client_id: e.target.value }));
    }
  };

  const handleClientCreated = async (clientId: string) => {
    setShowClientModal(false);
    const refreshed = await clientAPI.getAll();
    setLocalClients(refreshed);
    setFormData((prev) => ({ ...prev, client_id: clientId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        date_completed: formData.date_completed || null,
        value: formData.value ? parseFloat(formData.value) : null,
      };

      if (project) {
        await projectAPI.update(project.id, submitData);
      } else {
        await projectAPI.create(submitData);
      }
      onSubmit();
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-zero/15 bg-white text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit focus:border-transparent';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zero">
          {project ? 'Edit Project' : 'Create New Project'}
        </h2>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-zero/5 transition-colors">
          <X className="w-6 h-6 text-zero" />
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-4">Project Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zero mb-2">Client *</label>
              <select
                required
                value={formData.client_id}
                onChange={handleClientChange}
                className={inputClass}
              >
                <option value="">Select a client</option>
                <option value="add_new" className="text-fahrenheit font-semibold">
                  + Add New Client...
                </option>
                <option disabled>──────────</option>
                {localClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zero mb-2">Project Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className={inputClass}
                placeholder="Enter project title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zero mb-2">Status *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className={inputClass}
              >
                {projectStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zero mb-2">Date Completed</label>
              <input
                type="date"
                value={formData.date_completed}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date_completed: e.target.value }))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zero mb-2">Project Value</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zero font-medium">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.value}
                  onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                  className={`${inputClass} pl-8`}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zero mb-2">Website URL</label>
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, website_url: e.target.value }))
                }
                className={inputClass}
                placeholder="https://example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zero mb-2">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className={`${inputClass} resize-y`}
                placeholder="Project description and notes..."
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-muted text-zero rounded-lg font-semibold hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-fahrenheit text-white rounded-lg font-semibold hover:bg-fahrenheit/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <LoadingSpinner size="small" /> : <Save className="w-5 h-5" />}
            {project ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>

      {project && <PaymentManager projectId={project.id} onPaymentsChange={onPaymentsChange} />}

      {showClientModal && (
        <ClientModal
          onSuccess={handleClientCreated}
          onCancel={() => setShowClientModal(false)}
        />
      )}
    </div>
  );
}
