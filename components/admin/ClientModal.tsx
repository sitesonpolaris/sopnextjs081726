'use client';

import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { clientAPI } from '@/lib/admin-data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ClientModalProps {
  onSuccess: (clientId: string) => void;
  onCancel: () => void;
}

export default function ClientModal({ onSuccess, onCancel }: ClientModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newClient = await clientAPI.create(formData);
      setSuccess(true);
      setTimeout(() => onSuccess(newClient.id), 600);
    } catch (err) {
      console.error('Error saving client:', err);
      if (err instanceof Error && err.message.includes('duplicate key')) {
        setError('A client with this email already exists');
      } else {
        setError('Failed to save client');
      }
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-zero/15 bg-white text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit focus:border-transparent';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-zero">Add New Client</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-zero/5 transition-colors"
          >
            <X className="w-6 h-6 text-zero" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-sm text-green-600 font-semibold">
            Client created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zero mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className={inputClass}
              placeholder="Enter client's full name"
              disabled={loading || success}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zero mb-2">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className={inputClass}
              placeholder="client@example.com"
              disabled={loading || success}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zero mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              className={inputClass}
              placeholder="(555) 123-4567"
              disabled={loading || success}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-muted text-zero rounded-lg font-semibold hover:bg-muted/80 transition-colors"
              disabled={loading || success}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="px-6 py-3 bg-fahrenheit text-white rounded-lg font-semibold hover:bg-fahrenheit/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Client
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
