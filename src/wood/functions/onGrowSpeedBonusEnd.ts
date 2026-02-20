import { GameState } from '../../game/GameState'
import { Timer } from '../../timers/Timer'
import { scaleTreeGrowthTimers } from '../../timers/scaleTimers'
import { GrowSpeedBonusAdapter } from '../forest/growSpeedBonus'
import { selectGrowSpeedBonusMultiplier } from '../forest/growSpeedSelectors'

export const onGrowSpeedBonusEnd = (state: GameState, timer: Timer) => {
    const bonus = GrowSpeedBonusAdapter.select(state.growSpeedBonuses, timer.actId)
    if (!bonus) return

    const before = selectGrowSpeedBonusMultiplier(state, bonus.woodType, bonus.location)
    GrowSpeedBonusAdapter.remove(state.growSpeedBonuses, bonus.id)
    const after = selectGrowSpeedBonusMultiplier(state, bonus.woodType, bonus.location)

    scaleTreeGrowthTimers(state, bonus.woodType, bonus.location, after / before)
}
