import { expect, test } from '@playwright/test'

test('permite escolher as experiências do docente, estudante e editor de roteiro', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Escolha a experiência que pretende explorar' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Painel do Docente/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Painel do Estudante/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Editor visual de roteiro/i })).toHaveAttribute('href', '/studio/roteiro')
  await expect(page.getByRole('button', { name: 'Alternar menu lateral' })).toHaveCount(0)

  await page.getByRole('button', { name: /Painel do Docente/ }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('dialog').getByText('Principais funcionalidades')).toBeVisible()
  await expect(page.getByRole('dialog').getByRole('link', { name: 'Entrar', exact: true })).toHaveAttribute('href', '/docente/mission-control')
  await page.getByRole('dialog').getByRole('link', { name: 'Entrar', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Painel do Docente', exact: true })).toBeVisible()

  await page.goto('/')
  await page.getByRole('button', { name: /Painel do Estudante/ }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('dialog').getByText('Principais funcionalidades')).toBeVisible()
  await expect(page.getByRole('dialog').getByRole('link', { name: /Entrar no exemplo 1/ })).toHaveAttribute('href', '/estudante/percurso?exemplo=1')
  await page.getByRole('dialog').getByRole('link', { name: /Entrar no exemplo 1/ }).click()
  await expect(page.getByRole('heading', { name: 'Meu Percurso', exact: true })).toBeVisible()
})

test('mantém as duas escolhas acessíveis num ecrã móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await expect(page.getByRole('button', { name: /Painel do Docente/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Painel do Estudante/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Editor visual de roteiro/i })).toBeVisible()

  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(hasHorizontalOverflow).toBe(false)
})
