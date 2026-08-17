'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send, MapPin, Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { ReCaptchaProvider } from '@/components/ReCaptchaProvider';
import {
  RECAPTCHA_THRESHOLD,
  isSpamEmail,
  isHoneypotFilled,
  isSubmissionTooFast,
  getSpamRejectionMessage,
} from '@/lib/spam-protection';

const projectTypes = [
  'New Website',
  'Website Redesign',
  'E-commerce Store',
  'Web Application',
  'Systems & Automation',
  'Branding & Design',
  'Other',
];

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formLoadTime, setFormLoadTime] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    honeypot: '',
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    setFormLoadTime(Date.now());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isHoneypotFilled(form.honeypot)) {
        alert(getSpamRejectionMessage('honeypot'));
        setLoading(false);
        return;
      }

      if (isSubmissionTooFast(formLoadTime, Date.now())) {
        alert(getSpamRejectionMessage('timing'));
        setLoading(false);
        return;
      }

      if (isSpamEmail(form.email)) {
        alert(getSpamRejectionMessage('email'));
        setLoading(false);
        return;
      }

      if (!executeRecaptcha) {
        alert('reCAPTCHA not ready. Please try again.');
        setLoading(false);
        return;
      }

      const token = await executeRecaptcha('contact_form');

      const verifyUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-recaptcha`;
      const verifyResponse = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          expectedAction: 'contact_form',
        }),
      });

      if (!verifyResponse.ok) {
        console.error('reCAPTCHA verification failed');
        alert(getSpamRejectionMessage('recaptcha'));
        setLoading(false);
        return;
      }

      const verifyData = await verifyResponse.json();

      if (!verifyData.success || verifyData.score < RECAPTCHA_THRESHOLD) {
        console.log('Spam detected. Score:', verifyData.score);
        alert(getSpamRejectionMessage('recaptcha'));
        setLoading(false);
        return;
      }

      const submissionData = {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        company: form.company || undefined,
        service: form.service || undefined,
        message: form.message,
        created_at: new Date().toISOString(),
        recaptcha_score: verifyData.score,
        spam_flagged: false,
      };

      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([submissionData]);

      if (dbError) {
        console.error('Database error:', dbError);
        alert('There was an error submitting your message. Please try again.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your message. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <>
        <section className="bg-white pt-32 pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <h1 className="text-4xl font-bold tracking-tight text-zero sm:text-5xl">
              Contact Us
            </h1>
          </div>
        </section>
        <section className="bg-[#f8f8f8] py-24">
          <div className="mx-auto max-w-xl px-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-zero">Message Sent!</h2>
            <p className="mt-3 text-lg text-zero/60">
              Thanks for reaching out. We&apos;ll get back to you within 48 hours.
            </p>
            <Button asChild className="mt-8 bg-fahrenheit hover:bg-fahrenheit/90 text-white">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-white pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-fahrenheit">
            Get in Touch
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zero sm:text-5xl">
            Let&apos;s Discuss Your Growth Goals
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zero/60">
            Ready to transform your digital presence? Fill out the form below and we&apos;ll
            schedule a strategy session to discuss your project.
          </p>
        </div>
      </section>

      <section className="bg-[#f8f8f8] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="rounded-2xl border border-zero/10 bg-white p-8 shadow-sm">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zero">Full Name</label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Smith"
                      className="border-zero/15 focus:border-fahrenheit"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zero">Email</label>
                    <Input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@company.com"
                      className="border-zero/15 focus:border-fahrenheit"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zero">Phone</label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(704) 555-1234"
                      className="border-zero/15 focus:border-fahrenheit"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zero">Company</label>
                    <Input
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Company Name"
                      className="border-zero/15 focus:border-fahrenheit"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-zero">Project Type</label>
                  <Select onValueChange={(val) => setForm({ ...form, service: val })}>
                    <SelectTrigger className="border-zero/15">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-zero">
                    Tell us about your project
                  </label>
                  <Textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your project goals, timeline, and any specific requirements..."
                    className="border-zero/15 focus:border-fahrenheit resize-none"
                  />
                </div>

                <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
                  <Input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.honeypot}
                    onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-8 w-full bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-zero/10 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-bold text-zero">Contact Information</h3>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-fahrenheit/10 p-2">
                      <MapPin className="h-5 w-5 text-fahrenheit" />
                    </div>
                    <div>
                      <p className="font-medium text-zero">Location</p>
                      <p className="text-sm text-zero/60">Charlotte, NC</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-fahrenheit/10 p-2">
                      <Mail className="h-5 w-5 text-fahrenheit" />
                    </div>
                    <div>
                      <p className="font-medium text-zero">Email</p>
                      <a href="mailto:hello@sitesonpolaris.com" className="text-sm text-fahrenheit hover:underline">
                        hello@sitesonpolaris.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-fahrenheit/10 p-2">
                      <Phone className="h-5 w-5 text-fahrenheit" />
                    </div>
                    <div>
                      <p className="font-medium text-zero">Phone</p>
                      <a href="tel:+17045551234" className="text-sm text-fahrenheit hover:underline">
                        (704) 555-1234
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zero/10 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-bold text-zero">Prefer a Consultation?</h3>
                <p className="mt-2 text-sm text-zero/60">
                  Schedule a free strategy session where we&apos;ll discuss your business goals and
                  identify opportunities for growth.
                </p>
                <Button asChild className="mt-4 w-full bg-zero hover:bg-zero/90 text-white gap-2">
                  <Link href="/booking">
                    Schedule Consultation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ContactPage() {
  return (
    <ReCaptchaProvider>
      <ContactForm />
    </ReCaptchaProvider>
  );
}
