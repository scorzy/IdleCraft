import { GameState } from '../game/GameState'
import { activityIcons, activityTitles } from '../game/globals'

export const selectActivityId = (state: GameState) => state.activities.ids
export const selectActivityTitle = (id: string) => (state: GameState) => {
    const act = state.activities.entries[id]
    if (!act) return ''

    const actFun = activityTitles.getEx(act.type)
    return actFun(state, id)
}
export const selectActivityIcon = (id: string) => (state: GameState) => {
    const act = state.activities.entries[id]
    if (!act) return ''
    const actFun = activityIcons.getEx(act.type)
    return actFun(state, id)
}
