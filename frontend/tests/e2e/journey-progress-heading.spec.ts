import { expect, test } from '@playwright/test'

test('progresso global integrado no cabeçalho do Meu Percurso', async ({ page }, info) => {
  await page.goto('/estudante/percurso')
  const heading = page.locator('main header').filter({ has: page.getByRole('heading', { name: 'Meu Percurso', exact: true }) })
  await expect(heading.getByTestId('global-progress')).toHaveText('18%')
  await expect(heading.getByText('3 de 17 marcos confirmados')).toBeVisible()
  await expect(heading.getByRole('progressbar', { name: 'Progresso global', exact: true })).toHaveAttribute('value', '18')
  await expect(page.getByRole('region', { name: 'Progresso global da simulação' })).toHaveCount(0)
  await expect(page.getByText('Veja o que está feito, o que falta e qual é o próximo passo.')).toHaveCount(0)
  for (const width of [1440, 720, 390]) {
    await page.setViewportSize({ width, height: 853 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: info.outputPath(`heading-${width}.png`) })
  }
  await heading.getByRole('link', { name: 'Ver percurso completo' }).click()
  await expect(page).toHaveURL(/\/estudante\/percurso\/completo$/)
  const fullHeading = page.locator('main header')
  await expect(fullHeading.getByRole('heading', { name: 'Percurso completo' })).toBeVisible()
  await expect(fullHeading.getByTestId('global-progress')).toHaveText('18%')
  await expect(fullHeading.getByText('3 de 17 marcos confirmados')).toBeVisible()
  await expect(fullHeading.getByRole('link', { name: 'Ver percurso completo' })).toHaveCount(0)
  await expect(page.getByRole('region', { name: 'Progresso global da simulação' })).toHaveCount(0)
  for (const width of [1440, 720, 390]) {
    await page.setViewportSize({ width, height: 853 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: info.outputPath(`full-heading-${width}.png`) })
  }
})
