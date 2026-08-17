'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send, CheckCircle2 } from 'lucide-react';
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

const serviceTypes = [
  'New Website Design',
  'Website Redesign',
  'E-commerce Development',
  'Custom Web Application',
  'Systems & Automation',
  'Branding & Logo Design',
  'Full Digital Package',
];

const budgetRanges = [
  'Under $2,500',
  '$2,500 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000+',
];

function WebServiceForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formLoadTime, setFormLoadTime] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    service_type: '',
    budget: '',
    timeline: '',
    goals: '',
    features: '',
    inspiration: '',
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

      const token = await executeRecaptcha('web_service_form');

      const verifyUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-recaptcha`;
      const verifyResponse = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          expectedAction: 'web_service_form',
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

      await supabase.from('contact_submissions').insert([{
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        project_type: form.service_type,
        message: `Current Website: ${form.website}\nBudget: ${form.budget}\nTimeline: ${form.timeline}\nGoals: ${form.goals}\nFeatures: ${form.features}\nInspiration: ${form.inspiration}`,
        recaptcha_score: verifyData.score,
        spam_flagged: false,
      }]);

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again.');
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
              Start a Project
            </h1>
          </div>
        </section>
        <section className="bg-[#f8f8f8] py-24">
          <div className="mx-auto max-w-xl px-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-zero">Request Submitted!</h2>
            <p className="mt-3 text-lg text-zero/60">
              We have received your project details. Our team will review and reach out within 48
              hours.
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
            Get Started
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zero sm:text-5xl">
            Start Your Project
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zero/60">
            Tell us about your project and goals. The more detail you provide, the better we can
            tailor our approach to your needs.
          </p>
        </div>
      </section>

      <section className="bg-[#f8f8f8] py-16">
        <div className="mx-auto max-w-3xl px-6">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-zero/10 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="text-xl font-bold text-zero">Your Information</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zero">Full Name</label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Smith"
                  className="border-zero/15"
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
                  className="border-zero/15"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zero">Phone</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(704) 555-1234"
                  className="border-zero/15"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zero">Company</label>
                <Input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Company Name"
                  className="border-zero/15"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-zero">
                Current Website URL (if any)
              </label>
              <Input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://yoursite.com"
                className="border-zero/15"
              />
            </div>

            <div className="mt-10 h-px bg-zero/10" />

            <h2 className="mt-10 text-xl font-bold text-zero">Project Details</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zero">Service Needed</label>
                <Select onValueChange={(val) => setForm({ ...form, service_type: val })}>
                  <SelectTrigger className="border-zero/15">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zero">Budget Range</label>
                <Select onValueChange={(val) => setForm({ ...form, budget: val })}>
                  <SelectTrigger className="border-zero/15">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-zero">Ideal Timeline</label>
              <Input
                value={form.timeline}
                onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                placeholder="e.g., Launch in 6 weeks"
                className="border-zero/15"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-zero">
                Business Goals
              </label>
              <Textarea
                rows={3}
                value={form.goals}
                onChange={(e) => setForm({ ...form, goals: e.target.value })}
                placeholder="What do you want your website to achieve? More leads, sales, brand awareness?"
                className="border-zero/15 resize-none"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-zero">
                Key Features Needed
              </label>
              <Textarea
                rows={3}
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder="e.g., Contact form, booking system, e-commerce, blog, member area..."
                className="border-zero/15 resize-none"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-zero">
                Inspiration Sites
              </label>
              <Textarea
                rows={2}
                value={form.inspiration}
                onChange={(e) => setForm({ ...form, inspiration: e.target.value })}
                placeholder="Share links to websites you admire or want yours to resemble"
                className="border-zero/15 resize-none"
              />
            </div>

            <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
              <Input
                type="text"
                name="url"
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
              {loading ? 'Submitting...' : 'Submit Project Request'}
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}

export default function WebServiceFormPage() {
  return (
    <ReCaptchaProvider>
      <WebServiceForm />
    </ReCaptchaProvider>
  );
}
