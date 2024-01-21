import { AbilitiesEnum } from '../../activeAbilities/abilitiesEnum'
import { startAbility } from '../../activeAbilities/functions/startAbility'
import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'

export function startNextAbility(state: GameState, charId: string): GameState {
    const char = CharacterAdapter.selectEx(state.characters, charId)

    let done = false
    const offset = char.lastCombatAbilityNum + 1
    const len = char.combatAbilities.length
    const pointer = offset % len
    const combatAbilityId = char.combatAbilities[pointer]

    if (combatAbilityId) {
        const combatAbility = char.allCombatAbilities.entries[combatAbilityId]
        if (combatAbility) {
            const { state: gameState, done: doneRes } = startAbility(state, charId, combatAbility.abilityId)
            state = gameState
            if (doneRes) {
                done = true
                state = {
                    ...state,
                    characters: CharacterAdapter.update(state.characters, charId, {
                        lastCombatAbilityNum: pointer,
                        lastCombatAbilityId: combatAbilityId,
                    }),
                }
            }
        }
    }

    if (done) return state

    const { state: gameState } = startAbility(state, charId, AbilitiesEnum.NormalAttack)
    state = gameState
    return state
}
