import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { ActivityAdapter, ActivityTypes } from '../ActivityState'
import { ActivityStartResult } from '../activityInterfaces'
import { endActivity } from './endActivity'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { stopActivity } from './stopActivity'
import { TimerAdapter } from '../../timers/Timer'

describe('activity lifecycle boundaries', () => {
    let state: GameState

    beforeAll(() => initialize())

    beforeEach(() => {
        state = GetInitialGameState()
    })

    function addActivity(id: string, remove = false, max = 1) {
        ActivityAdapter.create(state.activities, {
            id,
            type: ActivityTypes.Crafting,
            max,
            remove,
        })
        state.orderedActivities.push(id)
    }

    it('auto-removes a completed activity when its repetition limit is reached', () => {
        addActivity('crafting', true, 1)
        state.activityId = 'crafting'

        endActivity(state, 'crafting', ActivityStartResult.Ended)

        expect(ActivityAdapter.select(state.activities, 'crafting')).toBeUndefined()
        expect(state.orderedActivities).toEqual([])
        expect(state.activityDone).toBe(1)
        expect(state.activityId).toBeNull()
    })

    it('stops the active activity, clears its timers, and leaves unrelated timers intact', () => {
        addActivity('crafting')
        state.activityId = 'crafting'
        state.lastActivityDone = 1
        TimerAdapter.create(state.timers, {
            id: 'activity-timer',
            from: 0,
            to: 1,
            type: ActivityTypes.Crafting,
            actId: 'crafting',
        })
        TimerAdapter.create(state.timers, {
            id: 'other-timer',
            from: 0,
            to: 1,
            type: ActivityTypes.Crafting,
            actId: 'other',
        })

        stopActivity(state, 'crafting')

        expect(state.activityId).toBeNull()
        expect(state.lastActivityDone).toBe(0)
        expect(TimerAdapter.select(state.timers, 'activity-timer')).toBeUndefined()
        expect(TimerAdapter.select(state.timers, 'other-timer')).toBeDefined()
    })

    it('leaves an activity untouched when an execution remains started', () => {
        addActivity('crafting')
        state.activityId = 'crafting'

        endActivity(state, 'crafting', ActivityStartResult.Started)

        expect(ActivityAdapter.select(state.activities, 'crafting')).toBeDefined()
        expect(state.activityDone).toBe(0)
        expect(state.activityId).toBe('crafting')
    })
})
