import type { Task, TaskStatus } from '@/lib/admin-data';

export const TASK_STATUSES: { value: TaskStatus; label: string; pill: string }[] = [
  { value: 'open', label: 'Open', pill: 'text-blue-700 bg-blue-100' },
  { value: 'waiting_on_client', label: 'Waiting on Client', pill: 'text-purple-700 bg-purple-100' },
  { value: 'suggested', label: 'Suggested', pill: 'text-orange-700 bg-orange-100' },
  { value: 'done', label: 'Done', pill: 'text-green-700 bg-green-100' },
  { value: 'paid', label: 'Paid', pill: 'text-teal-700 bg-teal-100' },
  { value: 'cancelled', label: 'Cancelled', pill: 'text-zero/70 bg-zero/10' },
];

export const CLOSED_STATUSES: TaskStatus[] = ['done', 'paid', 'cancelled'];
export const STALE_AFTER_DAYS = 7;
export const CLOSED_RECENT_DAYS = 30;

export type TaskTab = 'on_me' | 'on_client' | 'suggested' | 'closed';

export const TASK_TABS: { id: TaskTab; label: string }[] = [
  { id: 'on_me', label: 'On me' },
  { id: 'on_client', label: 'On client' },
  { id: 'suggested', label: 'Suggested' },
  { id: 'closed', label: 'Closed' },
];

export function statusInfo(status: TaskStatus) {
  return TASK_STATUSES.find((s) => s.value === status) ?? TASK_STATUSES[0];
}

export const isClosed = (task: Task) => CLOSED_STATUSES.includes(task.status);

// Today as YYYY-MM-DD in the device's own time zone (last_activity is a plain date).
export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Whole days between a YYYY-MM-DD date and today, both read as local dates.
export function daysSince(date: string | null): number | null {
  if (!date) return null;
  const [y, m, d] = date.split('-').map(Number);
  const then = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today.getTime() - then.getTime()) / 86_400_000);
}

export function relativeDay(date: string | null): string {
  const days = daysSince(date);
  if (days === null) return 'No activity yet';
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months <= 1 ? 'About a month ago' : `${months} months ago`;
}

// Tasks with no activity date count as stale: nobody has touched them.
export function isStale(task: Task): boolean {
  if (isClosed(task)) return false;
  const days = daysSince(task.last_activity);
  return days === null || days > STALE_AFTER_DAYS;
}

// Suggested tasks only appear on the Suggested tab, so a task is never listed twice.
// An open task with no ball_in_court yet lands on "On me" so it gets assigned.
export function tabFor(task: Task): TaskTab {
  if (isClosed(task)) return 'closed';
  if (task.status === 'suggested') return 'suggested';
  return task.ball_in_court === 'client' ? 'on_client' : 'on_me';
}

export function sortForTab(tab: TaskTab, tasks: Task[]): Task[] {
  if (tab === 'closed') {
    return [...tasks].sort((a, b) => (b.completed_at ?? '').localeCompare(a.completed_at ?? ''));
  }
  // Oldest activity first (stale tasks are the oldest), missing dates first of all.
  return [...tasks].sort((a, b) => (a.last_activity ?? '').localeCompare(b.last_activity ?? ''));
}

export function isRecentlyClosed(task: Task): boolean {
  if (!task.completed_at) return false;
  return Date.now() - new Date(task.completed_at).getTime() <= CLOSED_RECENT_DAYS * 86_400_000;
}

export function matchesSearch(task: Task, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [task.client_label, task.title, task.next_step ?? ''].some((field) =>
    field.toLowerCase().includes(q)
  );
}
