'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Target,
  Zap,
  Shield,
  TrendingDown,
  Palette,
  Clock,
  Smartphone,
  Search,
  HelpCircle,
} from 'lucide-react';
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

const steps = ['About You', 'Your Challenges', 'Your Project', 'Confirm'];

interface Challenge {
  value: string;
  label: string;
  description: string;
  icon: any;
}

const challenges: Challenge[] = [
  {
    value: 'no-leads',
    label: 'Not Getting Enough Leads',
    description: 'Traffic exists but visitors aren\'t converting',
    icon: TrendingDown
  },
  {
    value: 'outdated-look',
    label: 'Website Looks Outdated',
    description: 'Design doesn\'t reflect your brand quality',
    icon: Palette
  },
  {
    value: 'hard-to-update',
    label: 'Hard to Update Content',
    description: 'Making changes requires technical help',
    icon: Clock
  },
  {
    value: 'too-slow',
    label: 'Site is Too Slow',
    description: 'Pages take forever to load',
    icon: Zap
  },
  {
    value: 'not-mobile-friendly',
    label: 'Not Mobile-Friendly',
    description: 'Poor experience on phones and tablets',
    icon: Smartphone
  },
  {
    value: 'no-google-visibility',
    label: 'Don\'t Show Up in Google',
    description: 'Struggling with search engine rankings',
    icon: Search
  },
  {
    value: 'not-sure',
    label: 'Not Sure Where to Start',
    description: 'Need expert guidance on next steps',
    icon: HelpCircle
  }
];

const budgetRanges = [
  '$500 - $2,500',
  '$2,500 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000+',
  'Not Sure Yet',
];

const timelines = [
  'ASAP',
  '1-2 Months',
  '3-6 Months',
  'No Rush',
];

function BookingForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formLoadTime, setFormLoadTime] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    challenges: [] as string[],
    project_type: '',
    budget: '',
    timeline: '',
    message: '',
    honeypot: '',
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    setFormLoadTime(Date.now());
  }, []);

  const toggleChallenge = (value: string) => {
    setForm({
      ...form,
      challenges: form.challenges.includes(value)
        ? form.challenges.filter((c) => c !== value)
        : [...form.challenges, value]
    });
  };

  async function handleSubmit() {
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

      const token = await executeRecaptcha('booking_form');

      const verifyUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-recaptcha`;
      const verifyResponse = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          expectedAction: 'booking_form',
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

      const nameParts = form.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const { error: dbError } = await supabase.from('consultation_submissions').insert([{
        first_name: firstName,
        last_name: lastName,
        email: form.email,
        phone: form.phone,
        company_name: form.company,
        project_type: form.project_type,
        challenges: form.challenges,
        budget_range: form.budget,
        timeline: form.timeline,
        project_details: form.message,
        submission_source: 'booking-form',
      }]);

      if (dbError) {
        console.error('Database error:', dbError);
        alert('There was an error submitting your consultation request. Please try again.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your consultation request. Please try again.');
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
              Book a Consultation
            </h1>
          </div>
        </section>
        <section className="bg-[#f8f8f8] py-24">
          <div className="mx-auto max-w-xl px-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-zero">Consultation Requested!</h2>
            <p className="mt-3 text-lg text-zero/60">
              We&apos;ll review your information and reach out within 48 hours to schedule your
              strategy consultation.
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
            Free Strategy Session
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zero sm:text-5xl">
            Schedule Your Consultation
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zero/60">
            This consultation will help us understand your business goals and identify opportunities
            for conversion optimization, modern development, and automation.
          </p>
        </div>
      </section>

      <section className="bg-[#f8f8f8] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="mb-8">
                {/* Breadcrumb circles with connecting lines */}
                <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                  {steps.map((s, idx) => (
                    <div key={s} className="flex items-center gap-1 sm:gap-2">
                      <div
                        className={`flex h-10 w-10 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          idx <= step
                            ? 'bg-fahrenheit text-white'
                            : 'bg-zero/10 text-zero/40'
                        }`}
                      >
                        {idx < step ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      {/* Step labels - hidden on mobile, visible on sm+ */}
                      <span
                        className={`hidden sm:inline text-sm font-medium ${
                          idx <= step ? 'text-zero' : 'text-zero/40'
                        }`}
                      >
                        {s}
                      </span>
                      {/* Connecting lines */}
                      {idx < steps.length - 1 && (
                        <div className={`h-px w-4 sm:w-8 sm:mx-2 ${idx < step ? 'bg-fahrenheit' : 'bg-zero/10'}`} />
                      )}
                    </div>
                  ))}
                </div>
                {/* Current step name - only visible on mobile */}
                <div className="mt-3 sm:hidden">
                  <p className="text-sm font-semibold text-fahrenheit">
                    Step {step + 1} of {steps.length}
                  </p>
                  <p className="text-base font-bold text-zero">
                    {steps[step]}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-zero/10 bg-white p-8 shadow-sm">
                {step === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-zero">Tell Us About Yourself</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-zero">Full Name</label>
                        <Input
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="John Smith"
                          className="border-zero/15"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-zero">Email</label>
                        <Input
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
                    <div className="flex justify-end">
                      <Button
                        onClick={() => setStep(1)}
                        disabled={!form.name || !form.email}
                        className="bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-zero">What Challenges Are You Facing?</h2>
                    <p className="text-sm text-zero/60">Select all that apply to help us understand your needs</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {challenges.map((challenge) => {
                        const isSelected = form.challenges.includes(challenge.value);
                        const Icon = challenge.icon;
                        return (
                          <button
                            key={challenge.value}
                            type="button"
                            onClick={() => toggleChallenge(challenge.value)}
                            className={`relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                              isSelected
                                ? 'border-fahrenheit bg-fahrenheit/5 shadow-sm'
                                : 'border-zero/10 bg-white hover:border-zero/20 hover:shadow-sm'
                            }`}
                          >
                            <div className={`rounded-lg p-2 ${isSelected ? 'bg-fahrenheit text-white' : 'bg-zero/5 text-zero'}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium text-sm ${isSelected ? 'text-fahrenheit' : 'text-zero'}`}>
                                {challenge.label}
                              </p>
                              <p className="mt-0.5 text-xs text-zero/60">{challenge.description}</p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-fahrenheit" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(0)} className="gap-2 border-zero/20 text-zero">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={() => setStep(2)}
                        disabled={form.challenges.length === 0}
                        className="bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-zero">About Your Project</h2>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zero">What do you need?</label>
                      <Select onValueChange={(val) => setForm({ ...form, project_type: val })} value={form.project_type}>
                        <SelectTrigger className="border-zero/15">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          {['New Website', 'Website Redesign', 'E-commerce', 'Web Application', 'Automation', 'Branding', 'Other'].map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zero">Budget Range</label>
                      <Select onValueChange={(val) => setForm({ ...form, budget: val })} value={form.budget}>
                        <SelectTrigger className="border-zero/15">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetRanges.map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zero">Timeline</label>
                      <Select onValueChange={(val) => setForm({ ...form, timeline: val })} value={form.timeline}>
                        <SelectTrigger className="border-zero/15">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {timelines.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zero">Project Details</label>
                      <Textarea
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us about your goals, requirements, and any specific features you need..."
                        className="border-zero/15 resize-none"
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)} className="gap-2 border-zero/20 text-zero">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <Button onClick={() => setStep(3)} className="bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2">
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-zero">Confirm Your Details</h2>
                    <div className="rounded-xl bg-[#f8f8f8] p-6 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-zero/60">Name</span>
                        <span className="font-medium text-zero">{form.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zero/60">Email</span>
                        <span className="font-medium text-zero">{form.email}</span>
                      </div>
                      {form.phone && (
                        <div className="flex justify-between text-sm">
                          <span className="text-zero/60">Phone</span>
                          <span className="font-medium text-zero">{form.phone}</span>
                        </div>
                      )}
                      {form.company && (
                        <div className="flex justify-between text-sm">
                          <span className="text-zero/60">Company</span>
                          <span className="font-medium text-zero">{form.company}</span>
                        </div>
                      )}
                      {form.challenges.length > 0 && (
                        <div className="pt-2 border-t border-zero/10">
                          <span className="text-sm text-zero/60">Challenges</span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {form.challenges.map((challengeValue) => {
                              const challenge = challenges.find((c) => c.value === challengeValue);
                              return (
                                <span
                                  key={challengeValue}
                                  className="inline-flex items-center gap-1 rounded-full bg-fahrenheit/10 px-3 py-1 text-xs font-medium text-fahrenheit"
                                >
                                  {challenge && <challenge.icon className="h-3 w-3" />}
                                  {challenge?.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {form.project_type && (
                        <div className="flex justify-between text-sm">
                          <span className="text-zero/60">Project Type</span>
                          <span className="font-medium text-zero">{form.project_type}</span>
                        </div>
                      )}
                      {form.budget && (
                        <div className="flex justify-between text-sm">
                          <span className="text-zero/60">Budget</span>
                          <span className="font-medium text-zero">{form.budget}</span>
                        </div>
                      )}
                      {form.timeline && (
                        <div className="flex justify-between text-sm">
                          <span className="text-zero/60">Timeline</span>
                          <span className="font-medium text-zero">{form.timeline}</span>
                        </div>
                      )}
                      {form.message && (
                        <div className="pt-2 border-t border-zero/10">
                          <span className="text-sm text-zero/60">Details</span>
                          <p className="mt-1 text-sm text-zero">{form.message}</p>
                        </div>
                      )}
                    </div>
                    <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
                      <Input
                        type="text"
                        name="company_url"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.honeypot}
                        onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(2)} className="gap-2 border-zero/20 text-zero">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-fahrenheit hover:bg-fahrenheit/90 text-white gap-2"
                      >
                        {loading ? 'Submitting...' : 'Submit Request'}
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-zero/10 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-bold text-zero">What to Expect</h3>
                <div className="mt-6 space-y-5">
                  {[
                    { icon: Calendar, title: 'Free 30-Min Session', desc: 'No obligation strategy call to discuss your goals.' },
                    { icon: Target, title: 'Custom Roadmap', desc: 'We identify the best approach for your specific needs.' },
                    { icon: Zap, title: 'Quick Turnaround', desc: 'Most projects launch in 4-8 weeks from kickoff.' },
                    { icon: Shield, title: 'No Pressure', desc: 'Honest recommendations even if we are not the right fit.' },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="rounded-lg bg-fahrenheit/10 p-2 h-fit">
                        <item.icon className="h-5 w-5 text-fahrenheit" />
                      </div>
                      <div>
                        <p className="font-medium text-zero">{item.title}</p>
                        <p className="text-sm text-zero/50">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function BookingPage() {
  return (
    <ReCaptchaProvider>
      <BookingForm />
    </ReCaptchaProvider>
  );
}
