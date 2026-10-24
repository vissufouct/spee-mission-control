import { createBrowserRouter, Link } from 'react-router-dom'
import { JourneyPage, FullJourneyPage, RegistrationPage, ActivityPage, journeyPaths } from '@/features/student-journey'
import { AppShell } from '../shell/AppShell'
import { TeacherOverviewPage, TeacherCompanyPage, teacherPaths } from '@/features/teacher-mission-control'
import { DevelopmentLandingPage } from '../landing/DevelopmentLandingPage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export const router = createBrowserRouter([{
  path: '/',
  element: <DevelopmentLandingPage />,
}, {
  element: <AppShell />,
  children: [
    { path: journeyPaths.home, element: <JourneyPage /> },
    { path: journeyPaths.full, element: <FullJourneyPage /> },
    { path: journeyPaths.registration, element: <RegistrationPage /> },
    { path: journeyPaths.home + '/actividades/:activityId', element: <ActivityPage /> },
  ],
}, {
  element: <AppShell role="teacher" />,
  children: [
    { path: teacherPaths.home, element: <TeacherOverviewPage /> },
    { path: teacherPaths.home + '/empresas/:companyId', element: <TeacherCompanyPage /> },
    { path: teacherPaths.home + '/empresas/:companyId/contribuicoes', element: <TeacherCompanyPage contributions /> },
  ],
}, {
  path: '*',
  element: (
    <main className="mx-auto max-w-xl p-8">
      <section className="spee-panel p-8">
        <h1 className="text-2xl font-semibold">Página não encontrada</h1>
        <p className="my-4">Este endereço não faz parte da experiência actual.</p>
        <Link to="/" className="text-blue-700 underline">Voltar ao ponto de partida</Link>
      </section>
    </main>
  ),
}], { basename })
