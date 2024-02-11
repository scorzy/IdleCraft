import { CastCharAbilityAdapter } from '../../activeAbilities/abilityAdapters'
import { ActivityAdapter } from '../../activities/ActivityState'
import { removeActivityInt } from '../../activities/functions/removeActivity'
import { GameState } from '../../game/GameState'
import { TimerAdapter } from '../../timers/Timer'
import { removeTimer } from '../../timers/removeTimer'
import { CharacterAdapter } from '../characterAdapter'
import { PLAYER_ID } from '../charactersConst'

export function removeCharacter(state: GameState, characterId: string): GameState {
    const character = CharacterAdapter.selectEx(state.characters, characterId)

    if (character.id === PLAYER_ID) {
        return killPlayer(state)
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
function killPlayer(state: GameState): GameState {
    const activities = ActivityAdapter.getIds(state.activities)
    for (const actId of activities) state = removeActivityInt(state, actId)

    state = {
        ...state,
        ui: { ...state.ui, deadDialog: true },
        characters: CharacterAdapter.update(state.characters, PLAYER_ID, { health: 1 }),
    }

    return state
}
