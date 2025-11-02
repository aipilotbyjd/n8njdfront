'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useToast } from '@/lib/toast';

export default function ChangePassword() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.password_confirmation) {
      const errorMsg = 'New passwords do not match';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await authAPI.changePassword(formData);

      if (result.success) {
        setSuccess(true);
        showToast('Password changed successfully!', 'success');
        setTimeout(() => router.push('/'), 2000);
      } else {
        const errorMsg = result.message || 'Password change failed';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#607AFB]/20 via-transparent to-[#8B5CF6]/20"></div>
      <div className="absolute top-20 -left-20 w-72 h-72 bg-[#607AFB]/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#8B5CF6]/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-glass backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-[#607AFB]/20">
          {!success ? (
            <>
              <div className="text-center mb-10">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#607AFB] to-[#8B5CF6] rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-[#607AFB] to-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white text-4xl">password</span>
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Change Password</h1>
                <p className="text-gray-400 text-lg">Update your account password</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="group">
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Current Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-xl group-focus-within:text-[#607AFB] transition-colors">lock</span>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={formData.current_password}
                      onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                      placeholder="Enter current password"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#607AFB] focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-gray-300 text-sm font-medium mb-2 block">New Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-xl group-focus-within:text-[#607AFB] transition-colors">lock_reset</span>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Enter new password"
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#607AFB] focus:bg-white/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#607AFB] transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPasswords ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="group">
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Confirm New Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-xl group-focus-within:text-[#607AFB] transition-colors">lock_check</span>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                      placeholder="Confirm new password"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#607AFB] focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#607AFB]/50 hover:scale-[1.02] active:scale-[0.98] transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 group">
                  <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  Back to dashboard
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Password Updated!</h1>
              <p className="text-gray-400 text-lg mb-8">Your password has been changed successfully</p>
              <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
