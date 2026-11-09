'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { clientAPI, projectAPI, taskAPI, type Client, type Project, type Task, type TaskInput } from '@/lib/admin-data';
import TaskSheet from './TaskSheet';
import { isStale, relativeDay, statusInfo } from './task-utils';

// The non-closed tasks for one project, shown under the project's edit form.
export default function ProjectTasks({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const load = useCallback(async () => {
    try {
      setTasks(await taskAPI.getOpenForProject(projectId));
    } catch (err) {
      console.error('Error loading project tasks:', err);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  // Pickers are only needed once the sheet opens.
  const openSheet = async (task: Task | null) => {
    if (clients.length === 0) {
      const [c, p] = await Promise.all([clientAPI.getAll(), projectAPI.getAll()]);
      setClients(c);
      setProjects(p);
    }
    setEditing(task);
    setSheetOpen(true);
  };

  const save = async (values: TaskInput) => {
    if (editing) {
      await taskAPI.update(editing.id, values);
    } else {
      await taskAPI.create(values);
    }
    toast(editing ? 'Task saved' : 'Task added');
    await load();
  };

  return (
    <section className="mt-8 rounded-xl border border-zero/10 bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-zero">Tasks</h3>
        <button
          type="button"
          onClick={() => openSheet(null)}
          className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-fahrenheit px-4 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add task
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-zero/60">No open tasks for this project.</p>
      ) : (
        <ul className="divide-y divide-zero/10">
          {tasks.map((task) => (
            <li key={task.id}>
              <button type="button" onClick={() => openSheet(task)} className="flex w-full items-start gap-3 py-3 text-left">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-zero">{task.title}</p>
                  {task.next_step && <p className="line-clamp-2 text-sm text-zero/70">{task.next_step}</p>}
                  <p className="mt-1 text-xs text-zero/60">{relativeDay(task.last_activity)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusInfo(task.status).pill}`}>
                    {statusInfo(task.status).label}
                  </span>
                  {isStale(task) && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Stale</span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Link href="/admin/tasks" className="mt-3 inline-block text-sm font-semibold text-fahrenheit hover:underline">
        All tasks
      </Link>

      <TaskSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        task={editing}
        defaults={{ project_id: projectId }}
        clients={clients}
        projects={projects}
        onSave={save}
      />
    </section>
  );
}
