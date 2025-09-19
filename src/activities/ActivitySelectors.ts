import { GameState } from '../game/GameState'
import { activityIcons, activityTitles, activityViewers } from '../game/globals'
import { ActivityAdapter } from './ActivityState'

export const selectActivityIds = (state: GameState) => state.orderedActivities
export const selectActivityTitle = (id: string) => (state: GameState) => {
    const act = ActivityAdapter.selectEx(state.activities, id)
    return activityTitles.getEx(act.type)(state, id)
}
export const selectActivityIcon = (id: string) => (state: GameState) => {
    const act = ActivityAdapter.selectEx(state.activities, id)
    return activityIcons.getEx(act.type)(state, id)
}
export const selectActivityNum = (state: GameState) => {
    return ActivityAdapter.getIds(state.activities).length
}
export const selectActivityMax = (id: string) => (state: GameState) => {
    return ActivityAdapter.selectEx(state.activities, id).max
}
export const selectActivityCanView = (id: string) => (s: GameState) => {
    const activity = ActivityAdapter.select(s.activities, id)
    if (!activity) return
    return activityViewers.get(activity.type) !== undefined
}
