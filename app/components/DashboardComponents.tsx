import { useState } from 'react';
import CredentialModal from './CredentialModal';

export function DashboardContent({ timeRange, setTimeRange, workflows, executions, openEditor }: any) {
  const activeWorkflows = workflows.filter((w: any) => w.is_active).length;
  const totalExecutions = workflows.reduce((sum: number, w: any) => sum + (w.execution_count || 0), 0);
  const successRate = totalExecutions > 0 ? 95 : 0;
  const errorWorkflows = workflows.filter((w: any) => w.status === 'error').length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-white text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:bg-white/10 transition-all cursor-pointer"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <button onClick={() => openEditor()} className="px-6 py-2.5 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#607AFB]/30 hover:scale-105">
            <span className="material-symbols-outlined text-lg">add</span>
            <span className="font-semibold">New Workflow</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card flex flex-col gap-3 rounded-2xl p-6 bg-glass hover:scale-105 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm font-medium">Total Active Workflows</p>
            <div className="size-12 rounded-xl bg-gradient-to-br from-[#607AFB]/20 to-[#607AFB]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#607AFB] text-2xl">account_tree</span>
            </div>
          </div>
          <p className="text-white text-4xl font-bold">{activeWorkflows}</p>
        </div>
        <div className="stat-card flex flex-col gap-3 rounded-2xl p-6 bg-glass hover:scale-105 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm font-medium">Total Executions</p>
            <div className="size-12 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#8B5CF6] text-2xl">bolt</span>
            </div>
          </div>
          <p className="text-white text-4xl font-bold">{totalExecutions}</p>
        </div>
        <div className="stat-card flex flex-col gap-3 rounded-2xl p-6 bg-glass hover:scale-105 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm font-medium">Success Rate</p>
            <div className="size-12 rounded-xl bg-gradient-to-br from-green-400/20 to-green-400/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-green-400 text-2xl">check_circle</span>
            </div>
          </div>
          <p className="text-green-400 text-4xl font-bold">{successRate.toFixed(1)}%</p>
        </div>
        <div className="stat-card flex flex-col gap-3 rounded-2xl p-6 bg-glass hover:scale-105 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm font-medium">Errors</p>
            <div className="size-12 rounded-xl bg-gradient-to-br from-red-400/20 to-red-400/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-red-400 text-2xl">error</span>
            </div>
          </div>
          <p className="text-red-400 text-4xl font-bold">{errorWorkflows}</p>
        </div>
      </div>
    </div>
  );
}

export function WorkflowsContent({ workflows, openEditor, pagination, onPageChange, loading, onDelete, onDuplicate, onActivate, onDeactivate, onExecute }: any) {
  const [filter, setFilter] = useState('all');
  const filteredWorkflows = filter === 'all' ? (workflows || []) : (workflows || []).filter((w: any) => w.status === filter);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-gray-400 mt-2">Manage automation workflows</p>
        </div>
        <button onClick={() => openEditor()} className="px-6 py-3 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#607AFB]/30 hover:scale-105">
          <span className="material-symbols-outlined text-lg">add</span>
          <span className="font-semibold">Create Workflow</span>
        </button>
      </div>
      
      <div className="flex gap-2 mb-6">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'all' ? 'bg-[#607AFB] text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}>All</button>
        <button onClick={() => setFilter('active')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'active' ? 'bg-[#607AFB] text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}>Active</button>
        <button onClick={() => setFilter('draft')} className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === 'draft' ? 'bg-[#607AFB] text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}>Draft</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading workflows...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredWorkflows || []).map((workflow: any) => (
              <div key={workflow.id} className="bg-glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 group relative">
                <div onClick={() => openEditor(workflow)} className="cursor-pointer">
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#607AFB] transition-colors">{workflow.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{workflow.description || 'No description'}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className={`text-xs px-2 py-1 rounded-full ${workflow.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{workflow.status}</span>
                    <span className="text-sm text-gray-400">{workflow.execution_count} runs</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={(e) => { e.stopPropagation(); onExecute(workflow.id); }}
                    className="flex-1 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm transition-all flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">play_arrow</span>
                    Execute
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); workflow.is_active ? onDeactivate(workflow.id) : onActivate(workflow.id); }}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-1 ${workflow.is_active ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400' : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400'}`}
                  >
                    <span className="material-symbols-outlined text-sm">{workflow.is_active ? 'pause' : 'play_arrow'}</span>
                    {workflow.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onDuplicate(workflow.id); }}
                    className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-all flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    Duplicate
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(workflow.id); }}
                    className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-all flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => onPageChange(pagination.current_page - 1)}
                disabled={!pagination.prev_page_url}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="text-gray-400 px-4">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <button
                onClick={() => onPageChange(pagination.current_page + 1)}
                disabled={!pagination.next_page_url}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function ExecutionsContent({ executions, pagination, onPageChange, loading }: any) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold tracking-tight">Executions</h1>
        <p className="text-gray-400 mt-2">View execution history</p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading executions...</div>
        </div>
      ) : (
        <>
          <div className="bg-glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-white/5">
                <tr>
                  <th className="px-6 py-3">Workflow</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Started</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Mode</th>
                </tr>
              </thead>
              <tbody>
                {(executions || []).map((execution: any) => (
                  <tr key={execution.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4 text-white">{execution.workflow_id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${execution.status === 'success' ? 'bg-green-500/20 text-green-400' : execution.status === 'running' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                        {execution.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{new Date(execution.started_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-400">{execution.execution_time_ms ? `${(execution.execution_time_ms / 1000).toFixed(2)}s` : '-'}</td>
                    <td className="px-6 py-4 text-gray-400 capitalize">{execution.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => onPageChange(pagination.current_page - 1)}
                disabled={!pagination.prev_page_url}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="text-gray-400 px-4">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <button
                onClick={() => onPageChange(pagination.current_page + 1)}
                disabled={!pagination.next_page_url}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function CredentialsContent({ credentials, onDelete, onRefresh, loading }: any) {
  const [showModal, setShowModal] = useState(false);
  const [editingCredential, setEditingCredential] = useState<any>(null);

  const handleCreate = () => {
    setEditingCredential(null);
    setShowModal(true);
  };

  const handleEdit = (credential: any) => {
    setEditingCredential(credential);
    setShowModal(true);
  };

  const handleSave = () => {
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <CredentialModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        credential={editingCredential}
      />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold tracking-tight">Credentials</h1>
          <p className="text-gray-400 mt-2">Manage API credentials</p>
        </div>
        <button onClick={handleCreate} className="px-6 py-3 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#607AFB]/30 hover:scale-105">
          <span className="material-symbols-outlined text-lg">add</span>
          <span className="font-semibold">Add Credential</span>
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading credentials...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(credentials || []).map((credential: any) => (
            <div key={credential.id} className="bg-glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 group">
              <div className="size-12 rounded-xl bg-gradient-to-br from-green-400/20 to-green-400/5 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-green-400 text-2xl">key</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{credential.name}</h3>
              <p className="text-gray-400 text-sm capitalize mb-4">{credential.type}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(credential)}
                  className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-all flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => onDelete(credential.id)}
                  className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-all flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
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

export function TemplatesContent({ templates, pagination, onPageChange, onUse, loading }: any) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold tracking-tight">Templates</h1>
        <p className="text-gray-400 mt-2">Start with pre-built templates</p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading templates...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(templates || []).map((template: any) => (
              <div key={template.id} className="bg-glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 group">
                <h3 className="text-white font-bold text-lg mb-2">{template.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-sm text-gray-400">{template.usage_count || 0} uses</span>
                  <button onClick={() => onUse(template.id)} className="px-4 py-2 bg-[#607AFB] hover:bg-[#4f68d9] text-white text-sm rounded-lg transition-all">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => onPageChange(pagination.current_page - 1)}
                disabled={!pagination.prev_page_url}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="text-gray-400 px-4">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <button
                onClick={() => onPageChange(pagination.current_page + 1)}
                disabled={!pagination.next_page_url}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function SettingsContent() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-400 mt-2">Configure workspace</p>
      </div>
      
      <div className="bg-glass rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-4">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Workspace Name</label>
            <input type="text" defaultValue="Automation Inc." className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WebhooksContent({ webhooks, onRefresh, loading }: any) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold tracking-tight">Webhooks</h1>
          <p className="text-gray-400 mt-2">Manage workflow webhooks</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#607AFB]/30 hover:scale-105">
          <span className="material-symbols-outlined text-lg">add</span>
          <span className="font-semibold">Create Webhook</span>
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading webhooks...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {(webhooks || []).map((webhook: any) => (
            <div key={webhook.id} className="bg-glass rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">{webhook.path}</h3>
                  <p className="text-gray-400 text-sm mb-2">{webhook.method} • {webhook.trigger_count || 0} triggers</p>
                  <code className="text-xs text-[#607AFB] bg-[#607AFB]/10 px-2 py-1 rounded">{webhook.url || `http://n8njd.test/api/webhook/${webhook.workflow_id}/${webhook.path}`}</code>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-all">
                    Test
                  </button>
                  <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-all">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function VariablesContent({ variables, onRefresh, loading }: any) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold tracking-tight">Variables</h1>
          <p className="text-gray-400 mt-2">Manage environment variables</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#607AFB]/30 hover:scale-105">
          <span className="material-symbols-outlined text-lg">add</span>
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
              {(variables || []).map((variable: any) => (
                <tr key={variable.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 text-white font-mono">{variable.key}</td>
                  <td className="px-6 py-4 text-gray-400 capitalize">{variable.type}</td>
                  <td className="px-6 py-4 text-gray-400">{variable.workflow_id ? 'Workflow' : 'Global'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button className="text-red-400 hover:text-red-300 transition-colors">
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
