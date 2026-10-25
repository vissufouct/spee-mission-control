import { Download, FileJson, History, RotateCcw, Save, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMemo, useRef, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { GroupTree } from '../components/GroupTree'
import { ScenarioCanvas } from '../components/ScenarioCanvas'
import { ScenarioInspector } from '../components/ScenarioInspector'
import { VersionDialog } from '../components/VersionDialog'
import { useScenarioCommand, useScenarioDocument, useScenarioExport } from '../hooks/useScenarioEditor'
import type { ScenarioCommand } from '../types'

function breadcrumb(groups: { id: string; title: string; parentId: string | null }[], groupId: string) {
  const items: { id: string; title: string }[] = []
  let current = groups.find(group => group.id === groupId)
  while (current) {
    items.unshift({ id: current.id, title: current.title })
    current = current.parentId ? groups.find(group => group.id === current!.parentId) : undefined
  }
  return items
}

export function ScenarioEditorPage() {
  const documentQuery = useScenarioDocument()
  const mutation = useScenarioCommand()
  const exportDocument = useScenarioExport()
  const fileInput = useRef<HTMLInputElement>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [versionDialogOpen, setVersionDialogOpen] = useState(false)
  const [switchTarget, setSwitchTarget] = useState<string | null>(null)
  const [importJson, setImportJson] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<'node' | 'group' | null>(null)
  const [resetOpen, setResetOpen] = useState(false)
  const document = documentQuery.data
  const snapshot = document?.draft
  const firstGroupId = snapshot?.groups[0]?.id ?? null
  const groupId = selectedGroupId && snapshot?.groups.some(group => group.id === selectedGroupId) ? selectedGroupId : firstGroupId
  const currentGroup = snapshot?.groups.find(group => group.id === groupId)
  const trail = useMemo(() => snapshot && groupId ? breadcrumb(snapshot.groups, groupId) : [], [groupId, snapshot])

  if (documentQuery.isLoading) return <main className="scenario-load"><Workflow /><h1>A carregar o editor de roteiro…</h1></main>
  if (documentQuery.isError || !document || !snapshot || !groupId || !currentGroup) return (
    <main className="scenario-load scenario-load--error"><Workflow /><h1>Não foi possível abrir o editor</h1><p>{documentQuery.error instanceof Error ? documentQuery.error.message : 'O roteiro inicial é inválido.'}</p></main>
  )

  async function execute(command: Parameters<typeof mutation.mutateAsync>[0]['command']) {
    if (mutation.isPending) return
    mutation.reset()
    return mutation.mutateAsync({ command, revision: document!.revision })
  }

  function run(command: ScenarioCommand) { void execute(command) }

  function chooseVersion(versionId: string) {
    if (versionId === document!.activeVersionId) return
    if (document!.dirty) setSwitchTarget(versionId)
    else void execute({ type: 'switch-version', versionId }).then(() => { setSelectedNodeId(null); setSelectedGroupId(null) })
  }

  async function readImport(file: File | undefined) {
    if (!file) return
    try { setImportJson(await file.text()) }
    catch { mutation.reset() }
    if (fileInput.current) fileInput.current.value = ''
  }

  return (
    <main className="scenario-editor">
      <header className="scenario-editor__header">
        <Link to="/" className="scenario-editor__brand"><span><Workflow /></span><span><strong>SPEE Studio</strong><small>Editor visual de roteiro</small></span></Link>
        <div className="scenario-editor__version">
          <label><History size={15} />Versão
            <select value={document.activeVersionId} onChange={event => chooseVersion(event.target.value)} disabled={mutation.isPending}>
              {document.versions.map(version => <option key={version.id} value={version.id}>{version.name}</option>)}
            </select>
          </label>
          <span className={document.dirty ? 'scenario-dirty scenario-dirty--active' : 'scenario-dirty'}>{document.dirty ? 'Alterações por guardar' : 'Versão guardada'}</span>
        </div>
        <div className="scenario-editor__actions">
          <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={event => void readImport(event.target.files?.[0])} />
          <Button variant="ghost" size="sm" onClick={() => fileInput.current?.click()}><FileJson />Importar</Button>
          <Button variant="ghost" size="sm" onClick={() => void exportDocument()}><Download />Exportar JSON</Button>
          <Button variant="outline" size="sm" onClick={() => setResetOpen(true)}><RotateCcw />Repor</Button>
          <Button size="sm" onClick={() => setVersionDialogOpen(true)}><Save />Guardar versão</Button>
        </div>
      </header>

      <div className="scenario-editor__context">
        <div><span>Roteiro</span><strong>{document.title}</strong></div>
        <nav aria-label="Caminho do agrupamento">{trail.map((item, index) => <span key={item.id}>{index > 0 && <i>/</i>}<button type="button" onClick={() => { setSelectedGroupId(item.id); setSelectedNodeId(null) }}>{item.title}</button></span>)}</nav>
        <div className="scenario-editor__counts"><span>{snapshot.nodes.length} nós</span><span>{snapshot.dependencies.length} precedências</span><span>{snapshot.labels.length} etiquetas</span></div>
      </div>

      {mutation.isError && <div className="scenario-editor__error" role="alert">{mutation.error instanceof Error ? mutation.error.message : 'A alteração não foi guardada.'}<button type="button" onClick={() => mutation.reset()}>Fechar</button></div>}

      <div className="scenario-editor__workspace">
        <GroupTree snapshot={snapshot} selectedId={groupId} onSelect={id => { setSelectedGroupId(id); setSelectedNodeId(null) }} />
        <section className="scenario-editor__canvas-wrap" aria-labelledby="scenario-canvas-title">
          <div className="scenario-editor__canvas-heading"><div><span>Área de trabalho</span><h1 id="scenario-canvas-title">{currentGroup.title}</h1></div><p>Arraste para posicionar. Largue um nó sobre outro para trocar as posições. Ligue os pontos laterais para criar precedência.</p></div>
          <ScenarioCanvas
            key={`${groupId}-${document.revision}-${selectedNodeId ?? 'none'}`}
            snapshot={snapshot}
            groupId={groupId}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onOpenGroup={id => { setSelectedGroupId(id); setSelectedNodeId(null) }}
            onMoveNode={(nodeId, position) => run({ type: 'move-node', nodeId, position })}
            onSwapNodes={(nodeId, targetNodeId) => run({ type: 'swap-nodes', nodeId, targetNodeId })}
            onMoveGroup={(movedGroupId, position) => run({ type: 'move-group', groupId: movedGroupId, position })}
            onConnectNodes={(fromNodeId, toNodeId) => run({ type: 'add-dependency', fromNodeId, toNodeId })}
            onDeleteDependency={dependencyId => run({ type: 'delete-dependency', dependencyId })}
          />
        </section>
        <ScenarioInspector
          snapshot={snapshot}
          groupId={groupId}
          selectedNodeId={selectedNodeId}
          onCommand={run}
          onRequestDeleteNode={() => setDeleteTarget('node')}
          onRequestDeleteGroup={() => setDeleteTarget('group')}
        />
      </div>

      <VersionDialog
        open={versionDialogOpen}
        onOpenChange={setVersionDialogOpen}
        suggestedName={`Versão ${document.versions.length + 1}`}
        pending={mutation.isPending}
        onSave={values => void execute({ type: 'save-version', ...values }).then(() => setVersionDialogOpen(false))}
      />
      <ConfirmDialog
        open={Boolean(switchTarget)}
        onOpenChange={open => { if (!open) setSwitchTarget(null) }}
        title="Mudar de versão sem guardar?"
        description="As alterações actuais serão substituídas pela versão escolhida. Exporte o JSON ou guarde uma versão se precisar de as conservar."
        confirmLabel="Mudar de versão"
        onConfirm={() => { if (switchTarget) void execute({ type: 'switch-version', versionId: switchTarget }).then(() => { setSwitchTarget(null); setSelectedNodeId(null); setSelectedGroupId(null) }) }}
        pending={mutation.isPending}
      />
      <ConfirmDialog
        open={Boolean(importJson)}
        onOpenChange={open => { if (!open) setImportJson(null) }}
        title="Importar este roteiro JSON?"
        description="A importação substitui o documento local, incluindo versões. O ficheiro é validado antes de qualquer alteração."
        confirmLabel="Importar roteiro"
        onConfirm={() => { if (importJson) void execute({ type: 'import', json: importJson }).then(() => { setImportJson(null); setSelectedNodeId(null); setSelectedGroupId(null) }) }}
        pending={mutation.isPending}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={open => { if (!open) setDeleteTarget(null) }}
        title={deleteTarget === 'node' ? 'Apagar este nó?' : 'Apagar este agrupamento?'}
        description={deleteTarget === 'node' ? 'As ligações de precedência associadas também serão removidas.' : 'Todos os subagrupamentos, nós e ligações contidos serão removidos.'}
        confirmLabel="Apagar"
        destructive
        onConfirm={() => {
          if (deleteTarget === 'node' && selectedNodeId) void execute({ type: 'delete-node', nodeId: selectedNodeId }).then(() => { setSelectedNodeId(null); setDeleteTarget(null) })
          if (deleteTarget === 'group') {
            const fallback = currentGroup.parentId ?? snapshot.groups.find(group => group.id !== currentGroup.id)?.id ?? null
            void execute({ type: 'delete-group', groupId }).then(() => { setSelectedGroupId(fallback); setSelectedNodeId(null); setDeleteTarget(null) })
          }
        }}
        pending={mutation.isPending}
      />
      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Repor o roteiro importado?"
        description="O documento local e todas as versões criadas neste browser serão substituídos pela importação inicial da folha de cálculo."
        confirmLabel="Repor roteiro"
        destructive
        onConfirm={() => void execute({ type: 'reset' }).then(() => { setResetOpen(false); setSelectedNodeId(null); setSelectedGroupId(null) })}
        pending={mutation.isPending}
      />
    </main>
  )
}
