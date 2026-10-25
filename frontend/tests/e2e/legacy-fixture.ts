import { test as base } from '@playwright/test'
import fixture from '../../src/data/student-journey.fixture.json' with { type: 'json' }
import teacherFixture from '../../src/data/teacher-mission-control.fixture.json' with { type: 'json' }

// Keep regression coverage of imported version-1 scenarios independent of the new
// default roadmap. New-example acceptance tests deliberately use Playwright directly.
export { expect } from '@playwright/test'
export const test = base.extend({
  page: async ({ page }, runPage) => {
    await page.addInitScript(({ seed, teacher }) => {
      if (window.top !== window) return
      const key = 'spee.roadmap-2026.1.spee.student-journey.v1'
      if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify(seed))
      const teacherKey = 'spee.roadmap-2026.1.spee.teacher-mission-control.v1'
      if (localStorage.getItem(teacherKey) === null) localStorage.setItem(teacherKey, JSON.stringify(teacher))
    }, { seed: fixture, teacher: teacherFixture })
    await runPage(page)
  },
})
