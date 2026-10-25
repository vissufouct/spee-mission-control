import type { EvidenceFile } from './JourneyRepository'

export function resourceUrl(resource: string) {
  return resource.startsWith('https://') ? resource : import.meta.env.BASE_URL + resource
}

/** Reads a user-selected document; persistence remains the repository's responsibility. */
export async function readEvidenceFile(file: File): Promise<EvidenceFile> {
  const extension = file.name.split('.').at(-1)?.toLowerCase()
  const mime = { pdf: 'application/pdf', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }[extension ?? '']
  if (!mime || file.size > 2_000_000 || !file.size) throw new Error('Escolha um PDF, Word ou Excel não vazio, até 2 MB.')
  const bytes = new Uint8Array(await file.arrayBuffer())
  const signature = Array.from(bytes.slice(0, 4)).map(value => String.fromCharCode(value)).join('')
  if ((extension === 'pdf' && signature !== '%PDF') || (extension !== 'pdf' && !signature.startsWith('PK'))) throw new Error('O conteúdo do ficheiro não corresponde ao formato indicado.')
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 8192) binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192))
  return { fileName: file.name, dataUrl: `data:${mime};base64,${btoa(binary)}` }
}
