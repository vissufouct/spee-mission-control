import { ChevronRight, Folder, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ScenarioGroup, ScenarioSnapshot } from '../types'

function TreeBranch({ group, snapshot, selectedId, onSelect, visibleIds }: {
  group: ScenarioGroup
  snapshot: ScenarioSnapshot
  selectedId: string
  onSelect: (id: string) => void
  visibleIds: Set<string> | null
}) {
  const children = snapshot.groups.filter(item => item.parentId === group.id && (!visibleIds || visibleIds.has(item.id)))
  return (
    <li>
      <div className={`scenario-tree__row${selectedId === group.id ? ' scenario-tree__row--active' : ''}`}>
        {children.length > 0 ? <ChevronRight className="scenario-tree__chevron" size={14} /> : <span className="scenario-tree__spacer" />}
        <button type="button" onClick={() => onSelect(group.id)} title={group.title}>
          <Folder size={15} aria-hidden="true" />
          <span>{group.title}</span>
        </button>
      </div>
      {children.length > 0 && <ul>{children.map(child => <TreeBranch key={child.id} group={child} snapshot={snapshot} selectedId={selectedId} onSelect={onSelect} visibleIds={visibleIds} />)}</ul>}
    </li>
  )
}

export function GroupTree({ snapshot, selectedId, onSelect }: { snapshot: ScenarioSnapshot; selectedId: string; onSelect: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const visibleIds = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('pt-PT')
    if (!term) return null
    const ids = new Set(snapshot.groups.filter(group => group.title.toLocaleLowerCase('pt-PT').includes(term)).map(group => group.id))
    for (const id of [...ids]) {
      let parent = snapshot.groups.find(group => group.id === id)?.parentId
      while (parent) {
        ids.add(parent)
        parent = snapshot.groups.find(group => group.id === parent)?.parentId
      }
    }
    return ids
  }, [query, snapshot.groups])
  const roots = snapshot.groups.filter(group => group.parentId === null && (!visibleIds || visibleIds.has(group.id)))
  return (
    <aside className="scenario-tree" aria-label="Estrutura do roteiro">
      <div className="scenario-panel-heading"><span>Estrutura</span><small>{snapshot.groups.length} agrupamentos</small></div>
      <label className="scenario-search"><Search size={15} /><span className="sr-only">Pesquisar agrupamentos</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Pesquisar" /></label>
      <nav aria-label="Agrupamentos do roteiro">
        {roots.length ? <ul className="scenario-tree__root">{roots.map(root => <TreeBranch key={root.id} group={root} snapshot={snapshot} selectedId={selectedId} onSelect={onSelect} visibleIds={visibleIds} />)}</ul> : <p className="scenario-tree__empty">Nenhum agrupamento encontrado.</p>}
      </nav>
    </aside>
  )
}
