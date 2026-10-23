/** Experimental equal-weight rule, shared by both views until DEC-008 is resolved. */
export function confirmedProgress(completed: number, total: number) {
  return total > 0 ? Math.round(completed / total * 100) : 0
}
