import { createSelector } from 'reselect'
import { Bonus, BonusResult } from '../../bonus/Bonus'
import { bonusFromPerk, bonusFromItem, getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { hasPerk } from '../../perks/PerksSelectors'
import { PerksEnum } from '../../perks/perksEnum'
import { FAST_MINING_PERK } from '../MiningCost'
import { DEF_PICKAXE } from '../miningSelectors'
import { PickaxeBase, selectPickaxe } from './miningSelectors'

const TIME_BASE: Bonus = {
    id: 'base',
    add: DEF_PICKAXE.time,
    ...PickaxeBase,
}
const PERK_FAST: Bonus = bonusFromPerk(PerksEnum.FAST_MINING, { multi: -1 * FAST_MINING_PERK })

export const selectMiningTimeAll = createSelector(
    [selectPickaxe, (s: GameState) => hasPerk(PerksEnum.FAST_MINING)(s)],
    (pickaxe, fastMiningPerk) => {
        const ret: BonusResult = { total: DEF_PICKAXE.time, bonuses: [] }

        if (pickaxe && pickaxe.pickaxeData) ret.bonuses.push(bonusFromItem(pickaxe, { add: pickaxe.pickaxeData.time }))
        else ret.bonuses.push(TIME_BASE)

        if (fastMiningPerk) ret.bonuses.push(PERK_FAST)

        ret.total = getTotal(ret.bonuses)
        return ret
    }
)

export const selectMiningTime = (state: GameState) => selectMiningTimeAll(state).total
