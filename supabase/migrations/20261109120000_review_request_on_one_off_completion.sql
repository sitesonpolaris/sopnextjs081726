/*
  # Queue Google review requests for one-off completions too

  `completed_one_off` (logos, banners, business cards and other non-website jobs) is
  treated like `completed_ongoing`: moving a project into either status queues the
  "Google Review Request" email. Moving between the two completed statuses does not
  queue a second request, and the existing review_request_sent_at guard still applies.
  The new on_hold, awaiting_payment and waiting_on_client statuses never trigger it.
*/

CREATE OR REPLACE FUNCTION public.queue_review_request_on_completion()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
review_template_id uuid;
client_opted_in boolean;
client_pause_date date;
scheduled_send_date timestamptz;
BEGIN
-- Only proceed if status changed TO a completed status
IF NEW.status IN ('completed_ongoing', 'completed_one_off')
   AND (OLD.status IS NULL OR OLD.status NOT IN ('completed_ongoing', 'completed_one_off')) THEN

-- Check if review request already sent for this project
IF NEW.review_request_sent_at IS NOT NULL THEN
RETURN NEW;
END IF;

-- Get the Google Review Request template ID
SELECT id INTO review_template_id
FROM email_templates
WHERE name = 'Google Review Request' AND active = true
LIMIT 1;

-- If template doesn't exist or is inactive, skip
IF review_template_id IS NULL THEN
RETURN NEW;
END IF;

-- Check client email preferences
SELECT
COALESCE(opted_in, true),
pause_until_date
INTO client_opted_in, client_pause_date
FROM client_email_preferences
WHERE client_id = NEW.client_id;

-- Respect opt-out preferences
IF client_opted_in = false THEN
RETURN NEW;
END IF;

-- Respect pause period
IF client_pause_date IS NOT NULL AND client_pause_date > CURRENT_DATE THEN
RETURN NEW;
END IF;

-- Calculate scheduled send date (3 days from now)
scheduled_send_date := NOW() + INTERVAL '3 days';

-- Insert the scheduled email
BEGIN
INSERT INTO scheduled_emails (
client_id,
project_id,
template_id,
scheduled_date,
status
)
VALUES (
NEW.client_id,
NEW.id,
review_template_id,
scheduled_send_date,
'pending_generation'
);

-- Update project to mark that review request was queued
NEW.review_request_sent_at := NOW();

EXCEPTION
WHEN OTHERS THEN
-- Log error but don't fail the project status update
RAISE WARNING 'Failed to queue review request for project %: %', NEW.id, SQLERRM;
END;
END IF;

RETURN NEW;
END;
$function$;
