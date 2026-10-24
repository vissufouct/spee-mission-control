import { FileText, FileSpreadsheet, Video, Link as LinkIcon } from 'lucide-react'
import type { Activity } from '../types'
const formats = { pdf: { label: 'PDF', icon: FileText }, excel: { label: 'Excel', icon: FileSpreadsheet }, word: { label: 'Word', icon: FileText }, video: { label: 'Vídeo', icon: Video }, url: { label: 'Página Web', icon: LinkIcon } }
export function SupportMaterials({ materials }: { materials: NonNullable<Activity['materials']> }) {
  return <section className="mt-5 rounded-md border p-4" aria-label="Materiais de apoio">
    <h3 className="font-semibold">Materiais de apoio</h3>
    {!materials.length && <p className="mt-3 text-sm text-slate-500">Ainda não existem materiais associados a esta actividade.</p>}
    <ul className="divide-y">{materials.map((material, index) => {
      const format = formats[material.format]
      const Icon = format.icon
      const href = material.href?.startsWith('apoio/') ? import.meta.env.BASE_URL + material.href : material.href
      return <li key={index} className="flex items-start gap-3 py-3"><Icon size={20} className="shrink-0 text-cyan-600" aria-hidden /><div>
        {href ? <a className="text-sm font-semibold text-blue-700 underline" href={href} target="_blank" rel="noreferrer">{material.title}<span className="sr-only"> (abre noutro separador)</span></a> : <span className="text-sm font-semibold">{material.title}</span>}
        <p className="text-xs text-slate-500">{format.label}{!href && ' · Recurso ainda não disponível'}</p><p className="mt-1 text-sm text-slate-600">{material.description}</p>
      </div></li>
    })}</ul>
  </section>
}
