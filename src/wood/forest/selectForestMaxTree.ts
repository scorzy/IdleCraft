import { Bonus } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { LocationModifierType } from '../../gameLocations/modifiers/LocationModifier'
import { selectLocationModifierBonusResult } from '../../gameLocations/modifiers/locationModifierSelectors'
import { WoodData } from '../WoodData'
import { WoodTypes } from '../WoodTypes'

export const selectForestMaxTreeList = (state: GameState, woodType: WoodTypes, location: GameLocations) => {
    const bonuses: Bonus[] = []
    const data = WoodData[woodType]

    bonuses.push({
        id: 'baseMaxTree',
        add: data.maxQta,
        iconId: data.iconId,
        nameId: 'Base',
    })

    const maxTreeMulti = selectLocationModifierBonusResult(state, location, LocationModifierType.MaxTree)

    for (const bonus of maxTreeMulti.bonuses)
        bonuses.push({
            id: 'maxTreeBonus',
            multi: bonus.multi,
            iconId: bonus.iconId,
            nameId: 'maxTreeName',
        })

    return {
        bonuses,
        total: Math.round(getTotal(bonuses)),
    }
}
export const selectForestMaxTree = (state: GameState, woodType: WoodTypes, location: GameLocations) =>
    selectForestMaxTreeList(state, woodType, location).total
