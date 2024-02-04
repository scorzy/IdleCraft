import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { Item } from '../../items/Item'
import { memoize } from '../../utils/memoize'
import { selectMainWeapon } from './selectMainWeapon'

const selectAttackDamageList = memoize((weapon: Item | undefined) => {
    const bonuses: Bonus[] = []

    if (weapon && weapon.weaponData) {
        bonuses.push({
            id: `w_${weapon.id}`,
            add: weapon.weaponData.damage,
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

export const selectCharacterAttackDamageList = memoize((charId: string) => (state: GameState) => {
    const weapon = selectMainWeapon(charId)(state)
    return selectAttackDamageList(weapon)
})
export const selectCharacterAttackDamage = memoize(
    (charId: string) => (state: GameState) => selectCharacterAttackDamageList(charId)(state).total
)
