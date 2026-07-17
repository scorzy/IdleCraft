import { GameState } from '../../game/GameState'
import { scaleTreeGrowthTimers } from '../../timers/scaleTimers'
import { Timer } from '../../timers/Timer'
import { GrowSpeedBonusAdapter } from '../forest/growSpeedBonus'
import { selectTreeRespawnTime } from '../forest/growSpeedSelectors'

export const onGrowSpeedBonusEnd = (state: GameState, timer: Timer) => {
    const bonus = GrowSpeedBonusAdapter.select(state.growSpeedBonuses, timer.actId)
    if (!bonus) return

    const before = selectTreeRespawnTime(state, bonus.woodType, bonus.location)
    GrowSpeedBonusAdapter.remove(state.growSpeedBonuses, bonus.id)
    const after = selectTreeRespawnTime(state, bonus.woodType, bonus.location)

    scaleTreeGrowthTimers(state, bonus.woodType, bonus.location, after / before)
}
