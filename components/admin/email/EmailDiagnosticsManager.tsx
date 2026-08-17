'use client';

import { useState } from 'react';
import { Play, Bug, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Loader } from 'lucide-react';
import { supabase } from '@/lib/admin-data';

interface DiagnosticResult {
  success: boolean;
  processed: number;
  emails?: Array<{ client: string; template: string; email_id?: string }>;
  errors?: Array<{ client: string; template: string; error: string }>;
  debug?: string[];
  error?: string;
}

export default function EmailDiagnosticsManager() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  const loadClients = async () => {
    setLoadingClients(true);
    try {
      const { data, error } = await supabase.from('clients').select('id, name').order('name');
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  const runDiagnostics = async (debug = false, clientId?: string) => {
    setLoading(true);
    setResult(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('No session');
      const payload: Record<string, unknown> = { debug };
      if (clientId) payload.client_ids = [clientId];
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-scheduled-emails`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed: ${errorText}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error running diagnostics:', error);
      setResult({
        success: false,
        processed: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-zero/10 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-zero mb-2">Email Processing Diagnostics</h3>
        <p className="text-zero/50 text-sm">
          Test and debug the automated email processing system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-semibold text-zero flex items-center gap-2 text-sm">
            <Play className="w-4 h-4 text-fahrenheit" />
            Quick Actions
          </h4>
          <button
            onClick={() => runDiagnostics(false)}
            disabled={loading}
            className="w-full py-3 px-4 bg-fahrenheit text-white rounded-lg hover:bg-fahrenheit/90 disabled:bg-muted disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            Process All Eligible Emails
          </button>
          <button
            onClick={() => runDiagnostics(true)}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-muted disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Bug className="w-5 h-5" />}
            Debug Mode (All Clients)
          </button>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-zero flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-fahrenheit" />
            Test Specific Client
          </h4>
          <div className="space-y-2">
            {clients.length === 0 && (
              <button
                onClick={loadClients}
                disabled={loadingClients}
                className="w-full py-2 px-4 bg-muted text-zero rounded-lg hover:bg-muted/80 transition-colors"
              >
                {loadingClients ? 'Loading...' : 'Load Clients'}
              </button>
            )}
            {clients.length > 0 && (
              <>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-4 py-2 border border-zero/15 rounded-lg focus:ring-2 focus:ring-fahrenheit"
                >
                  <option value="">Select a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => selectedClientId && runDiagnostics(true, selectedClientId)}
                  disabled={loading || !selectedClientId}
                  className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-muted disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Bug className="w-4 h-4" />
                  Debug This Client
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {result && (
        <div
          className={`rounded-lg p-6 ${
            result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start gap-3 mb-4">
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            )}
            <div>
              <h4
                className={`text-lg font-semibold ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {result.success ? 'Processing Complete' : 'Processing Failed'}
              </h4>
              <p
                className={`text-sm mt-1 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {result.success
                  ? `Processed ${result.processed} email${result.processed !== 1 ? 's' : ''}`
                  : result.error || 'An error occurred'}
              </p>
            </div>
          </div>

          {result.emails && result.emails.length > 0 && (
            <div className="mt-4">
              <h5 className="font-semibold text-green-900 mb-2">Generated Emails:</h5>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.emails.map((email, i) => (
                  <div key={i} className="bg-white rounded p-3 text-sm">
                    <div className="font-medium text-zero">{email.client}</div>
                    <div className="text-zero/50">{email.template}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.errors && result.errors.length > 0 && (
            <div className="mt-4">
              <h5 className="font-semibold text-red-900 mb-2">Errors:</h5>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.errors.map((error, i) => (
                  <div key={i} className="bg-white rounded p-3 text-sm">
                    <div className="font-medium text-zero">{error.client}</div>
                    <div className="text-zero/50">{error.template}</div>
                    <div className="text-destructive mt-1">{error.error}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.debug && result.debug.length > 0 && (
            <div className="mt-4">
              <h5 className="font-semibold text-zero mb-2">Debug Logs:</h5>
              <div className="bg-zinc-900 rounded p-4 overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                  {result.debug.join('\n')}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          How It Works
        </h4>
        <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
          <li>
            <strong>Process All:</strong> Checks all clients and generates eligible emails
          </li>
          <li>
            <strong>Debug Mode:</strong> Shows detailed logs about why emails were/weren&apos;t generated
          </li>
          <li>
            <strong>Specific Client:</strong> Test logic for a single client
          </li>
        </ul>
      </div>
    </div>
  );
}
