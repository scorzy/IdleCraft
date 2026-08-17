import { memoize } from 'micro-memoize'
import { ExpEnum } from '@/experience/ExpEnum'
import { ActivityAdapter } from '../activities/ActivityState'
import { PLAYER_ID } from '../characters/charactersConst'
import { selectLevelExp } from '../experience/expSelectors'
import { GameState } from '../game/GameState'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { GameLocations } from '../gameLocations/GameLocations'
import { LocationModifierType } from '../gameLocations/modifiers/LocationModifier'
import { selectLocationModifierMulti } from '../gameLocations/modifiers/locationModifierSelectors'
import { PickaxeData } from '../items/Item'
import { isMining } from './Mining'
import { OreData } from './OreData'
import { OreTypes } from './OreTypes'

export const DEF_PICKAXE: PickaxeData = {
    damage: 10,
    time: 6e3,
    armourPen: 0,
}

export const isOreSelected = (oreType: OreTypes) => (state: GameState) => state.ui.oreType === oreType

const makeDefaultMine = memoize(
    (oreType: OreTypes, quantityBonus: number) => {
        const data = OreData[oreType]
        return {
            hp: data.hp,
            qta: Math.max(1, Math.floor(data.qta * quantityBonus)),
        }
    },
    {
        maxSize: 15,
    }
)

export const selectDefaultMine = (state: GameState, oreType: OreTypes, location: GameLocations = state.location) => {
    const quantityBonus = selectLocationModifierMulti(state, location, LocationModifierType.OreVeinQuantity)
    const def = makeDefaultMine(oreType, quantityBonus)

    return def
}

export const selectOre = (state: GameState, oreType: OreTypes) => {
    const ore = GameLocationAdapter.selectEx(state.locations, state.location).ores[oreType]
    if (ore) return ore
    return selectDefaultMine(state, oreType)
}

export const selectMiningId = (s: GameState, oreType: OreTypes) =>
    ActivityAdapter.find(s.activities, (act) => isMining(act) && act.oreType === oreType)?.id
export const isOreEnabled = (oreType: OreTypes) => (state: GameState) =>
    selectLevelExp(ExpEnum.Mining, PLAYER_ID)(state) >= OreData[oreType].requiredLevel
