import { InitialTimerState, Timer, TimerAdapter } from './Timer'

export function getFirstTimer(timers: InitialTimerState, max: number): Timer | null {
    const timerId = timers.minId
    if (!timerId) return null
    const timer = TimerAdapter.select(timers, timerId)
    if (!timer) return null
    if (timer.to > max) return null
    return timer
}
