import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ActivityTypes } from '../activities/ActivityState'
import { activityExecutors } from '../game/globals'
import { GameState } from '../game/GameState'
import { GetInitialGameState } from '../game/InitialGameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { WoodTypes } from '../wood/WoodTypes'
import { TreeGrowthAdapter } from '../wood/forest/forestGrowth'
import { advanceTimers } from '../game/functions/advanceTimers'
import { getFirstTimer } from './getFirstTimer'
import { onTimer } from './onTimer'
import { scaleTimerFromNow, scaleTreeGrowthTimers } from './scaleTimers'
import { startTimer } from './startTimer'
import { TimerAdapter } from './Timer'

describe('timer state transitions', () => {
    let state: GameState

    beforeEach(() => {
        vi.restoreAllMocks()
        state = GetInitialGameState()
        activityExecutors.clear()
    })

    it('creates a timer from the persisted game clock while loading', () => {
        state.loading = true
        state.now = 100

        startTimer(state, 250, ActivityTypes.Crafting, 'activity', 'timer')

        expect(TimerAdapter.selectEx(state.timers, 'timer')).toEqual({
            id: 'timer',
            from: 100,
            to: 350,
            type: ActivityTypes.Crafting,
            actId: 'activity',
        })
    })

    it('anchors a live timer to the current wall clock', () => {
        vi.spyOn(Date, 'now').mockReturnValue(500)
        state.now = 100

        startTimer(state, 250, ActivityTypes.Crafting, 'activity', 'timer')

        expect(state.now).toBe(500)
        expect(TimerAdapter.selectEx(state.timers, 'timer')?.from).toBe(500)
        expect(TimerAdapter.selectEx(state.timers, 'timer')?.to).toBe(750)
    })

    it('advances the game clock and every timer by the same amount', () => {
        state.now = 1_000
        TimerAdapter.create(state.timers, {
            id: 'timer',
            from: 1_000,
            to: 2_000,
            type: ActivityTypes.Crafting,
            actId: 'activity',
        })

        advanceTimers(state, 500)

        expect(state.now).toBe(1_500)
        expect(TimerAdapter.selectEx(state.timers, 'timer')).toMatchObject({ from: 1_500, to: 2_500 })
    })

    it('returns the earliest timer at or before the requested limit', () => {
        TimerAdapter.create(state.timers, {
            id: 'late',
            from: 0,
            to: 300,
            type: ActivityTypes.Crafting,
            actId: 'late-act',
        })
        TimerAdapter.create(state.timers, {
            id: 'early',
            from: 0,
            to: 100,
            type: ActivityTypes.Crafting,
            actId: 'early-act',
        })

        expect(getFirstTimer(state.timers, 200)?.id).toBe('early')
        expect(getFirstTimer(state.timers, 50)).toBeNull()
    })

    it('removes a timer, clamps now to its due time, and dispatches its executor', () => {
        state.now = 100
        state.lastRegen = 100
        const executor = vi.fn()
        activityExecutors.set(ActivityTypes.Crafting, executor)
        TimerAdapter.create(state.timers, {
            id: 'timer',
            from: 50,
            to: 250,
            type: ActivityTypes.Crafting,
            actId: 'activity',
        })

        onTimer(state, 'timer')

        expect(state.now).toBe(250)
        expect(TimerAdapter.select(state.timers, 'timer')).toBeUndefined()
        expect(executor).toHaveBeenCalledWith(state, expect.objectContaining({ id: 'timer', actId: 'activity' }))
    })

    it('ignores unknown timers', () => {
        const executor = vi.fn()
        activityExecutors.set(ActivityTypes.Crafting, executor)

        onTimer(state, 'missing')

        expect(executor).not.toHaveBeenCalled()
        expect(state.now).toBe(GetInitialGameState().now)
    })

    it('scales a timer duration while preserving its normalized progress', () => {
        state.now = 250
        TimerAdapter.create(state.timers, {
            id: 'timer',
            from: 0,
            to: 1_000,
            type: ActivityTypes.Crafting,
            actId: 'activity',
        })

        scaleTimerFromNow(state, 'timer', 2)

        expect(TimerAdapter.selectEx(state.timers, 'timer')).toMatchObject({ from: 125, to: 625 })
    })

    it('ignores invalid ratios, missing timers, and zero-length timers', () => {
        TimerAdapter.create(state.timers, {
            id: 'timer',
            from: 100,
            to: 100,
            type: ActivityTypes.Crafting,
            actId: 'activity',
        })

        scaleTimerFromNow(state, 'timer', 0)
        scaleTimerFromNow(state, 'timer', 1)
        scaleTimerFromNow(state, 'missing', 2)
        scaleTimerFromNow(state, 'timer', 2)

        expect(TimerAdapter.selectEx(state.timers, 'timer')).toMatchObject({ from: 100, to: 100 })
    })

    it('scales only matching tree-growth timers', () => {
        state.now = 250
        TreeGrowthAdapter.create(state.treeGrowth, {
            id: 'growth',
            woodType: WoodTypes.Oak,
            location: GameLocations.StartVillage,
        })
        TimerAdapter.create(state.timers, {
            id: 'matching',
            from: 0,
            to: 1_000,
            type: ActivityTypes.Tree,
            actId: 'growth',
        })
        TimerAdapter.create(state.timers, {
            id: 'other-type',
            from: 0,
            to: 1_000,
            type: ActivityTypes.Crafting,
            actId: 'growth',
        })

        scaleTreeGrowthTimers(state, WoodTypes.Oak, GameLocations.StartVillage, 2)

        expect(TimerAdapter.selectEx(state.timers, 'matching')).toMatchObject({ from: 125, to: 625 })
        expect(TimerAdapter.selectEx(state.timers, 'other-type').to).toBe(1_000)
    })
})
