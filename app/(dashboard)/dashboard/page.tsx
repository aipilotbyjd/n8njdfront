'use client';

import { useState, useEffect } from 'react';
import { workflowAPI, executionAPI } from '@/lib/api';
import { useToast } from '@/lib/toast';
import Link from 'next/link';

export default function DashboardPage() {
  const { showToast } = useToast();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [executions, setExecutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workflowsRes, executionsRes] = await Promise.all([
        workflowAPI.getAll(1),
        executionAPI.getAll(1, 5)
      ]);
      setWorkflows(workflowsRes.success ? workflowsRes.data : []);
      setExecutions(executionsRes.success ? executionsRes.data : []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const activeWorkflows = workflows.filter(w => w.is_active).length;
  const totalExecutions = workflows.reduce((sum, w) => sum + (w.execution_count || 0), 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Active Workflows</p>
            <span className="material-symbols-outlined text-[#607AFB]">account_tree</span>
          </div>
          <p className="text-white text-3xl font-bold">{activeWorkflows}</p>
        </div>
        <div className="bg-glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total Executions</p>
            <span className="material-symbols-outlined text-[#8B5CF6]">bolt</span>
          </div>
          <p className="text-white text-3xl font-bold">{totalExecutions}</p>
        </div>
        <div className="bg-glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Success Rate</p>
            <span className="material-symbols-outlined text-green-400">check_circle</span>
          </div>
          <p className="text-green-400 text-3xl font-bold">95%</p>
        </div>
        <div className="bg-glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total Workflows</p>
            <span className="material-symbols-outlined text-blue-400">folder</span>
          </div>
          <p className="text-white text-3xl font-bold">{workflows.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold">Recent Workflows</h2>
            <Link href="/workflows" className="text-[#607AFB] text-sm hover:underline">View all</Link>
          </div>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="space-y-3">
              {workflows.slice(0, 5).map((workflow) => (
                <div key={workflow.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-white font-medium">{workflow.name}</p>
                    <p className="text-gray-400 text-sm">{workflow.execution_count || 0} executions</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${workflow.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {workflow.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold">Recent Executions</h2>
            <Link href="/executions" className="text-[#607AFB] text-sm hover:underline">View all</Link>
          </div>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="space-y-3">
              {executions.map((execution) => (
                <div key={execution.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Workflow #{execution.workflow_id}</p>
                    <p className="text-gray-400 text-sm">{new Date(execution.started_at).toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${execution.status === 'success' ? 'bg-green-500/20 text-green-400' : execution.status === 'running' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                    {execution.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
