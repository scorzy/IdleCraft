import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { getFirstTimer } from './getFirstTimer'
import { TimerAdapter } from './Timer'
import { onTimer } from './onTimer'

function onTimerAndCheck(state: GameState, timerId: string): GameState {
    const toDo = TimerAdapter.select(state.timers, timerId)
    if (!toDo) return state
    const now = toDo.to

    let timer = getFirstTimer(state.timers, now)
    while (timer) {
        state.now = timer.to
        state = onTimer(state, timer.id)
        timer = getFirstTimer(state.timers, now)
    }

    const toDo2 = TimerAdapter.select(state.timers, timerId)
    if (toDo2) state = onTimer(state, toDo2.id)

    return state
}

export const execTimer = (timerId: string) => useGameStore.setState((s) => onTimerAndCheck(s, timerId))
