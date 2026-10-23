import { useEffect, useState } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { MessageCircle, UserRound } from 'lucide-react'
import { Dialog } from '@/shared/components/ui/dialog'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { teacherPaths } from '@/features/teacher-mission-control'
import { journeyPaths } from '@/features/student-journey'
import './shell.css'
export function AppShell({ role = 'student' }: { role?: 'student' | 'teacher' }) {
  const [menuOpen, setMenuOpen] = useState(() => window.matchMedia('(min-width: 901px)').matches)
  useEffect(() => {
    const media = window.matchMedia('(min-width: 901px)')
    const resize = () => setMenuOpen(media.matches)
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !media.matches) setMenuOpen(false) }
    media.addEventListener('change', resize)
    window.addEventListener('keydown', escape)
    return () => { media.removeEventListener('change', resize); window.removeEventListener('keydown', escape) }
  }, [])
  const [notice, setNotice] = useState('')
  const location = useLocation()
  const teacher = role === 'teacher'
  const page = teacher ? (location.pathname.endsWith('/contribuicoes') ? 'Contribuição' : location.pathname.includes('/empresas/') ? 'Percurso da empresa' : 'Mission Control') : location.pathname.endsWith('/completo') ? 'Percurso completo' : location.pathname.endsWith('/registar-empresa') ? 'Registar empresa' : 'Meu Percurso'
  return <div className="app-shell" data-menu-open={menuOpen}>
    <ScrollRestoration />
    <a href="#main-content" className="skip-link">Saltar para o conteúdo</a>
    <Header menuOpen={menuOpen} onMenu={() => setMenuOpen(value => !value)} onNotice={setNotice} userLabel={teacher ? 'Docente · Vali Issufo' : 'Estudante · Ana Machava'} />
    {menuOpen && <button className="menu-backdrop" aria-label="Fechar menu lateral" onClick={() => setMenuOpen(false)} />}
    <Sidebar open={menuOpen} homePath={teacher ? teacherPaths.home : journeyPaths.home} onClose={() => { if (!window.matchMedia('(min-width: 901px)').matches) setMenuOpen(false) }} onNotice={setNotice} />
    <div className="shell-body">
      <div className="shell-identity"><div><h2 className="flex items-center gap-2 text-2xl font-light tracking-wide text-slate-700"><UserRound size={23} />{teacher ? 'ISSUFO, VALI' : 'MACHAVA, ANA'}</h2><p className="mt-1 text-sm text-slate-400">{teacher ? 'ITIS · Docente' : 'ITIS · Turma A'}</p></div><p className="text-xs text-slate-500">Página Inicial <span className="mx-2 text-blue-500">/</span> {teacher ? 'Docente' : 'Estudante'} <span className="mx-2 text-blue-500">/</span> {page}</p></div>
      <main id="main-content" className="shell-content" tabIndex={-1}><Outlet /></main><Footer />
    </div>
    <button className="shell-help" aria-label="Ajuda sobre este protótipo" onClick={() => setNotice('Ajuda sobre este protótipo')}><MessageCircle size={26} /></button>
    <Dialog open={!!notice} onOpenChange={value => { if (!value) setNotice('') }} title={notice} description="Protótipo local do frontend" className="max-w-lg"><p className="mt-5 text-sm leading-7 text-slate-600">O menu conserva a estrutura do simulador. {teacher ? 'No Roteiro de Tarefas pode consultar a turma, os percursos das empresas, as contribuições e registar orientações locais.' : 'Pode explorar o Meu Percurso e testar o registo da empresa, guardar alterações e consultar o resultado.'} Os restantes módulos serão trabalhados em iterações próprias.</p></Dialog>
  </div>
}
