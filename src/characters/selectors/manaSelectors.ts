import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { memoize } from '../../utils/memoize'
import { selectCharacter } from '../characterSelectors'

const selectManaBonusList = memoize((points: number) => {
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

export const selectCharacterMaxManaList = memoize((charId: string) => (state: GameState) => {
    const char = selectCharacter(state, charId)
    const list = selectManaBonusList(char.manaPoints)
    return list
})
export const selectCharacterMaxMana = memoize(
    (charId: string) => (state: GameState) => selectCharacterMaxManaList(charId)(state).total
)
