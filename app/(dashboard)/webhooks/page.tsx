'use client';

import { useState, useEffect } from 'react';
import { webhookAPI } from '@/lib/api';
import { useToast } from '@/lib/toast';

export default function WebhooksPage() {
  const { showToast } = useToast();
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const result = await webhookAPI.getAll();
      if (result.success) {
        setWebhooks(result.data || []);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch webhooks', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Webhooks</h1>
          <p className="text-gray-400 mt-2">Manage workflow webhooks</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-xl flex items-center gap-2 hover:scale-105 transition-all">
          <span className="material-symbols-outlined">add</span>
          <span className="font-semibold">Create Webhook</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading webhooks...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="bg-glass rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">{webhook.path}</h3>
                  <p className="text-gray-400 text-sm mb-2">{webhook.method} • {webhook.trigger_count || 0} triggers</p>
                  <code className="text-xs text-[#607AFB] bg-[#607AFB]/10 px-2 py-1 rounded">{webhook.url || `http://n8njd.test/api/webhook/${webhook.workflow_id}/${webhook.path}`}</code>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm">Test</button>
                  <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
