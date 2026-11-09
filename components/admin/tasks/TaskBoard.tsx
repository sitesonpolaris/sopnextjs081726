'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  clientAPI,
  projectAPI,
  taskAPI,
  type Client,
  type Project,
  type Task,
  type TaskInput,
  type TaskStatus,
} from '@/lib/admin-data';
import TaskCard from './TaskCard';
import TaskSheet from './TaskSheet';
import {
  TASK_TABS,
  isRecentlyClosed,
  matchesSearch,
  sortForTab,
  statusInfo,
  tabFor,
  todayISO,
  type TaskTab,
} from './task-utils';

const EMPTY_MESSAGES: Record<TaskTab, string> = {
  on_me: 'Nothing waiting on you.',
  on_client: 'Nothing waiting on clients.',
  suggested: 'No suggested tasks right now.',
  closed: 'No tasks closed in the last 30 days.',
};

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [tab, setTab] = useState<TaskTab>('on_me');
  const [query, setQuery] = useState('');
  const [showAllClosed, setShowAllClosed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const [t, c, p] = await Promise.all([taskAPI.getAll(), clientAPI.getAll(), projectAPI.getAll()]);
      setTasks(t);
      setClients(c);
      setProjects(p);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setLoadError('Could not load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const replaceTask = (task: Task) => setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));

  // Optimistic quick edit: show the change at once, save it, roll back on failure.
  const quickUpdate = async (task: Task, patch: TaskInput, undoLabel?: string) => {
    const optimistic = { ...task, ...patch } as Task;
    replaceTask(optimistic);
    try {
      const saved = await taskAPI.update(task.id, patch);
      replaceTask(saved);
      if (undoLabel) {
        toast(undoLabel, {
          action: {
            label: 'Undo',
            onClick: () => quickUpdate(saved, { status: task.status, last_activity: task.last_activity }),
          },
        });
      }
    } catch (err) {
      console.error('Error updating task:', err);
      replaceTask(task);
      toast.error('Could not save that change. It has been undone.');
    }
  };

  const changeStatus = (task: Task, status: TaskStatus) =>
    quickUpdate(
      task,
      { status, last_activity: todayISO() },
      `${task.client_label}: ${statusInfo(status).label}`
    );

  const toggleBall = (task: Task) =>
    quickUpdate(task, {
      ball_in_court: task.ball_in_court === 'client' ? 'jesse' : 'client',
      last_activity: todayISO(),
    });

  const saveFromSheet = async (values: TaskInput) => {
    if (editing) {
      replaceTask(await taskAPI.update(editing.id, values));
      toast('Task saved');
    } else {
      const created = await taskAPI.create(values);
      setTasks((prev) => [...prev, created]);
      setTab(tabFor(created));
      toast('Task added');
    }
  };

  const openTask = (task: Task | null) => {
    setEditing(task);
    setSheetOpen(true);
  };

  const searched = useMemo(() => tasks.filter((t) => matchesSearch(t, query)), [tasks, query]);

  const byTab = useMemo(() => {
    const groups: Record<TaskTab, Task[]> = { on_me: [], on_client: [], suggested: [], closed: [] };
    for (const task of searched) groups[tabFor(task)].push(task);
    return groups;
  }, [searched]);

  const closedHidden = tab === 'closed' && !showAllClosed ? byTab.closed.filter((t) => !isRecentlyClosed(t)).length : 0;
  const visible = sortForTab(
    tab,
    tab === 'closed' && !showAllClosed ? byTab.closed.filter(isRecentlyClosed) : byTab[tab]
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="pb-28">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-zero">Tasks</h2>
          <p className="text-sm text-zero/60">Stale after 7 days without activity.</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zero/40" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search client, task or next step"
          aria-label="Search tasks"
          className="h-12 w-full rounded-lg border border-zero/15 bg-white pl-10 pr-3 text-base text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit"
        />
      </div>

      <div role="tablist" aria-label="Task lists" className="mb-4 grid grid-cols-4 gap-1 rounded-xl bg-zero/5 p-1">
        {TASK_TABS.map((t) => {
          const active = tab === t.id;
          const count = t.id === 'closed' && !showAllClosed ? byTab.closed.filter(isRecentlyClosed).length : byTab[t.id].length;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`flex min-h-[44px] flex-col items-center justify-center rounded-lg px-1 py-1.5 text-xs font-semibold sm:flex-row sm:gap-1.5 sm:text-sm ${
                active ? 'bg-white text-zero shadow-sm' : 'text-zero/60'
              }`}
            >
              <span>{t.label}</span>
              <span className={`tabular-nums ${active ? 'text-fahrenheit' : ''}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {loadError ? (
        <div className="rounded-xl border border-zero/10 bg-white p-6 text-center">
          <p className="text-zero/70">{loadError}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              load();
            }}
            className="mt-3 h-11 rounded-lg bg-fahrenheit px-5 font-semibold text-white"
          >
            Try again
          </button>
        </div>
      ) : visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zero/15 bg-white p-8 text-center text-zero/60">
          {query ? 'No tasks match your search.' : EMPTY_MESSAGES[tab]}
        </p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {visible.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onOpen={() => openTask(task)}
              onStatusChange={(status) => changeStatus(task, status)}
              onToggleBall={() => toggleBall(task)}
            />
          ))}
        </ul>
      )}

      {tab === 'closed' && closedHidden > 0 && (
        <button
          type="button"
          onClick={() => setShowAllClosed(true)}
          className="mx-auto mt-4 block h-11 rounded-lg border border-zero/15 bg-white px-5 text-sm font-semibold text-zero"
        >
          Show all ({closedHidden} older)
        </button>
      )}

      <button
        type="button"
        onClick={() => openTask(null)}
        className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-[calc(1.25rem+env(safe-area-inset-right))] z-40 inline-flex h-14 items-center gap-2 rounded-full bg-fahrenheit px-5 text-base font-semibold text-white shadow-lg"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
        Add task
      </button>

      <TaskSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        task={editing}
        clients={clients}
        projects={projects}
        onSave={saveFromSheet}
      />
    </div>
  );
}
