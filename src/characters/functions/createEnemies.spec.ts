import { beforeEach, describe, expect, it } from 'vitest'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { PLAYER_ID } from '../charactersConst'
import { createEnemies } from './createEnemies'

describe('createEnemies', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    it('creates the requested quantity of enemies', () => {
        createEnemies(state, [{ quantity: 2, template: 'Wolf' }])

        const enemyIds = state.characters.ids.filter((id) => id !== PLAYER_ID)
        expect(enemyIds).toHaveLength(2)
        enemyIds.forEach((id) => {
            expect(state.characters.entries[id]!.isEnemy).toBe(true)
            expect(state.characters.entries[id]!.templateId).toBe('Wolf')
        })
    })

    it('creates enemies for multiple templates', () => {
        createEnemies(state, [
            { quantity: 1, template: 'Wolf' },
            { quantity: 2, template: 'Chicken' },
        ])

        const enemyIds = state.characters.ids.filter((id) => id !== PLAYER_ID)
        expect(enemyIds).toHaveLength(3)
        const templateCounts = enemyIds.reduce<Record<string, number>>((acc, id) => {
            const t = state.characters.entries[id]!.templateId
            acc[t] = (acc[t] ?? 0) + 1
            return acc
        }, {})
        expect(templateCounts.Wolf).toBe(1)
        expect(templateCounts.Chicken).toBe(2)
    })

    it('resets health, mana and stamina to their max for created enemies', () => {
        createEnemies(state, [{ quantity: 1, template: 'Boar' }])

        const enemyId = state.characters.ids.find((id) => id !== PLAYER_ID)!
        const enemy = state.characters.entries[enemyId]!
        expect(enemy.health).toBeGreaterThan(0)
        expect(enemy.mana).toBeGreaterThanOrEqual(0)
        expect(enemy.stamina).toBeGreaterThanOrEqual(0)
    })

    it('does not touch the player character', () => {
        createEnemies(state, [{ quantity: 1, template: 'Wolf' }])

        expect(state.characters.entries[PLAYER_ID]!.isEnemy).toBe(false)
    })

    it('does nothing when given an empty list', () => {
        createEnemies(state, [])

        expect(state.characters.ids).toEqual([PLAYER_ID])
    })
})
