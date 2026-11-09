'use client';

import { ArrowLeftRight, Check, ChevronDown, Clock, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Task, TaskStatus } from '@/lib/admin-data';
import { TASK_STATUSES, isStale, relativeDay, statusInfo } from './task-utils';

interface TaskCardProps {
  task: Task;
  onOpen: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onToggleBall: () => void;
}

export default function TaskCard({ task, onOpen, onStatusChange, onToggleBall }: TaskCardProps) {
  const status = statusInfo(task.status);
  const stale = isStale(task);
  const suggested = task.status === 'suggested';
  const ballLabel = task.ball_in_court === 'client' ? 'Client' : task.ball_in_court === 'jesse' ? 'Jesse' : 'Not set';

  return (
    <li className="rounded-xl border border-zero/10 bg-white shadow-sm">
      <button type="button" onClick={onOpen} className="block w-full px-4 pb-3 pt-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <p className="font-bold text-zero">{task.client_label}</p>
          {stale && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
              Stale
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[15px] text-zero">{task.title}</p>
        {task.next_step && <p className="mt-1.5 line-clamp-2 text-sm text-zero/70">{task.next_step}</p>}
        <p className="mt-2 flex items-center gap-1.5 text-xs text-zero/60">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {relativeDay(task.last_activity)}
        </p>
      </button>

      <div className="flex flex-wrap items-center gap-2 border-t border-zero/10 px-3 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`inline-flex h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold ${status.pill}`}
            aria-label={`Status: ${status.label}. Change status`}
          >
            {status.label}
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {TASK_STATUSES.map((s) => (
              <DropdownMenuItem
                key={s.value}
                onSelect={() => s.value !== task.status && onStatusChange(s.value)}
                className="min-h-[44px] text-base"
              >
                {s.label}
                {s.value === task.status && <Check className="ml-auto h-4 w-4" aria-hidden="true" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {suggested ? (
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => onStatusChange('cancelled')}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-zero/15 px-3 text-sm font-semibold text-zero"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Dismiss
            </button>
            <button
              type="button"
              onClick={() => onStatusChange('open')}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-fahrenheit px-3 text-sm font-semibold text-white"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Accept
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onToggleBall}
            aria-label={`Ball in court: ${ballLabel}. Switch to ${task.ball_in_court === 'client' ? 'Jesse' : 'Client'}`}
            className="ml-auto inline-flex h-11 items-center gap-1.5 rounded-lg border border-zero/15 px-3 text-sm font-medium text-zero"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            On {ballLabel === 'Not set' ? 'nobody' : ballLabel}
          </button>
        )}
      </div>
    </li>
  );
}
