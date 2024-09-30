import { useShallow } from 'zustand/react/shallow'
import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { DamageData, DamageTypes, Item, damageTypesValues } from '../../items/Item'
import { memoize } from '../../utils/memoize'
import { checkLast } from '../../utils/memoizeLast'
import { selectMainWeapon } from './selectMainWeapon'

const selectAttackDamageList = memoize((weapon: Item | undefined, type: DamageTypes) => {
    const bonuses: Bonus[] = []

    if (weapon && weapon.weaponData) {
        const add = weapon.weaponData.damage[type]
        if (add)
            bonuses.push({
                id: `w_${weapon.id}`,
                add,
                iconId: weapon.icon,
                nameId: weapon.nameId,
            })
    } else
        bonuses.push({
            id: 'unharmed',
            add: 30,
            iconId: Icons.Punch,
            nameId: 'Unharmed',
        })

    const bonusList: BonusResult = {
        bonuses,
        total: getTotal(bonuses),
    }

    return bonusList
})

export const selectCharacterAttackDamageList = memoize((charId: string, type: DamageTypes) => (state: GameState) => {
    const weapon = selectMainWeapon(charId)(state)
    return selectAttackDamageList(weapon, type)
})
export const selectCharacterAttackDamage = memoize(
    (charId: string, type: DamageTypes) => (state: GameState) =>
        selectCharacterAttackDamageList(charId, type)(state).total
)
export const selectAllCharacterAttackDamage = (charId: string) =>
    checkLast((state: GameState) => {
        const ret: DamageData = {}
        damageTypesValues.forEach((type) => {
            const damage = selectCharacterAttackDamageList(charId, type)(state).total
            if (damage > 0) ret[type] = damage
        })
        return ret
    })
