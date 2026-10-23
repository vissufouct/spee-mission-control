import { AlertCircle, LoaderCircle } from 'lucide-react'
import { Button } from './ui/button'
export function AsyncState({ error, onRetry, onReset, loadingTitle = 'A preparar o seu percurso…', errorTitle = 'Não foi possível abrir o percurso' }: { error?: string; onRetry?: () => void; onReset?: () => void; loadingTitle?: string; errorTitle?: string }) {
  return <section className="rounded-lg border bg-white p-10 text-center" aria-live="polite" aria-busy={!error}>
    {error ? <AlertCircle className="mx-auto mb-4 text-red-600" size={32} /> : <LoaderCircle className="mx-auto mb-4 animate-spin text-cyan-600" size={32} />}
    <h1 className="text-xl font-semibold">{error ? errorTitle : loadingTitle}</h1>
    {error && <><p role="alert" className="mx-auto mt-3 max-w-lg text-slate-600">{error}</p><div className="mt-6 flex flex-wrap justify-center gap-3">
      {onRetry && <Button onClick={onRetry}>Tentar novamente</Button>}
      {onReset && <Button variant="outline" onClick={onReset}>Repor cenário inicial</Button>}
    </div></>}
  </section>
}
