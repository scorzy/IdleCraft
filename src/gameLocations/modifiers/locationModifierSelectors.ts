import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { GameLocationAdapter } from '../GameLocationAdapter'
import { GameLocations } from '../GameLocations'
import { LocationModifierAdapter, LocationModifierType } from './LocationModifier'
import { LocationModifierDataMap } from './LocationModifierData'

export const selectLocationModifierBonusResult = (
    state: GameState,
    location: GameLocations,
    type: LocationModifierType
): BonusResult => {
    const data = LocationModifierDataMap[type]
    const bonuses: Bonus[] = []
    const modifiers = GameLocationAdapter.selectEx(state.locations, location).modifiers

    LocationModifierAdapter.forEach(modifiers, (m) => {
        if (m.type !== type) return
        const bonus: Bonus = { id: m.id, nameId: data.nameId, iconId: data.iconId }
        bonuses.push(bonus)

        if (data.sumType === 'multi') bonus.multi = m.multi
        else bonus.add = m.multi
    })

    return { total: getTotal(bonuses, data.sumType === 'multi'), bonuses }
}

export const selectLocationModifierMulti = (state: GameState, location: GameLocations, type: LocationModifierType) =>
    selectLocationModifierBonusResult(state, location, type).total

export const selectLocationModifiers = (state: GameState, location: GameLocations) => {
    const modifiers = GameLocationAdapter.selectEx(state.locations, location).modifiers
    return LocationModifierAdapter.getIds(modifiers)
}
export const selectLocationModifier = (state: GameState, location: GameLocations, id: string) => {
    const modifiers = GameLocationAdapter.selectEx(state.locations, location).modifiers
    return LocationModifierAdapter.selectEx(modifiers, id)
}
