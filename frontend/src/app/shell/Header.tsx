import { Globe2, Menu, Search, UserRound } from 'lucide-react'
export function Header({ menuOpen, onMenu, onNotice, userLabel = 'Estudante · Ana Machava' }: { menuOpen: boolean; onMenu: () => void; onNotice: (label: string) => void; userLabel?: string }) {
  return <header className="shell-header">
    <div className="shell-brand"><span>Simulador Empresarial</span><button aria-label="Alternar menu lateral" aria-expanded={menuOpen} onClick={onMenu} className="rounded p-2 text-cyan-600"><Menu size={23} /></button></div>
    <div className="flex min-w-0 flex-1 items-center justify-end gap-6 px-5">
      <span className="mr-auto hidden text-xl font-light text-slate-500 xl:block">Eureka 101</span>
      <button className="hidden text-xs text-slate-600 lg:block" onClick={() => onNotice('Idioma')}><Globe2 className="mx-auto mb-1 text-cyan-600" size={21} />PORTUGUÊS</button>
      <button className="hidden text-xs text-slate-600 lg:block" onClick={() => onNotice('Pesquisa global')}><Search className="mx-auto mb-1 text-cyan-600" size={21} />PESQUISAR</button>
      <span className="flex min-w-0 items-center gap-3 text-sm text-slate-600"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white"><UserRound size={24} className="text-slate-400" /></span><span className="hidden truncate sm:block">{userLabel}</span></span>
      <span className="rounded border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-semibold tracking-wide text-cyan-800">PROTÓTIPO LOCAL</span>
    </div>
  </header>
}
