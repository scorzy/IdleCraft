import { ActivityTypes } from '../activities/ActivityState'
import { GameState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { TimerAdapter } from './Timer'
import { TreeGrowthAdapter } from '../wood/forest/forestGrowth'
import { WoodTypes } from '../wood/WoodTypes'

export const scaleTimerFromNow = (state: GameState, timerId: string, ratio: number) => {
    if (ratio <= 0 || ratio === 1) return
    const timer = TimerAdapter.select(state.timers, timerId)
    if (!timer) return

    const remaining = Math.max(timer.to - state.now, 0)
    const newRemaining = Math.max(Math.round(remaining / ratio), 0)
    timer.from = state.now
    timer.to = state.now + newRemaining
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
