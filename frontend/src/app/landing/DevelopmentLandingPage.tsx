import { ArrowRight, BookOpenCheck, GraduationCap, Presentation } from 'lucide-react'
import { Link } from 'react-router-dom'
import { journeyPaths } from '@/features/student-journey'
import { teacherPaths } from '@/features/teacher-mission-control'
import './development-landing.css'

export function DevelopmentLandingPage() {
  return (
    <div className="development-landing">
      <header className="development-landing__header">
        <Link className="development-landing__brand" to="/" aria-label="SPEE — ponto de partida">
          <span className="development-landing__brand-mark" aria-hidden="true">
            <BookOpenCheck size={22} strokeWidth={1.8} />
          </span>
          <span>
            <strong>SPEE</strong>
            <small>Simulador Empresarial</small>
          </span>
        </Link>

        <span className="development-landing__environment">Ambiente de desenvolvimento</span>
      </header>

      <main className="development-landing__main">
        <section className="development-landing__intro" aria-labelledby="development-landing-title">
          <p className="development-landing__eyebrow">Mission Control</p>
          <h1 id="development-landing-title">Escolha a experiência que pretende explorar</h1>
          <p>
            Entre numa das perspectivas do protótipo. Pode voltar a este ponto de partida
            sempre que quiser alternar entre docente e estudante.
          </p>
        </section>

        <nav className="development-landing__choices" aria-label="Escolher experiência do protótipo">
          <Link className="development-choice development-choice--teacher" to={teacherPaths.home}>
            <span className="development-choice__topline">
              <span className="development-choice__icon" aria-hidden="true">
                <Presentation size={26} strokeWidth={1.8} />
              </span>
              <span className="development-choice__role">Perspectiva do docente</span>
            </span>

            <span className="development-choice__body">
              <strong>Mission Control do Docente</strong>
              <span>
                Acompanhe o progresso das empresas, consulte evidências e registe orientações.
              </span>
            </span>

            <span className="development-choice__action">
              Entrar como docente
              <ArrowRight size={18} aria-hidden="true" />
            </span>
          </Link>

          <Link className="development-choice development-choice--student" to={journeyPaths.home}>
            <span className="development-choice__topline">
              <span className="development-choice__icon" aria-hidden="true">
                <GraduationCap size={26} strokeWidth={1.8} />
              </span>
              <span className="development-choice__role">Perspectiva do estudante</span>
            </span>

            <span className="development-choice__body">
              <strong>Mission Control do Estudante</strong>
              <span>
                Consulte o seu percurso, veja o que precisa de atenção e continue as actividades.
              </span>
            </span>

            <span className="development-choice__action">
              Entrar como estudante
              <ArrowRight size={18} aria-hidden="true" />
            </span>
          </Link>
        </nav>

        <p className="development-landing__note">
          Protótipo local · dados ilustrativos · sem autenticação real
        </p>
      </main>

      <footer className="development-landing__footer">
        <span>ITIS — Instituto de Tecnologias, Inovação e Serviços</span>
        <span>Exploração e validação de UX</span>
      </footer>
    </div>
  )
}
