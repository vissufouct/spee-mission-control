import { expect, test } from '@playwright/test'

test('o percurso funciona num contentor independente, sem shell nem persistência', async ({ page }, info) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.setViewportSize({ width: 1200, height: 900 })
  await page.goto('http://127.0.0.1:6006/iframe.html?id=estudante-meu-percurso-sem-appshell--with-data&viewMode=story')
  await expect(page.getByRole('heading', { name: 'Actividades deste bloco', exact: true })).toBeVisible()
  await expect(page.getByLabel('Progresso global', { exact: true })).toHaveAttribute('value', '18')
  await expect(page.locator('.app-shell')).toHaveCount(0)
  await expect(page.getByText('Simulador Empresarial', { exact: true })).toHaveCount(0)
  expect(await page.evaluate(() => localStorage.getItem('spee.student-journey.v1'))).toBeNull()
  await page.screenshot({ path: info.outputPath('07-percurso-sem-shell.png'), fullPage: true })
  await page.goto('http://127.0.0.1:6006/iframe.html?id=estudante-meu-percurso-sem-appshell--empty&viewMode=story')
  await expect(page.getByText('Não existem actividades neste estado.')).toBeVisible()
  await page.goto('http://127.0.0.1:6006/iframe.html?id=partilhados-estado-assíncrono--error&viewMode=story')
  await expect(page.getByText('Não foi possível ler os dados locais.', { exact: true })).toBeVisible()
  expect(errors).toEqual([])
})

test('as três vistas do docente funcionam sem AppShell ou persistência', async ({ page },info) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.setViewportSize({ width:1200,height:900 })
  await page.goto('http://127.0.0.1:6006/iframe.html?id=docente-visão-geral-sem-appshell--with-data&viewMode=story')
  await expect(page.getByRole('heading', { name:'Progresso por empresa e marco',exact:true })).toBeVisible()
  await page.getByLabel('Pesquisar empresa ou estudante', { exact:true }).fill('Nova Geração')
  await expect(page.locator('.teacher-matrix tbody tr')).toHaveCount(1)
  await page.goto('http://127.0.0.1:6006/iframe.html?id=docente-percurso-sem-appshell--with-data&viewMode=story')
  await expect(page.getByRole('heading', { name:'Percurso da empresa',exact:true })).toBeVisible()
  await page.goto('http://127.0.0.1:6006/iframe.html?id=docente-contribuição-sem-appshell--with-data&viewMode=story')
  await expect(page.getByRole('heading', { name:'Contribuição confirmada por actividade',exact:true })).toBeVisible()
  await expect(page.locator('.app-shell')).toHaveCount(0)
  expect(await page.evaluate(() => localStorage.getItem('spee.teacher-mission-control.v1'))).toBeNull()
  await page.screenshot({ path:info.outputPath('teacher-without-shell.png'),fullPage:false })
  await page.goto('http://127.0.0.1:6006/iframe.html?id=docente-visão-geral-sem-appshell--empty&viewMode=story')
  await expect(page.getByText('Nenhuma empresa corresponde aos filtros.')).toBeVisible()
  expect(errors).toEqual([])
})
