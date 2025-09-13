import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { Icons } from '../../icons/Icons'
import { CharacterState } from '../characterState'

export const selectMaxHealthFromChar = (char: CharacterState) => {
    const points = char.healthPoints
    const bonuses: Bonus[] = []
    bonuses.push({
        id: 'baseHealth',
        add: 100,
        iconId: Icons.Heart,
        nameId: 'Base',
    })
    if (points >= -9)
        bonuses.push({
            id: 'basePoints',
            add: 10 * points,
            showQta: points,
            iconId: Icons.HeartPlus,
            nameId: 'healthPoints',
        })

    const bonusList: BonusResult = {
        bonuses,
        total: getTotal(bonuses),
    }

    return bonusList
}
