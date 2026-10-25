import type { JourneySnapshot } from '../types'

/** Locate the selected activity's block, independently of the company's progress. */
export function getActivityBlockContext(snapshot: JourneySnapshot, activityId: string) {
  const index = snapshot.blocks.findIndex(block => block.activities.some(activity => activity.id === activityId))
  return {
    previous: index > 0 ? snapshot.blocks[index - 1] : undefined,
    current: index >= 0 ? snapshot.blocks[index] : undefined,
    next: index >= 0 ? snapshot.blocks[index + 1] : undefined,
  }
}
