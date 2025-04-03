import { createSelector } from 'reselect'
import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { Icons } from '../../icons/Icons'
import { CharacterState } from '../characterState'

export const selectMaxManaFromChar = createSelector([(char: CharacterState) => char.manaPoints], (points) => {
    const bonuses: Bonus[] = []
    bonuses.push({
        id: 'baseMana',
        add: 100,
        iconId: Icons.MagicPalm,
        nameId: 'Base',
    })
    if (points > 0)
        bonuses.push({
            id: 'basePoints',
            add: 10 * points,
            showQta: points,
            iconId: Icons.MagicPalm,
            nameId: 'ManaPoints',
        })

    const bonusList: BonusResult = {
        bonuses,
        total: getTotal(bonuses),
    }

    return bonusList
})
