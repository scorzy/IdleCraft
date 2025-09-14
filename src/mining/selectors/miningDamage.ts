import { memoize } from 'proxy-memoize'
import { Bonus, BonusResult } from '../../bonus/Bonus'
import { bonusFromItem, getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { DEF_PICKAXE } from '../miningSelectors'
import { PickaxeBase, selectPickaxe } from './miningSelectors'

const DAMAGE_BASE: Bonus = {
    id: 'base',
    add: DEF_PICKAXE.damage,
    ...PickaxeBase,
}
export const selectMiningDamageAll = (s: GameState) => {
    const pickaxe = selectPickaxe(s)
    const ret: BonusResult = { total: DEF_PICKAXE.damage, bonuses: [] }

    if (pickaxe && pickaxe.pickaxeData) ret.bonuses.push(bonusFromItem(pickaxe, { add: pickaxe.pickaxeData.damage }))
    else ret.bonuses.push(DAMAGE_BASE)

    ret.total = getTotal(ret.bonuses)

    return ret
}

export const selectMiningDamage = (state: GameState) => selectMiningDamageAll(state).total

export const selectMiningDamageAllMemo = memoize(selectMiningDamageAll)

export const selectMiningDamageMemo = (state: GameState) => selectMiningDamageAllMemo(state).total
