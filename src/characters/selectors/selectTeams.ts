import { memoize } from 'proxy-memoize'
import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'

export const selectTeams = memoize((state: GameState) => {
    const allies: string[] = []
    const enemies: string[] = []
    CharacterAdapter.forEach(state.characters, (c) => {
        if (c.isEnemy) enemies.push(c.id)
        else allies.push(c.id)
    })
    return { allies, enemies }
})
