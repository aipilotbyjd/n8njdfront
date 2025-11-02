'use client';

import { useState, useEffect } from 'react';
import { workflowAPI } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { useRouter } from 'next/navigation';

export default function WorkflowsPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async (page = 1) => {
    setLoading(true);
    try {
      const result = await workflowAPI.getAll(page);
      if (result.success) {
        setWorkflows(result.data || []);
        setPagination(result);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch workflows', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this workflow?')) {
      try {
        await workflowAPI.delete(id);
        showToast('Workflow deleted', 'success');
        fetchWorkflows(pagination?.current_page || 1);
      } catch (err: any) {
        showToast(err.message || 'Failed to delete', 'error');
      }
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await workflowAPI.activate(id);
      showToast('Workflow activated', 'success');
      fetchWorkflows(pagination?.current_page || 1);
    } catch (err: any) {
      showToast(err.message || 'Failed to activate', 'error');
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await workflowAPI.deactivate(id);
      showToast('Workflow deactivated', 'success');
      fetchWorkflows(pagination?.current_page || 1);
    } catch (err: any) {
      showToast(err.message || 'Failed to deactivate', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Workflows</h1>
          <p className="text-gray-400 mt-2">Manage your automation workflows</p>
        </div>
        <button onClick={() => router.push('/workflows/new')} className="px-6 py-3 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-xl flex items-center gap-2 hover:scale-105 transition-all">
          <span className="material-symbols-outlined">add</span>
          <span className="font-semibold">Create Workflow</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading workflows...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="bg-glass rounded-2xl p-6 hover:scale-105 transition-all">
                <h3 className="text-white font-bold text-lg mb-2">{workflow.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{workflow.description || 'No description'}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10 mb-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${workflow.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {workflow.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-sm text-gray-400">{workflow.execution_count || 0} runs</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => router.push(`/workflows/${workflow.id}`)} className="flex-1 px-3 py-2 bg-[#607AFB]/10 hover:bg-[#607AFB]/20 text-[#607AFB] rounded-lg text-sm">
                    Edit
                  </button>
                  <button onClick={() => workflow.is_active ? handleDeactivate(workflow.id) : handleActivate(workflow.id)} className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm">
                    {workflow.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(workflow.id)} className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => fetchWorkflows(pagination.current_page - 1)} disabled={!pagination.prev_page_url} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50">
                Previous
              </button>
              <span className="text-gray-400 px-4">Page {pagination.current_page} of {pagination.last_page}</span>
              <button onClick={() => fetchWorkflows(pagination.current_page + 1)} disabled={!pagination.next_page_url} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
