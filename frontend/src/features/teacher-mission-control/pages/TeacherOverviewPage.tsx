import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTeacher } from '../hooks/useTeacher'
import { TeacherLoadState } from '../components/TeacherLoadState'
import { TeacherHeading } from '../components/TeacherHeading'
import { OverviewView } from '../components/OverviewView'
import { GeneralOrientationsPanel } from '../components/GeneralOrientationsPanel'
import { OrientationRequestsDialog } from '../components/OrientationRequestsDialog'
import { readFilters, teacherPaths } from '../services/teacher.selectors'
export function TeacherOverviewPage() {
  const query = useTeacher()
  const [params, setParams] = useSearchParams()
  const [requestsOpen, setRequestsOpen] = useState(false)
  const navigate = useNavigate()
  if (query.isPending || query.isError) return <TeacherLoadState error={query.error?.message} onRetry={() => { void query.refetch() }} />
  const filters = readFilters(params)
  const currentClass = query.data.classes.find(c => c.id === filters.classId)
  const subtitle = currentClass ? currentClass.name + ' · ' + currentClass.year + ' · ' + currentClass.subject : `Todas as turmas · ${query.data.classes[0]?.year ?? ''}`
  const change = (key: string, value: string) => setParams(previous => {
    const next = new URLSearchParams(previous)
    if (value && value !== 'all') next.set(key, value); else next.delete(key)
    return next
  }, { replace: true, preventScrollReset: true, flushSync: true })
  return <div className="teacher-page">
    <TeacherHeading title="Painel do Docente" subtitle={subtitle} onRefresh={() => { void query.refetch() }} refreshing={query.isFetching}
      contextControl={<label className="my-3 block text-xs font-medium text-slate-600">Universidade
        <select className="mt-1 block min-h-10 w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" value={params.get('universidade') ?? 'uem'} onChange={event => change('universidade', event.target.value)}>
          <option value="uem">Universidade Eduardo Mondlane</option>
          <option value="up-maputo">Universidade Pedagógica de Maputo</option>
          <option value="ujc">Universidade Joaquim Chissano</option>
        </select>
      </label>} />
    <OverviewView snapshot={query.data} filters={filters} onChange={change} onClear={() => setParams(params.get('universidade') ? { universidade: params.get('universidade')! } : {}, { replace: true, preventScrollReset: true, flushSync: true })} onRequests={() => setRequestsOpen(true)} onOpen={(id, milestone) => {
      const next = new URLSearchParams(params)
      if (milestone) next.set('bloco', query.data.companies.find(c => c.id === id)?.activities.find(a => a.milestone === milestone)?.blockId ?? '')
      navigate(teacherPaths.company(id) + (next.size ? '?' + next : ''))
    }} />
    <GeneralOrientationsPanel snapshot={query.data} />
    <OrientationRequestsDialog snapshot={query.data} open={requestsOpen} onOpenChange={setRequestsOpen} />
  </div>
}
