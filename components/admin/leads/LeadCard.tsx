'use client';

import { CalendarClock, ClipboardList, Phone, Star } from 'lucide-react';
import type { Lead } from '@/lib/admin-data';
import { relativeDay } from '../tasks/task-utils';
import { followUpLabel, isFollowUpDue, leadStatusInfo, telHref } from './lead-utils';

interface LeadCardProps {
  lead: Lead;
  onOpen: () => void;
  onLog: () => void;
}

export default function LeadCard({ lead, onOpen, onLog }: LeadCardProps) {
  const status = leadStatusInfo(lead.status);
  const due = isFollowUpDue(lead);
  const followUp = followUpLabel(lead.next_follow_up);

  return (
    <li className="rounded-xl border border-zero/10 bg-white shadow-sm">
      <button type="button" onClick={onOpen} className="block w-full px-4 pb-3 pt-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <p className="font-bold text-zero">{lead.business}</p>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.pill}`}>{status.label}</span>
        </div>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-zero/70">
          {lead.category && <span>{lead.category}</span>}
          {lead.lead_type === 'backup' && <span className="text-zero/60">· Backup</span>}
          {lead.rating != null && (
            <span className="inline-flex items-center gap-0.5">
              · <Star className="h-3.5 w-3.5 fill-sol text-sol" aria-hidden="true" /> {lead.rating}
              {lead.reviews != null && ` (${lead.reviews})`}
            </span>
          )}
        </p>
        {lead.web_presence && <p className="mt-1 line-clamp-1 text-sm text-zero/60">{lead.web_presence}</p>}
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zero/60">
          <span>
            {lead.attempts} attempt{lead.attempts === 1 ? '' : 's'}
            {lead.last_contact && ` · last ${relativeDay(lead.last_contact).toLowerCase()}`}
          </span>
          {followUp && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
                due ? 'bg-amber-100 text-amber-800' : 'bg-zero/5 text-zero/70'
              }`}
            >
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              {followUp}
            </span>
          )}
        </p>
      </button>

      <div className="flex items-center gap-2 border-t border-zero/10 px-3 py-2">
        {lead.phone ? (
          <a
            href={telHref(lead.phone)}
            className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-zero/15 px-3 text-sm font-semibold text-zero"
          >
            <Phone className="h-4 w-4 text-fahrenheit" aria-hidden="true" />
            {lead.phone}
          </a>
        ) : (
          <span className="inline-flex h-11 flex-1 items-center justify-center text-sm text-zero/50">No phone</span>
        )}
        <button
          type="button"
          onClick={onLog}
          className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-fahrenheit px-3 text-sm font-semibold text-white"
        >
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          Log contact
        </button>
      </div>
    </li>
  );
}
