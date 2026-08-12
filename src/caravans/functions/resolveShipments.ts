import { ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { onTimer } from '../../timers/onTimer'

function getFirstShipmentTimerId(state: GameState, max: number): string | null {
    let min = Number.POSITIVE_INFINITY
    let ret: string | null = null

    for (const id of state.timers.ids) {
        const timer = state.timers.entries[id]
        if (!timer || timer.type !== ActivityTypes.Shipment) continue
        if (timer.to > max) continue
        if (timer.to < min) {
            min = timer.to
            ret = id
        }
    }
    return ret
}

// Redundant with production (loadGame.ts already replays Shipment timers generically); exists so offline resolution is testable without the Worker/MAX_LOAD machinery.
export function resolveShipments(state: GameState, now: number): void {
    if (now < state.now) return

    let timerId = getFirstShipmentTimerId(state, now)
    while (timerId) {
        onTimer(state, timerId)
        timerId = getFirstShipmentTimerId(state, now)
    }
}
