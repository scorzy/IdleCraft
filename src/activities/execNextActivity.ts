import { GameState } from '../game/GameState'
import { ActivityStartResult } from './AbstractActivity'
import { ActivityAdapter } from './ActivityState'
import { makeActivityFun } from './activityFunctions'

export function execNextActivity(state: GameState): GameState {
    if (state.orderedActivities.length < 1) return state

    if (state.activityId !== null) {
        const currentAct = ActivityAdapter.select(state.activities, state.activityId)
        if (currentAct === undefined) {
            state = { ...state, activityId: null }
        } else if (currentAct.max > state.activityDone) {
            const { gameState, result } = makeActivityFun(state, currentAct.type, state.activityId).start()
            state = gameState
            if (result === ActivityStartResult.Started) return state
        }
    }

    state = { ...state, activityDone: 0 }

    const start = state.lastActivityDone
    let i = start + 1

    function tryStart(): boolean {
        const activityId = state.orderedActivities[i]
        if (activityId === undefined) return false

        const activity = ActivityAdapter.select(state.activities, activityId)
        if (activity === undefined) return false

        const { gameState, result } = makeActivityFun(state, activity.type, activityId).start()
        state = gameState
        return result === ActivityStartResult.Started
    }

    for (i = start + 1; i < state.orderedActivities.length; i++) if (tryStart()) return state
    for (i = 0; i <= start; i++) if (tryStart()) return state

    state = { ...state, activityId: null }

    return state
}
