import { hasPerk } from '../../perks/PerksSelectors'
import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { GROW_SPEED_BONUS_DURATION, GROW_SPEED_BONUS_MULTI, GROW_SPEED_MASTERY_BONUS_DURATION, GROW_SPEED_MASTERY_BONUS_MULTI, GROW_SPEED_MASTERY_MAX_BONUS, GROW_SPEED_MASTERY_PERK, MAX_GROW_SPEED_BONUS } from '../GrowSpeedConst'
import { WoodTypes } from '../WoodTypes'
import { GrowSpeedBonusAdapter } from './growSpeedBonus'

export const selectGrowSpeedBonusMulti = (state: GameState, woodType: WoodTypes, location: GameLocations) => {
    let ret = 0
    GrowSpeedBonusAdapter.forEach(state.growSpeedBonuses, (b) => {
        if (b.woodType === woodType && b.location === location) ret += b.multi
    })
    return ret
}

export const selectGrowSpeedBonusMultiplier = (state: GameState, woodType: WoodTypes, location: GameLocations) =>
    1 + selectGrowSpeedBonusMulti(state, woodType, location) / 100

export const selectIncreaseGrowSpeedCap = (state: GameState) =>
    hasPerk(GROW_SPEED_MASTERY_PERK)(state) ? GROW_SPEED_MASTERY_MAX_BONUS : MAX_GROW_SPEED_BONUS

export const selectIncreaseGrowSpeedDuration = (state: GameState) =>
    hasPerk(GROW_SPEED_MASTERY_PERK)(state) ? GROW_SPEED_MASTERY_BONUS_DURATION : GROW_SPEED_BONUS_DURATION

export const selectIncreaseGrowSpeedMulti = (state: GameState) =>
    hasPerk(GROW_SPEED_MASTERY_PERK)(state) ? GROW_SPEED_MASTERY_BONUS_MULTI : GROW_SPEED_BONUS_MULTI

export const selectIncreaseGrowSpeedActiveCount = (state: GameState, woodType: WoodTypes, location: GameLocations) =>
    GrowSpeedBonusAdapter.count(state.growSpeedBonuses, (b) => b.woodType === woodType && b.location === location)
