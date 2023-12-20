import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { memoize } from '../../utils/memoize'
import { selectCharacter } from '../characterSelectors'

const selectStaminaBonusList = memoize((points: number) => {
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
})

export const selectCharacterMaxStaminaList = memoize((charId: string) => (state: GameState) => {
    const char = selectCharacter(state, charId)
    const list = selectStaminaBonusList(char.staminaPoints)
    return list
})
export const selectCharacterMaxStamina = memoize(
    (charId: string) => (state: GameState) => selectCharacterMaxStaminaList(charId)(state).total
)
