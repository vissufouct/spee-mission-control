import exampleOne from '@/data/student-roadmap-example-1.fixture.json'
import exampleTwo from '@/data/student-roadmap-example-2.fixture.json'

/** Entry links reload the app deliberately: each example gets a fresh query cache
 * and its own persisted state. Navigation inside it preserves the selected example. */
export function selectStudentScenario() {
  const requested = new URLSearchParams(window.location.search).get('exemplo')
  let selected = requested
  try {
    if (!['1', '2'].includes(selected ?? '')) selected = window.sessionStorage.getItem('spee.student-example')
    selected = selected === '2' ? '2' : '1'
    window.sessionStorage.setItem('spee.student-example', selected)
  } catch { selected = selected === '2' ? '2' : '1' }
  return { id: selected, seed: selected === '2' ? exampleTwo : exampleOne }
}
