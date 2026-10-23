import { ScenarioTools } from './ScenarioTools'
export function JourneyHeading({ title, description, revision }: { title: string; description: string; revision: number }) {
  return <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div><p className="spee-eyebrow">Mission Control do Estudante</p><h1 className="mt-1 text-4xl font-semibold tracking-tight text-slate-950">{title}</h1><p className="mt-2 text-base text-slate-500">{description}</p></div>
    <div className="flex flex-col items-end gap-2"><span className="inline-flex items-center gap-2 text-xs text-slate-500"><span className="size-2 rounded-full bg-emerald-500" />Dados locais guardados</span><ScenarioTools revision={revision} /></div>
  </header>
}
