import { GameState } from '../game/GameState'
import { activityStarters } from '../game/globals'
import { setState } from '../game/state'
import { ActivityAdapter } from './ActivityState'
import { ActivityStartResult } from './activityInterfaces'
import { removeActivityInt } from './functions/removeActivity'

export function startNextActivity(state: GameState): void {
    if (state.orderedActivities.length < 1) return

    if (state.activityId) {
        const currentAct = ActivityAdapter.select(state.activities, state.activityId)
        if (currentAct === undefined) {
            state.activityId = null
        } else if (currentAct.max > state.activityDone) {
            const actId = state.activityId
            const start = activityStarters.getEx(currentAct.type)
            const result = start(state, actId)

            if (result === ActivityStartResult.NotPossible) removeActivityInt(state, actId)

            if (result === ActivityStartResult.Started) return
        }
    }

    state.activityDone = 0

    const start = state.lastActivityDone
    let i = start + 1

    function tryStart(): boolean {
        const activityId = state.orderedActivities[i]
        if (!activityId) return false

        const activity = ActivityAdapter.select(state.activities, activityId)
        if (!activity) return false
        const start = activityStarters.getEx(activity.type)
        const result = start(state, activityId)

        if (result === ActivityStartResult.NotPossible) removeActivityInt(state, activityId)

        return result === ActivityStartResult.Started
    }

    for (i = start + 1; i < state.orderedActivities.length; i++) if (tryStart()) return
    for (i = 0; i <= start; i++) if (tryStart()) return

    state.activityId = null
}

export const moveActivityNext = (id: string) =>
    setState((s) => {
        const index = s.activities.ids.indexOf(id)
        if (index < 0) return
        if (index >= s.activities.ids.length - 1) return s
        const ids = s.activities.ids
        const tmp = ids[index + 1]
        if (!tmp) return s
        ids[index + 1] = id
        ids[index] = tmp
        return
    })
export const moveActivityPrev = (id: string) =>
    setState((s) => {
        const index = s.activities.ids.indexOf(id)
        if (index < 0) return
        if (index < 1) return
        const ids = s.activities.ids
        const tmp = ids[index - 1]
        if (!tmp) return
        ids[index - 1] = id
        ids[index] = tmp
        return
    })
