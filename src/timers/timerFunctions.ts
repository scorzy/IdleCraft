import { GameState } from '../game/GameState'
import { setState } from '../game/state'
import { getFirstTimer } from './getFirstTimer'
import { TimerAdapter } from './Timer'
import { onTimer } from './onTimer'

function onTimerAndCheck(state: GameState, timerId: string): void {
    const toDo = TimerAdapter.select(state.timers, timerId)
    if (!toDo) return
    const now = toDo.to

    state.isTimer = true
    try {
        let timer = getFirstTimer(state.timers, now)
        while (timer) {
            state.now = timer.to
            onTimer(state, timer.id)
            timer = getFirstTimer(state.timers, now)
        }

        const toDo2 = TimerAdapter.select(state.timers, timerId)
        if (toDo2) onTimer(state, toDo2.id)
    } finally {
        state.isTimer = false
    }
}

export const execTimer = (timerId: string) => setState((s) => onTimerAndCheck(s, timerId))
