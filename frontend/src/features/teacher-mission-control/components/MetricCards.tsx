import { Building2, ChartPie, AlertTriangle, Clock3, UsersRound, FileCheck2, Files } from 'lucide-react'
const icons = { companies: Building2, progress: ChartPie, alerts: AlertTriangle, active: Clock3, participants: UsersRound, actions: FileCheck2, results: Files }
export interface MetricItem { label: string; value: string | number; icon: keyof typeof icons; tone: 'green' | 'blue' | 'amber' | 'red'; onClick?: () => void; selected?: boolean }
export function MetricCards({ items }: { items: MetricItem[] }) {
  return <div className="teacher-metrics">{items.map(item => {
    const Icon = icons[item.icon]
    const content = <><span className="teacher-metric-icon"><Icon size={34} strokeWidth={1.8} /></span><span><strong>{item.value}</strong><span className="teacher-metric-label">{item.label}</span></span></>
    return item.onClick
      ? <button key={item.label} className={'teacher-metric teacher-metric--' + item.tone} aria-pressed={item.selected} onClick={item.onClick}>{content}</button>
      : <div key={item.label} className={'teacher-metric teacher-metric--' + item.tone}>{content}</div>
  })}</div>
}
