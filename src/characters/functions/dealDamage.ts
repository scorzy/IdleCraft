import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { kill } from './kill'

export function dealDamage(state: GameState, targetId: string, damage: number): { state: GameState; killed: boolean } {
    const target = CharacterAdapter.selectEx(state.characters, targetId)
    let killed = false

    const health = Math.floor(target.health - damage)
    if (health < 0.0001) {
        state = kill(state, targetId)
        killed = true
    } else {
        state = { ...state, characters: CharacterAdapter.update(state.characters, targetId, { health }) }
    }

    return { state, killed }
}
