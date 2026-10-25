import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/studio/roteiro')
  await page.evaluate(() => localStorage.removeItem('spee.scenario-editor.v1'))
  await page.reload()
})

test('cria um nó, guarda uma versão e conserva-a após recarregar', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Exercício económico 1' })).toBeVisible()
  await page.getByLabel('Nome do novo nó').fill('Validar plano anual')
  await page.getByRole('button', { name: 'Criar nó' }).click()
  await expect(page.getByText('Validar plano anual', { exact: true })).toBeVisible()
  await expect(page.getByText('Alterações por guardar')).toBeVisible()

  await page.getByRole('button', { name: 'Guardar versão' }).click()
  await page.getByLabel('Nome da versão').fill('Revisão funcional')
  await page.getByRole('dialog').getByRole('button', { name: 'Guardar versão' }).click()
  await expect(page.getByText('Versão guardada')).toBeVisible()
  await expect(page.getByLabel('Versão')).toHaveValue(/.+/)

  await page.reload()
  await expect(page.getByText('Validar plano anual', { exact: true })).toBeVisible()
  await expect(page.getByLabel('Versão')).toContainText('Revisão funcional')
})

test('mantém o editor utilizável sem AppShell num ecrã móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByRole('link', { name: /SPEE Studio/ })).toBeVisible()
  await expect(page.getByLabel('Estrutura do roteiro')).toBeVisible()
  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(hasHorizontalOverflow).toBe(false)
})
