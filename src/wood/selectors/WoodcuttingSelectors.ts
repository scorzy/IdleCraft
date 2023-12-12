import { PLAYER_ID } from '../../characters/charactersConst'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { GameState } from '../../game/GameState'
import { selectGameItem } from '../../storage/StorageSelectors'
import { Item, WoodAxeData } from '../../items/Item'
import { hasPerk } from '../../perks/PerksSelectors'
import { PerksEnum } from '../../perks/perksEnum'
import { memoizeOne } from '../../utils/memoizeOne'
import { Icons } from '../../icons/Icons'
import { BaseBonus, BonusResult } from '../../bonus/Bonus'
import { bonusFromItem, bonusFromPerk, getTotal } from '../../bonus/BonusFunctions'
import { FAST_WOODCUTTING_PERK } from '../WoodConst'

export const DEF_WOOD_AXE: WoodAxeData = {
    damage: 25,
    time: 3e3,
}
const Base: BaseBonus = {
    nameId: 'Base',
    iconId: Icons.Axe,
}

export function selectAxe(state: GameState): Item | undefined {
    const axe = state.characters[PLAYER_ID]!.inventory[EquipSlotsEnum.WoodAxe]
    if (!axe) return
    return selectGameItem(axe.stdItemId, axe.craftItemId)(state)
}

export const selectWoodcuttingTimeAll = (state: GameState) => {
    return selectWoodcuttingTimeInt(selectAxe(state), hasPerk(PerksEnum.FAST_WOODCUTTING)(state))
}
//  Time
const selectWoodcuttingTimeInt = memoizeOne((axe: Item | undefined, fastWoodPerk: boolean) => {
    const ret: BonusResult = { total: DEF_WOOD_AXE.time, bonuses: [] }

    if (axe && axe.woodAxeData) ret.bonuses.push(bonusFromItem(axe, { add: axe.woodAxeData.time }))
    else
        ret.bonuses.push({
            id: 'base',
            add: DEF_WOOD_AXE.time,
            ...Base,
        })

    if (fastWoodPerk) ret.bonuses.push(bonusFromPerk(PerksEnum.FAST_WOODCUTTING, { multi: FAST_WOODCUTTING_PERK }))

    ret.total = getTotal(ret.bonuses)
    return ret
})
export const selectWoodcuttingTime = (state: GameState) => selectWoodcuttingTimeAll(state).total

//  Damage
const selectWoodcuttingDamageInt = memoizeOne((axe: Item | undefined) => {
    const ret: BonusResult = { total: DEF_WOOD_AXE.damage, bonuses: [] }

    if (axe && axe.woodAxeData) ret.bonuses.push(bonusFromItem(axe, { add: axe.woodAxeData.damage }))
    else
        ret.bonuses.push({
            id: 'base',
            add: DEF_WOOD_AXE.damage,
            ...Base,
        })

    ret.total = getTotal(ret.bonuses)

    return ret
})
export const selectWoodcuttingDamageAll = (state: GameState) => {
    return selectWoodcuttingDamageInt(selectAxe(state))
}

export const selectWoodcuttingDamage = (state: GameState) => selectWoodcuttingDamageAll(state).total
