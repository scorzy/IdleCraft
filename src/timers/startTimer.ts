import { ActivityTypes } from '../activities/ActivityState'
import { GameState } from '../game/GameState'
import { getUniqueId } from '../utils/getUniqueId'
import { Timer, TimerAdapter } from './Timer'

export function startTimer(
    state: GameState,
    length: number,
    type: ActivityTypes,
    actId: string,
    timerId?: string
): void {
    let end = state.now + length
    const id = timerId ?? getUniqueId()

    if (!state.loading) {
        if (!state.loading && !state.isTimer) state.now = Date.now()
        end = state.now + length
    }

    const timer: Timer = { id, from: state.now, to: end, type, actId }

    TimerAdapter.create(state.timers, timer)
}
