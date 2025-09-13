import { memoize } from 'es-toolkit/compat'
import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'

export const selectTeams = (state: GameState) => {
    const allies: string[] = []
    const enemies: string[] = []
    CharacterAdapter.forEach(state.characters, (c) => {
        if (c.isEnemy) enemies.push(c.id)
        else allies.push(c.id)
    })
    return { allies, enemies }
}

export const selectTeamsMemo = memoize(selectTeams)
