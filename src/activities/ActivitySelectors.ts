import { GameState } from '../game/GameState'
import { makeActivityFun } from './makeActivityFun'

export const selectActivityId = (state: GameState) => state.activities.ids
export const selectActivityTitle = (id: string) => (state: GameState) => {
    const act = state.activities.entries[id]
    if (act === undefined) return ''
    const actFun = makeActivityFun(state, act.type, id)
    return actFun.getTitle()
}
export const selectActivityIcon = (id: string) => (state: GameState) => {
    const act = state.activities.entries[id]
    if (act === undefined) return ''
    const actFun = makeActivityFun(state, act.type, id)
    return actFun.getIcon()
}
