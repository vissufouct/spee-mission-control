import { zodResolver } from '@hookform/resolvers/zod'
import { FolderPlus, GitBranch, Plus, Save, Tag, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { groupDetailsSchema, nodeDetailsSchema } from '../schemas/scenario.schema'
import type { GroupDetails, NodeDetails, ScenarioCommand, ScenarioSnapshot } from '../types'

function NodeInspector({ snapshot, nodeId, onCommand, onRequestDelete }: {
  snapshot: ScenarioSnapshot
  nodeId: string
  onCommand: (command: ScenarioCommand) => void
  onRequestDelete: () => void
}) {
  const node = snapshot.nodes.find(item => item.id === nodeId)!
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<NodeDetails>({
    resolver: zodResolver(nodeDetailsSchema), defaultValues: { title: node.title, description: node.description },
  })
  useEffect(() => reset({ title: node.title, description: node.description }), [node, reset])
  const [predecessorId, setPredecessorId] = useState('')
  const predecessors = snapshot.dependencies.filter(item => item.toNodeId === node.id)
  const availablePredecessors = snapshot.nodes.filter(item => item.id !== node.id && !predecessors.some(link => link.fromNodeId === item.id))
  return (
    <div className="scenario-inspector__body">
      <div className="scenario-panel-heading"><span>Nó seleccionado</span><small>{node.source ? `${node.source.sheet} · ${node.source.column}${node.source.row}` : 'Criado no editor'}</small></div>
      <form className="scenario-form" onSubmit={handleSubmit(values => onCommand({ type: 'update-node', nodeId, values }))}>
        <label>Nome<input {...register('title')} />{errors.title && <small role="alert">{errors.title.message}</small>}</label>
        <label>Descrição<textarea rows={3} {...register('description')} />{errors.description && <small role="alert">{errors.description.message}</small>}</label>
        <label>Agrupamento<select value={node.groupId} onChange={event => onCommand({ type: 'set-node-group', nodeId, groupId: event.target.value })}>{snapshot.groups.map(group => <option key={group.id} value={group.id}>{group.title}</option>)}</select></label>
        <Button size="sm" type="submit" disabled={!isDirty}><Save />Guardar dados do nó</Button>
      </form>

      <section className="scenario-inspector__section">
        <h3><GitBranch size={16} /> Precedências</h3>
        <div className="scenario-inline-control">
          <select aria-label="Escolher nó precedente" value={predecessorId} onChange={event => setPredecessorId(event.target.value)}>
            <option value="">Adicionar predecessor…</option>
            {availablePredecessors.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <Button size="icon" variant="outline" aria-label="Adicionar precedência" disabled={!predecessorId} onClick={() => {
            onCommand({ type: 'add-dependency', fromNodeId: predecessorId, toNodeId: node.id }); setPredecessorId('')
          }}><Plus /></Button>
        </div>
        {predecessors.length ? <ul className="scenario-chip-list">{predecessors.map(link => {
          const source = snapshot.nodes.find(item => item.id === link.fromNodeId)
          return <li key={link.id}><span>{source?.title}</span><button type="button" aria-label={`Remover precedência ${source?.title}`} onClick={() => onCommand({ type: 'delete-dependency', dependencyId: link.id })}><X /></button></li>
        })}</ul> : <p className="scenario-muted">Ainda não tem predecessores.</p>}
      </section>

      <section className="scenario-inspector__section">
        <h3><Tag size={16} /> Etiquetas</h3>
        <div className="scenario-check-list">{snapshot.labels.map(label => <label key={label.id}><input type="checkbox" checked={node.labelIds.includes(label.id)} onChange={event => onCommand({ type: 'toggle-label', nodeId, labelId: label.id, assigned: event.target.checked })} /><span style={{ '--check-color': label.color } as React.CSSProperties}>{label.name}</span></label>)}</div>
      </section>

      <section className="scenario-inspector__section">
        <h3><FolderPlus size={16} /> Agrupamentos como etiqueta</h3>
        <div className="scenario-check-list">{snapshot.groups.map(group => <label key={group.id}><input type="checkbox" checked={node.groupTagIds.includes(group.id)} onChange={event => onCommand({ type: 'toggle-group-tag', nodeId, groupId: group.id, assigned: event.target.checked })} /><span>{group.title}</span></label>)}</div>
      </section>
      <Button variant="destructive" size="sm" onClick={onRequestDelete}><Trash2 />Apagar nó</Button>
    </div>
  )
}

function GroupInspector({ snapshot, groupId, onCommand, onRequestDelete }: {
  snapshot: ScenarioSnapshot
  groupId: string
  onCommand: (command: ScenarioCommand) => void
  onRequestDelete: () => void
}) {
  const group = snapshot.groups.find(item => item.id === groupId)!
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<GroupDetails>({ resolver: zodResolver(groupDetailsSchema), defaultValues: { title: group.title } })
  useEffect(() => reset({ title: group.title }), [group, reset])
  const [nodeName, setNodeName] = useState('')
  const [groupName, setGroupName] = useState('')
  const [labelName, setLabelName] = useState('')
  const childCount = snapshot.groups.filter(item => item.parentId === groupId).length
  const nodeCount = snapshot.nodes.filter(item => item.groupId === groupId).length
  return (
    <div className="scenario-inspector__body">
      <div className="scenario-panel-heading"><span>Agrupamento</span><small>{nodeCount} nós · {childCount} subgrupos</small></div>
      <form className="scenario-form" onSubmit={handleSubmit(values => onCommand({ type: 'update-group', groupId, values }))}>
        <label>Nome<input {...register('title')} />{errors.title && <small role="alert">{errors.title.message}</small>}</label>
        <Button size="sm" type="submit" disabled={!isDirty}><Save />Guardar nome</Button>
      </form>

      <section className="scenario-inspector__section">
        <h3><Plus size={16} /> Criar neste agrupamento</h3>
        <form className="scenario-quick-form" onSubmit={event => { event.preventDefault(); onCommand({ type: 'add-node', groupId, title: nodeName }); setNodeName('') }}>
          <input aria-label="Nome do novo nó" value={nodeName} onChange={event => setNodeName(event.target.value)} placeholder="Nome do novo nó" />
          <Button size="sm" disabled={!nodeName.trim()}>Criar nó</Button>
        </form>
        <form className="scenario-quick-form" onSubmit={event => { event.preventDefault(); onCommand({ type: 'add-group', parentId: groupId, title: groupName }); setGroupName('') }}>
          <input aria-label="Nome do subagrupamento" value={groupName} onChange={event => setGroupName(event.target.value)} placeholder="Nome do subagrupamento" />
          <Button size="sm" variant="outline" disabled={!groupName.trim()}>Criar subgrupo</Button>
        </form>
      </section>

      <section className="scenario-inspector__section">
        <h3><Tag size={16} /> Gerir etiquetas</h3>
        <form className="scenario-quick-form" onSubmit={event => { event.preventDefault(); onCommand({ type: 'add-label', name: labelName }); setLabelName('') }}>
          <input aria-label="Nome da nova etiqueta" value={labelName} onChange={event => setLabelName(event.target.value)} placeholder="Nova etiqueta" />
          <Button size="icon" variant="outline" aria-label="Criar etiqueta" disabled={!labelName.trim()}><Plus /></Button>
        </form>
        <ul className="scenario-label-manager">{snapshot.labels.map(label => <li key={label.id}><span style={{ '--tag': label.color } as React.CSSProperties}>{label.name}</span><button type="button" onClick={() => onCommand({ type: 'convert-label', labelId: label.id, parentGroupId: groupId })}>Converter em grupo</button></li>)}</ul>
      </section>
      <Button variant="destructive" size="sm" onClick={onRequestDelete}><Trash2 />Apagar agrupamento e conteúdo</Button>
    </div>
  )
}

export function ScenarioInspector({ snapshot, groupId, selectedNodeId, onCommand, onRequestDeleteNode, onRequestDeleteGroup }: {
  snapshot: ScenarioSnapshot
  groupId: string
  selectedNodeId: string | null
  onCommand: (command: ScenarioCommand) => void
  onRequestDeleteNode: () => void
  onRequestDeleteGroup: () => void
}) {
  const selectedExists = useMemo(() => snapshot.nodes.some(node => node.id === selectedNodeId), [selectedNodeId, snapshot.nodes])
  return <aside className="scenario-inspector" aria-label="Propriedades do roteiro">{selectedNodeId && selectedExists
    ? <NodeInspector snapshot={snapshot} nodeId={selectedNodeId} onCommand={onCommand} onRequestDelete={onRequestDeleteNode} />
    : <GroupInspector snapshot={snapshot} groupId={groupId} onCommand={onCommand} onRequestDelete={onRequestDeleteGroup} />}</aside>
}
