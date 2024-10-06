import { PLAYER_ID } from '../characters/charactersConst'
import { ExpEnum } from '../experience/expEnum'
import { selectLevelExp } from '../experience/expSelectors'
import { GameState } from '../game/GameState'
import { PickaxeData } from '../items/Item'
import { myMemoize } from '../utils/memoize'
import { OreData } from './OreData'
import { OreState } from './OreState'
import { OreTypes } from './OreTypes'

export const DEF_PICKAXE: PickaxeData = {
    damage: 20,
    time: 3e3,
    armourPen: 0,
}

export const isOreSelected = (oreType: OreTypes) => (state: GameState) => state.ui.oreType === oreType

export const selectDefaultMine = myMemoize(function selectDefaultMine(oreType: OreTypes): OreState {
    const data = OreData[oreType]
    return {
        hp: data.hp,
        qta: data.qta,
    }
})
export const selectOre = myMemoize((oreType: OreTypes) => (state: GameState) => {
    const ore = state.locations[state.location].ores[oreType]
    if (ore) return ore
    return selectDefaultMine(oreType)
})

export const selectMining = myMemoize((oreType: OreTypes) => (s: GameState) => {
    for (const id of s.mining.ids) {
        const act = s.mining.entries[id]
        if (act?.oreType === oreType) return act.activityId
    }
})
export const isOreEnabled = (oreType: OreTypes) => (state: GameState) =>
    selectLevelExp(ExpEnum.Mining, PLAYER_ID)(state) >= OreData[oreType].requiredLevel
