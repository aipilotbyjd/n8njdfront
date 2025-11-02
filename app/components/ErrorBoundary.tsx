'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
          <div className="bg-glass rounded-2xl p-8 max-w-md w-full text-center">
            <span className="material-symbols-outlined text-red-400 text-6xl mb-4 block">error</span>
            <h2 className="text-white text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-6">We're sorry for the inconvenience. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-xl transition-all hover:scale-105"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
