'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#607AFB]/20 via-transparent to-[#8B5CF6]/20"></div>
      <div className="absolute top-20 -left-20 w-72 h-72 bg-[#607AFB]/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#8B5CF6]/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-glass backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-[#607AFB]/20">
          {!submitted ? (
            <>
              <div className="text-center mb-10">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#607AFB] to-[#8B5CF6] rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-[#607AFB] to-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white text-4xl">lock_reset</span>
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Forgot Password?</h1>
                <p className="text-gray-400 text-lg">No worries, we'll send you reset instructions</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#607AFB]/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Send Reset Link
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 group">
                  <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white text-4xl">mark_email_read</span>
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Check Your Email</h1>
                <p className="text-gray-400 text-lg mb-2">
                  We sent a password reset link to
                </p>
                <p className="text-white font-semibold text-lg mb-8">{email}</p>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#607AFB] text-xl mt-0.5">info</span>
                    <p className="text-gray-400 text-sm text-left">
                      Didn't receive the email? Check your spam folder or{' '}
                      <button onClick={() => setSubmitted(false)} className="text-[#607AFB] hover:text-[#8B5CF6] transition-colors font-semibold">
                        try another email address
                      </button>
                    </p>
                  </div>
                </div>

                <Link 
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                  <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
