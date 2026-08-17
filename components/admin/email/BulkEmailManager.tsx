'use client';

import { useState, useEffect } from 'react';
import { Users, Send, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Loader as Loader2, Eye, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase, bulkEmailCampaignAPI, type BulkEmailCampaign, type Client } from '@/lib/admin-data';

const PROJECT_STATUSES = [
  { value: 'lead_identified', label: 'Lead Identified' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'loom_audit_sent', label: 'Loom Audit Sent' },
  { value: 'call_booked', label: 'Call Booked' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'deposit_received', label: 'Deposit Received' },
  { value: 'website_build', label: 'Website Build' },
  { value: 'retainer_active', label: 'Retainer Active' },
  { value: 'completed_ongoing', label: 'Completed/Ongoing' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function BulkEmailManager() {
  const [activeView, setActiveView] = useState<'compose' | 'history'>('compose');
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'selected' | 'by_status'>('all');
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [recipientCount, setRecipientCount] = useState(0);
  const [previewRecipients, setPreviewRecipients] = useState<Client[]>([]);
  const [campaigns, setCampaigns] = useState<BulkEmailCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [showClientSelect, setShowClientSelect] = useState(false);

  useEffect(() => {
    loadClients();
    loadCampaigns();
  }, []);

  useEffect(() => {
    updateRecipientCount();
  }, [filterType, selectedClientIds, selectedStatuses]);

  const loadClients = async () => {
    const { data, error } = await supabase.from('clients').select('id, name, email').order('name');
    if (!error && data) setAllClients(data as Client[]);
  };

  const loadCampaigns = async () => {
    const data = await bulkEmailCampaignAPI.getAll();
    setCampaigns(data);
  };

  const updateRecipientCount = async () => {
    setLoading(true);
    try {
      let query = supabase.from('clients').select('id, name, email', { count: 'exact' });
      if (filterType === 'selected' && selectedClientIds.length > 0) {
        query = query.in('id', selectedClientIds);
      } else if (filterType === 'by_status' && selectedStatuses.length > 0) {
        const { data: projectClients } = await supabase
          .from('projects')
          .select('client_id')
          .in('status', selectedStatuses);
        const uniqueClientIds = Array.from(new Set(projectClients?.map((p) => p.client_id) || []));
        if (uniqueClientIds.length > 0) {
          query = query.in('id', uniqueClientIds);
        } else {
          setRecipientCount(0);
          setPreviewRecipients([]);
          setLoading(false);
          return;
        }
      }
      const { data, count } = await query.limit(10);
      setRecipientCount(count || 0);
      setPreviewRecipients((data as Client[]) || []);
    } catch (error) {
      console.error('Error counting recipients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientIds((prev) =>
      prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]
    );
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleSendCampaign = async () => {
    if (!campaignName || !subject || !content) {
      alert('Please fill in all required fields');
      return;
    }
    if (!confirmed) {
      alert('Please confirm you want to send this campaign');
      return;
    }
    if (recipientCount === 0) {
      alert('No recipients selected');
      return;
    }
    setSending(true);
    try {
      let filterCriteria = {};
      if (filterType === 'selected') {
        filterCriteria = { client_ids: selectedClientIds };
      } else if (filterType === 'by_status') {
        filterCriteria = { statuses: selectedStatuses };
      }
      const { data: authData } = await supabase.auth.getUser();
      const campaign = await bulkEmailCampaignAPI.create({
        name: campaignName,
        subject,
        content,
        filter_type: filterType,
        filter_criteria: filterCriteria,
        status: 'draft',
        created_by: authData.user?.id,
      });

      const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-bulk-email`;
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaign_id: campaign.id, test_mode: testMode }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to send campaign');
      alert(
        testMode
          ? `Test emails sent! ${result.sent_count} emails sent to admin.`
          : `Campaign sent! ${result.sent_count} emails sent, ${result.failed_count} failed.`
      );
      setCampaignName('');
      setSubject('');
      setContent('');
      setFilterType('all');
      setSelectedClientIds([]);
      setSelectedStatuses([]);
      setConfirmed(false);
      setTestMode(false);
      loadCampaigns();
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert(`Failed to send: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSending(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  const inputClass =
    'w-full px-4 py-2 border border-zero/15 rounded-lg focus:ring-2 focus:ring-fahrenheit focus:border-transparent';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <button
          onClick={() => setActiveView('compose')}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeView === 'compose' ? 'bg-fahrenheit text-white' : 'bg-white text-zero hover:bg-muted'
          }`}
        >
          <Mail className="w-4 h-4" />
          Compose Campaign
        </button>
        <button
          onClick={() => setActiveView('history')}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeView === 'history' ? 'bg-fahrenheit text-white' : 'bg-white text-zero hover:bg-muted'
          }`}
        >
          <Eye className="w-4 h-4" />
          Campaign History
        </button>
      </div>

      {activeView === 'compose' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-zero/10 p-6">
            <h3 className="text-lg font-bold text-zero mb-4">Campaign Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zero mb-2">Campaign Name *</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Monthly Newsletter - January 2025"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zero mb-2">Email Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Use {client_name} for personalization"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zero mb-2">
                  Email Content * (HTML supported)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your email content here. HTML tags are supported."
                  rows={10}
                  className={`${inputClass} font-mono text-sm`}
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => setContent((prev) => prev + '{client_name}')}
                    className="text-xs px-3 py-1 bg-muted text-zero rounded hover:bg-muted/80"
                  >
                    Insert {'{client_name}'}
                  </button>
                  <p className="text-xs text-zero/40">Characters: {content.length} / Min: 50</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-zero/10 p-6">
            <h3 className="text-lg font-bold text-zero mb-4">Recipient Selection</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <input
                    type="radio"
                    name="filterType"
                    checked={filterType === 'all'}
                    onChange={() => setFilterType('all')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-zero text-sm">All Clients</div>
                    <div className="text-xs text-zero/50">Send to all clients</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <input
                    type="radio"
                    name="filterType"
                    checked={filterType === 'selected'}
                    onChange={() => setFilterType('selected')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-zero text-sm">Selected Clients</div>
                    <div className="text-xs text-zero/50">Choose specific clients</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <input
                    type="radio"
                    name="filterType"
                    checked={filterType === 'by_status'}
                    onChange={() => setFilterType('by_status')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-zero text-sm">By Project Status</div>
                    <div className="text-xs text-zero/50">Filter by pipeline stage</div>
                  </div>
                </label>
              </div>

              {filterType === 'selected' && (
                <div>
                  <button
                    onClick={() => setShowClientSelect(!showClientSelect)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <span className="font-medium">
                      {selectedClientIds.length > 0
                        ? `${selectedClientIds.length} clients selected`
                        : 'Select clients'}
                    </span>
                    {showClientSelect ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  {showClientSelect && (
                    <div className="mt-2 max-h-64 overflow-y-auto border border-zero/10 rounded-lg">
                      {allClients.map((client) => (
                        <label
                          key={client.id}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-muted cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedClientIds.includes(client.id)}
                            onChange={() => handleClientSelect(client.id)}
                          />
                          <div>
                            <div className="font-medium text-sm text-zero">{client.name}</div>
                            <div className="text-xs text-zero/50">{client.email}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {filterType === 'by_status' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {PROJECT_STATUSES.map((status) => (
                    <label
                      key={status.value}
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-muted"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status.value)}
                        onChange={() => handleStatusToggle(status.value)}
                      />
                      <span className="text-sm text-zero">{status.label}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-bold text-lg text-zero">
                        {loading ? 'Calculating...' : recipientCount}
                      </div>
                      <div className="text-sm text-zero/50">Eligible Recipients</div>
                    </div>
                  </div>
                  {previewRecipients.length > 0 && (
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-sm text-fahrenheit hover:underline"
                    >
                      {showPreview ? 'Hide' : 'Show'} Preview
                    </button>
                  )}
                </div>
                {showPreview && previewRecipients.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-zero/50 mb-2">
                      First {previewRecipients.length} recipients:
                    </p>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {previewRecipients.map((client) => (
                        <div key={client.id} className="text-sm text-zero">
                          {client.name} <span className="text-zero/40">({client.email})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-zero/10 p-6">
            <h3 className="text-lg font-bold text-zero mb-4">Review & Send</h3>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium text-zero mb-2 text-sm">Campaign Summary</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {campaignName || 'Not set'}
                  </p>
                  <p>
                    <span className="font-medium">Subject:</span> {subject || 'Not set'}
                  </p>
                  <p>
                    <span className="font-medium">Recipients:</span> {recipientCount}
                  </p>
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 border-2 border-yellow-300 bg-yellow-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={testMode}
                  onChange={(e) => setTestMode(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-zero text-sm">Test Mode</div>
                  <div className="text-xs text-zero/50">
                    Send all emails to hello@sitesonpolaris.com instead of actual recipients
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-fahrenheit rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-zero text-sm">
                    I have reviewed and want to send to {recipientCount} recipients
                  </div>
                  <div className="text-xs text-zero/50">This action cannot be undone</div>
                </div>
              </label>

              <button
                onClick={handleSendCampaign}
                disabled={!confirmed || sending || recipientCount === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-fahrenheit text-white rounded-lg hover:bg-fahrenheit/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Campaign...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {testMode ? 'Send Test Campaign' : 'Send Campaign'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-zero/10 p-6">
          <h3 className="text-lg font-bold text-zero mb-4">Campaign History</h3>
          {campaigns.length === 0 ? (
            <div className="text-center py-8 text-zero/50">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No campaigns sent yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border border-zero/10 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-bold text-zero text-sm">{campaign.name}</h4>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            campaign.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : campaign.status === 'sending'
                              ? 'bg-blue-100 text-blue-800'
                              : campaign.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </div>
                      <p className="text-sm text-zero/50 mb-2 break-words">{campaign.subject}</p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {campaign.total_recipients} recipients
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          {campaign.sent_count} sent
                        </span>
                        {campaign.failed_count > 0 && (
                          <span className="flex items-center gap-1 text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            {campaign.failed_count} failed
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setExpandedCampaign(
                          expandedCampaign === campaign.id ? null : campaign.id
                        )
                      }
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      {expandedCampaign === campaign.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {expandedCampaign === campaign.id && (
                    <div className="mt-4 pt-4 border-t border-zero/10">
                      <div className="bg-muted p-4 rounded-lg">
                        <h5 className="font-medium text-zero mb-2">Campaign Details</h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Filter Type:</span>{' '}
                            {campaign.filter_type === 'all'
                              ? 'All Clients'
                              : campaign.filter_type === 'selected'
                              ? 'Selected Clients'
                              : 'By Project Status'}
                          </div>
                          <div>
                            <span className="font-medium">Content Preview:</span>
                            <div className="mt-1 p-3 bg-white rounded border border-zero/10 max-h-32 overflow-y-auto text-xs">
                              {campaign.content.substring(0, 300)}...
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
