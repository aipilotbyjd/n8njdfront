'use client';

import { useState, useEffect } from 'react';
import { credentialAPI } from '@/lib/api';
import { useToast } from '@/lib/toast';

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  credential?: any;
}

const credentialTypes = [
  { value: 'http_basic', label: 'HTTP Basic Auth', icon: 'http' },
  { value: 'http_bearer', label: 'HTTP Bearer Token', icon: 'security' },
  { value: 'oauth2', label: 'OAuth2', icon: 'verified_user' },
  { value: 'api_key', label: 'API Key', icon: 'vpn_key' },
  { value: 'database', label: 'Database', icon: 'storage' },
  { value: 'smtp', label: 'SMTP', icon: 'email' },
  { value: 'aws', label: 'AWS', icon: 'cloud' },
];

export default function CredentialModal({ isOpen, onClose, onSave, credential }: CredentialModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [type, setType] = useState('http');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (credential) {
      setName(credential.name);
      setType(credential.type);
      setData(credential.data || {});
    } else {
      setName('');
      setType('http_basic');
      setData({});
    }
  }, [credential, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { name, type, data };
      if (credential) {
        await credentialAPI.update(credential.id, payload);
        showToast('Credential updated successfully', 'success');
      } else {
        await credentialAPI.create(payload);
        showToast('Credential created successfully', 'success');
      }
      onSave();
      onClose();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to save credential';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'http_basic':
        return (
          <>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Username</label>
              <input
                type="text"
                value={data.username || ''}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <input
                type="password"
                value={data.password || ''}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
          </>
        );
      case 'http_bearer':
        return (
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Bearer Token</label>
            <input
              type="password"
              value={data.token || ''}
              onChange={(e) => setData({ ...data, token: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
            />
          </div>
        );
      case 'api_key':
        return (
          <div>
            <label className="text-gray-400 text-sm mb-2 block">API Key</label>
            <input
              type="password"
              value={data.api_key || ''}
              onChange={(e) => setData({ ...data, api_key: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
            />
          </div>
        );
      case 'oauth2':
        return (
          <>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Client ID</label>
              <input
                type="text"
                value={data.client_id || ''}
                onChange={(e) => setData({ ...data, client_id: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Client Secret</label>
              <input
                type="password"
                value={data.client_secret || ''}
                onChange={(e) => setData({ ...data, client_secret: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
          </>
        );
      case 'database':
        return (
          <>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Host</label>
              <input
                type="text"
                value={data.host || ''}
                onChange={(e) => setData({ ...data, host: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Database</label>
              <input
                type="text"
                value={data.database || ''}
                onChange={(e) => setData({ ...data, database: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Username</label>
              <input
                type="text"
                value={data.username || ''}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <input
                type="password"
                value={data.password || ''}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
          </>
        );
      case 'smtp':
        return (
          <>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Host</label>
              <input
                type="text"
                value={data.host || ''}
                onChange={(e) => setData({ ...data, host: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Port</label>
              <input
                type="number"
                value={data.port || ''}
                onChange={(e) => setData({ ...data, port: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <input
                type="email"
                value={data.email || ''}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <input
                type="password"
                value={data.password || ''}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
          </>
        );
      case 'aws':
        return (
          <>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Access Key ID</label>
              <input
                type="text"
                value={data.access_key_id || ''}
                onChange={(e) => setData({ ...data, access_key_id: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Secret Access Key</label>
              <input
                type="password"
                value={data.secret_access_key || ''}
                onChange={(e) => setData({ ...data, secret_access_key: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Region</label>
              <input
                type="text"
                value={data.region || ''}
                onChange={(e) => setData({ ...data, region: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>
          </>
        );
      default:
        return (
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Configuration (JSON)</label>
            <textarea
              value={JSON.stringify(data, null, 2)}
              onChange={(e) => {
                try {
                  setData(JSON.parse(e.target.value));
                } catch {}
              }}
              rows={6}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
            />
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white text-2xl font-bold">{credential ? 'Edit Credential' : 'Create Credential'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Credential Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="My API Credential"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#607AFB] focus:ring-2 focus:ring-[#607AFB]/30"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Credential Type</label>
              <div className="grid grid-cols-2 gap-3">
                {credentialTypes.map((ct) => (
                  <button
                    key={ct.value}
                    type="button"
                    onClick={() => setType(ct.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      type === ct.value
                        ? 'bg-[#607AFB]/20 border-[#607AFB] text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{ct.icon}</span>
                    <span className="text-sm font-medium">{ct.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-4">
              {renderFields()}
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : credential ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
