import { GameState } from '../game/GameState'
import { Timer, TimerAdapter } from './Timer'
import { execTimer } from './timerFunctions'

//declare function setTimeout(this: Window | void, handler: (...args: unknown[]) => void, timeout: number): number

export const prevTimers = new Map<string, { id: string; from: number; to: number; intervalId: number }>()

export function updateTimers(state: GameState): void {
    if (state.loading) return
    if (state.isTimer) return

    TimerAdapter.forEach(state.timers, (timer) => {
        const prev = prevTimers.get(timer.id)

        if (!prev) startTimer(timer)
        else if (timer.from !== prev.to || timer.to !== prev.to) {
            clearInterval(prev.intervalId)
            startTimer(timer)
        }
    })

    prevTimers.forEach((v, id, map) => {
        if (TimerAdapter.select(state.timers, id)) return
        clearInterval(v.intervalId)
        map.delete(id)
    })
}

function startTimer(timer: Timer) {
    const diff = Math.max(timer.to - Date.now(), 0)
    const intervalId = setTimeout(() => execTimer(timer.id), diff) as unknown as number
    prevTimers.set(timer.id, { id: timer.id, to: timer.to, from: timer.from, intervalId })
}
