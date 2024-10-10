import { Bonus, BonusResult } from '../../bonus/Bonus'
import { bonusFromPerk, bonusFromItem, getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { Item } from '../../items/Item'
import { hasPerk } from '../../perks/PerksSelectors'
import { PerksEnum } from '../../perks/perksEnum'
import { myMemoizeOne } from '../../utils/myMemoizeOne'
import { FAST_WOODCUTTING_PERK } from '../WoodConst'
import { WoodBase, DEF_WOOD_AXE, selectAxe } from './WoodcuttingSelectors'

const TIME_BASE: Bonus = {
    id: 'base',
    add: DEF_WOOD_AXE.time,
    ...WoodBase,
}
const PERK_FAST: Bonus = bonusFromPerk(PerksEnum.FAST_WOODCUTTING, { multi: -1 * FAST_WOODCUTTING_PERK })

export const selectWoodcuttingTimeAll = (state: GameState) => {
    return selectWoodcuttingTimeInt(selectAxe(state), hasPerk(PerksEnum.FAST_WOODCUTTING)(state))
}

const selectWoodcuttingTimeInt = myMemoizeOne((axe: Item | undefined, fastWoodPerk: boolean) => {
    const ret: BonusResult = { total: DEF_WOOD_AXE.time, bonuses: [] }

    if (axe && axe.woodAxeData) ret.bonuses.push(bonusFromItem(axe, { add: axe.woodAxeData.time }))
    else ret.bonuses.push(TIME_BASE)

    if (fastWoodPerk) ret.bonuses.push(PERK_FAST)

    ret.total = getTotal(ret.bonuses)
    return ret
})
export const selectWoodcuttingTime = (state: GameState) => selectWoodcuttingTimeAll(state).total
