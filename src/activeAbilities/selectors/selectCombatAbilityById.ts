import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { CharAbilityAdapter } from '../abilityAdapters'

export const selectCombatAbilityById = (id: string, charId?: string) => (state: GameState) => {
    const allCombatAbilities = CharacterAdapter.selectEx(
        state.characters,
        charId ?? state.ui.selectedCharId
    ).allCombatAbilities
    return CharAbilityAdapter.selectEx(allCombatAbilities, id)
}
