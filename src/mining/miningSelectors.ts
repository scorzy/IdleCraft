import moize from 'moize'
import { ActivityAdapter } from '../activities/ActivityState'
import { PLAYER_ID } from '../characters/charactersConst'
import { selectLevelExp } from '../experience/expSelectors'
import { GameState } from '../game/GameState'
import { PickaxeData } from '../items/Item'
import { isMining } from './Mining'
import { OreData } from './OreData'
import { OreTypes } from './OreTypes'
import { ExpEnum } from '@/experience/ExpEnum'

export const DEF_PICKAXE: PickaxeData = {
    damage: 10,
    time: 4e3,
    armourPen: 0,
}

export const isOreSelected = (oreType: OreTypes) => (state: GameState) => state.ui.oreType === oreType

const makeDefaultMine = moize(
    (oreType: OreTypes) => {
        const data = OreData[oreType]
        return {
            hp: data.hp,
            qta: data.qta,
        }
    },
    {
        maxSize: 15,
    }
)

export const selectDefaultMine = (_s: GameState, oreType: OreTypes) => {
    return makeDefaultMine(oreType)
}

export const selectOre = (state: GameState, oreType: OreTypes) => {
    const ore = state.locations[state.location].ores[oreType]
    if (ore) return ore
    return selectDefaultMine(state, oreType)
}

export const selectMiningId = (s: GameState, oreType: OreTypes) =>
    ActivityAdapter.find(s.activities, (act) => isMining(act) && act.oreType === oreType)?.id
export const isOreEnabled = (oreType: OreTypes) => (state: GameState) =>
    selectLevelExp(ExpEnum.Mining, PLAYER_ID)(state) >= OreData[oreType].requiredLevel
