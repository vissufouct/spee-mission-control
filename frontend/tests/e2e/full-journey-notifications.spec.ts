import { expect, test } from '@playwright/test'

for (const route of ['/estudante/percurso', '/estudante/percurso/completo', '/estudante/percurso/actividades/registar-empresa', '/estudante/percurso/registar-empresa']) {
  test('painel tabulado no título: ' + route, async ({ page }, info) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(route)
    const launcher = page.locator('.student-notification-launcher')
    await expect(launcher).toBeVisible()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    const headingBox = await page.locator('main h1').boundingBox()
    const launcherBox = await launcher.boundingBox()
    expect(launcherBox!.x).toBeGreaterThan(headingBox!.x)
    await launcher.press('Enter')
    await expect(page.getByRole('dialog', { name: 'Notificações e conversas', exact: true })).toBeVisible()
    await page.getByRole('tab', { name: 'Docente 2', exact: true }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('tab', { name: 'Grupo 1', exact: true })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel')).toContainText('Registar empresa')
    await page.keyboard.press('Escape')
    await expect(launcher).toBeFocused()
    await page.screenshot({ path: info.outputPath('desktop.png'), fullPage: true })
    await page.setViewportSize({ width: 390, height: 844 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await launcher.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.screenshot({ path: info.outputPath('mobile-popup.png') })
  })
}
