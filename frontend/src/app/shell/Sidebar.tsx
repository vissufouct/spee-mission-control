import { Anchor, Calculator, UsersRound } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { navigation } from '../router/navigation'
const icons = { anchor: Anchor, calculator: Calculator, users: UsersRound }
export function Sidebar({ open, onClose, onNotice, homePath = '/estudante/percurso' }: { open: boolean; onClose: () => void; onNotice: (label: string) => void; homePath?: string }) {
  const location = useLocation()
  return <aside className="shell-sidebar" data-open={open} aria-label="Menu do simulador">
    <nav aria-label="Navegação principal">{navigation.map((group, index) => <div key={index}>
      <p className={group.section ? 'menu-section' : 'menu-divider'}>{group.section}</p>
      {group.items.map(item => {
        const Icon = 'icon' in item && item.icon ? icons[item.icon as keyof typeof icons] : null
        const active = item.label === 'Roteiro de Tarefas' && location.pathname.startsWith(homePath)
        const content = <>{Icon && <span className="module-icon"><Icon size={19} /></span>}<span>{item.label}</span></>
        return 'path' in item && item.path
          ? <Link className="menu-item" data-active={active} aria-current={active ? 'page' : undefined} to={homePath} key={item.label} onClick={onClose}>{content}</Link>
          : <button className="menu-item" key={item.label} onClick={() => { onNotice(item.label); onClose() }}>{content}</button>
      })}
    </div>)}</nav>
  </aside>
}
