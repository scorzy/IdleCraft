import { PLAYER_ID } from '../../characters/charactersConst'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { GameState } from '../../game/GameState'
import { selectGameItem } from '../../storage/StorageSelectors'
import { Item, WoodAxeData } from '../../items/Item'
import { Icons } from '../../icons/Icons'
import { BaseBonus } from '../../bonus/Bonus'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { WoodTypes } from '../WoodTypes'
import { selectLevelExp } from '../../experience/expSelectors'
import { WoodData } from '../WoodData'
import { isWoodcutting } from '../Woodcutting'
import { GameLocations } from '../../gameLocations/GameLocations'
import { isIncreaseGrowSpeed } from '../IncreaseGrowSpeed'
import { ExpEnum } from '@/experience/ExpEnum'

export const DEF_WOOD_AXE: WoodAxeData = {
    damage: 10,
    time: 6e3,
}
export const WoodBase: BaseBonus = {
    nameId: 'Base',
    iconId: Icons.Axe,
}

export function selectAxe(state: GameState): Item | undefined {
    const axe = CharacterAdapter.selectEx(state.characters, PLAYER_ID).inventory[EquipSlotsEnum.WoodAxe]
    if (!axe) return
    return selectGameItem(axe.itemId)(state)
}

export const isWoodEnabled = (woodType: WoodTypes) => (state: GameState) => {
    const woodLevel = selectLevelExp(ExpEnum.Woodcutting, PLAYER_ID)(state)
    const data = WoodData[woodType]
    return woodLevel >= data.requiredLevel
}

export const isSelectedWoodEnabled = (state: GameState) => {
    const woodType = state.ui.woodType
    const woodLevel = selectLevelExp(ExpEnum.Woodcutting, PLAYER_ID)(state)
    const data = WoodData[woodType]
    return woodLevel >= data.requiredLevel
}
export const selectWoodcuttingId = (s: GameState, woodType: WoodTypes) => {
    for (const id of s.activities.ids) {
        const act = s.activities.entries[id]
        if (act && isWoodcutting(act) && act?.woodType === woodType) return act.id
    }
}

export const selectIncreaseGrowSpeedId = (s: GameState, woodType: WoodTypes, location: GameLocations) => {
    for (const id of s.activities.ids) {
        const act = s.activities.entries[id]
        if (act && isIncreaseGrowSpeed(act) && act.woodType === woodType && act.location === location) return act.id
    }
}
