import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { getUniqueId } from '../utils/getUniqueId'
import { Timer, TimerAdapter, TimerTypes } from './Timer'

export const execTimer = (timerId: string) => useGameStore.setState((s) => onTimer(s, timerId))

export function startTimer(
    state: GameState,
    length: number,
    type: TimerTypes,
    actId: string,
    data?: unknown
): GameState {
    const end = state.now + length
    let intervalId = 0
    const id = getUniqueId()

    if (!state.loading) {
        state = { ...state, now: Date.now() }
        const diff = Math.max(end - state.now, 0)
        intervalId = window.setTimeout(() => execTimer(id), diff)
    }

    const timer: Timer = { id, from: state.now, to: end, intervalId, type, actId, data }

    state = {
        ...state,
        timers: TimerAdapter.create(state.timers, timer),
    }

    return state
}

export function onTimer(state: GameState, timerId: string) {
    const timer = state.timers.entries[timerId]
    if (timer === undefined) return state

    state = { ...state, timers: TimerAdapter.remove(state.timers, timerId) }

    switch (timer.type) {
        case TimerTypes.Woodcutting:
    }

    return state
}

export function removeActivityTimers(state: GameState, activityId: string): GameState {
    let timers = state.timers

    for (const id of timers.ids) {
        const timer = TimerAdapter.select(timers, id)
        if (timer && activityId === timer.actId) {
            timers = TimerAdapter.remove(timers, id)
            if (timer.intervalId) window.clearInterval(timer.intervalId)
        }
    }

    state = { ...state, timers }
    return state
}
