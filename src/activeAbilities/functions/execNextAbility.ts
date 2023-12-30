import { CharacterStateAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { execAbility } from './execAbility'

export function execNextAbility(state: GameState, charId: string): GameState {
    const done = false
    const char = CharacterStateAdapter.selectEx(state.characters, charId)

    const start = (i: number) => {
        const abilityId = char.combatAbilities[i]
        if (!abilityId) return
        const res = execAbility(state, charId, abilityId)
        state = res.state
        if (res.done) {
            state = {
                ...state,
                characters: CharacterStateAdapter.update(state.characters, charId, { lastCombatAbilityNum: i }),
            }
        }
    }

    for (let i = char.lastCombatAbilityNum; i < char.combatAbilities.length; i++) {
        start(i)
        if (done) return state
    }

    for (let i = 0; i < char.lastCombatAbilityNum; i++) {
        start(i)
        if (done) return state
    }

    return state
}
