import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { Icons } from '../../icons/Icons'
import { CharacterState } from '../characterState'

export const selectMaxStaminaFromChar = (char: CharacterState) => {
    const points = char.staminaPoints
    const bonuses: Bonus[] = []
    bonuses.push({
        id: 'baseStamina',
        add: 100,
        iconId: Icons.Strong,
        nameId: 'Base',
    })
    if (points > 0)
        bonuses.push({
            id: 'basePoints',
            add: 10 * points,
            showQta: points,

            iconId: Icons.Strong,
            nameId: 'ManaPoints',
        })

    const bonusList: BonusResult = {
        bonuses,
        total: getTotal(bonuses),
    }

    return bonusList
}
