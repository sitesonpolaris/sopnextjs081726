'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  leadContactAPI,
  type Client,
  type Lead,
  type LeadContact,
  type LeadInput,
  type LeadStatus,
  type LeadType,
} from '@/lib/admin-data';
import { CONTACT_METHODS, LEAD_STATUSES, leadStatusInfo } from './lead-utils';

interface LeadSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The lead being edited, or null to add a new one. */
  lead: Lead | null;
  clients: Client[];
  onSave: (values: LeadInput) => Promise<void>;
}

const TEXT_FIELDS = [
  ['business', 'Business'],
  ['category', 'Category'],
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['contact_name', 'Contact name'],
  ['address', 'Address'],
  ['web_presence', 'Current web presence'],
  ['other_contact', 'Other contact'],
  ['source', 'Source'],
] as const;

type TextField = (typeof TEXT_FIELDS)[number][0];

type FormState = Record<TextField, string> & {
  notes: string;
  lead_type: LeadType | '';
  status: LeadStatus;
  attempts: string;
  rating: string;
  reviews: string;
  last_contact: string;
  next_follow_up: string;
  client_id: string;
};

function initialState(lead: Lead | null): FormState {
  return {
    business: lead?.business ?? '',
    category: lead?.category ?? '',
    phone: lead?.phone ?? '',
    email: lead?.email ?? '',
    contact_name: lead?.contact_name ?? '',
    address: lead?.address ?? '',
    web_presence: lead?.web_presence ?? '',
    other_contact: lead?.other_contact ?? '',
    source: lead?.source ?? '',
    notes: lead?.notes ?? '',
    lead_type: lead?.lead_type ?? 'primary',
    status: lead?.status ?? 'not_called',
    attempts: String(lead?.attempts ?? 0),
    rating: lead?.rating != null ? String(lead.rating) : '',
    reviews: lead?.reviews != null ? String(lead.reviews) : '',
    last_contact: lead?.last_contact ?? '',
    next_follow_up: lead?.next_follow_up ?? '',
    client_id: lead?.client_id ?? '',
  };
}

const fieldClass =
  'w-full rounded-lg border border-zero/15 bg-white px-3 text-base text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit focus:border-fahrenheit';

const sheetClass =
  'flex h-[100dvh] flex-col gap-0 p-0 sm:mx-auto sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-t-2xl [&>button.absolute]:right-2 [&>button.absolute]:top-2 [&>button.absolute]:flex [&>button.absolute]:h-11 [&>button.absolute]:w-11 [&>button.absolute]:items-center [&>button.absolute]:justify-center';

const numberOrNull = (v: string) => (v.trim() === '' || Number.isNaN(Number(v)) ? null : Number(v));

export default function LeadSheet({ open, onOpenChange, lead, clients, onSave }: LeadSheetProps) {
  const [form, setForm] = useState<FormState>(() => initialState(lead));
  const [history, setHistory] = useState<LeadContact[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setForm(initialState(lead));
    setError('');
    setHistory(null);
    if (lead) {
      leadContactAPI
        .getForLead(lead.id)
        .then(setHistory)
        .catch((err) => {
          console.error('Error loading contact history:', err);
          setHistory([]);
        });
    }
  }, [open, lead]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.business.trim()) {
      setError('Business name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const text = Object.fromEntries(TEXT_FIELDS.map(([key]) => [key, form[key].trim() || null]));
      await onSave({
        ...text,
        business: form.business.trim(),
        notes: form.notes.trim() || null,
        lead_type: form.lead_type || null,
        status: form.status,
        attempts: Math.max(0, Math.round(numberOrNull(form.attempts) ?? 0)),
        rating: numberOrNull(form.rating),
        reviews: numberOrNull(form.reviews),
        last_contact: form.last_contact || null,
        next_follow_up: form.next_follow_up || null,
        client_id: form.client_id || null,
      });
      onOpenChange(false);
    } catch (err) {
      console.error('Error saving lead:', err);
      setError('Could not save this lead. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className={sheetClass}>
        <SheetHeader className="border-b border-zero/10 px-5 pb-4 pt-5 text-left">
          <SheetTitle className="pr-10 text-xl text-zero">{lead ? lead.business : 'Add lead'}</SheetTitle>
          <SheetDescription className="text-zero/60">
            {lead ? `${leadStatusInfo(lead.status).label} · ${lead.attempts} attempts` : 'New leads start as Not called.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Status
                <select value={form.status} onChange={(e) => set('status', e.target.value as LeadStatus)} className={`${fieldClass} h-12`}>
                  {LEAD_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Lead type
                <select value={form.lead_type} onChange={(e) => set('lead_type', e.target.value as LeadType | '')} className={`${fieldClass} h-12`}>
                  <option value="primary">Primary</option>
                  <option value="backup">Backup</option>
                  <option value="">Not set</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {TEXT_FIELDS.map(([key, label]) => (
                <label key={key} className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                  {label}
                  <input
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    required={key === 'business'}
                    type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                    className={`${fieldClass} h-12`}
                  />
                </label>
              ))}
            </div>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
              Notes
              <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} className={`${fieldClass} py-2.5`} />
            </label>

            <div className="grid grid-cols-3 gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Attempts
                <input type="number" min={0} inputMode="numeric" value={form.attempts} onChange={(e) => set('attempts', e.target.value)} className={`${fieldClass} h-12`} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Rating
                <input type="number" min={0} max={5} step={0.1} inputMode="decimal" value={form.rating} onChange={(e) => set('rating', e.target.value)} className={`${fieldClass} h-12`} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Reviews
                <input type="number" min={0} inputMode="numeric" value={form.reviews} onChange={(e) => set('reviews', e.target.value)} className={`${fieldClass} h-12`} />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Last contact
                <input type="date" value={form.last_contact} onChange={(e) => set('last_contact', e.target.value)} className={`${fieldClass} h-12`} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Next follow-up
                <input type="date" value={form.next_follow_up} onChange={(e) => set('next_follow_up', e.target.value)} className={`${fieldClass} h-12`} />
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
              Linked client (once won)
              <select value={form.client_id} onChange={(e) => set('client_id', e.target.value)} className={`${fieldClass} h-12`}>
                <option value="">Not linked</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.trim()}
                  </option>
                ))}
              </select>
            </label>

            {lead && (
              <section aria-label="Contact history" className="rounded-xl border border-zero/10">
                <h3 className="border-b border-zero/10 px-4 py-3 text-sm font-semibold text-zero">Contact history</h3>
                {history === null ? (
                  <p className="px-4 py-3 text-sm text-zero/60">Loading…</p>
                ) : history.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-zero/60">No contacts logged yet.</p>
                ) : (
                  <ul className="divide-y divide-zero/10">
                    {history.map((c) => (
                      <li key={c.id} className="px-4 py-3 text-sm">
                        <p className="font-medium text-zero">
                          {c.contacted_on} · {CONTACT_METHODS.find((m) => m.value === c.method)?.label ?? c.method}
                          {c.outcome && ` · ${leadStatusInfo(c.outcome).label}`}
                        </p>
                        {c.spoke_with && <p className="text-zero/70">Spoke with {c.spoke_with}</p>}
                        {c.notes && <p className="text-zero/70">{c.notes}</p>}
                        {c.next_step && <p className="text-zero/70">Next: {c.next_step}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {error && (
              <p role="alert" className="rounded-lg bg-fahrenheit/10 px-4 py-3 text-sm text-fahrenheit">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 border-t border-zero/10 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-12 flex-1 rounded-lg border border-zero/15 text-base font-semibold text-zero"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-fahrenheit text-base font-semibold text-white disabled:opacity-60"
            >
              {saving && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
              {lead ? 'Save changes' : 'Add lead'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
