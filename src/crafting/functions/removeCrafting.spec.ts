import { describe, it, expect } from 'vitest'
import { GameState } from '../../game/GameState'
import { Crafting } from '../CraftingIterfaces'
import { ActivityTypes } from '../../activities/ActivityState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { removeCrafting } from './removeCrafting'

const crafting: Crafting = {
    id: 'activity-1',
    recipeId: '',
    type: ActivityTypes.Crafting,
    max: 1,
    paramsValue: [
        {
            id: '',
            itemId: 'item-1',
        },
    ],
    result: {
        time: 1e3,
        requirements: [],
        results: [
            {
                id: 'item-1',
                qta: 1,
                stdItemId: 'item-1',
            },
        ],
    },
}

describe('removeCrafting', () => {
    it('should remove the specified activity from the game state', () => {
        const initialState: GameState = GetInitialGameState()
        initialState.activities = {
            entries: {
                'activity-1': { ...crafting },
                'activity-2': { ...crafting, id: 'activity-2' },
            },
            ids: ['activity-1', 'activity-2'],
        }

        const updatedState = removeCrafting(initialState, 'activity-1')

        expect(updatedState.activities.entries).not.toHaveProperty('activity-1')
        expect(updatedState.activities.ids).not.toContain('activity-1')
        expect(updatedState.activities.entries).toHaveProperty('activity-2')
        expect(updatedState.activities.ids).toContain('activity-2')
    })

    it('should not modify the state if the activity ID does not exist', () => {
        const initialState: GameState = GetInitialGameState()
        initialState.activities = {
            entries: {
                'activity-1': { ...crafting, id: 'activity-1' },
            },
            ids: ['activity-1'],
        }

        expect(() => removeCrafting(initialState, 'non-existent-id')).toThrowError()
    })

    it('should handle an empty activities state gracefully', () => {
        const initialState: GameState = GetInitialGameState()
        initialState.activities = {
            entries: {},
            ids: [],
        }

        expect(() => removeCrafting(initialState, 'activity-1')).toThrowError()
    })
})
