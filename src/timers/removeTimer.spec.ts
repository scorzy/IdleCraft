import { describe, expect, it } from 'vitest'
import { ActivityTypes } from '../activities/ActivityState'
import { GameState } from '../game/GameState'
import { GetInitialGameState } from '../game/InitialGameState'
import { TimerAdapter } from './Timer'
import { removeTimer } from './removeTimer'

describe('removeTimer', () => {
    it('removes an existing timer', () => {
        const state: GameState = GetInitialGameState()
        TimerAdapter.create(state.timers, { id: 't1', from: 0, to: 100, type: ActivityTypes.Woodcutting, actId: 'a1' })

        removeTimer(state, 't1')

        expect(state.timers.ids).not.toContain('t1')
    })

    it('does nothing when the timer does not exist', () => {
        const state: GameState = GetInitialGameState()

        expect(() => removeTimer(state, 'missing')).not.toThrow()
        expect(state.timers.ids).toHaveLength(0)
    })
})
