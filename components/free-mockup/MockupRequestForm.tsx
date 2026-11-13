'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ReCaptchaProvider } from '@/components/ReCaptchaProvider';
import { supabase } from '@/lib/supabase';
import {
  RECAPTCHA_THRESHOLD,
  isSpamEmail,
  isHoneypotFilled,
  isSubmissionTooFast,
  getSpamRejectionMessage,
} from '@/lib/spam-protection';

const RECAPTCHA_ACTION = 'free_mockup_form';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  business: '',
  website: '',
  about: '',
  honeypot: '',
};

function Form() {
  const [form, setForm] = useState(emptyForm);
  const [formLoadTime, setFormLoadTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    setFormLoadTime(Date.now());
  }, []);

  const update = (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isHoneypotFilled(form.honeypot)) {
        setError(getSpamRejectionMessage('honeypot'));
        return;
      }
      if (isSubmissionTooFast(formLoadTime, Date.now())) {
        setError(getSpamRejectionMessage('timing'));
        return;
      }
      if (isSpamEmail(form.email)) {
        setError(getSpamRejectionMessage('email'));
        return;
      }
      if (!executeRecaptcha) {
        setError('The spam check is still loading. Please try again in a moment.');
        return;
      }

      const token = await executeRecaptcha(RECAPTCHA_ACTION);
      const verifyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-recaptcha`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, expectedAction: RECAPTCHA_ACTION }),
        }
      );
      const verifyData = verifyResponse.ok ? await verifyResponse.json() : null;
      if (!verifyData?.success || verifyData.score < RECAPTCHA_THRESHOLD) {
        setError(getSpamRejectionMessage('recaptcha'));
        return;
      }

      const [firstName, ...rest] = form.name.trim().split(/\s+/);

      // Saved into columns the notification email trigger already sends, so the
      // request shows up in the inbox email without backend changes.
      const { error: dbError } = await supabase.from('consultation_submissions').insert([
        {
          first_name: firstName,
          last_name: rest.join(' '),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          company_name: form.business.trim(),
          domain_name: form.website.trim() || null,
          business_description: form.about.trim(),
          project_type: 'Free homepage mockup',
          submission_source: 'free-mockup',
        },
      ]);

      if (dbError) {
        console.error('Database error:', dbError);
        setError('Something went wrong sending your request. Please try again, or call (704) 251-5030.');
        return;
      }

      setSubmittedName(firstName);
    } catch (err) {
      console.error('Error submitting mockup request:', err);
      setError('Something went wrong sending your request. Please try again, or call (704) 251-5030.');
    } finally {
      setLoading(false);
    }
  }

  if (submittedName) {
    return (
      <div className="flex flex-col items-center py-8 text-center" role="status">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-700" aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-zero">Got it, {submittedName}!</h2>
        <p className="mt-3 max-w-sm text-zero/80">
          I&apos;ll review what you sent and reach out within 48 hours to talk through your mockup.
          Questions before then? Call{' '}
          <a href="tel:+17042515030" className="font-semibold text-fahrenheit hover:underline">
            (704) 251-5030
          </a>
          .
        </p>
        <Link
          href="/portfolio"
          className="mt-8 inline-flex items-center gap-2 font-semibold text-fahrenheit hover:underline"
        >
          Browse my recent work
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="mockup-name">Your name</Label>
          <Input id="mockup-name" name="name" autoComplete="name" required value={form.name} onChange={update('name')} className="h-12" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="mockup-business">Business name</Label>
          <Input id="mockup-business" name="organization" autoComplete="organization" required value={form.business} onChange={update('business')} className="h-12" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="mockup-email">Email</Label>
          <Input id="mockup-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={update('email')} className="h-12" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="mockup-phone">
            Phone <span className="font-normal text-zero/60">(optional)</span>
          </Label>
          <Input id="mockup-phone" name="tel" type="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} className="h-12" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="mockup-website">
          Current website <span className="font-normal text-zero/60">(optional)</span>
        </Label>
        <Input
          id="mockup-website"
          name="url"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="yourbusiness.com"
          value={form.website}
          onChange={update('website')}
          className="h-12"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="mockup-about">Tell me about your business</Label>
        <Textarea
          id="mockup-about"
          name="about"
          required
          rows={5}
          placeholder="What you do, who your customers are, and what you'd like your homepage to do for you."
          value={form.about}
          onChange={update('about')}
        />
      </div>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="mockup-company-website">Leave this empty</label>
        <input id="mockup-company-website" type="text" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={update('honeypot')} />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-fahrenheit/10 px-4 py-3 text-sm text-fahrenheit">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-fahrenheit px-4 text-[15px] font-bold text-white transition-colors hover:bg-fahrenheit/90 disabled:opacity-70 sm:px-7 sm:text-lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            Get My Free Homepage Mockup
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </>
        )}
      </button>
      <p className="text-center text-sm text-zero/70">No cost, no obligation.</p>
    </form>
  );
}

export function MockupRequestForm() {
  return (
    <ReCaptchaProvider>
      <Form />
    </ReCaptchaProvider>
  );
}
