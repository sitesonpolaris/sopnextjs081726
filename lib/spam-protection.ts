export const RECAPTCHA_THRESHOLD = 0.6;
export const MIN_SUBMISSION_TIME_MS = 3000;

export const SPAM_EMAIL_DOMAINS = [
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwaway.email',
  'temp-mail.org',
  'fakeinbox.com',
  'trashmail.com',
  'yopmail.com',
  'maildrop.cc',
  'getnada.com',
  'mailnesia.com',
  'sharklasers.com',
  'guerrillamail.info',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.de',
  'spam4.me',
  'mail.tm',
];

export function isSpamEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1];
  if (!domain) return true;
  return SPAM_EMAIL_DOMAINS.includes(domain);
}

export function isHoneypotFilled(honeypotValue: string): boolean {
  return honeypotValue.trim().length > 0;
}

export function isSubmissionTooFast(formLoadTime: number, submissionTime: number): boolean {
  const timeDiff = submissionTime - formLoadTime;
  return timeDiff < MIN_SUBMISSION_TIME_MS;
}

export function getSpamRejectionMessage(reason: string): string {
  const messages: Record<string, string> = {
    recaptcha: 'Your submission was flagged as potential spam. Please try again or contact us directly.',
    honeypot: 'Invalid submission detected. Please refresh and try again.',
    timing: 'Submission was too fast. Please take your time filling out the form.',
    email: 'Please use a valid business or personal email address.',
    default: 'Your submission could not be processed. Please try again later.',
  };

  return messages[reason] || messages.default;
}
