import { expect, test } from './legacy-fixture'

test('percurso completo mantém blocos, segmentos e navegação no layout aprovado', async ({ page }, info) => {
  await page.goto('/estudante/percurso/completo')
  const current = page.locator('.student-full-block--current')
  await expect(current).toHaveAttribute('open', '')
  await expect(current.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1')
  await expect(current.getByRole('progressbar').locator('span')).toHaveCount(4)
  await current.locator('summary').press('Enter')
  await expect(current.getByRole('button', { name: /Registar empresa/ })).not.toBeVisible()
  await expect(current.getByRole('progressbar')).toBeVisible()
  await current.locator('summary').press('Enter')
  for (const width of [1440, 720, 390]) {
    await page.setViewportSize({ width, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: info.outputPath(`full-journey-${width}.png`), fullPage: true })
  }
  await current.getByRole('button', { name: /Registar empresa/ }).click()
  await expect(page).toHaveURL(/actividades\/registar-empresa$/)
  await page.goBack()
  await page.getByRole('link', { name: 'Ideação', exact: true }).click()
  await expect(page).toHaveURL(/percurso\?bloco=ideacao$/)
})
