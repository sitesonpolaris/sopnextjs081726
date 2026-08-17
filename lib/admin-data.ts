export { supabase } from './supabase';
import { supabase } from './supabase';

// ==================== TYPES ====================

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  video_url: string | null;
  image_url: string | null;
  tech_stack: string[];
  results: string | null;
  client_name: string | null;
  project_duration: string | null;
  project_year: string | null;
  challenge: string | null;
  solution: string | null;
  features: string[];
  metrics: Array<{ label: string; value: string; icon: string }>;
  testimonial: { text: string; author: string; position: string };
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  website_url: string | null;
  is_visible: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  image_url: string | null;
  featured: boolean;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  read_time: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  status: string;
  website_url: string | null;
  date_completed: string | null;
  created_at: string;
  updated_at: string;
  value: number | null;
  client?: Client;
}

export interface ProjectPayment {
  id: string;
  project_id: string;
  amount: number;
  payment_date: string;
  event: string;
  created_at: string;
  updated_at: string;
}

export interface ConsultationSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  business_description: string | null;
  target_market: string | null;
  project_type: string | null;
  standard_pages: string[];
  additional_services: string[];
  design_tone: string | null;
  has_domain: string | null;
  domain_name: string | null;
  how_did_you_find: string | null;
  quiz_score: number;
  status: string | null;
  created_at: string;
  updated_at: string;
  challenges?: string[];
  budget_range?: string | null;
  timeline?: string | null;
  project_details?: string | null;
  submission_source?: string | null;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  recaptcha_score: number | null;
  submission_time_seconds: number | null;
  spam_flagged: boolean;
  blocked_email: boolean;
  honeypot_triggered: boolean;
  project_type: string | null;
}

export interface ScheduledEmail {
  id: string;
  client_id: string;
  project_id: string | null;
  template_id: string;
  scheduled_date: string | null;
  status: string;
  generated_subject: string;
  generated_content: string;
  approved_by: string | null;
  approved_at: string | null;
  sent_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
  template?: EmailTemplate;
  project?: Project;
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  ai_prompt: string;
  subject_template: string;
  timing_config: Record<string, unknown>;
  active: boolean;
  approval_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  scheduled_email_id: string;
  client_id: string;
  sent_at: string | null;
  resend_id: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  replied_at: string | null;
  bounced: boolean;
  error_message: string | null;
  created_at: string;
}

export interface BroadcastCampaign {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content: string | null;
  segment_id: string;
  resend_broadcast_id: string | null;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  recipient_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  error_message: string | null;
}

export interface BulkEmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  filter_type: string;
  filter_criteria: { client_ids?: string[]; statuses?: string[] };
  status: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  created_by: string | null;
  created_at: string;
  sent_at: string | null;
  updated_at: string;
}

// ==================== PORTFOLIO API ====================

export const portfolioAPI = {
  async getAll(): Promise<PortfolioItem[]> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data as PortfolioItem[];
  },

  async create(item: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data as PortfolioItem;
  },

  async update(id: string, item: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as PortfolioItem;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
    if (error) throw error;
  },

  async toggleVisibility(id: string, visible: boolean): Promise<void> {
    const { error } = await supabase
      .from('portfolio_items')
      .update({ is_visible: visible })
      .eq('id', id);
    if (error) throw error;
  },
};

// ==================== BLOG API ====================

export const blogAPI = {
  async getAll(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data as BlogPost[];
  },

  async create(post: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single();
    if (error) throw error;
    return data as BlogPost;
  },

  async update(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(post)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as BlogPost;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== CLIENTS API ====================

export const clientAPI = {
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data as Client[];
  },

  async create(client: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    if (error) throw error;
    return data as Client;
  },

  async update(id: string, client: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Client;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== PROJECTS API ====================

export const projectAPI = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*, client:clients(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Project[];
  },

  async create(project: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    if (error) throw error;
    return data as Project;
  },

  async update(id: string, project: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Project;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== PROJECT PAYMENTS API ====================

export const projectPaymentAPI = {
  async getAll(): Promise<ProjectPayment[]> {
    const { data, error } = await supabase
      .from('project_payments')
      .select('*')
      .order('payment_date', { ascending: false });
    if (error) throw error;
    return data as ProjectPayment[];
  },

  async getByProject(projectId: string): Promise<ProjectPayment[]> {
    const { data, error } = await supabase
      .from('project_payments')
      .select('*')
      .eq('project_id', projectId)
      .order('payment_date', { ascending: false });
    if (error) throw error;
    return data as ProjectPayment[];
  },

  async create(payment: Partial<ProjectPayment>): Promise<ProjectPayment> {
    const { data, error } = await supabase
      .from('project_payments')
      .insert(payment)
      .select()
      .single();
    if (error) throw error;
    return data as ProjectPayment;
  },

  async update(id: string, payment: Partial<ProjectPayment>): Promise<ProjectPayment> {
    const { data, error } = await supabase
      .from('project_payments')
      .update(payment)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as ProjectPayment;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('project_payments').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== CONSULTATIONS API ====================

export const consultationAPI = {
  async getAll(): Promise<ConsultationSubmission[]> {
    const { data, error } = await supabase
      .from('consultation_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as ConsultationSubmission[];
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('consultation_submissions')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },
};

// ==================== CONTACT SUBMISSIONS API ====================

export const contactSubmissionAPI = {
  async getAll(): Promise<ContactSubmission[]> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as ContactSubmission[];
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  async toggleSpamFlag(id: string, flagged: boolean): Promise<void> {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ spam_flagged: flagged })
      .eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (error) throw error;
  },

  async blockEmail(email: string, reason: string, blockedBy: string | null): Promise<void> {
    const { error } = await supabase.from('email_blocklist').insert({
      email: email.toLowerCase(),
      reason,
      blocked_by: blockedBy,
    });
    if (error) throw error;
  },

  async unblockEmail(email: string): Promise<void> {
    const { error } = await supabase
      .from('email_blocklist')
      .delete()
      .eq('email', email.toLowerCase());
    if (error) throw error;
  },
};

// ==================== SCHEDULED EMAILS API ====================

export const scheduledEmailAPI = {
  async getPendingApproval(): Promise<ScheduledEmail[]> {
    const { data, error } = await supabase
      .from('scheduled_emails')
      .select('*, client:clients(*), template:email_templates(*), project:projects(*)')
      .eq('status', 'pending_approval')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as ScheduledEmail[];
  },

  async getByStatus(status: string): Promise<ScheduledEmail[]> {
    const { data, error } = await supabase
      .from('scheduled_emails')
      .select('*, client:clients(*), template:email_templates(*), project:projects(*)')
      .eq('status', status)
      .order('sent_at', { ascending: false });
    if (error) throw error;
    return data as ScheduledEmail[];
  },

  async approve(
    id: string,
    approvedBy: string,
    edits?: { subject: string; body: string }
  ): Promise<void> {
    const update: Record<string, unknown> = {
      status: 'approved',
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
    };
    if (edits) {
      update.generated_subject = edits.subject;
      update.generated_content = edits.body;
    }
    const { error } = await supabase.from('scheduled_emails').update(update).eq('id', id);
    if (error) throw error;
  },

  async reject(id: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from('scheduled_emails')
      .update({
        status: 'rejected',
        rejection_reason: reason,
      })
      .eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('scheduled_emails').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== EMAIL TEMPLATES API ====================

export const emailTemplateAPI = {
  async getAll(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as EmailTemplate[];
  },

  async create(template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .insert(template)
      .select()
      .single();
    if (error) throw error;
    return data as EmailTemplate;
  },

  async update(id: string, template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .update(template)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as EmailTemplate;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('email_templates').delete().eq('id', id);
    if (error) throw error;
  },

  async toggleActive(id: string, active: boolean): Promise<void> {
    const { error } = await supabase.from('email_templates').update({ active }).eq('id', id);
    if (error) throw error;
  },
};

// ==================== BROADCAST CAMPAIGNS API ====================

export const broadcastCampaignAPI = {
  async getAll(): Promise<BroadcastCampaign[]> {
    const { data, error } = await supabase
      .from('broadcast_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as BroadcastCampaign[];
  },

  async create(campaign: Partial<BroadcastCampaign>): Promise<BroadcastCampaign> {
    const { data, error } = await supabase
      .from('broadcast_campaigns')
      .insert(campaign)
      .select()
      .single();
    if (error) throw error;
    return data as BroadcastCampaign;
  },
};

// ==================== BULK EMAIL CAMPAIGNS API ====================

export const bulkEmailCampaignAPI = {
  async getAll(): Promise<BulkEmailCampaign[]> {
    const { data, error } = await supabase
      .from('bulk_email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as BulkEmailCampaign[];
  },

  async create(campaign: Partial<BulkEmailCampaign>): Promise<BulkEmailCampaign> {
    const { data, error } = await supabase
      .from('bulk_email_campaigns')
      .insert(campaign)
      .select()
      .single();
    if (error) throw error;
    return data as BulkEmailCampaign;
  },
};

// ==================== SYNC STATS HELPER ====================

export async function getSyncStats() {
  const [clientsResult, syncedResult, segmentResult] = await Promise.all([
    supabase.from('clients').select('id', { count: 'exact', head: true }),
    supabase.from('broadcast_contacts_sync').select('*', { count: 'exact', head: true }),
    supabase.from('resend_segment').select('segment_id, updated_at').maybeSingle(),
  ]);

  return {
    totalClients: clientsResult.count || 0,
    syncedContacts: syncedResult.count || 0,
    lastSyncTime: segmentResult.data?.updated_at || null,
    segmentId: segmentResult.data?.segment_id || null,
  };
}

// ==================== STORAGE UPLOAD ====================

export async function uploadFile(
  file: File,
  folder: string,
  bucket: string = 'media'
): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}
