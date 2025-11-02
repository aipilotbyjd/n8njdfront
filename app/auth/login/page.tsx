'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useToast } from '@/lib/toast';

export default function Login() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authAPI.login({ email, password });

      if (result.success) {
        const token = result.data.token || result.data.access_token;
        localStorage.setItem('access_token', token);
        document.cookie = `access_token=${token}; path=/; max-age=3600`;
        if (result.data.user) {
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }
        if (result.data.organization) {
          localStorage.setItem('organization', JSON.stringify(result.data.organization));
        }
        showToast('Login successful! Welcome back.', 'success');
        router.push('/');
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
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#607AFB] to-[#8B5CF6] rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-[#607AFB] to-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-4xl">account_tree</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Welcome Back</h1>
            <p className="text-gray-400 text-lg">Sign in to continue your automation journey</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="text-gray-300 text-sm font-medium mb-2 block">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-xl group-focus-within:text-[#607AFB] transition-colors">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#607AFB] focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-gray-300 text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-xl group-focus-within:text-[#607AFB] transition-colors">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#607AFB] focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#607AFB] transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded bg-white/5 border-white/10 accent-[#607AFB]" />
                <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-[#607AFB] text-sm hover:text-[#8B5CF6] transition-colors font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#607AFB]/50 hover:scale-[1.02] active:scale-[0.98] transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-[#607AFB] hover:text-[#8B5CF6] transition-colors font-semibold">
                Sign up for free
              </Link>
            </p>
          </div>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a0e1a] text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <button className="py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center justify-center hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            <button className="py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center justify-center hover:scale-105 active:scale-95">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </button>
            <button className="py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center justify-center hover:scale-105 active:scale-95">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
