import { ActivityTypes } from '../activities/ActivityState'
import { GameState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { TreeGrowthAdapter } from '../wood/forest/forestGrowth'
import { WoodTypes } from '../wood/WoodTypes'
import { TimerAdapter } from './Timer'

export const scaleTimerFromNow = (state: GameState, timerId: string, ratio: number) => {
    if (ratio <= 0 || ratio === 1) return

    const timer = TimerAdapter.select(state.timers, timerId)
    if (!timer) return

    const full = Math.max(timer.to - timer.from, 0)
    if (full <= 0) return

    const elapsed = Math.min(Math.max(state.now - timer.from, 0), full)
    const progress = elapsed / full

    const newFull = Math.max(Math.round(full / ratio), 1)
    const newElapsed = Math.max(Math.round(newFull * progress), 0)

    timer.from = state.now - newElapsed
    timer.to = timer.from + newFull
}

export const scaleTreeGrowthTimers = (
    state: GameState,
    woodType: WoodTypes,
    location: GameLocations,
    ratio: number
) => {
    if (ratio <= 0 || ratio === 1) return

    for (const timerId of state.timers.ids) {
        const timer = TimerAdapter.select(state.timers, timerId)
        if (!timer || timer.type !== ActivityTypes.Tree || !timer.actId) continue

        const treeGrowth = TreeGrowthAdapter.select(state.treeGrowth, timer.actId)
        if (!treeGrowth) continue
        if (treeGrowth.woodType !== woodType || treeGrowth.location !== location) continue

        scaleTimerFromNow(state, timer.id, ratio)
    }
}
