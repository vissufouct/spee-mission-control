import { resourceUrl } from '../services/learning-resources'

/** A prepared preview avoids relying on PDF plug-ins in embedded browsers. */
export function DocumentPreview({ src, preview, title }: { src: string; preview?: string; title: string }) {
  return preview ? <figure className="space-y-2">
    <img src={resourceUrl(preview)} alt={`Pré-visualização do documento: ${title}`} className="h-auto w-full rounded-lg border border-slate-200" />
    <figcaption className="text-xs text-slate-500">Pré-visualização do documento de exemplo. O ficheiro original está disponível abaixo.</figcaption>
  </figure> : <div className="space-y-2">
    <iframe className="student-task-resource" src={src} title={title} />
    <p className="text-xs text-slate-500">Se o documento não aparecer neste browser, utilize a ligação abaixo para o abrir ou descarregar.</p>
  </div>
}
