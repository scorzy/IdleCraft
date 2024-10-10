import { Bonus, BonusResult } from '../../bonus/Bonus'
import { bonusFromPerk, bonusFromItem, getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { Item } from '../../items/Item'
import { hasPerk } from '../../perks/PerksSelectors'
import { PerksEnum } from '../../perks/perksEnum'
import { myMemoizeOne } from '../../utils/myMemoizeOne'
import { FAST_MINING_PERK } from '../MiningCost'
import { DEF_PICKAXE } from '../miningSelectors'
import { PickaxeBase, selectPickaxe } from './miningSelectors'

const TIME_BASE: Bonus = {
    id: 'base',
    add: DEF_PICKAXE.time,
    ...PickaxeBase,
}
const PERK_FAST: Bonus = bonusFromPerk(PerksEnum.FAST_MINING, { multi: -1 * FAST_MINING_PERK })

export const selectMiningTimeAll = (state: GameState) => {
    return selectMiningTimeInt(selectPickaxe(state), hasPerk(PerksEnum.FAST_MINING)(state))
}

const selectMiningTimeInt = myMemoizeOne((pickaxe: Item | undefined, fastWoodPerk: boolean) => {
    const ret: BonusResult = { total: DEF_PICKAXE.time, bonuses: [] }

    if (pickaxe && pickaxe.woodAxeData) ret.bonuses.push(bonusFromItem(pickaxe, { add: pickaxe.woodAxeData.time }))
    else ret.bonuses.push(TIME_BASE)

    if (fastWoodPerk) ret.bonuses.push(PERK_FAST)

    ret.total = getTotal(ret.bonuses)
    return ret
})
export const selectMiningTime = (state: GameState) => selectMiningTimeAll(state).total
