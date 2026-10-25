import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useTeacher } from '../hooks/useTeacher'
import { TeacherLoadState } from '../components/TeacherLoadState'
import { TeacherHeading } from '../components/TeacherHeading'
import { CompanyView } from '../components/CompanyView'
import { ContributionView } from '../components/ContributionView'
import { OrientationsPanel } from '../components/OrientationsPanel'
import { ActivityDialog, type ActivitySelection } from '../components/ActivityDialog'
import { OrientationRequestsDialog } from '../components/OrientationRequestsDialog'
import { teacherPaths } from '../services/teacher.selectors'
export function TeacherCompanyPage({ contributions = false }: { contributions?: boolean }) {
  const { companyId } = useParams()
  const query = useTeacher()
  const [params, setParams] = useSearchParams()
  const [selection, setSelection] = useState<ActivitySelection | null>(null)
  const [requestsOpen, setRequestsOpen] = useState(false)
  if (query.isPending || query.isError) return <TeacherLoadState error={query.error?.message} onRetry={() => { void query.refetch() }} />
  const company = query.data.companies.find(c => c.id === companyId)
  const backParams = new URLSearchParams(params)
  backParams.delete('bloco'); backParams.delete('categoria')
  const suffix = (values: URLSearchParams) => values.size ? '?' + values : ''
  if (!company) return <section className="spee-panel teacher-empty"><h1>Empresa não encontrada</h1><p>Não existe uma empresa com este identificador no cenário local.</p><Link className="teacher-text-link" to={teacherPaths.home + suffix(backParams)}>Voltar à turma</Link></section>
  const selectedBlock = params.get('bloco')
  const blockId = company.blocks.some(b => b.id === selectedBlock) ? selectedBlock! : company.currentBlockId
  const category = ['confirmed', 'collective', 'automatic'].includes(params.get('categoria') ?? '') ? params.get('categoria')! : 'confirmed'
  const change = (key: string, value: string) => setParams(previous => { const next = new URLSearchParams(previous); next.set(key, value); return next }, { replace: true, preventScrollReset: true, flushSync: true })
  const onOpen = (activityId: string, resultId?: string) => setSelection({ activityId, resultId })
  const returnParams = new URLSearchParams(params); returnParams.delete('categoria')
  return <div className="teacher-page">
    <TeacherHeading title={contributions ? 'Contribuição e pista de actividade' : 'Percurso da empresa'} subtitle={company.name + ' · ' + query.data.classes.find(c => c.id === company.classId)?.name + (company.example ? ` · Exemplo ${company.example}` : '')}>
      <Link className="teacher-text-link" to={contributions ? teacherPaths.company(company.id) + suffix(returnParams) : teacherPaths.home + suffix(backParams)}>{contributions ? '← Voltar ao percurso' : '← Voltar à turma'}</Link>
    </TeacherHeading>
    {contributions ? <ContributionView company={company} snapshot={query.data} category={category} onCategory={value => change('categoria', value)} onOpen={onOpen} />
      : <><CompanyView company={company} snapshot={query.data} blockId={blockId} onBlock={id => change('bloco', id)} onOpen={onOpen} onRequests={() => setRequestsOpen(true)} /><OrientationsPanel key={company.id} company={company} snapshot={query.data} /></>}
    <ActivityDialog company={company} selection={selection} onSelect={setSelection} />
    <OrientationRequestsDialog snapshot={query.data} companyId={company.id} open={requestsOpen} onOpenChange={setRequestsOpen} />
  </div>
}
