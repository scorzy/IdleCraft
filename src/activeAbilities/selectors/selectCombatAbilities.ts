import { GameState } from '../../game/GameState'
import { AbilitiesEnum } from '../abilitiesEnum'

const NORMAL_ATTACK_ROTATION = [AbilitiesEnum.NormalAttack]

export const getCombatRotation = (combatAbilities: string[]) =>
    combatAbilities.length === 0 ? NORMAL_ATTACK_ROTATION : combatAbilities

export const selectCombatAbilities = (state: GameState) =>
    state.characters.entries[state.ui.selectedCharId]?.combatAbilities ?? []

export const selectCombatAbilitiesChar = (charId: string) => (state: GameState) =>
    state.characters.entries[charId]?.combatAbilities ?? []

export const selectCombatRotationChar = (charId: string) => (state: GameState) =>
    getCombatRotation(selectCombatAbilitiesChar(charId)(state))
