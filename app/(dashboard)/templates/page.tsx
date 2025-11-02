'use client';

import { useState, useEffect } from 'react';
import { templateAPI } from '@/lib/api';
import { useToast } from '@/lib/toast';

export default function TemplatesPage() {
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const result = await templateAPI.getAll();
      if (result.success) {
        setTemplates(result.data || []);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUse = async (id: number) => {
    try {
      await templateAPI.use(id);
      showToast('Template applied successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to use template', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold">Templates</h1>
        <p className="text-gray-400 mt-2">Start with pre-built templates</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading templates...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-glass rounded-2xl p-6 hover:scale-105 transition-all">
              <h3 className="text-white font-bold text-lg mb-2">{template.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{template.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm text-gray-400">{template.usage_count || 0} uses</span>
                <button onClick={() => handleUse(template.id)} className="px-4 py-2 bg-[#607AFB] hover:bg-[#4f68d9] text-white text-sm rounded-lg">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
