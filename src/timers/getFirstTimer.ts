import { InitialTimerState, Timer } from './Timer'

export function getFirstTimer(timers: InitialTimerState, max: number): Timer | null {
    let min = Number.POSITIVE_INFINITY
    let ret: Timer | null = null
    const ids = timers.ids
    ids.forEach((id) => {
        const timer = timers.entries[id]
        if (!timer) return
        if (timer.to > max) return
        if (timer.to < min) {
            min = timer.to
            ret = timer
        }
    })
    return ret
}
