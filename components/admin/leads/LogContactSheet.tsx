'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { leadAPI, leadContactAPI, type ContactMethod, type Lead, type LeadStatus } from '@/lib/admin-data';
import { CONTACT_METHODS, LEAD_STATUSES, addDaysISO, todayISO } from './lead-utils';

interface LogContactSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onLogged: (lead: Lead) => void;
}

const FOLLOW_UP_CHOICES: { label: string; days: number | null }[] = [
  { label: 'None', days: null },
  { label: 'Tomorrow', days: 1 },
  { label: '3 days', days: 3 },
  { label: '1 week', days: 7 },
];

const fieldClass =
  'w-full rounded-lg border border-zero/15 bg-white px-3 text-base text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit focus:border-fahrenheit';

const sheetClass =
  'flex h-[100dvh] flex-col gap-0 p-0 sm:mx-auto sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-t-2xl [&>button.absolute]:right-2 [&>button.absolute]:top-2 [&>button.absolute]:flex [&>button.absolute]:h-11 [&>button.absolute]:w-11 [&>button.absolute]:items-center [&>button.absolute]:justify-center';

export default function LogContactSheet({ open, onOpenChange, lead, onLogged }: LogContactSheetProps) {
  const [method, setMethod] = useState<ContactMethod>('call');
  const [outcome, setOutcome] = useState<LeadStatus>('no_answer');
  const [spokeWith, setSpokeWith] = useState('');
  const [notes, setNotes] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [contactedOn, setContactedOn] = useState(todayISO());
  const [followUp, setFollowUp] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && lead) {
      setMethod('call');
      // A lead that hasn't been reached yet most often ends in no answer.
      setOutcome(lead.status === 'not_called' ? 'no_answer' : lead.status);
      setSpokeWith('');
      setNotes('');
      setNextStep('');
      setContactedOn(todayISO());
      setFollowUp(lead.next_follow_up ?? '');
      setError('');
    }
  }, [open, lead]);

  if (!lead) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lead) return;
    setSaving(true);
    setError('');
    try {
      const contact = await leadContactAPI.create({
        lead_id: lead.id,
        contacted_on: contactedOn || todayISO(),
        method,
        outcome,
        spoke_with: spokeWith.trim() || null,
        notes: notes.trim() || null,
        next_step: nextStep.trim() || null,
      });
      try {
        const lastContact =
          lead.last_contact && lead.last_contact > contact.contacted_on ? lead.last_contact : contact.contacted_on;
        const updated = await leadAPI.update(lead.id, {
          status: outcome,
          attempts: lead.attempts + 1,
          last_contact: lastContact,
          next_follow_up: followUp || null,
        });
        onLogged(updated);
        onOpenChange(false);
      } catch (err) {
        // Keep the log and the lead in step: drop the entry if the lead didn't update.
        await leadContactAPI.delete(contact.id).catch(() => undefined);
        throw err;
      }
    } catch (err) {
      console.error('Error logging contact:', err);
      setError('Could not save this contact. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className={sheetClass}>
        <SheetHeader className="border-b border-zero/10 px-5 pb-4 pt-5 text-left">
          <SheetTitle className="pr-10 text-xl text-zero">Log contact</SheetTitle>
          <SheetDescription className="text-zero/60">{lead.business}</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-zero">How</legend>
              <div className="grid grid-cols-3 gap-2">
                {CONTACT_METHODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    aria-pressed={method === m.value}
                    onClick={() => setMethod(m.value)}
                    className={`h-11 rounded-lg border text-base font-medium ${
                      method === m.value ? 'border-fahrenheit bg-fahrenheit text-white' : 'border-zero/15 bg-white text-zero'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
              Outcome (sets the lead&apos;s status)
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as LeadStatus)}
                className={`${fieldClass} h-12`}
              >
                {LEAD_STATUSES.filter((s) => s.value !== 'not_called').map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Spoke with
                <input value={spokeWith} onChange={(e) => setSpokeWith(e.target.value)} className={`${fieldClass} h-12`} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Date
                <input
                  type="date"
                  value={contactedOn}
                  onChange={(e) => setContactedOn(e.target.value)}
                  className={`${fieldClass} h-12`}
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
              Notes
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${fieldClass} py-2.5`} />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
              Next step
              <input value={nextStep} onChange={(e) => setNextStep(e.target.value)} className={`${fieldClass} h-12`} />
            </label>

            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-zero">Next follow-up</legend>
              <div className="grid grid-cols-4 gap-2">
                {FOLLOW_UP_CHOICES.map((c) => {
                  const value = c.days === null ? '' : addDaysISO(c.days);
                  return (
                    <button
                      key={c.label}
                      type="button"
                      aria-pressed={followUp === value}
                      onClick={() => setFollowUp(value)}
                      className={`h-11 rounded-lg border text-sm font-medium ${
                        followUp === value ? 'border-fahrenheit bg-fahrenheit text-white' : 'border-zero/15 bg-white text-zero'
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
              <input
                type="date"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                aria-label="Follow-up date"
                className={`${fieldClass} mt-2 h-12`}
              />
            </fieldset>

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
              Save
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
