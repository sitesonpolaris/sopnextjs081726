import type { ContactMethod, Lead, LeadStatus } from '@/lib/admin-data';
import { daysSince, todayISO } from '../tasks/task-utils';

export type LeadTab = 'to_call' | 'follow_up' | 'in_progress' | 'closed';

export const LEAD_STATUSES: { value: LeadStatus; label: string; pill: string; tab: LeadTab }[] = [
  { value: 'not_called', label: 'Not called', pill: 'text-zero/80 bg-zero/10', tab: 'to_call' },
  { value: 'no_answer', label: 'No answer', pill: 'text-slate-700 bg-slate-100', tab: 'follow_up' },
  { value: 'left_voicemail', label: 'Left voicemail', pill: 'text-blue-700 bg-blue-100', tab: 'follow_up' },
  { value: 'call_back', label: 'Call back', pill: 'text-orange-700 bg-orange-100', tab: 'follow_up' },
  { value: 'sent_dm', label: 'Sent DM', pill: 'text-sky-700 bg-sky-100', tab: 'follow_up' },
  { value: 'interested', label: 'Interested', pill: 'text-purple-700 bg-purple-100', tab: 'in_progress' },
  { value: 'sample_site_sent', label: 'Sample site sent', pill: 'text-teal-700 bg-teal-100', tab: 'in_progress' },
  { value: 'quoted', label: 'Quoted', pill: 'text-amber-800 bg-amber-100', tab: 'in_progress' },
  { value: 'won', label: 'Won', pill: 'text-green-700 bg-green-100', tab: 'closed' },
  { value: 'not_interested', label: 'Not interested', pill: 'text-red-700 bg-red-50', tab: 'closed' },
  { value: 'closed_bad_number', label: 'Closed / bad number', pill: 'text-zero/70 bg-zero/10', tab: 'closed' },
];

export const LEAD_TABS: { id: LeadTab; label: string }[] = [
  { id: 'to_call', label: 'To call' },
  { id: 'follow_up', label: 'Follow up' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'closed', label: 'Closed' },
];

export const CONTACT_METHODS: { value: ContactMethod; label: string }[] = [
  { value: 'call', label: 'Call' },
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'dm', label: 'DM' },
  { value: 'in_person', label: 'In person' },
  { value: 'other', label: 'Other' },
];

export function leadStatusInfo(status: LeadStatus) {
  return LEAD_STATUSES.find((s) => s.value === status) ?? LEAD_STATUSES[0];
}

export const tabForLead = (lead: Lead): LeadTab => leadStatusInfo(lead.status).tab;
export const isClosedLead = (lead: Lead) => tabForLead(lead) === 'closed';

// A follow-up is due when its date is today or earlier and the lead is still open.
export function isFollowUpDue(lead: Lead): boolean {
  if (isClosedLead(lead) || !lead.next_follow_up) return false;
  const days = daysSince(lead.next_follow_up);
  return days !== null && days >= 0;
}

export function followUpLabel(date: string | null): string | null {
  const days = daysSince(date);
  if (days === null) return null;
  if (days > 1) return `Overdue ${days} days`;
  if (days === 1) return 'Due yesterday';
  if (days === 0) return 'Due today';
  if (days === -1) return 'Tomorrow';
  return `In ${-days} days`;
}

// Monday of the current week, as YYYY-MM-DD in the device's time zone.
export function startOfWeekISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Due follow-ups first (earliest date first), then everything else alphabetically.
export function sortLeads(tab: LeadTab, leads: Lead[]): Lead[] {
  return [...leads].sort((a, b) => {
    if (tab !== 'to_call' && tab !== 'closed') {
      const fa = a.next_follow_up ?? '9999-12-31';
      const fb = b.next_follow_up ?? '9999-12-31';
      if (fa !== fb) return fa.localeCompare(fb);
    }
    if (tab === 'closed') {
      return (b.last_contact ?? '').localeCompare(a.last_contact ?? '') || a.business.localeCompare(b.business);
    }
    if (tab === 'to_call' && a.lead_type !== b.lead_type) {
      // Primary leads before backups.
      return a.lead_type === 'primary' ? -1 : b.lead_type === 'primary' ? 1 : 0;
    }
    return a.business.localeCompare(b.business);
  });
}

export function matchesLeadSearch(lead: Lead, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [lead.business, lead.category, lead.contact_name, lead.address, lead.notes, lead.phone]
    .filter(Boolean)
    .some((field) => (field as string).toLowerCase().includes(q));
}

export const telHref = (phone: string) => `tel:+1${phone.replace(/\D/g, '').slice(-10)}`;

export { todayISO };
