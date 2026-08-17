'use client';

import { useState, useEffect } from 'react';
import { Radio, Send, RefreshCw, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Users, Eye } from 'lucide-react';
import {
  broadcastCampaignAPI,
  getSyncStats,
  supabase,
  type BroadcastCampaign,
} from '@/lib/admin-data';

export default function BroadcastManager() {
  const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>([]);
  const [syncStats, setSyncStats] = useState({
    totalClients: 0,
    syncedContacts: 0,
    lastSyncTime: null as string | null,
    segmentId: null as string | null,
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [sending, setSending] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<BroadcastCampaign | null>(null);
  const [formData, setFormData] = useState({ name: '', subject: '', html_content: '', text_content: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadCampaigns(), loadSyncStats()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async () => {
    const data = await broadcastCampaignAPI.getAll();
    setCampaigns(data);
  };

  const loadSyncStats = async () => {
    const stats = await getSyncStats();
    setSyncStats(stats);
  };

  const handleSyncContacts = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-resend-contacts');
      if (error) throw error;
      alert(`Sync completed! ${data.syncedCount} contacts synced successfully.`);
      await loadSyncStats();
    } catch (error) {
      console.error('Sync error:', error);
      alert(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncStats.segmentId) {
      alert('Please sync contacts first to create a segment.');
      return;
    }
    if (syncStats.syncedContacts === 0) {
      alert('No contacts synced yet. Please sync contacts before creating a broadcast.');
      return;
    }
    try {
      const { data: authData } = await supabase.auth.getUser();
      await broadcastCampaignAPI.create({
        name: formData.name,
        subject: formData.subject,
        html_content: formData.html_content,
        text_content: formData.text_content || null,
        segment_id: syncStats.segmentId,
        status: 'draft',
        recipient_count: syncStats.syncedContacts,
        created_by: authData.user?.id,
      });
      alert('Broadcast campaign created successfully!');
      setFormData({ name: '', subject: '', html_content: '', text_content: '' });
      setShowCreateForm(false);
      await loadCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert(`Failed to create campaign: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSendBroadcast = async (campaign: BroadcastCampaign) => {
    if (!confirm(`Send "${campaign.name}" to ${campaign.recipient_count} contacts?`)) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-resend-broadcast', {
        body: { campaignId: campaign.id },
      });
      if (error) throw error;
      alert(`Broadcast sent! Broadcast ID: ${data.broadcastId}`);
      await loadCampaigns();
    } catch (error) {
      console.error('Send error:', error);
      alert(`Failed to send: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'sending':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Radio className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-8 h-8 text-fahrenheit animate-spin" />
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-2 border border-zero/15 rounded-lg focus:ring-2 focus:ring-fahrenheit focus:border-transparent';

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">About Resend Broadcasts</h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
          <li>Unlimited sending to synced contacts</li>
          <li>Up to 1,000 contacts in your segment</li>
          <li>Contacts automatically synced from your client database</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg border border-zero/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-fahrenheit" />
            <div>
              <h3 className="text-xl font-bold text-zero">Contact Sync Status</h3>
              <p className="text-sm text-zero/50">
                {syncStats.syncedContacts} of {syncStats.totalClients} clients synced to Resend
              </p>
            </div>
          </div>
          <button
            onClick={handleSyncContacts}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 bg-fahrenheit text-white rounded-lg hover:bg-fahrenheit/90 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Contacts'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm text-zero/50 mb-1">Total Clients</div>
            <div className="text-2xl font-bold text-zero">{syncStats.totalClients}</div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm text-zero/50 mb-1">Synced Contacts</div>
            <div className="text-2xl font-bold text-fahrenheit">{syncStats.syncedContacts}</div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm text-zero/50 mb-1">Last Sync</div>
            <div className="text-sm font-medium text-zero">
              {syncStats.lastSyncTime
                ? new Date(syncStats.lastSyncTime).toLocaleString()
                : 'Never'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-zero/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Radio className="w-6 h-6 text-fahrenheit" />
            <h3 className="text-xl font-bold text-zero">Broadcast Campaigns</h3>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-fahrenheit text-white rounded-lg hover:bg-fahrenheit/90 transition-colors"
          >
            {showCreateForm ? 'Cancel' : 'Create Broadcast'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateCampaign} className="mb-6 p-6 bg-muted rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Campaign Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
                required
                minLength={3}
                placeholder="Internal campaign name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Email Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={inputClass}
                required
                maxLength={255}
                placeholder="Subject line for recipients"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">HTML Content</label>
              <textarea
                value={formData.html_content}
                onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                className={`${inputClass} font-mono text-sm`}
                rows={12}
                required
                minLength={50}
                placeholder="HTML email content. Use {{firstName}}, {{lastName}}, {{email}}."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">
                Plain Text Version (Optional)
              </label>
              <textarea
                value={formData.text_content}
                onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
                className={inputClass}
                rows={6}
                placeholder="Plain text version (auto-generated from HTML if empty)"
              />
            </div>
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-zero/50">
                Will be sent to {syncStats.syncedContacts} contacts
              </p>
              <button
                type="submit"
                className="px-6 py-2 bg-fahrenheit text-white rounded-lg hover:bg-fahrenheit/90 transition-colors"
              >
                Create Campaign
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-zero/50">
              <Radio className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No broadcast campaigns yet. Create your first one above!</p>
            </div>
          ) : (
            campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border border-zero/10 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(campaign.status)}
                      <h4 className="font-semibold text-zero">{campaign.name}</h4>
                      <span className="text-xs px-2 py-1 bg-muted rounded-full text-zero/50">
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-sm text-zero/50 mb-2">
                      <strong>Subject:</strong> {campaign.subject}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-zero/40">
                      <span>Recipients: {campaign.recipient_count}</span>
                      <span>
                        Created: {new Date(campaign.created_at).toLocaleDateString()}
                      </span>
                      {campaign.sent_at && (
                        <span>Sent: {new Date(campaign.sent_at).toLocaleString()}</span>
                      )}
                    </div>
                    {campaign.error_message && (
                      <p className="text-xs text-destructive mt-2">
                        Error: {campaign.error_message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() =>
                        setSelectedCampaign(
                          selectedCampaign?.id === campaign.id ? null : campaign
                        )
                      }
                      className="px-3 py-1 text-sm border border-zero/15 rounded hover:bg-muted transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {campaign.status === 'draft' && (
                      <button
                        onClick={() => handleSendBroadcast(campaign)}
                        disabled={sending}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-fahrenheit text-white rounded hover:bg-fahrenheit/90 disabled:opacity-50 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </button>
                    )}
                  </div>
                </div>
                {selectedCampaign?.id === campaign.id && (
                  <div className="mt-4 pt-4 border-t border-zero/10">
                    <h5 className="font-semibold text-sm text-zero mb-2">HTML Content Preview:</h5>
                    <div className="bg-muted p-4 rounded max-h-96 overflow-auto">
                      <pre className="text-xs whitespace-pre-wrap">{campaign.html_content}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
