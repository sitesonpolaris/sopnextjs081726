'use client';

import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, DollarSign, Calendar, FileText } from 'lucide-react';
import { projectPaymentAPI, type ProjectPayment } from '@/lib/admin-data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatDateOnly } from '@/lib/utils';

interface PaymentManagerProps {
  projectId: string;
  onPaymentsChange?: () => void;
}

export default function PaymentManager({ projectId, onPaymentsChange }: PaymentManagerProps) {
  const [payments, setPayments] = useState<ProjectPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<ProjectPayment | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    event: '',
  });

  useEffect(() => {
    if (projectId) loadPayments();
  }, [projectId]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await projectPaymentAPI.getByProject(projectId);
      setPayments(data);
    } catch (err) {
      console.error('Error loading payments:', err);
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    try {
      setLoading(true);
      const paymentData = {
        project_id: projectId,
        amount,
        payment_date: formData.payment_date,
        event: formData.event.trim(),
      };

      if (editingPayment) {
        await projectPaymentAPI.update(editingPayment.id, paymentData);
      } else {
        await projectPaymentAPI.create(paymentData);
      }
      await loadPayments();
      setFormData({ amount: '', payment_date: new Date().toISOString().split('T')[0], event: '' });
      setShowForm(false);
      setEditingPayment(null);
      onPaymentsChange?.();
    } catch (err) {
      console.error('Error saving payment:', err);
      setError('Failed to save payment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await projectPaymentAPI.delete(id);
      await loadPayments();
      setDeleteConfirm(null);
      onPaymentsChange?.();
    } catch (err) {
      console.error('Error deleting payment:', err);
      setError('Failed to delete payment');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  const formatDate = formatDateOnly;

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-zero/15 bg-white text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit focus:border-transparent';

  return (
    <div className="bg-white rounded-xl border border-zero/10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-zero">Payment History</h3>
        {!showForm ? (
          <button
            type="button"
            onClick={() => {
              setEditingPayment(null);
              setFormData({
                amount: '',
                payment_date: new Date().toISOString().split('T')[0],
                event: '',
              });
              setShowForm(true);
            }}
            className="bg-fahrenheit text-white px-4 py-2 rounded-lg font-semibold hover:bg-fahrenheit/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Payment
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditingPayment(null);
            }}
            className="bg-muted text-zero px-4 py-2 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
          >
            Done
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-muted/50 rounded-lg border border-fahrenheit/20">
          <h4 className="text-base font-semibold text-zero mb-4">
            {editingPayment ? 'Edit Payment' : 'New Payment'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Amount *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zero font-medium">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  className={`${inputClass} pl-8`}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Payment Date *</label>
              <input
                type="date"
                required
                value={formData.payment_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, payment_date: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Event *</label>
              <input
                type="text"
                required
                minLength={3}
                value={formData.event}
                onChange={(e) => setFormData((prev) => ({ ...prev, event: e.target.value }))}
                className={inputClass}
                placeholder="e.g., Initial deposit"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingPayment(null);
              }}
              className="px-4 py-2 bg-muted text-zero rounded-lg font-semibold hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-fahrenheit text-white rounded-lg font-semibold hover:bg-fahrenheit/90 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <LoadingSpinner size="small" /> : null}
              {editingPayment ? 'Update' : 'Save'} Payment
            </button>
          </div>
        </form>
      )}

      {loading && !showForm ? (
        <div className="text-center py-8">
          <LoadingSpinner size="medium" className="mx-auto mb-4" />
          <p className="text-zero/60">Loading payments...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-8">
          <DollarSign className="w-12 h-12 text-zero/30 mx-auto mb-4" />
          <p className="text-zero/50">No payments recorded yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-zero/10"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-fahrenheit" />
                    <div>
                      <div className="text-xs text-zero/50">Amount</div>
                      <div className="font-semibold text-zero">{formatCurrency(payment.amount)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-fahrenheit" />
                    <div>
                      <div className="text-xs text-zero/50">Date</div>
                      <div className="text-zero">{formatDate(payment.payment_date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-fahrenheit" />
                    <div>
                      <div className="text-xs text-zero/50">Event</div>
                      <div className="text-zero">{payment.event}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPayment(payment);
                      setFormData({
                        amount: payment.amount.toString(),
                        payment_date: payment.payment_date,
                        event: payment.event,
                      });
                      setShowForm(true);
                    }}
                    className="p-2 rounded-lg hover:bg-zero/5 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-zero" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(payment.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-zero/10">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-zero">Total Payments</span>
              <span className="text-2xl font-bold text-fahrenheit">{formatCurrency(totalAmount)}</span>
            </div>
            <p className="text-sm text-zero/50 mt-1">
              {payments.length} payment{payments.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-zero mb-4">Confirm Deletion</h3>
            <p className="text-zero/70 mb-6">Delete this payment? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="flex-1 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-semibold hover:bg-destructive/90 transition-colors"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-muted text-zero px-4 py-2 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
