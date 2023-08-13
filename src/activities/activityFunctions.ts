import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { ActivityStartResult } from './AbstractActivity'
import { ActivityAdapter } from './ActivityState'
import { makeActivityFun } from './makeActivityFun'

function removeActivityInt(state: GameState, id: string): GameState {
    const act = ActivityAdapter.select(state.activities, id)
    if (act === undefined) return state
    state = makeActivityFun(state, act.type, id).remove()
    return startNextActivity(state)
}

export const removeActivity = (id: string | undefined) => {
    if (id === undefined) return
    return useGameStore.setState((s) => removeActivityInt(s, id))
}

export function execActivityOnTimer(state: GameState, activityId: string): GameState {
    const activity = ActivityAdapter.select(state.activities, activityId)
    if (activity === undefined) return state
    const res = makeActivityFun(state, activity.type, activityId).exec()
    state = res.gameState
    if (res.result !== ActivityStartResult.Started) state = startNextActivity(state)
    return state
}

export function startNextActivity(state: GameState): GameState {
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

export const moveActivityNext = (id: string) =>
    useGameStore.setState((s) => {
        const index = s.activities.ids.indexOf(id)
        if (index < 0) return s
        if (index >= s.activities.ids.length - 1) return s
        const ids = [...s.activities.ids]
        const tmp = ids[index + 1]
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
        ids[index - 1] = id
        ids[index] = tmp
        s = { ...s, activities: { ...s.activities, ids } }
        return s
    })
