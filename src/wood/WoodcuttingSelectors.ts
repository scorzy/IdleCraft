import { PLAYER_ID } from '../characters/charactersConst'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { GameState } from '../game/GameState'
import { selectGameItem } from '../storage/StorageSelectors'
import { WoodAxeData } from '../items/Item'
import { hasPerk } from '../perks/PerksSelectors'
import { PerksEnum } from '../perks/perksEnum'
import { FAST_WOODCUTTING_PERK } from './WoodConst'
import { memoizeOne } from '../utils/memoizeOne'
import { Icons } from '../icons/Icons'
import { BaseBonus, Bonus, BonusResult } from '../bonus/bonus'
import { getTotal } from '../bonus/bonusFunctions'

export const DEF_WOOD_AXE: WoodAxeData = {
    damage: 25,
    time: 3e3,
}
const Base: BaseBonus = {
    nameId: 'Base',
    iconId: Icons.Axe,
}

export function selectAxe(state: GameState): {
    stdItemId: string | null
    craftItemId: string | null
    axe: WoodAxeData
} {
    const axe = state.characters[PLAYER_ID]!.inventory[EquipSlotsEnum.WoodAxe]
    if (!axe) return { stdItemId: null, craftItemId: null, axe: DEF_WOOD_AXE }
    return {
        stdItemId: axe.stdItemId ?? null,
        craftItemId: axe.craftItemId ?? null,
        axe: selectGameItem(axe.stdItemId, axe.craftItemId)(state)?.woodAxeData ?? DEF_WOOD_AXE,
    }
}

//  Time
const selectWoodcuttingTimeInt = memoizeOne(
    (stdItemId: string | null, craftItemId: string | null, axe: WoodAxeData, fastWoodPerk: boolean) => {
        const ret: BonusResult = { total: DEF_WOOD_AXE.time, bonuses: [] }

        const base: Bonus = {
            id: 'axe',
            add: axe.time,
        }
        if (stdItemId) base.stdItemId = stdItemId
        else if (craftItemId) base.craftItemId = craftItemId
        else base.baseBonus = Base

        ret.bonuses.push(base)

        if (fastWoodPerk)
            ret.bonuses.push({
                id: PerksEnum.FAST_WOODCUTTING,
                perk: PerksEnum.FAST_WOODCUTTING,
                multi: FAST_WOODCUTTING_PERK,
            })

        ret.total = getTotal(ret.bonuses)
        return ret
    }
)
export const selectWoodcuttingTimeAll = (state: GameState) => {
    const axeData = selectAxe(state)

    return selectWoodcuttingTimeInt(
        axeData.stdItemId,
        axeData.craftItemId,
        axeData.axe,
        hasPerk(PerksEnum.FAST_WOODCUTTING)(state)
    )
}

export const selectWoodcuttingTime = (state: GameState) => selectWoodcuttingTimeAll(state).total

//  Damage
const selectWoodcuttingDamageInt = memoizeOne(
    (stdItemId: string | null, craftItemId: string | null, axe: WoodAxeData) => {
        const ret: BonusResult = { total: DEF_WOOD_AXE.damage, bonuses: [] }

        const base: Bonus = {
            id: 'axe',
            add: axe.damage,
        }
        if (stdItemId) base.stdItemId = stdItemId
        else if (craftItemId) base.craftItemId = craftItemId
        else base.baseBonus = Base

        ret.bonuses.push(base)

        ret.total = getTotal(ret.bonuses)
        return ret
    }
)
export const selectWoodcuttingDamageAll = (state: GameState) => {
    const axeData = selectAxe(state)
    return selectWoodcuttingDamageInt(axeData.stdItemId, axeData.craftItemId, axeData.axe)
}

export const selectWoodcuttingDamage = (state: GameState) => selectWoodcuttingDamageAll(state).total
