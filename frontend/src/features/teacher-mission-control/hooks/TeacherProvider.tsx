import { createContext, useContext, type ReactNode } from 'react'
import type { TeacherRepository } from '../services/TeacherRepository'
const Context = createContext<TeacherRepository | null>(null)
export function TeacherProvider({ repository, children }: { repository: TeacherRepository; children: ReactNode }) {
  return <Context.Provider value={repository}>{children}</Context.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export function useTeacherRepository() {
  const repository = useContext(Context)
  if (!repository) throw new Error('TeacherProvider é necessário.')
  return repository
}
