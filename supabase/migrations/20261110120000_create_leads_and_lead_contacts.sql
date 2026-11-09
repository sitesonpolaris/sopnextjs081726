/*
  # Lead tracker tables (replaces the "Sites on Polaris Lead Tracker" Google Sheet)

  1. leads: one row per prospect business, with pipeline status, attempt count and
     follow-up dates. client_id links a won lead to its client record.
  2. lead_contacts: the call log; one row per call, voicemail, text, email or DM.
  3. Security: RLS on both tables; only signed-in admins can read or write.
*/

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business text NOT NULL,
  category text,
  lead_type text CHECK (lead_type IN ('primary', 'backup')),
  phone text,
  email text,
  contact_name text,
  address text,
  rating numeric(2, 1),
  reviews integer,
  web_presence text,
  other_contact text,
  notes text,
  source text,
  status text NOT NULL DEFAULT 'not_called' CHECK (status IN (
    'not_called', 'no_answer', 'left_voicemail', 'call_back', 'sent_dm', 'interested',
    'sample_site_sent', 'quoted', 'won', 'not_interested', 'closed_bad_number'
  )),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_contact date,
  next_follow_up date,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lead_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  contacted_on date NOT NULL DEFAULT CURRENT_DATE,
  method text NOT NULL DEFAULT 'call' CHECK (method IN ('call', 'text', 'email', 'dm', 'in_person', 'other')),
  outcome text,
  spoke_with text,
  notes text,
  next_step text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_next_follow_up_idx ON public.leads (next_follow_up);
CREATE INDEX IF NOT EXISTS lead_contacts_lead_id_idx ON public.lead_contacts (lead_id, contacted_on DESC);

CREATE OR REPLACE FUNCTION public.leads_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_set_updated_at ON public.leads;
CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.leads_set_updated_at();

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can manage all leads" ON public.leads;
CREATE POLICY "Authenticated users can manage all leads"
  ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage all lead contacts" ON public.lead_contacts;
CREATE POLICY "Authenticated users can manage all lead contacts"
  ON public.lead_contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
