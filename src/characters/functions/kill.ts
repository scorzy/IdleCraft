import { GameState } from '../../game/GameState'
import { addLoot } from '../../storage/function/addLoot'
import { CharacterAdapter } from '../characterAdapter'
import { onKillListeners } from './onKillListeners'
import { removeCharacter } from './removeCharacter'

export function kill(state: GameState, targetId: string): void {
    const loot = CharacterAdapter.selectEx(state.characters, targetId).loot
    if (loot) addLoot(state, loot)

    for (const listener of onKillListeners) listener(state, targetId)

    removeCharacter(state, targetId)
}
