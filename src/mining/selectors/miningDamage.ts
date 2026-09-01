import { memoize } from 'proxy-memoize'
import { Bonus, BonusResult } from '../../bonus/Bonus'
import { bonusFromItem, getTotal } from '../../bonus/BonusFunctions'
import { PLAYER_ID } from '../../characters/charactersConst'
import { ExpEnum } from '../../experience/ExpEnum'
import { selectLevel } from '../../experience/expSelectors'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { MINING_DAMAGE_PER_LEVEL } from '../MiningConst'
import { DEF_PICKAXE } from '../miningSelectors'
import { PickaxeBase, selectPickaxe } from './miningSelectors'

const DAMAGE_BASE: Bonus = {
    id: 'base',
    add: DEF_PICKAXE.damage,
    ...PickaxeBase,
}
export const selectMiningDamageAll = (s: GameState) => {
    const pickaxe = selectPickaxe(s)
    const level = selectLevel(ExpEnum.Mining, PLAYER_ID)(s)
    const ret: BonusResult = { total: DEF_PICKAXE.damage, bonuses: [] }

    if (pickaxe && pickaxe.pickaxeData) ret.bonuses.push(bonusFromItem(pickaxe, { add: pickaxe.pickaxeData.damage }))
    else ret.bonuses.push(DAMAGE_BASE)

    if (level > 0) {
        ret.bonuses.push({
            id: 'mining',
            nameId: 'Mining',
            iconId: Icons.Pickaxe,
            multi: level * MINING_DAMAGE_PER_LEVEL,
        })
    }

    ret.total = getTotal(ret.bonuses)

    return ret
}

export const selectMiningDamage = (state: GameState) => selectMiningDamageAll(state).total

export const selectMiningDamageAllMemo = memoize(selectMiningDamageAll)

export const selectMiningDamageMemo = (state: GameState) => selectMiningDamageAllMemo(state).total
