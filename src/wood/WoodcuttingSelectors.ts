import { PLAYER_ID } from '../characters/charactersConst'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { GameState } from '../game/GameState'
import { selectGameItem } from '../storage/StorageSelectors'
import { WoodAxeData } from '../items/Item'
import { getItemId2 } from '../storage/storageFunctions'
import { hasPerk } from '../perks/PerksSelectors'
import { PerksEnum } from '../perks/perksEnum'
import { FAST_WOODCUTTING_PERK } from './WoodConst'
import { memoizeOne } from '../utils/memoizeOne'
import { Icons } from '../icons/Icons'
import { BaseBonus, BonusResult } from '../bonus/bonus'
import { getTotal } from '../bonus/bonusFunctions'

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
export function selectAxe(state: GameState): WoodAxeData {
    const axe = state.characters[PLAYER_ID]!.inventory[EquipSlotsEnum.WoodAxe]
    if (!axe) return DEF_WOOD_AXE
    return selectGameItem(axe.stdItemId, axe.craftItemId)(state)?.woodAxeData ?? DEF_WOOD_AXE
}

//  Time
const selectWoodcuttingTimeInt = memoizeOne((axe: WoodAxeData, fastWoodPerk: boolean) => {
    const ret: BonusResult = { total: DEF_WOOD_AXE.time, bonuses: [] }

    ret.bonuses.push({
        id: 'axe',
        baseBonus: Base,
        add: axe.time,
    })

    if (fastWoodPerk)
        ret.bonuses.push({
            id: PerksEnum.FAST_WOODCUTTING,
            perk: PerksEnum.FAST_WOODCUTTING,
            multi: FAST_WOODCUTTING_PERK,
        })

    ret.total = getTotal(ret.bonuses)
    return ret
})
export const selectWoodcuttingTimeAll = (state: GameState) =>
    selectWoodcuttingTimeInt(selectAxe(state), hasPerk(PerksEnum.FAST_WOODCUTTING)(state))

export const selectWoodcuttingTime = (state: GameState) => selectWoodcuttingTimeAll(state).total

//  Damage
const selectWoodcuttingDamageInt = memoizeOne((axe: WoodAxeData) => {
    const ret: BonusResult = { total: DEF_WOOD_AXE.damage, bonuses: [] }

    ret.bonuses.push({
        id: 'axe',
        baseBonus: Base,
        add: axe.damage,
    })

    ret.total = getTotal(ret.bonuses)
    return ret
})
export const selectWoodcuttingDamageAll = (state: GameState) => selectWoodcuttingDamageInt(selectAxe(state))

export const selectWoodcuttingDamage = (state: GameState) => selectWoodcuttingDamageAll(state).total
