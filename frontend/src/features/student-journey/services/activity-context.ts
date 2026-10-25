import type { JourneySnapshot } from '../types'

/** Adjacent activities in the published itinerary, not prerequisite relationships. */
export function getActivityContext(snapshot: JourneySnapshot, activityId: string) {
  const activities = snapshot.blocks.flatMap(block => block.activities.map(activity => ({ activity, blockTitle: block.title })))
  const index = activities.findIndex(item => item.activity.id === activityId)
  return {
    previous: index > 0 ? activities[index - 1] : undefined,
    current: index >= 0 ? activities[index] : undefined,
    next: index >= 0 ? activities[index + 1] : undefined,
  }
}
