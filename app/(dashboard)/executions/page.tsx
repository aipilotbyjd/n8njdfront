'use client';

import { useState, useEffect } from 'react';
import { executionAPI } from '@/lib/api';
import { useToast } from '@/lib/toast';

export default function ExecutionsPage() {
  const { showToast } = useToast();
  const [executions, setExecutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    fetchExecutions();
  }, []);

  const fetchExecutions = async (page = 1) => {
    setLoading(true);
    try {
      const result = await executionAPI.getAll(page);
      if (result.success) {
        setExecutions(result.data || []);
        setPagination(result);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch executions', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold">Executions</h1>
        <p className="text-gray-400 mt-2">View execution history</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading executions...</div>
        </div>
      ) : (
        <>
          <div className="bg-glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-white/5">
                <tr>
                  <th className="px-6 py-3">Workflow</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Started</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Mode</th>
                </tr>
              </thead>
              <tbody>
                {executions.map((execution) => (
                  <tr key={execution.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4 text-white">Workflow #{execution.workflow_id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${execution.status === 'success' ? 'bg-green-500/20 text-green-400' : execution.status === 'running' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                        {execution.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{new Date(execution.started_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-400">{execution.execution_time_ms ? `${(execution.execution_time_ms / 1000).toFixed(2)}s` : '-'}</td>
                    <td className="px-6 py-4 text-gray-400 capitalize">{execution.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => fetchExecutions(pagination.current_page - 1)} disabled={!pagination.prev_page_url} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50">
                Previous
              </button>
              <span className="text-gray-400 px-4">Page {pagination.current_page} of {pagination.last_page}</span>
              <button onClick={() => fetchExecutions(pagination.current_page + 1)} disabled={!pagination.next_page_url} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
