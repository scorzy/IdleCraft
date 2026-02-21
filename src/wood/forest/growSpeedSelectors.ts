import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Icons } from '../../icons/Icons'
import { hasPerk } from '../../perks/PerksSelectors'
import { Timer, TimerAdapter } from '../../timers/Timer'
import {
    GROW_SPEED_BONUS_DURATION,
    GROW_SPEED_BONUS_MULTI,
    GROW_SPEED_MASTERY_BONUS_DURATION,
    GROW_SPEED_MASTERY_BONUS_MULTI,
    GROW_SPEED_MASTERY_MAX_BONUS,
    GROW_SPEED_MASTERY_PERK,
    MAX_GROW_SPEED_BONUS,
} from '../GrowSpeedConst'
import { WoodTypes } from '../WoodTypes'
import { selectTreeGrowthTime } from './forestSelectors'
import { GrowSpeedBonusAdapter } from './growSpeedBonus'

const GROW_SPEED_BASE: Bonus = {
    id: 'GrowSpeedBase',
    nameId: 'Base',
    iconId: Icons.Forest,
    add: 0,
}

const TREE_RESPAWN_BASE: Bonus = {
    id: 'TreeRespawnBase',
    nameId: 'Base',
    iconId: Icons.Forest,
}

export const selectIncreaseGrowSpeedBonusAll = (state: GameState, woodType: WoodTypes, location: GameLocations) => {
    const ret: BonusResult = { total: 0, bonuses: [GROW_SPEED_BASE] }

    GrowSpeedBonusAdapter.forEach(state.growSpeedBonuses, (b) => {
        if (b.woodType !== woodType || b.location !== location) return
        ret.bonuses.push({
            id: b.id,
            nameId: 'IncreaseGrowSpeed',
            iconId: Icons.Forest,
            add: b.multi,
        })
    })

    ret.total = getTotal(ret.bonuses)
    return ret
}

export const selectGrowSpeedBonusMulti = (state: GameState, woodType: WoodTypes, location: GameLocations) =>
    selectIncreaseGrowSpeedBonusAll(state, woodType, location).total

export const selectGrowSpeedBonusMultiplier = (state: GameState, woodType: WoodTypes, location: GameLocations) =>
    1 + selectGrowSpeedBonusMulti(state, woodType, location) / 100

export const selectTreeRespawnTime = (state: GameState, woodType: WoodTypes, location: GameLocations) =>
    Math.round(selectTreeGrowthTime() / selectGrowSpeedBonusMultiplier(state, woodType, location))

export const selectTreeRespawnTimeAll = (state: GameState, woodType: WoodTypes, location: GameLocations) => {
    const ret: BonusResult = {
        total: 0,
        bonuses: [{ ...TREE_RESPAWN_BASE, add: selectTreeGrowthTime() }],
    }

    const speedBonus = selectIncreaseGrowSpeedBonusAll(state, woodType, location)
    const delta = selectTreeRespawnTime(state, woodType, location) - selectTreeGrowthTime()

    if (speedBonus.total > 0)
        ret.bonuses.push({
            id: `TreeRespawnBonus-${woodType}-${location}`,
            nameId: 'IncreaseGrowSpeed',
            iconId: Icons.Forest,
            add: delta,
            showQta: selectIncreaseGrowSpeedActiveCount(state, woodType, location),
        })

    ret.total = getTotal(ret.bonuses)
    return ret
}

export const selectIncreaseGrowSpeedCap = (state: GameState) =>
    hasPerk(GROW_SPEED_MASTERY_PERK)(state) ? GROW_SPEED_MASTERY_MAX_BONUS : MAX_GROW_SPEED_BONUS

export const selectIncreaseGrowSpeedDuration = (state: GameState) =>
    hasPerk(GROW_SPEED_MASTERY_PERK)(state) ? GROW_SPEED_MASTERY_BONUS_DURATION : GROW_SPEED_BONUS_DURATION

export const selectIncreaseGrowSpeedMulti = (state: GameState) =>
    hasPerk(GROW_SPEED_MASTERY_PERK)(state) ? GROW_SPEED_MASTERY_BONUS_MULTI : GROW_SPEED_BONUS_MULTI

export const selectIncreaseGrowSpeedActiveCount = (state: GameState, woodType: WoodTypes, location: GameLocations) =>
    GrowSpeedBonusAdapter.count(state.growSpeedBonuses, (b) => b.woodType === woodType && b.location === location)

export const selectFirstExpiringGrowSpeedTimer: (
    state: GameState,
    woodType: WoodTypes,
    location: GameLocations
) => Timer | undefined = (state: GameState, woodType: WoodTypes, location: GameLocations) => {
    let timerToRemove: Timer | undefined = undefined

    GrowSpeedBonusAdapter.forEach(state.growSpeedBonuses, (g) => {
        if (g.woodType !== woodType) return
        if (g.location !== location) return

        const t = TimerAdapter.select(state.timers, g.id)
        if (!t) return

        if (!timerToRemove || timerToRemove.to > t.to) timerToRemove = t
    })

    return timerToRemove
}
