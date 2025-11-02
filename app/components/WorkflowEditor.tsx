'use client';

import { useCallback, useState } from 'react';
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

const nodeTypes = {
  trigger: ['Webhook', 'Schedule', 'Email Trigger', 'Manual'],
  action: ['HTTP Request', 'Email', 'Slack', 'Database'],
  transform: ['Code', 'Filter', 'Merge', 'Split']
};

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Webhook Trigger' }, position: { x: 250, y: 100 } },
  { id: '2', data: { label: 'HTTP Request' }, position: { x: 250, y: 250 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true }
];

export default function WorkflowEditor({ workflow, onClose }: any) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNode = (label: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      data: { label },
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#0a0e1a] w-full h-full flex flex-col">
        <div className="bg-glass-header px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-white">arrow_back</span>
            </button>
            <div>
              <h2 className="text-white font-bold text-lg">{workflow?.name || 'New Workflow'}</h2>
              <p className="text-gray-400 text-sm">Workflow Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all">
              <span className="material-symbols-outlined text-lg">save</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-[#607AFB] to-[#8B5CF6] text-white rounded-lg transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">play_arrow</span>
              Execute
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
          </div>

          {selectedNode && (
            <div className="w-80 bg-glass-nav border-l border-white/10 overflow-y-auto p-4">
              <h3 className="text-white font-semibold mb-4">Node Properties</h3>
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
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
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
