import { useRef, useState } from 'react'
import { Download, FlaskConical, RotateCcw, Upload } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Dialog } from '@/shared/components/ui/dialog'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useJourneyMutation, useScenarioExport } from '../hooks/useJourney'
export function ScenarioTools({ revision }: { revision: number }) {
  const [open, setOpen] = useState(false)
  const [reset, setReset] = useState(false)
  const [importText, setImportText] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const file = useRef<HTMLInputElement>(null)
  const exportScenario = useScenarioExport()
  const mutation = useJourneyMutation()
  async function exportFile() {
    try { await exportScenario(); setFeedback('Cenário exportado.') }
    catch (error) { setFeedback(error instanceof Error ? error.message : 'Não foi possível exportar.') }
  }
  return <>
    <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="text-xs"><FlaskConical />Dados de demonstração</Button>
    <Dialog open={open} onOpenChange={setOpen} title="Dados de demonstração" description="As alterações ficam apenas neste browser. Pode exportar o cenário em JSON para o guardar ou experimentar noutra máquina." className="max-w-xl">
      <div className="mt-5 space-y-3">
        <Button variant="outline" onClick={() => void exportFile()} className="w-full justify-start"><Download />Exportar cenário JSON</Button>
        <Button variant="outline" onClick={() => file.current?.click()} className="w-full justify-start"><Upload />Importar cenário JSON</Button>
        <Button variant="outline" onClick={() => setReset(true)} className="w-full justify-start"><RotateCcw />Repor cenário inicial</Button>
        <input ref={file} type="file" accept=".json,application/json" className="sr-only" aria-label="Ficheiro do cenário" onChange={async event => {
          const selected = event.target.files?.[0]
          if (selected) {
            if (selected.size > 2_000_000) setFeedback('O ficheiro deve ter no máximo 2 MB.')
            else { try { setImportText(await selected.text()) } catch { setFeedback('Não foi possível ler o ficheiro.') } }
          }
          event.target.value = ''
        }} />
      </div>
      {feedback && <p role="status" className="mt-4 text-sm text-blue-800">{feedback}</p>}
      <p className="mt-5 text-xs leading-5 text-slate-500">A importação e a reposição substituem o cenário local. Exporte primeiro se quiser conservar o seu trabalho. Não são enviados dados para um servidor.</p>
    </Dialog>
    <ConfirmDialog open={reset} onOpenChange={setReset} title="Repor o cenário inicial?" description="As alterações deste cenário no browser serão substituídas pelos dados iniciais." confirmLabel="Repor cenário" destructive pending={mutation.isPending} error={mutation.error?.message} onConfirm={() => mutation.mutate({ type: 'reset' }, { onSuccess: () => { setReset(false); setFeedback('Cenário inicial reposto.') } })} />
    <ConfirmDialog open={importText !== null} onOpenChange={value => { if (!value) { setImportText(null); mutation.reset() } }} title="Importar este cenário?" description="O ficheiro será validado antes de substituir o cenário local. Uma importação inválida não altera os dados." confirmLabel="Importar cenário" pending={mutation.isPending} error={mutation.error?.message} onConfirm={() => mutation.mutate({ type: 'import', json: importText!, revision }, { onSuccess: () => { setImportText(null); setFeedback('Cenário importado.') } })} />
  </>
}
