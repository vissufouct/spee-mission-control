import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import type { LearningTask } from '../types'
import type { EvidenceFile } from '../services/JourneyRepository'
import { readEvidenceFile, resourceUrl } from '../services/learning-resources'

export function EvidenceTaskForm({ task, pending, error, onSubmit }: { task: LearningTask; pending: boolean; error?: string; onSubmit: (file?: EvidenceFile) => void }) {
  const [file, setFile] = useState<EvidenceFile>()
  const [fileError, setFileError] = useState('')
  const [reading, setReading] = useState(false)
  const [sample, setSample] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  return <div className="space-y-4">
    {task.resource && <a href={resourceUrl(task.resource)} download className="text-sm text-blue-700 underline">Descarregar modelo / exemplo ({task.resource.split('.').at(-1)?.toUpperCase()})</a>}
    <label className="block text-sm font-medium">Seleccionar evidência <span className="font-normal text-slate-500">({(task.accepts ?? ['pdf']).join(', ').toUpperCase()} · até 2 MB)</span>
      <input type="file" className="mt-2 block w-full rounded-lg border border-slate-200 p-3 text-sm" accept={(task.accepts ?? ['pdf']).map(format => '.' + format).join(',')} disabled={pending || reading} onChange={async event => {
        const selected = event.target.files?.[0]; setFile(undefined); setConfirmed(false); setSample(false); setFileError('')
        if (!selected) return
        setReading(true)
        try { setFile(await readEvidenceFile(selected)) } catch (reason) { setFileError(reason instanceof Error ? reason.message : 'Não foi possível ler o ficheiro.') } finally { setReading(false) }
      }} />
    </label>
    {task.resource && !file && <label className="flex gap-2 text-sm"><input type="checkbox" checked={sample} disabled={reading || pending} onChange={event => { setSample(event.target.checked); setConfirmed(false) }} />Usar o ficheiro de exemplo nesta simulação.</label>}
    {(file || sample) && <label className="flex gap-2 text-sm"><input type="checkbox" checked={confirmed} disabled={pending} onChange={event => setConfirmed(event.target.checked)} />Confirmo a submissão {file ? 'de ' + file.fileName : 'deste exemplo'}. Ficará guardada apenas neste browser.</label>}
    {(error || fileError) && <p role="alert" className="text-sm text-red-700">{error || fileError}</p>}
    <Button disabled={pending || reading || !confirmed || (!file && !sample)} onClick={() => onSubmit(file)}>{pending ? 'A submeter…' : reading ? 'A ler ficheiro…' : 'Confirmar submissão'}</Button>
  </div>
}
