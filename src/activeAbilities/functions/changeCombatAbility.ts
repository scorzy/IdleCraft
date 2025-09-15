import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { setState } from '../../game/setState'

export const changeCombatAbility = (index: number, abilityId: string) =>
    setState((state: GameState) => {
        const charId = state.ui.selectedCharId
        const char = CharacterAdapter.selectEx(state.characters, charId)

        char.combatAbilities[index] = abilityId
    })
