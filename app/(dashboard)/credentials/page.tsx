'use client';

import { useState, useEffect } from 'react';
import { credentialAPI } from '@/lib/api';
import { useToast } from '@/lib/toast';
import CredentialModal from '@/app/components/CredentialModal';

export default function CredentialsPage() {
  const { showToast } = useToast();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCredential, setEditingCredential] = useState<any>(null);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const result = await credentialAPI.getAll();
      if (result.success) {
        setCredentials(result.data || []);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this credential?')) {
      try {
        await credentialAPI.delete(id);
        showToast('Credential deleted', 'success');
        fetchCredentials();
      } catch (err: any) {
        showToast(err.message || 'Failed to delete', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <CredentialModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={fetchCredentials} credential={editingCredential} />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Credentials</h1>
          <p className="text-gray-400 mt-2">Manage API credentials</p>
        </div>
        <button onClick={() => { setEditingCredential(null); setShowModal(true); }} className="px-6 py-3 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-xl flex items-center gap-2 hover:scale-105 transition-all">
          <span className="material-symbols-outlined">add</span>
          <span className="font-semibold">Add Credential</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading credentials...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((credential) => (
            <div key={credential.id} className="bg-glass rounded-2xl p-6 hover:scale-105 transition-all">
              <div className="size-12 rounded-xl bg-gradient-to-br from-green-400/20 to-green-400/5 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-green-400 text-2xl">key</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{credential.name}</h3>
              <p className="text-gray-400 text-sm capitalize mb-4">{credential.type}</p>
              <div className="flex gap-2">
                <button onClick={() => { setEditingCredential(credential); setShowModal(true); }} className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(credential.id)} className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
