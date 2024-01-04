import { CastCharAbilityAdapter } from '../../activeAbilities/abilityAdapters'
import { GameState } from '../../game/GameState'
import { TimerAdapter } from '../../timers/Timer'
import { removeTimer } from '../../timers/removeTimer'
import { CharacterAdapter } from '../characterAdapter'
import { PLAYER_ID } from '../charactersConst'

export function removeCharacter(state: GameState, characterId: string): GameState {
    const character = CharacterAdapter.selectEx(state.characters, characterId)

    if (character.id === PLAYER_ID) {
        // ToDo
    } else {
        state = { ...state, characters: CharacterAdapter.remove(state.characters, characterId) }
        const toRemove: string[] = []
        CastCharAbilityAdapter.forEach(state.castCharAbility, (ability) => {
            if (ability.characterId !== characterId) return
            toRemove.push(ability.id)
        })

        TimerAdapter.forEach(state.timers, (tim) => {
            if (toRemove.some((r) => r === tim.actId)) state = removeTimer(state, tim.id)
        })

        let castCharAbility = state.castCharAbility
        toRemove.forEach((cca) => {
            castCharAbility = CastCharAbilityAdapter.remove(castCharAbility, cca)
        })
        state = { ...state, castCharAbility }
    }

    return state
}
