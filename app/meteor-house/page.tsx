'use client';

import React, { useState } from 'react';
import { Instagram, Send, CheckCircle, Palette, Film, FileImage } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import PortfolioSliderMH from '@/components/portfolio/PortfolioSliderMH';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const services = [
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Brand Identity',
    description:
      'Complete brand identity systems including color palettes, typography, visual language, and brand guidelines that create lasting impressions.',
  },
  {
    icon: <Film className="w-6 h-6" />,
    title: 'Animations',
    description:
      'Dynamic animations and motion design for social media, presentations, website elements, and video content that captivate your audience.',
  },
  {
    icon: <FileImage className="w-6 h-6" />,
    title: 'Print Graphics',
    description:
      'Professional print materials including business cards, brochures, posters, and marketing collateral that make a lasting impression.',
  },
];

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string;
  service_interest: string;
  message: string;
}

export default function MeteorHousePage() {
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    service_interest: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const submissionData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        company_name: formData.company_name || null,
        service_interest: formData.service_interest || null,
        message: formData.message || null,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('meteor_house_consultations').insert([submissionData]);

      if (error) throw error;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-meteor-house-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify(submissionData),
          }
        );

        if (!response.ok) {
          console.error('Email notification failed:', await response.text());
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
      }

      setSubmitSuccess(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_name: '',
        service_interest: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        'There was an error submitting your request. Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 bg-white min-h-screen mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12 md:pb-20">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Meteor House</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="text-center mb-12 md:mb-20">
          <div className="flex items-center justify-center mb-4 md:mb-6">
            <div className="w-full h-full rounded-full flex items-center justify-center">
              <img
                src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Branding/MH%20Logo%20for%20SoP.png"
                alt="Meteor House Logo"
                className="h-20 md:h-32 w-auto"
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-neutral-dark px-2">
            Meteor House
            <br />
            <span className="text-accent-red">Marketing Partner</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-neutral-dark/70 max-w-3xl mx-auto mb-6 md:mb-8 px-4">
            Meteor House delivers explosive creativity with top-tier branding, logo design, and
            eye-catching animations that help businesses stand out instantly.
          </p>
          <a
            href="https://www.instagram.com/meteor_house_/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-neutral-dark text-neutral-dark px-6 py-3 font-semibold hover:bg-neutral-dark hover:text-white transition-all duration-300 min-h-[44px]"
          >
            <Instagram className="w-5 h-5" />
            Follow on Instagram
          </a>
        </div>

        <div className="mb-12 md:mb-20 py-12 md:py-20 bg-neutral-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-neutral-dark">
              <span className="text-accent-red">Services</span> Offered
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white p-4 md:p-6 rounded-lg border-2 border-neutral-gray hover:border-accent-red hover:shadow-lg transition-all duration-300 group text-center"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent-red/10 border border-accent-red/20 flex items-center justify-center mb-3 md:mb-4 text-accent-red mx-auto group-hover:bg-accent-red group-hover:text-white transition-all duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-neutral-dark group-hover:text-accent-red transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-neutral-dark/70 text-sm">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <PortfolioSliderMH />

        <div id="consultation" className="py-12 md:py-20 bg-neutral-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg border-2 border-neutral-gray p-4 md:p-8 lg:p-12">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-neutral-dark">
                  Book a <span className="text-accent-red">Consultation</span>
                </h2>
                <p className="text-sm md:text-base text-neutral-dark/70">
                  Ready to make an impact? Let&apos;s discuss your marketing needs and create something
                  amazing together.
                </p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-6 md:py-8">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-neutral-dark mb-2">
                    Thank You!
                  </h3>
                  <p className="text-sm md:text-base text-neutral-dark/70 mb-6">
                    We&apos;ve received your consultation request. A team member from Meteor House will
                    contact you soon!
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="bg-accent-red text-white px-6 py-3 font-semibold hover:bg-neutral-dark transition-all duration-300 shadow-md min-h-[44px]"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-neutral-dark font-medium mb-2 text-sm md:text-base">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded border-2 border-neutral-gray text-neutral-dark bg-white focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-dark font-medium mb-2 text-sm md:text-base">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded border-2 border-neutral-gray text-neutral-dark bg-white focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-neutral-dark font-medium mb-2 text-sm md:text-base">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded border-2 border-neutral-gray text-neutral-dark bg-white focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-dark font-medium mb-2 text-sm md:text-base">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded border-2 border-neutral-gray text-neutral-dark bg-white focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-dark font-medium mb-2 text-sm md:text-base">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded border-2 border-neutral-gray text-neutral-dark bg-white focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-dark font-medium mb-2 text-sm md:text-base">
                      Service Interest
                    </label>
                    <select
                      name="service_interest"
                      value={formData.service_interest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded border-2 border-neutral-gray text-neutral-dark bg-white focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent min-h-[44px]"
                    >
                      <option value="">Select a service</option>
                      <option value="Branding">Brand Identity</option>
                      <option value="Animations">Animations</option>
                      <option value="Print Graphics">Print Graphics</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-dark font-medium mb-2 text-sm md:text-base">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded border-2 border-neutral-gray text-neutral-dark bg-white focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  {submitError && (
                    <div className="bg-red-500/20 border-2 border-red-500/50 rounded p-3 md:p-4 text-red-700 text-sm md:text-base">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent-red text-white px-6 md:px-8 py-3 md:py-4 font-bold text-base md:text-lg hover:bg-neutral-dark transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="small" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                        Request Consultation
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
