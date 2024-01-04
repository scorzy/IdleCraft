import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { memoize } from '../../utils/memoize'
import { CharacterAdapter } from '../characterAdapter'
import { CharacterState } from '../characterState'

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
export function selectMaxManaFromChar(char: CharacterState): BonusResult {
    return selectManaBonusList(char.manaPoints)
}
export const selectCharacterMaxManaList = memoize((charId: string) => (state: GameState) => {
    const char = CharacterAdapter.selectEx(state.characters, charId)
    return selectMaxManaFromChar(char)
})
export const selectCharacterMaxMana = memoize(
    (charId: string) => (state: GameState) => selectCharacterMaxManaList(charId)(state).total
)
