'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { BallInCourt, Client, Project, Task, TaskInput, TaskStatus } from '@/lib/admin-data';
import { TASK_STATUSES, todayISO } from './task-utils';

interface TaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The task being edited, or null to add a new one. */
  task: Task | null;
  /** Prefill for a new task, e.g. { project_id } from a project's page. */
  defaults?: TaskInput;
  clients: Client[];
  projects: Project[];
  onSave: (values: TaskInput) => Promise<void>;
}

type FormState = {
  client_id: string;
  project_id: string;
  client_label: string;
  title: string;
  status: TaskStatus;
  ball_in_court: BallInCourt | '';
  next_step: string;
  source: string;
  due_date: string;
  last_activity: string;
  added_on: string;
};

function initialState(task: Task | null, defaults: TaskInput | undefined, projects: Project[], clients: Client[]): FormState {
  if (task) {
    return {
      client_id: task.client_id ?? '',
      project_id: task.project_id ?? '',
      client_label: task.client_label,
      title: task.title,
      status: task.status,
      ball_in_court: task.ball_in_court ?? '',
      next_step: task.next_step ?? '',
      source: task.source ?? '',
      due_date: task.due_date ?? '',
      last_activity: task.last_activity ?? '',
      added_on: task.added_on,
    };
  }
  const today = todayISO();
  const project = projects.find((p) => p.id === defaults?.project_id);
  const clientId = defaults?.client_id ?? project?.client_id ?? '';
  const client = clients.find((c) => c.id === clientId);
  return {
    client_id: clientId,
    project_id: defaults?.project_id ?? '',
    client_label: defaults?.client_label ?? client?.name.trim() ?? '',
    title: defaults?.title ?? '',
    status: defaults?.status ?? 'open',
    ball_in_court: defaults?.ball_in_court ?? 'jesse',
    next_step: defaults?.next_step ?? '',
    source: defaults?.source ?? '',
    due_date: defaults?.due_date ?? '',
    last_activity: today,
    added_on: today,
  };
}

const fieldClass =
  'w-full rounded-lg border border-zero/15 bg-white px-3 text-base text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit focus:border-fahrenheit';

export default function TaskSheet({ open, onOpenChange, task, defaults, clients, projects, onSave }: TaskSheetProps) {
  const [form, setForm] = useState<FormState>(() => initialState(task, defaults, projects, clients));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Reset whenever the sheet opens on a different task (or a fresh "add").
  useEffect(() => {
    if (open) {
      setForm(initialState(task, defaults, projects, clients));
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task?.id]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name.trim() ?? '';

  // The label follows the picked client unless it has been typed over.
  const pickClient = (clientId: string) =>
    setForm((prev) => {
      const labelWasDefault = !prev.client_label || prev.client_label === clientName(prev.client_id);
      const project = projects.find((p) => p.id === prev.project_id);
      return {
        ...prev,
        client_id: clientId,
        project_id: project && project.client_id !== clientId ? '' : prev.project_id,
        client_label: labelWasDefault ? clientName(clientId) : prev.client_label,
      };
    });

  const pickProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project && project.client_id !== form.client_id) {
      pickClient(project.client_id);
    }
    set('project_id', projectId);
  };

  const visibleProjects = form.client_id ? projects.filter((p) => p.client_id === form.client_id) : projects;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client_label.trim() || !form.title.trim()) {
      setError('Client and task are both required.');
      return;
    }

    // Moving the task forward counts as activity, unless the date was edited by hand.
    let lastActivity = form.last_activity || null;
    if (
      task &&
      form.last_activity === (task.last_activity ?? '') &&
      (form.status !== task.status ||
        (form.ball_in_court || null) !== task.ball_in_court ||
        form.next_step.trim() !== (task.next_step ?? ''))
    ) {
      lastActivity = todayISO();
    }

    setSaving(true);
    setError('');
    try {
      await onSave({
        client_id: form.client_id || null,
        project_id: form.project_id || null,
        client_label: form.client_label.trim(),
        title: form.title.trim(),
        status: form.status,
        ball_in_court: form.ball_in_court || null,
        next_step: form.next_step.trim() || null,
        source: form.source.trim() || null,
        due_date: form.due_date || null,
        last_activity: lastActivity,
        added_on: form.added_on || todayISO(),
      });
      onOpenChange(false);
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Could not save this task. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex h-[100dvh] flex-col gap-0 p-0 sm:mx-auto sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-t-2xl [&>button.absolute]:right-2 [&>button.absolute]:top-2 [&>button.absolute]:flex [&>button.absolute]:h-11 [&>button.absolute]:w-11 [&>button.absolute]:items-center [&>button.absolute]:justify-center"
      >
        <SheetHeader className="border-b border-zero/10 px-5 pb-4 pt-5 text-left">
          <SheetTitle className="pr-10 text-xl text-zero">{task ? 'Edit task' : 'Add task'}</SheetTitle>
          <SheetDescription className="text-zero/60">
            {task ? task.client_label : 'Status, ball in court and dates can all be changed later.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Client
                <select value={form.client_id} onChange={(e) => pickClient(e.target.value)} className={`${fieldClass} h-12`}>
                  <option value="">No client record (prospect)</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name.trim()}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Project
                <select value={form.project_id} onChange={(e) => pickProject(e.target.value)} className={`${fieldClass} h-12`}>
                  <option value="">No project</option>
                  {visibleProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title.trim()}
                      {!form.client_id && p.client ? ` (${p.client.name.trim()})` : ''}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
              Client name shown on the card
              <input
                value={form.client_label}
                onChange={(e) => set('client_label', e.target.value)}
                required
                className={`${fieldClass} h-12`}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
              Task
              <input value={form.title} onChange={(e) => set('title', e.target.value)} required className={`${fieldClass} h-12`} />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Status
                <select
                  value={form.status}
                  onChange={(e) => set('status', e.target.value as TaskStatus)}
                  className={`${fieldClass} h-12`}
                >
                  {TASK_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <fieldset className="flex flex-col gap-1.5">
                <legend className="mb-1.5 text-sm font-medium text-zero">Ball in court</legend>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    ['jesse', 'Jesse'],
                    ['client', 'Client'],
                    ['', 'Not set'],
                  ] as const).map(([value, label]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => set('ball_in_court', value)}
                      aria-pressed={form.ball_in_court === value}
                      className={`h-12 rounded-lg border text-base font-medium transition-colors ${
                        form.ball_in_court === value
                          ? 'border-fahrenheit bg-fahrenheit text-white'
                          : 'border-zero/15 bg-white text-zero'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
              Next step
              <textarea
                value={form.next_step}
                onChange={(e) => set('next_step', e.target.value)}
                rows={3}
                className={`${fieldClass} py-2.5`}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Last activity
                <input
                  type="date"
                  value={form.last_activity}
                  onChange={(e) => set('last_activity', e.target.value)}
                  className={`${fieldClass} h-12`}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Due date
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(e) => set('due_date', e.target.value)}
                  className={`${fieldClass} h-12`}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
                Added on
                <input
                  type="date"
                  value={form.added_on}
                  onChange={(e) => set('added_on', e.target.value)}
                  className={`${fieldClass} h-12`}
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-zero">
              Source
              <input
                value={form.source}
                onChange={(e) => set('source', e.target.value)}
                placeholder="e.g. Email: Logo Concepts"
                className={`${fieldClass} h-12`}
              />
            </label>

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
              {task ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
