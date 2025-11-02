'use client';

import { useState, useEffect } from 'react';
import { variableAPI } from '@/lib/api';
import { useToast } from '@/lib/toast';

export default function VariablesPage() {
  const { showToast } = useToast();
  const [variables, setVariables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVariables();
  }, []);

  const fetchVariables = async () => {
    setLoading(true);
    try {
      const result = await variableAPI.getAll();
      if (result.success) {
        setVariables(result.data || []);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch variables', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Variables</h1>
          <p className="text-gray-400 mt-2">Manage environment variables</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-xl flex items-center gap-2 hover:scale-105 transition-all">
          <span className="material-symbols-outlined">add</span>
          <span className="font-semibold">Add Variable</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading variables...</div>
        </div>
      ) : (
        <div className="bg-glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-white/5">
              <tr>
                <th className="px-6 py-3">Key</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Scope</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variables.map((variable) => (
                <tr key={variable.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 text-white font-mono">{variable.key}</td>
                  <td className="px-6 py-4 text-gray-400 capitalize">{variable.type}</td>
                  <td className="px-6 py-4 text-gray-400">{variable.workflow_id ? 'Workflow' : 'Global'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-white">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
