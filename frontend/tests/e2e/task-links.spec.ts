import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import type { JourneySnapshot } from '../../src/features/student-journey/types'
const exampleOne = JSON.parse(readFileSync('src/data/student-roadmap-example-1.fixture.json', 'utf8')) as JourneySnapshot

test('orientação de fornecedores apresenta quatro links sem concluir por abertura', async ({ page }, info) => {
  // Isolated scenario: make the supplier task available to exercise its guidance.
  await page.addInitScript(seed => {
    const task = seed.blocks.flatMap(block => block.activities).flatMap(activity => activity.tasks ?? []).find(task => task.id === 'b03-a03-t01')!
    task.dependsOn = []
    localStorage.setItem('spee.roadmap-2026.1.spee.student-journey.v1', JSON.stringify(seed))
  }, exampleOne)
  await page.goto('/estudante/percurso/actividades/contratos-servicos?exemplo=1&tarefa=b03-a03-t01')
  const dialog = page.getByRole('dialog', { name: 'Contratar fornecedores', exact: true })
  await expect(dialog).toBeVisible()
  const links = dialog.getByRole('navigation', { name: 'Ligações da tarefa' }).getByRole('link')
  await expect(links).toHaveCount(4)
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('href', /^https:\/\//)
  }
  await expect(dialog.getByRole('button', { name: 'Confirmar conclusão da tarefa' })).toBeDisabled()
  await page.screenshot({ path: info.outputPath('supplier-links.png') })
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(links.first()).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: info.outputPath('supplier-links-mobile.png') })
})

test('novo exemplo apresenta pesquisa de mercado com URL configurado', async ({ page }) => {
  await page.goto('/estudante/percurso/actividades/definir-ideia?exemplo=2&tarefa=b02-a01-t05')
  const dialog = page.getByRole('dialog', { name: 'Conhecer as empresas do mercado', exact: true })
  await expect(dialog.getByRole('link', { name: /Consultar empresas do mercado/ })).toHaveAttribute('href', /FormCatalogEmpresas.aspx/)
  await expect(dialog.getByRole('button', { name: 'Confirmar conclusão da tarefa' })).toBeDisabled()
})
