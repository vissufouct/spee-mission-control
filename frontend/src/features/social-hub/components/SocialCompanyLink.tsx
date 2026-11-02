import { useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Building2, X } from 'lucide-react'
import type { SocialSnapshot } from '../schemas/social.schema'
export function SocialCompanyLink({ company, members }: { company: NonNullable<SocialSnapshot['members'][number]['company']>; members: SocialSnapshot['members'] }) {
  const opener = useRef<HTMLAnchorElement>(null)
  const [open, setOpen] = useState(false)
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <a ref={opener} className="social-company-link" href={`#empresa-${encodeURIComponent(company.id)}`} aria-haspopup="dialog" onClick={event => { event.preventDefault(); setOpen(true) }}>{company.name}</a>
    <Dialog.Portal><Dialog.Overlay className="social-company-overlay" /><Dialog.Content className="social-company-dialog" onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus() }}>
      <Dialog.Title><Building2 size={20} />{company.name}</Dialog.Title>
      <Dialog.Description>Empresa dos participantes nesta simulação.</Dialog.Description>
      <h3>Participantes</h3><ul>{members.filter(member => member.company?.id === company.id).map(member => <li key={member.id}><strong>{member.name}</strong><span>{member.className}</span></li>)}</ul>
      <Dialog.Close aria-label="Fechar ficha da empresa" className="social-company-close"><X size={20} /></Dialog.Close>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>
}
