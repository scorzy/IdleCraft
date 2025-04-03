import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { createDeepEqualSelector } from '../../utils/createDeepEqualSelector'

export const selectTeams = createDeepEqualSelector(
    (state: GameState) => state.characters,
    (characters) => {
        const allies: string[] = []
        const enemies: string[] = []
        CharacterAdapter.forEach(characters, (c) => {
            if (c.isEnemy) enemies.push(c.id)
            else allies.push(c.id)
        })
        return { allies, enemies }
    }
)
