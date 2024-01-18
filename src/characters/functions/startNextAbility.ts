import { AbilitiesEnum } from '../../activeAbilities/abilitiesEnum'
import { startAbility } from '../../activeAbilities/functions/startAbility'
import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'

export function startNextAbility(state: GameState, charId: string): GameState {
    const char = CharacterAdapter.selectEx(state.characters, charId)

    let done = false
    const offset = char.lastCombatAbilityNum + 1
    const len = char.combatAbilities.length
    for (let i = 0; i < len; i++) {
        const pointer = (i + offset) % len
        const combatAbilityId = char.combatAbilities[pointer]
        if (!combatAbilityId) continue

        const combatAbility = char.allCombatAbilities.entries[combatAbilityId]
        if (!combatAbility) continue

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
            break
        }
    }

    if (done) return state

    const { state: gameState } = startAbility(state, charId, AbilitiesEnum.NormalAttack)
    state = gameState
    return state
}
