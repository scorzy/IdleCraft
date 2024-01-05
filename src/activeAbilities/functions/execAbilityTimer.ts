import { CharacterAdapter } from '../../characters/characterAdapter'
import { startNextAbility } from '../../characters/functions/startNextAbility'
import { GameState } from '../../game/GameState'
import { Timer } from '../../timers/Timer'
import { CastCharAbilityAdapter } from '../abilityAdapters'
import { execAbility } from './execAbility'

export function execAbilityTimer(state: GameState, timer: Timer): GameState {
    const cast = CastCharAbilityAdapter.select(state.castCharAbility, timer.actId)
    if (!cast) return state

    state = { ...state, castCharAbility: CastCharAbilityAdapter.remove(state.castCharAbility, cast.id) }
    state = execAbility(state, cast.abilityId, cast.characterId)

    const cast2 = CharacterAdapter.select(state.characters, cast.characterId)
    if (cast2) state = startNextAbility(state, cast.characterId)

    return state
}
