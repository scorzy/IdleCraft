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
export const selectActivityNum = (state: GameState) => ActivityAdapter.getIds(state.activities).length

export const selectActivityMax = (id: string) => (state: GameState) =>
    ActivityAdapter.selectEx(state.activities, id).max

export const selectActivityCanView = (id: string) => (s: GameState) => {
    const activity = ActivityAdapter.select(s.activities, id)
    if (!activity) return
    return activityViewers.get(activity.type) !== undefined
}
export const selectActivityAutoRemove = (id: string) => (state: GameState) =>
    ActivityAdapter.selectEx(state.activities, id).remove ?? false

export const selectAddActType = (state: GameState) => state.addActType
export const selectRemoveOtherActivities = (state: GameState) => state.removeOtherActivities
export const selectStartActNow = (state: GameState) => state.startActNow
export const selectActRepetitions = (state: GameState) => state.actRepetitions
export const selectActAutoRemove = (state: GameState) => state.actAutoRemove
