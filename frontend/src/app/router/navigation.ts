import { journeyPaths } from '@/features/student-journey'
export const navigation = [
  { section: 'MENU INICIAL', items: [
    { label: 'Início', path: journeyPaths.home }, { label: 'Meu Perfil' }, { label: 'Assistente SPEE' },
    { label: 'Gestor Documental' }, { label: 'Banca' }, { label: 'Email' }, { label: 'Catálogo de Empresas' },
    { label: 'Concursos Públicos' }, { label: 'Projeção de Preços' },
  ] },
  { section: 'RECURSOS AUXILIARES', items: [
    { label: 'Roteiro de Tarefas', path: journeyPaths.home, icon: 'anchor' },
    { label: 'Modelo de Negócio', icon: 'calculator' },
  ] },
  { section: '', items: [
    { label: 'SGC Gestão Comercial', icon: 'calculator' },
    { label: 'RH Online Recursos Humanos', icon: 'users' },
  ] },
] satisfies { section: string; items: { label: string; path?: string; icon?: string }[] }[]

