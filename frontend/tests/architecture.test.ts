import { describe, expect, it } from 'vitest'
import { inspectModule, checkProject } from '../scripts/check-boundaries'

describe('fronteiras arquitecturais', () => {
  it('o projecto actual respeita as fronteiras', () => expect(checkProject()).toEqual([]))
  it('impede imports de internos de outra feature por alias ou caminho relativo', () => {
    expect(inspectModule('src/features/a/pages/Page.tsx', "import { B } from '@/features/b/components/B'")).not.toEqual([])
    expect(inspectModule('src/features/a/pages/Page.tsx', "import { B } from '../../b/components/B'")).not.toEqual([])
  })
  it('permite consumir apenas a API pública', () => {
    expect(inspectModule('src/app/router/router.tsx', "import { Page } from '@/features/a'")).toEqual([])
  })
  it('impede dependências do shell e persistência directa na UI', () => {
    expect(inspectModule('src/features/a/components/Card.tsx', "import Shell from '../../../app/shell/AppShell'")).not.toEqual([])
    expect(inspectModule('src/features/a/hooks/useData.ts', "window.localStorage.getItem('data')")).not.toEqual([])
    expect(inspectModule('src/features/a/pages/Page.tsx', "fetch('/data.json')")).not.toEqual([])
    expect(inspectModule('src/features/a/pages/Page.tsx', "import repo from '../api/JsonRepository'")).not.toEqual([])
  })
  it('impede JSON directo, reexports e imports dinâmicos que furem as fronteiras', () => {
    expect(inspectModule('src/features/a/pages/Page.tsx', "import data from '../../../data/fixture.json'")).not.toEqual([])
    expect(inspectModule('src/app/providers/P.tsx', "export { X } from '@/features/a/api/repo'")).not.toEqual([])
    expect(inspectModule('src/features/a/components/X.tsx', "import('../../../app/shell/AppShell')")).not.toEqual([])
    expect(inspectModule('src/features/a/components/X.tsx', "import(path)")).not.toEqual([])
  })
  it('permite fixtures em testes e no ponto de composição', () => {
    expect(inspectModule('src/app/providers/P.tsx', "import data from '@/data/fixture.json'")).toEqual([])
    expect(inspectModule('src/features/a/components/X.stories.tsx', "import data from '@/data/fixture.json'")).toEqual([])
  })
  it('shared não pode depender de features', () => {
    expect(inspectModule('src/shared/components/Button.tsx', "import { X } from '@/features/a'")).not.toEqual([])
  })
})
