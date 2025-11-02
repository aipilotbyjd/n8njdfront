export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`${sizeClasses[size]} border-[#607AFB] border-t-transparent rounded-full animate-spin`} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-gray-400 mt-4">Loading...</p>
      </div>
    </div>
  );
}
