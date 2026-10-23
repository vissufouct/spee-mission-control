import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const normal = (value: string) => value.replaceAll('\\', '/')
const featureOf = (file: string) => file.match(/^src\/features\/([^/]+)/)?.[1]

/** Resolve local imports before applying rules, so relative paths cannot bypass them. */
export function inspectModule(file: string, source: string): string[] {
  const errors: string[] = []
  const feature = featureOf(file)
  const isolatedExample = /\.(test|stories)\.tsx?$/.test(file)
  const presentation = /^src\/features\/[^/]+\/(components|pages|hooks)\//.test(file) || file.startsWith('src/shared/components/')
  const syntax = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
  function checkImport(specifier: string) {
    const local = specifier.startsWith('@/') ? 'src/' + specifier.slice(2) : specifier.startsWith('.') ? normal(path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier))) : null
    if (!local) return
    const clean = local.replace(/\.(tsx?|jsx?)$/, '').replace(/\/index$/, '')
    const targetFeature = featureOf(clean)
    if (feature && clean.startsWith('src/app/')) errors.push('Uma feature não pode importar app.')
    if (file.startsWith('src/shared/') && /^src\/(app|features|data)\//.test(clean)) errors.push('shared não pode depender de app, features ou data.')
    if (targetFeature && targetFeature !== feature && clean !== 'src/features/' + targetFeature)
      errors.push('Consumir a feature apenas através do index.ts público.')
    if (feature && targetFeature === feature && specifier.startsWith('@/'))
      errors.push('Usar imports relativos dentro da própria feature.')
    if (presentation && /\/api\//.test(clean)) errors.push('UI/hooks não podem importar o adaptador concreto.')
    if ((local.endsWith('.json') || clean.startsWith('src/data/')) && !isolatedExample &&
        !file.startsWith('src/app/providers/') && !/^src\/features\/[^/]+\/api\//.test(file))
      errors.push('Fixtures JSON só podem ser importadas na composição, nos adaptadores ou em testes/stories.')
  }
  function visit(node: ts.Node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) checkImport(node.moduleSpecifier.text)
    if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || ts.isIdentifier(node.expression) && node.expression.text === 'require')) {
      const argument = node.arguments[0]
      if (argument && ts.isStringLiteral(argument)) checkImport(argument.text)
      else errors.push('Imports dinâmicos calculados não permitem verificar as fronteiras.')
    }
    if (!isolatedExample && presentation && ts.isIdentifier(node) && ['localStorage', 'sessionStorage', 'indexedDB', 'fetch', 'XMLHttpRequest'].includes(node.text))
      errors.push('UI/hooks não podem aceder directamente à persistência/transporte.')
    ts.forEachChild(node, visit)
  }
  visit(syntax)
  return [...new Set(errors)]
}

function filesIn(folder: string): string[] {
  return readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(folder, entry.name)
    return entry.isDirectory() ? filesIn(full) : [full]
  })
}
export function checkProject(): string[] {
  return filesIn(path.join(projectRoot, 'src')).flatMap(full => {
    const file = normal(path.relative(projectRoot, full))
    const source = readFileSync(full, 'utf8')
    if (/\.tsx?$/.test(file)) return inspectModule(file, source).map(error => file + ': ' + error)
    if (file.includes('/features/') && file.endsWith('.css') && /\.shell-|--sidebar-width|#main-content/.test(source))
      return [file + ': CSS da feature conhece o shell.']
    return []
  })
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = checkProject()
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1 }
  else console.log('Fronteiras verificadas: features, API pública, shell e acesso aos dados.')
}
