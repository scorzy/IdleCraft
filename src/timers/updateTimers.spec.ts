import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest'
import { create } from 'mutative'
import type { GameState } from '../game/GameState'
import { GetInitialGameState } from '../game/InitialGameState'
import { ActivityTypes } from '../activities/ActivityState'
import { getUniqueId } from '../utils/getUniqueId'
import { prevTimers, updateTimers } from './updateTimers'
import { TimerAdapter } from './Timer'
import { execTimer } from './timerFunctions'

vi.mock('./timerFunctions', () => ({
    execTimer: vi.fn(),
}))

describe('updateTimers', () => {
    const prevState: GameState = GetInitialGameState()
    let state: GameState

    const timer = {
        id: 't1',
        actId: getUniqueId(),
        from: Date.now(),
        to: Date.now() + 1e3,
        type: ActivityTypes.Crafting,
    }

    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()

        vi.spyOn(globalThis, 'setTimeout')
        vi.spyOn(globalThis, 'clearInterval')

        state = create(prevState, (state: GameState) => TimerAdapter.create(state.timers, timer))

        prevTimers.clear()
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.restoreAllMocks()
        prevTimers.clear()
    })

    it('does nothing if state.loading is true', () => {
        state.loading = true
        updateTimers(state)
        expect(setTimeout).not.toHaveBeenCalled()
    })
    it('does nothing if state.isTimer is true', () => {
        state.isTimer = true
        updateTimers(state)
        expect(setTimeout).not.toHaveBeenCalled()
    })
    it('starts a new timer when not present in prevTimers', () => {
        updateTimers(state)
        expect(setTimeout).toHaveBeenCalledTimes(1)
    })
    it('executes execTimer after timeout', () => {
        updateTimers(state)
        vi.runAllTimers()
        expect(execTimer).toHaveBeenCalledWith('t1')
    })

    it('restarts a timer if from/to changes', () => {
        updateTimers(state)

        const prevCallCount = (setTimeout as unknown as Mock).mock.calls.length

        const newState = create(state, (state: GameState) => {
            const tim = TimerAdapter.select(state.timers, 't1')
            if (tim) tim.to += 1e3
        })

        updateTimers(newState)

        expect((setTimeout as unknown as Mock).mock.calls.length).toBeGreaterThan(prevCallCount)
    })

    it('clears a timer if removed from state', () => {
        updateTimers(state)

        updateTimers(prevState)

        expect(clearInterval).toHaveBeenCalled()
    })
})
