export function JourneyHeading({ title, description }: { title: string; description: string }) {
  return <header><p className="spee-eyebrow">Mission Control do Estudante</p><h1 className="mt-1 text-4xl font-semibold tracking-tight text-slate-950">{title}</h1><p className="mt-2 text-base text-slate-500">{description}</p></header>
}
