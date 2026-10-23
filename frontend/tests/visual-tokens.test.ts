import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'

it('o azul de acção mantém contraste mínimo de 4,5:1 com texto branco', () => {
  const css = readFileSync(new URL('../src/shared/styles/tokens.css', import.meta.url), 'utf8')
  const hex = css.match(/--color-primary:\s*#([\da-f]{6})/i)![1]
  const [r, g, b] = hex.match(/.{2}/g)!.map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
  const luminance = .2126 * r + .7152 * g + .0722 * b
  expect(1.05 / (luminance + .05)).toBeGreaterThanOrEqual(4.5)
})
