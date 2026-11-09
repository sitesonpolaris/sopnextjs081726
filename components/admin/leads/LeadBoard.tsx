'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { clientAPI, leadAPI, leadContactAPI, type Client, type Lead, type LeadInput, type LeadType } from '@/lib/admin-data';
import LeadCard from './LeadCard';
import LeadSheet from './LeadSheet';
import LogContactSheet from './LogContactSheet';
import {
  LEAD_TABS,
  isFollowUpDue,
  leadStatusInfo,
  matchesLeadSearch,
  sortLeads,
  startOfWeekISO,
  tabForLead,
  type LeadTab,
} from './lead-utils';

const EMPTY_MESSAGES: Record<LeadTab, string> = {
  to_call: 'Everyone on the list has been contacted.',
  follow_up: 'No follow-ups waiting.',
  in_progress: 'No leads in progress yet.',
  closed: 'No closed leads.',
};

type TypeFilter = 'all' | LeadType;

export default function LeadBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [contactsThisWeek, setContactsThisWeek] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [tab, setTab] = useState<LeadTab>('to_call');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [selected, setSelected] = useState<Lead | null>(null);

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const [l, c, weekCount] = await Promise.all([
        leadAPI.getAll(),
        clientAPI.getAll(),
        leadContactAPI.countSince(startOfWeekISO()),
      ]);
      setLeads(l);
      setClients(c);
      setContactsThisWeek(weekCount);
    } catch (err) {
      console.error('Error loading leads:', err);
      setLoadError('Could not load leads.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const replaceLead = (lead: Lead) => setLeads((prev) => prev.map((l) => (l.id === lead.id ? lead : l)));

  const saveLead = async (values: LeadInput) => {
    if (selected) {
      replaceLead(await leadAPI.update(selected.id, values));
      toast('Lead saved');
    } else {
      const created = await leadAPI.create(values);
      setLeads((prev) => [...prev, created]);
      setTab(tabForLead(created));
      toast('Lead added');
    }
  };

  const handleLogged = (lead: Lead) => {
    replaceLead(lead);
    setContactsThisWeek((n) => n + 1);
    toast(`${lead.business}: ${leadStatusInfo(lead.status).label}`);
  };

  const filtered = useMemo(
    () => leads.filter((l) => matchesLeadSearch(l, query) && (typeFilter === 'all' || l.lead_type === typeFilter)),
    [leads, query, typeFilter]
  );

  const byTab = useMemo(() => {
    const groups: Record<LeadTab, Lead[]> = { to_call: [], follow_up: [], in_progress: [], closed: [] };
    for (const lead of filtered) groups[tabForLead(lead)].push(lead);
    return groups;
  }, [filtered]);

  const dueCount = leads.filter(isFollowUpDue).length;
  const visible = sortLeads(tab, byTab[tab]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="pb-28">
      <h2 className="mb-4 text-2xl font-bold text-zero">Leads</h2>

      <dl className="mb-4 grid grid-cols-3 gap-2">
        {[
          ['Total leads', leads.length],
          ['Follow-ups due', dueCount],
          ['Contacts this week', contactsThisWeek],
        ].map(([label, value]) => (
          <div
            key={label}
            className={`rounded-xl border bg-white px-3 py-3 ${
              label === 'Follow-ups due' && dueCount > 0 ? 'border-amber-300' : 'border-zero/10'
            }`}
          >
            <dt className="text-xs text-zero/60">{label}</dt>
            <dd className="text-2xl font-bold tabular-nums text-zero">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zero/40" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search business, category, contact or notes"
          aria-label="Search leads"
          className="h-12 w-full rounded-lg border border-zero/15 bg-white pl-10 pr-3 text-base text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit"
        />
      </div>

      <div className="mb-3 flex gap-2" role="group" aria-label="Lead type">
        {(['all', 'primary', 'backup'] as TypeFilter[]).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={typeFilter === t}
            onClick={() => setTypeFilter(t)}
            className={`h-11 rounded-full border px-4 text-sm font-semibold ${
              typeFilter === t ? 'border-zero bg-zero text-white' : 'border-zero/15 bg-white text-zero'
            }`}
          >
            {t === 'all' ? 'All' : t === 'primary' ? 'Primary' : 'Backup'}
          </button>
        ))}
      </div>

      <div role="tablist" aria-label="Lead lists" className="mb-4 grid grid-cols-4 gap-1 rounded-xl bg-zero/5 p-1">
        {LEAD_TABS.map((t) => {
          const active = tab === t.id;
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
              <span className={`tabular-nums ${active ? 'text-fahrenheit' : ''}`}>{byTab[t.id].length}</span>
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
          {query || typeFilter !== 'all' ? 'No leads match these filters.' : EMPTY_MESSAGES[tab]}
        </p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {visible.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onOpen={() => {
                setSelected(lead);
                setDetailOpen(true);
              }}
              onLog={() => {
                setSelected(lead);
                setLogOpen(true);
              }}
            />
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => {
          setSelected(null);
          setDetailOpen(true);
        }}
        className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-[calc(1.25rem+env(safe-area-inset-right))] z-40 inline-flex h-14 items-center gap-2 rounded-full bg-fahrenheit px-5 text-base font-semibold text-white shadow-lg"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
        Add lead
      </button>

      <LeadSheet open={detailOpen} onOpenChange={setDetailOpen} lead={selected} clients={clients} onSave={saveLead} />
      <LogContactSheet open={logOpen} onOpenChange={setLogOpen} lead={selected} onLogged={handleLogged} />
    </div>
  );
}
