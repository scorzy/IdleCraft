import { Bonus, BonusResult } from '../../bonus/Bonus'
import { bonusFromItem, getTotal } from '../../bonus/BonusFunctions'
import { PLAYER_ID } from '../../characters/charactersConst'
import { ExpEnum } from '../../experience/ExpEnum'
import { selectLevel } from '../../experience/expSelectors'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { WOODCUTTING_DAMAGE_PER_LEVEL } from '../WoodConst'
import { DEF_WOOD_AXE, selectAxe, WoodBase } from './WoodcuttingSelectors'

const DAMAGE_BASE: Bonus = {
    id: 'base',
    add: DEF_WOOD_AXE.damage,
    ...WoodBase,
}
export const selectWoodcuttingDamageAll = (s: GameState) => {
    const axe = selectAxe(s)
    const level = selectLevel(ExpEnum.Woodcutting, PLAYER_ID)(s)
    const ret: BonusResult = { total: DEF_WOOD_AXE.damage, bonuses: [] }

    if (axe && axe.woodAxeData) ret.bonuses.push(bonusFromItem(axe, { add: axe.woodAxeData.damage }))
    else ret.bonuses.push(DAMAGE_BASE)

    if (level > 0) {
        ret.bonuses.push({
            id: 'woodcutting',
            nameId: 'Woodcutting',
            iconId: Icons.Axe,
            multi: level * WOODCUTTING_DAMAGE_PER_LEVEL,
        })
    }

    ret.total = getTotal(ret.bonuses)

    return ret
}

export const selectWoodcuttingDamage = (state: GameState) => selectWoodcuttingDamageAll(state).total
