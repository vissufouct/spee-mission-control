import { expect, test } from '@playwright/test'
import fixture from '../../src/data/student-roadmap-example-1.fixture.json' with { type: 'json' }

for (const example of [1, 2]) {
  test(`contexto segue a actividade seleccionada no exemplo ${example}`, async ({ page }, info) => {
    const activities = fixture.blocks.flatMap(block => block.activities.map(({ id, title }) => ({ id, title })))
    const chosen = activities.findIndex(activity => activity.id === 'registar-empresa')
    await page.goto(`/estudante/percurso/actividades/registar-empresa?exemplo=${example}`)
    const context = page.getByRole('region', { name: 'Actividades em contexto' })
    const cards = context.locator('.student-context-card')
    await expect(cards).toHaveCount(3)
    await expect(cards.nth(0)).toContainText(activities[chosen - 1].title)
    await expect(cards.nth(1)).toContainText('Actividade actual')
    await expect(cards.nth(1).getByRole('button', { name: activities[chosen].title, exact: true })).toBeDisabled()
    await expect(cards.nth(2)).toContainText(activities[chosen + 1].title)
    await cards.nth(0).getByRole('button', { name: activities[chosen - 1].title, exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(activities[chosen - 1].title)
    await expect(cards.nth(1)).toContainText(activities[chosen - 1].title)
    await expect(cards.nth(2)).toContainText(activities[chosen].title)
    await page.goto(`/estudante/percurso/actividades/${activities[0].id}`)
    await expect(cards).toHaveCount(3)
    await expect(cards.nth(0)).toContainText('Esta é a primeira actividade do roteiro.')
    await expect(cards.nth(0).getByRole('button')).toHaveCount(0)
    await page.goto(`/estudante/percurso/actividades/${activities.at(-1)!.id}`)
    await expect(cards).toHaveCount(3)
    await expect(cards.nth(2)).toContainText('Não há outra actividade definida no roteiro.')
    await expect(cards.nth(2).getByRole('button')).toHaveCount(0)
    await page.screenshot({ path: info.outputPath(`contexto-exemplo-${example}.png`), fullPage: true })
  })
}
