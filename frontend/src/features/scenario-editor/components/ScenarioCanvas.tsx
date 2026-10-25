import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  applyNodeChanges,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type NodeProps,
  type ReactFlowInstance,
} from '@xyflow/react'
import { FolderOpen, GitBranch, GripVertical } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ScenarioSnapshot } from '../types'

type ActivityData = {
  [key: string]: unknown
  title: string
  labels: { name: string; color: string }[]
  predecessorCount: number
  successorCount: number
}
type GroupData = { [key: string]: unknown; title: string; itemCount: number }
type ActivityFlowNode = Node<ActivityData, 'activity'>
type GroupFlowNode = Node<GroupData, 'groupCard'>
type CanvasNode = ActivityFlowNode | GroupFlowNode

function ActivityCard({ data, selected }: NodeProps<ActivityFlowNode>) {
  return (
    <article className={`scenario-node${selected ? ' scenario-node--selected' : ''}`}>
      <Handle type="target" position={Position.Left} aria-label="Receber precedência" />
      <div className="scenario-node__drag" aria-hidden="true"><GripVertical size={15} /></div>
      <strong>{data.title}</strong>
      <div className="scenario-node__meta">
        {data.predecessorCount > 0 && <span><GitBranch size={12} /> {data.predecessorCount} antes</span>}
        {data.successorCount > 0 && <span>{data.successorCount} depois</span>}
      </div>
      {data.labels.length > 0 && (
        <div className="scenario-node__labels">
          {data.labels.slice(0, 3).map(label => <span key={label.name} style={{ '--tag': label.color } as React.CSSProperties}>{label.name}</span>)}
          {data.labels.length > 3 && <span className="scenario-node__more">+{data.labels.length - 3}</span>}
        </div>
      )}
      <Handle type="source" position={Position.Right} aria-label="Criar precedência" />
    </article>
  )
}

function GroupCard({ data, selected }: NodeProps<GroupFlowNode>) {
  return (
    <article className={`scenario-group-card${selected ? ' scenario-group-card--selected' : ''}`}>
      <span className="scenario-group-card__icon"><FolderOpen size={22} /></span>
      <span><strong>{data.title}</strong><small>{data.itemCount} elementos · duplo clique para abrir</small></span>
    </article>
  )
}

const nodeTypes = { activity: ActivityCard, groupCard: GroupCard }

function countItems(snapshot: ScenarioSnapshot, groupId: string) {
  return snapshot.nodes.filter(node => node.groupId === groupId).length + snapshot.groups.filter(group => group.parentId === groupId).length
}

function makeNodes(snapshot: ScenarioSnapshot, groupId: string, selectedNodeId: string | null): CanvasNode[] {
  const labels = new Map(snapshot.labels.map(label => [label.id, label]))
  const groups = new Map(snapshot.groups.map(group => [group.id, group]))
  const groupNodes: GroupFlowNode[] = snapshot.groups.filter(group => group.parentId === groupId).map(group => ({
    id: group.id,
    type: 'groupCard',
    position: group.position,
    data: { title: group.title, itemCount: countItems(snapshot, group.id) },
    draggable: true,
  }))
  const activityNodes: ActivityFlowNode[] = snapshot.nodes.filter(node => node.groupId === groupId).map(node => ({
    id: node.id,
    type: 'activity',
    position: node.position,
    data: {
      title: node.title,
      labels: [
        ...node.labelIds.flatMap(id => labels.get(id) ? [labels.get(id)!] : []),
        ...node.groupTagIds.flatMap(id => groups.get(id) ? [{ name: groups.get(id)!.title, color: '#475569' }] : []),
      ],
      predecessorCount: snapshot.dependencies.filter(item => item.toNodeId === node.id).length,
      successorCount: snapshot.dependencies.filter(item => item.fromNodeId === node.id).length,
    },
    selected: node.id === selectedNodeId,
  }))
  return [...groupNodes, ...activityNodes]
}

export function ScenarioCanvas({ snapshot, groupId, selectedNodeId, onSelectNode, onOpenGroup, onMoveNode, onSwapNodes, onMoveGroup, onConnectNodes, onDeleteDependency }: {
  snapshot: ScenarioSnapshot
  groupId: string
  selectedNodeId: string | null
  onSelectNode: (id: string | null) => void
  onOpenGroup: (id: string) => void
  onMoveNode: (id: string, position: { x: number; y: number }) => void
  onSwapNodes: (id: string, targetId: string) => void
  onMoveGroup: (id: string, position: { x: number; y: number }) => void
  onConnectNodes: (fromNodeId: string, toNodeId: string) => void
  onDeleteDependency: (id: string) => void
}) {
  const initialNodes = useMemo(() => makeNodes(snapshot, groupId, selectedNodeId), [snapshot, groupId, selectedNodeId])
  const [nodes, setNodes] = useState<CanvasNode[]>(initialNodes)
  const [instance, setInstance] = useState<ReactFlowInstance<CanvasNode, Edge> | null>(null)
  const visibleIds = useMemo(() => new Set(nodes.filter(node => node.type === 'activity').map(node => node.id)), [nodes])
  const edges = useMemo<Edge[]>(() => snapshot.dependencies.filter(item => visibleIds.has(item.fromNodeId) && visibleIds.has(item.toNodeId)).map(item => ({
    id: item.id,
    source: item.fromNodeId,
    target: item.toNodeId,
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#087eff', strokeWidth: 1.8 },
  })), [snapshot.dependencies, visibleIds])

  function handleChanges(changes: NodeChange<CanvasNode>[]) {
    setNodes(current => applyNodeChanges(changes, current))
  }

  function handleDragStop(_: MouseEvent | TouchEvent, node: CanvasNode) {
    if (node.type === 'groupCard') {
      onMoveGroup(node.id, node.position)
      return
    }
    const target = instance?.getIntersectingNodes(node).find(item => item.id !== node.id && item.type === 'activity')
    if (target) onSwapNodes(node.id, target.id)
    else onMoveNode(node.id, node.position)
  }

  function handleConnect(connection: Connection) {
    if (connection.source && connection.target) onConnectNodes(connection.source, connection.target)
  }

  if (!nodes.length) {
    return (
      <div className="scenario-canvas scenario-canvas--empty">
        <FolderOpen size={34} />
        <h2>Este agrupamento está vazio</h2>
        <p>Crie um nó ou um subagrupamento no painel da direita.</p>
      </div>
    )
  }

  return (
    <div className="scenario-canvas" aria-label="Editor visual do roteiro">
      <ReactFlow<CanvasNode, Edge>
        key={groupId}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={setInstance}
        onNodesChange={handleChanges}
        onNodeClick={(_, node) => node.type === 'activity' ? onSelectNode(node.id) : onSelectNode(null)}
        onNodeDoubleClick={(_, node) => { if (node.type === 'groupCard') onOpenGroup(node.id) }}
        onNodeDragStop={handleDragStop}
        onPaneClick={() => onSelectNode(null)}
        onConnect={handleConnect}
        onEdgesDelete={deleted => deleted.forEach(edge => onDeleteDependency(edge.id))}
        deleteKeyCode={null}
        fitView
        fitViewOptions={{ padding: 0.18, maxZoom: 1.1 }}
        minZoom={0.25}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={22} size={1} color="#d9e2ea" />
        <MiniMap pannable zoomable nodeColor={node => node.type === 'groupCard' ? '#c6d7e9' : '#0f9dac'} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
