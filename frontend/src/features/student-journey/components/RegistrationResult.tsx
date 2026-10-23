import { CheckCircle2, Download, FileCheck2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { downloadJson } from '../services/download'
import type { JourneySnapshot } from '../types'
export function RegistrationResult({ snapshot }: { snapshot: JourneySnapshot }) {
  const registration = snapshot.registration!
  const data = registration.data
  const values = [['Denominação', data.legalName], ['NUIT', data.taxId], ['Actividade económica', data.sector], ['Província', data.province], ['Morada', data.address], ['Correio electrónico', data.email], ['Capital social', new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'MZN' }).format(data.capital)]]
  return <section className="spee-panel p-6">
    <div className="mb-6 flex gap-4 rounded-lg bg-emerald-50 p-5"><CheckCircle2 className="shrink-0 text-emerald-600" size={30} /><div><h2 className="text-xl font-semibold text-emerald-900">Empresa registada</h2><p className="mt-1 text-sm text-emerald-800">Os três critérios foram confirmados e o progresso foi actualizado.</p></div></div>
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">{values.map(([label, value]) => <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-medium">{value}</dd></div>)}</dl>
    <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t pt-5"><div><p className="flex items-center gap-2 font-medium"><FileCheck2 size={20} />Comprovativo de constituição</p><p className="mt-1 text-xs text-slate-500">{registration.receiptNumber}</p></div>
      <Button variant="outline" onClick={() => downloadJson(JSON.stringify({ aviso: 'SIMULAÇÃO PEDAGÓGICA — SEM VALIDADE OFICIAL', ...registration }, null, 2), 'comprovativo-simulacao.json')}><Download />Descarregar comprovativo</Button></div>
    <p className="mt-4 text-xs leading-5 text-slate-500">Resultado de demonstração, sem validade oficial. O registo confirmado é de consulta. Para repetir a experiência, reponha o cenário no Meu Percurso.</p>
  </section>
}
