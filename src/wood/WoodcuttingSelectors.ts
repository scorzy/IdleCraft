import { PLAYER_ID } from '../characters/charactersConst'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { GameState } from '../game/GameState'
import { selectGameItem } from '../storage/StorageSelectors'
import { Item, WoodAxeData } from '../items/Item'
import { getItemId2 } from '../storage/storageFunctions'
import { hasPerk } from '../perks/PerksSelectors'
import { PerksEnum } from '../perks/perksEnum'
import { FAST_WOODCUTTING_PERK } from './WoodConst'
import { BaseBonus, BonusResult } from '../bonus/Bonus'
import { memoizeOne } from '../utils/memoizeOne'
import { Icons } from '../icons/Icons'

export const DEF_WOOD_AXE: WoodAxeData = {
    damage: 25,
    time: 3e3,
}
const Base: BaseBonus = {
    nameId: 'Base',
    iconId: Icons.Axe,
}
export function selectAxeId(state: GameState) {
    const axe = state.characters[PLAYER_ID]!.inventory[EquipSlotsEnum.WoodAxe]
    if (!axe) return
    return getItemId2(axe.stdItemId, axe.craftItemId)
}
export function selectAxe(state: GameState) {
    const axe = state.characters[PLAYER_ID]!.inventory[EquipSlotsEnum.WoodAxe]
    if (!axe) return
    return selectGameItem(axe.stdItemId, axe.craftItemId)(state)
}

export const selectWoodcuttingTime = (state: GameState) => {
    const axe = selectAxe(state)
    return axe?.woodAxeData?.time ?? DEF_WOOD_AXE.time
}

const selectWoodcuttingDamageInt = memoizeOne((axe: Item | undefined, fastWoodPerk: boolean) => {
    const ret: BonusResult = { total: DEF_WOOD_AXE.damage, bonuses: [] }

    if (axe?.woodAxeData) {
        ret.total = axe.woodAxeData.damage
        ret.bonuses.push({
            baseBonus: Base,
            add: axe.woodAxeData.damage,
        })
    }

    if (fastWoodPerk) {
        ret.total = ret.total * (1 + FAST_WOODCUTTING_PERK / 100)
        ret.bonuses.push({
            perk: PerksEnum.FAST_WOODCUTTING,
            multi: FAST_WOODCUTTING_PERK,
        })
    }

    return ret
})
export const selectWoodcuttingDamageAll = (state: GameState) =>
    selectWoodcuttingDamageInt(selectAxe(state), hasPerk(PerksEnum.FAST_WOODCUTTING)(state))

export const selectWoodcuttingDamage = (state: GameState) => selectWoodcuttingDamageAll(state).total
