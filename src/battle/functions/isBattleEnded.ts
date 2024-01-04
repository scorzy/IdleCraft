import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'

export function isBattleEnded(state: GameState): boolean {
    const enemy = CharacterAdapter.find(state.characters, (c) => c.isEnemy)
    if (enemy) return false
    return true
}
