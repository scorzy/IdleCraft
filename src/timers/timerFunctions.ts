import { execActivityOnTimer } from '../activities/activityFunctions'
import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { getUniqueId } from '../utils/getUniqueId'
import { growTree } from '../wood/forest/forestFunctions'
import { Timer, TimerAdapter, TimerTypes } from './Timer'

declare function setTimeout(this: Window | void, handler: (...args: unknown[]) => void, timeout: number): number
declare function setTimeout(this: Window | void, handler: unknown, timeout?: unknown, ...args: unknown[]): number

export const execTimer = (timerId: string) => useGameStore.setState((s) => onTimer(s, timerId))

export function startTimer(
    state: GameState,
    length: number,
    type: TimerTypes,
    actId: string,
    data?: unknown
): GameState {
    let end = state.now + length
    let intervalId = 0
    const id = getUniqueId()

    if (!state.loading) {
        state = { ...state, now: Date.now() }
        end = state.now + length
        const diff = Math.max(end - state.now, 0)
        intervalId = setTimeout(() => execTimer(id), diff)
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

    const actId = timer.actId
    if (actId) {
        if (timer.type === TimerTypes.Tree) {
            return growTree(state, actId)
        }

        state = execActivityOnTimer(state, actId)
    }

    return state
}

export function removeActivityTimers(state: GameState, activityId: string): GameState {
    let timers = state.timers

    for (const id of timers.ids) {
        const timer = TimerAdapter.select(timers, id)
        if (timer && activityId === timer.actId) {
            timers = TimerAdapter.remove(timers, id)
            if (timer.intervalId) clearInterval(timer.intervalId)
        }
    }

    state = { ...state, timers }
    return state
}
