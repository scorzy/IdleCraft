import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { memoize } from '../../utils/memoize'
import { CharacterAdapter } from '../characterAdapter'
import { CharacterState } from '../characterState'

const selectHealthBonusList = memoize((points: number) => {
    const bonuses: Bonus[] = []
    bonuses.push({
        id: 'baseHealth',
        add: 100,
        iconId: Icons.Heart,
        nameId: 'Base',
    })
    if (points > 0)
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
})
export function selectMaxHealthFromChar(char: CharacterState): BonusResult {
    return selectHealthBonusList(char.healthPoints)
}
export const selectCharacterMaxHealthList = memoize((charId: string) => (state: GameState) => {
    const char = CharacterAdapter.selectEx(state.characters, charId)
    return selectMaxHealthFromChar(char)
})
export const selectCharacterMaxHealth = (charId: string) => (state: GameState) =>
    selectCharacterMaxHealthList(charId)(state).total
