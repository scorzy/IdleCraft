import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { memoize } from '../../utils/memoize'
import { CharacterAdapter } from '../characterAdapter'
import { CharacterState } from '../characterState'

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
export function selectMaxStaminaFromChar(char: CharacterState): BonusResult {
    return selectStaminaBonusList(char.manaPoints)
}
export const selectCharacterMaxStaminaList = memoize((charId: string) => (state: GameState) => {
    const char = CharacterAdapter.selectEx(state.characters, charId)
    return selectStaminaBonusList(char.staminaPoints)
})
export const selectCharacterMaxStamina = (charId: string) => (state: GameState) =>
    selectCharacterMaxStaminaList(charId)(state).total
