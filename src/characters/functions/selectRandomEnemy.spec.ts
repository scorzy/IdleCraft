import { beforeEach, describe, expect, it } from 'vitest'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { PLAYER_ID } from '../charactersConst'
import { createEnemies } from './createEnemies'
import { selectRandomEnemy } from './selectRandomEnemy'

describe('selectRandomEnemy', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    it('returns undefined when no opposing character exists', () => {
        expect(selectRandomEnemy(state, false)).toBeUndefined()
    })

    it('returns the player id when the caster is on the enemy team', () => {
        expect(selectRandomEnemy(state, true)).toBe(PLAYER_ID)
    })

    it('returns one of the enemy ids when the caster is on the player team', () => {
        createEnemies(state, [{ quantity: 3, template: 'Wolf' }])
        const enemyIds = state.characters.ids.filter((id) => id !== PLAYER_ID)

        const picked = selectRandomEnemy(state, false)

        expect(enemyIds).toContain(picked)
    })
})
