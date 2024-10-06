import { Bonus, BonusResult } from '../../bonus/Bonus'
import { bonusFromItem, getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { Item } from '../../items/Item'
import { myMemoizeOne } from '../../utils/memoizeOne'
import { selectAxe } from '../../wood/selectors/WoodcuttingSelectors'
import { DEF_PICKAXE } from '../miningSelectors'
import { PickaxeBase } from './miningSelectors'

const DAMAGE_BASE: Bonus = {
    id: 'base',
    add: DEF_PICKAXE.damage,
    ...PickaxeBase,
}
const selectMiningDamageInt = myMemoizeOne((pickaxe: Item | undefined) => {
    const ret: BonusResult = { total: DEF_PICKAXE.damage, bonuses: [] }

    if (pickaxe && pickaxe.woodAxeData) ret.bonuses.push(bonusFromItem(pickaxe, { add: pickaxe.woodAxeData.damage }))
    else ret.bonuses.push(DAMAGE_BASE)

    ret.total = getTotal(ret.bonuses)

    return ret
})
export const selectMiningDamageAll = (state: GameState) => {
    return selectMiningDamageInt(selectAxe(state))
}

export const selectMiningDamage = (state: GameState) => selectMiningDamageAll(state).total
