import { GameState } from '../game/GameState'
import { activityIcons, activityTitles } from '../game/globals'
import { ActivityAdapter } from './ActivityState'

export const selectActivityId = (state: GameState) => state.activities.ids
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
