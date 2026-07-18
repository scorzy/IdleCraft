import { beforeEach, describe, expect, it } from 'vitest'
import { CharTemplateEnum } from '../../characters/templates/characterTemplateEnum'
import { createEnemies } from '../../characters/functions/createEnemies'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { isBattleEnded } from './isBattleEnded'

describe('isBattleEnded', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    it('returns true when there is no enemy character', () => {
        expect(isBattleEnded(state)).toBe(true)
    })

    it('returns false when at least one enemy character is alive', () => {
        createEnemies(state, [{ quantity: 1, template: CharTemplateEnum.Wolf }])

        expect(isBattleEnded(state)).toBe(false)
    })
})
