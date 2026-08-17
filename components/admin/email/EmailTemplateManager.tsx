'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, CreditCard as Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { emailTemplateAPI, type EmailTemplate } from '@/lib/admin-data';

export default function EmailTemplateManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'check-in',
    ai_prompt: '',
    subject_template: '',
    timing_config: {},
    active: true,
    approval_required: true,
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await emailTemplateAPI.getAll();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setFormData({
      name: '',
      type: 'check-in',
      ai_prompt: '',
      subject_template: '',
      timing_config: {},
      active: true,
      approval_required: true,
    });
    setShowModal(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditing(template);
    setFormData({
      name: template.name,
      type: template.type,
      ai_prompt: template.ai_prompt,
      subject_template: template.subject_template,
      timing_config: template.timing_config,
      active: template.active,
      approval_required: template.approval_required,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await emailTemplateAPI.update(editing.id, formData);
      } else {
        await emailTemplateAPI.create(formData);
      }
      setShowModal(false);
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    }
  };

  const handleToggleActive = async (template: EmailTemplate) => {
    try {
      await emailTemplateAPI.toggleActive(template.id, !template.active);
      loadTemplates();
    } catch (error) {
      console.error('Error toggling template:', error);
    }
  };

  const handleDelete = async (template: EmailTemplate) => {
    if (!confirm(`Delete "${template.name}"?`)) return;
    try {
      await emailTemplateAPI.delete(template.id);
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template. It may be in use.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-zero/10 p-6">
        <p className="text-zero/50">Loading templates...</p>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-2 border border-zero/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-fahrenheit';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-zero/10 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-zero">Email Templates</h3>
            <p className="text-zero/50 text-sm">Manage templates for automated client emails</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-fahrenheit text-white rounded-lg hover:bg-fahrenheit/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Template
          </button>
        </div>

        <div className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 ${
                template.active ? 'border-zero/10' : 'border-zero/10 bg-muted/50 opacity-75'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-semibold text-zero text-sm">{template.name}</h4>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        template.type === 'milestone'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {template.type === 'milestone' ? 'Milestone' : 'Check-in'}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        template.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {template.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-zero/50 mb-2 break-words">{template.subject_template}</p>
                  <p className="text-xs text-zero/40 line-clamp-2">
                    {template.ai_prompt.substring(0, 200)}...
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleToggleActive(template)}
                    className={`p-2 rounded-lg transition-colors ${
                      template.active
                        ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                    }`}
                    title={template.active ? 'Deactivate' : 'Activate'}
                  >
                    {template.active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template)}
                    className="p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-none sm:rounded-lg shadow-xl max-w-3xl w-full min-h-screen sm:min-h-0 sm:my-8">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-zero/10">
                <h3 className="text-xl font-bold text-zero">
                  {editing ? 'Edit Template' : 'Create New Template'}
                </h3>
              </div>
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-zero mb-2">Template Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zero mb-2">Template Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={inputClass}
                    required
                  >
                    <option value="check-in">Check-in</option>
                    <option value="milestone">Milestone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zero mb-2">
                    Subject Line Template *
                  </label>
                  <input
                    type="text"
                    value={formData.subject_template}
                    onChange={(e) =>
                      setFormData({ ...formData, subject_template: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Use {client_name}, {company_name}, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zero mb-2">AI Prompt *</label>
                  <textarea
                    value={formData.ai_prompt}
                    onChange={(e) => setFormData({ ...formData, ai_prompt: e.target.value })}
                    rows={8}
                    className={`${inputClass} font-mono text-sm`}
                    placeholder="Instructions for AI to generate personalized email content..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 rounded text-fahrenheit focus:ring-fahrenheit"
                    />
                    <span className="text-sm text-zero">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.approval_required}
                      onChange={(e) =>
                        setFormData({ ...formData, approval_required: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-fahrenheit focus:ring-fahrenheit"
                    />
                    <span className="text-sm text-zero">Requires Approval</span>
                  </label>
                </div>
              </div>
              <div className="p-6 border-t border-zero/10 bg-muted flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-zero/15 text-zero rounded-lg hover:bg-zero/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-fahrenheit text-white rounded-lg hover:bg-fahrenheit/90 transition-colors"
                >
                  {editing ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
