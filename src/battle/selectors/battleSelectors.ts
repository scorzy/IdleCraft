import { ActivityAdapter } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { isBattle } from '../BattleTypes'

export const getBattleActivity = (state: GameState, id: string) => {
    const data = ActivityAdapter.selectEx(state.activities, id)
    if (!isBattle(data)) throw new Error(`Activity ${id} is not a battle`)
    return data
}

export const selectCurrentBattleActivityId = (state: GameState) => {
    const activityId = state.activityId
    if (!activityId) return

    const activity = ActivityAdapter.select(state.activities, activityId)
    return activity && isBattle(activity) ? activityId : undefined
}
