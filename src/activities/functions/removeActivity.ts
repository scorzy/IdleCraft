import { GameState } from '../../game/GameState'
import { activityRemovers } from '../../game/globals'
import { useGameStore } from '../../game/state'
import { ActivityAdapter } from '../ActivityState'

export function removeActivityInt(state: GameState, activityId: string) {
    const activity = ActivityAdapter.selectEx(state.activities, activityId)
    const remover = activityRemovers.get(activity.type)
    if (!remover) throw new Error(`[makeExecActivity] remover not found ${activity.type}`)
    state = remover(state, activityId)
    return state
}
export const removeActivity = (id: string | undefined | null) => {
    if (!id) return
    return useGameStore.setState((s) => removeActivityInt(s, id))
}
