import { GameState } from '../game/GameState'
import { activityStarters } from '../game/globals'
import { useGameStore } from '../game/state'
import { ActivityAdapter } from './ActivityState'
import { ActivityStartResult } from './activityInterfaces'

export function startNextActivity(state: GameState): GameState {
    if (state.orderedActivities.length < 1) return state

    if (state.activityId !== null) {
        const currentAct = ActivityAdapter.select(state.activities, state.activityId)
        if (currentAct === undefined) {
            state = { ...state, activityId: null }
        } else if (currentAct.max > state.activityDone) {
            const start = activityStarters.getEx(currentAct.type)
            const { state: gameState, result } = start(state, state.activityId)
            state = gameState
            if (result === ActivityStartResult.Started) return state
        }
    }

    state = { ...state, activityDone: 0 }

    const start = state.lastActivityDone
    let i = start + 1

    function tryStart(): boolean {
        const activityId = state.orderedActivities[i]
        if (!activityId) return false

        const activity = ActivityAdapter.select(state.activities, activityId)
        if (!activity) return false
        const start = activityStarters.getEx(activity.type)
        const { state: gameState, result } = start(state, activityId)
        state = gameState

        return result === ActivityStartResult.Started
    }

    for (i = start + 1; i < state.orderedActivities.length; i++) if (tryStart()) return state
    for (i = 0; i <= start; i++) if (tryStart()) return state

    state = { ...state, activityId: null }

    return state
}

export const moveActivityNext = (id: string) =>
    useGameStore.setState((s) => {
        const index = s.activities.ids.indexOf(id)
        if (index < 0) return s
        if (index >= s.activities.ids.length - 1) return s
        const ids = [...s.activities.ids]
        const tmp = ids[index + 1]
        if (!tmp) return s
        ids[index + 1] = id
        ids[index] = tmp
        s = { ...s, activities: { ...s.activities, ids } }
        return s
    })
export const moveActivityPrev = (id: string) =>
    useGameStore.setState((s) => {
        const index = s.activities.ids.indexOf(id)
        if (index < 0) return s
        if (index < 1) return s
        const ids = [...s.activities.ids]
        const tmp = ids[index - 1]
        if (!tmp) return s
        ids[index - 1] = id
        ids[index] = tmp
        s = { ...s, activities: { ...s.activities, ids } }
        return s
    })
