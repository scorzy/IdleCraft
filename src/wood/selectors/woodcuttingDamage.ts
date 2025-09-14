import { Bonus, BonusResult } from '../../bonus/Bonus'
import { bonusFromItem, getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { DEF_WOOD_AXE, WoodBase, selectAxe } from './WoodcuttingSelectors'

const DAMAGE_BASE: Bonus = {
    id: 'base',
    add: DEF_WOOD_AXE.damage,
    ...WoodBase,
}
export const selectWoodcuttingDamageAll = (s: GameState) => {
    const axe = selectAxe(s)
    const ret: BonusResult = { total: DEF_WOOD_AXE.damage, bonuses: [] }

    if (axe && axe.woodAxeData) ret.bonuses.push(bonusFromItem(axe, { add: axe.woodAxeData.damage }))
    else ret.bonuses.push(DAMAGE_BASE)

    ret.total = getTotal(ret.bonuses)

    return ret
}

export const selectWoodcuttingDamage = (state: GameState) => selectWoodcuttingDamageAll(state).total
