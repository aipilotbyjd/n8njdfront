'use client';

import { useCallback, useState, useEffect } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { workflowAPI } from '@/lib/api';

const nodeTypes = {
  trigger: ['Webhook', 'Schedule', 'Email Trigger', 'Manual'],
  action: ['HTTP Request', 'Email', 'Slack', 'Database'],
  transform: ['Code', 'Filter', 'Merge', 'Split']
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function WorkflowEditor({ workflow, onClose, onSave }: any) {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow?.nodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow?.connections || initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState(workflow?.name || '');
  const [workflowDescription, setWorkflowDescription] = useState(workflow?.description || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNode = (label: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      data: { label },
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSave = async () => {
    if (!workflowName.trim()) {
      setError('Workflow name is required');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      const data = {
        name: workflowName,
        description: workflowDescription,
        nodes: nodes,
        connections: edges
      };

      let result;
      if (workflow?.id) {
        result = await workflowAPI.update(workflow.id, data);
      } else {
        result = await workflowAPI.create(data);
      }

      if (result.success || result.data) {
        if (onSave) onSave();
        onClose();
      } else {
        setError(result.message || 'Failed to save workflow');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save workflow');
      console.error('Failed to save workflow:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#0a0e1a] w-full h-full flex flex-col">
        <div className="bg-glass-header px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-white">arrow_back</span>
            </button>
            <div className="flex-1 max-w-xl">
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Workflow Name"
                className="text-white font-bold text-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#607AFB] rounded px-3 py-1 w-full"
              />
              <input
                type="text"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Add description..."
                className="text-gray-400 text-sm bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#607AFB] rounded px-3 py-1 w-full mt-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {error && <span className="text-red-400 text-sm mr-2">{error}</span>}
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">{saving ? 'hourglass_empty' : 'save'}</span>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 bg-glass-nav border-r border-white/10 overflow-y-auto p-4">
            <h3 className="text-white font-semibold mb-4">Nodes</h3>
            {Object.entries(nodeTypes).map(([category, items]) => (
              <div key={category} className="mb-4">
                <p className="text-gray-400 text-xs uppercase mb-2">{category}</p>
                <div className="space-y-2">
                  {items.map((node) => (
                    <div 
                      key={node}
                      onClick={() => addNode(node)}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#607AFB] text-lg">account_tree</span>
                        <span className="text-white text-sm">{node}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              fitView
              style={{ background: '#0a0e1a' }}
            >
              <Background color="#ffffff" gap={20} size={1} style={{ opacity: 0.05 }} />
              <Controls style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <MiniMap 
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                nodeColor="#607AFB"
              />
            </ReactFlow>
            
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="material-symbols-outlined text-gray-600 text-6xl mb-4 block">account_tree</span>
                  <p className="text-gray-500 text-lg">Click on nodes from the left panel to start building</p>
                </div>
              </div>
            )}
          </div>

          {selectedNode && (
            <div className="w-80 bg-glass-nav border-l border-white/10 overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Node Properties</h3>
                <button
                  onClick={() => {
                    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
                    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
                    setSelectedNode(null);
                  }}
                  className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Node Name</label>
                  <input
                    type="text"
                    value={selectedNode.data.label}
                    onChange={(e) => {
                      setNodes((nds) =>
                        nds.map((n) =>
                          n.id === selectedNode.id
                            ? { ...n, data: { ...n.data, label: e.target.value } }
                            : n
                        )
                      );
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: e.target.value } });
                    }}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#607AFB]"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Node ID</label>
                  <input
                    type="text"
                    value={selectedNode.id}
                    disabled
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
