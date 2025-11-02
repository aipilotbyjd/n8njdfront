'use client';

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-2">Configure your workspace</p>
      </div>

      <div className="bg-glass rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-4">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Workspace Name</label>
            <input type="text" defaultValue="Automation Inc." className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Email</label>
            <input type="email" defaultValue="john@automation.com" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-lg hover:scale-105 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
