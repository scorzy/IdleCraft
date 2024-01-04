import { NORMAL_ATTACK_ID } from '../../activeAbilities/abilityConst'
import { startAbility } from '../../activeAbilities/functions/startAbility'
import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'

export function startNextAbility(state: GameState, charId: string): GameState {
    const char = CharacterAdapter.selectEx(state.characters, charId)

    let done = false
    const offset = char.lastCombatAbilityNum
    const len = char.combatAbilities.length
    for (let i = 0; i < len; i++) {
        const pointer = (i + offset) % len
        const abilityId = char.combatAbilities[pointer]
        if (!abilityId) continue
        const { state: gameState, done: doneRes } = startAbility(state, charId, abilityId)
        state = gameState
        if (doneRes) {
            done = true
            break
        }
    }

    if (done) return state
    const { state: gameState } = startAbility(state, charId, NORMAL_ATTACK_ID)
    state = gameState
    return state
}
