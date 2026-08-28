import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ActivityAdapter, ActivityTypes } from './ActivityState'
import { ActivityStartResult } from './activityInterfaces'
import { activityRemovers, activityStarters } from '../game/globals'
import { GameState } from '../game/GameState'
import { GetInitialGameState } from '../game/InitialGameState'
import { startNextActivity } from './activityFunctions'

describe('activity lifecycle', () => {
    let state: GameState
    const results = new Map<string, ActivityStartResult>()
    const starter = vi.fn((current: GameState, id: string) => {
        const result = results.get(id) ?? ActivityStartResult.NotPossible
        if (result === ActivityStartResult.Started) current.activityId = id
        return result
    })
    const remover = vi.fn((current: GameState, id: string) => {
        ActivityAdapter.remove(current.activities, id)
        current.orderedActivities = current.orderedActivities.filter((activityId) => activityId !== id)
    })

    beforeEach(() => {
        state = GetInitialGameState()
        results.clear()
        starter.mockClear()
        remover.mockClear()
        activityStarters.clear()
        activityRemovers.clear()
        activityStarters.set(ActivityTypes.Crafting, starter)
        activityRemovers.set(ActivityTypes.Crafting, remover)
    })

    function addActivity(id: string, max = 1) {
        ActivityAdapter.create(state.activities, { id, type: ActivityTypes.Crafting, max })
        state.orderedActivities.push(id)
    }

    it('starts the current activity again while repetitions remain', () => {
        addActivity('current', 3)
        state.activityId = 'current'
        state.activityDone = 1
        results.set('current', ActivityStartResult.Started)

        startNextActivity(state)

        expect(starter).toHaveBeenCalledWith(state, 'current')
        expect(state.activityId).toBe('current')
    })

    it('advances to the next queue entry after the current activity reaches its limit', () => {
        addActivity('current', 1)
        addActivity('next', 1)
        state.activityId = 'current'
        state.activityDone = 1
        state.lastActivityDone = 0
        results.set('current', ActivityStartResult.Ended)
        results.set('next', ActivityStartResult.Started)

        startNextActivity(state)

        expect(starter).toHaveBeenNthCalledWith(1, state, 'next')
        expect(state.activityId).toBe('next')
        expect(state.activityDone).toBe(0)
    })

    it('removes impossible activities and leaves no active activity when none can start', () => {
        addActivity('blocked')
        results.set('blocked', ActivityStartResult.NotPossible)
        state.lastActivityDone = 0

        startNextActivity(state)

        expect(remover).toHaveBeenCalledWith(state, 'blocked')
        expect(ActivityAdapter.select(state.activities, 'blocked')).toBeUndefined()
        expect(state.orderedActivities).toEqual([])
        expect(state.activityId).toBeNull()
    })

    it('wraps around the queue when the entries after the last completed item cannot start', () => {
        addActivity('first')
        addActivity('second')
        addActivity('third')
        state.lastActivityDone = 1
        results.set('first', ActivityStartResult.Started)

        startNextActivity(state)

        expect(state.activityId).toBe('first')
        expect(starter).toHaveBeenCalledWith(state, 'third')
        expect(starter).toHaveBeenCalledWith(state, 'first')
    })
})
