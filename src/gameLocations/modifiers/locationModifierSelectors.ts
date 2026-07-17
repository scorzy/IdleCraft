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
        bonuses.push({ id: m.id, nameId: data.nameId, iconId: data.iconId, add: m.multi })
    })

    return { total: getTotal(bonuses), bonuses }
}

export const selectLocationModifierMulti = (state: GameState, location: GameLocations, type: LocationModifierType) =>
    selectLocationModifierBonusResult(state, location, type).total
