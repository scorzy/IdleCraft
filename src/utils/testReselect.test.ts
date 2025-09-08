import { createSelectorCreator, weakMapMemoize } from 'reselect'
import { describe, expect, test } from 'vitest'
import { deepEqual } from 'fast-equals'
import { GetInitialGameState } from '../game/InitialGameState'
import { addItem } from '../storage/storageFunctions'
import { GameState } from '../game/GameState'

describe('Reselect', () => {
    test('deep equal with transformation', () => {
        let state = GetInitialGameState()
        state = addItem(state, 'plank', 10)
        state = addItem(state, 'log', 10)

        // const creator = createSelectorCreator(weakMapMemoize, { resultEqualityCheck: deepEqual })

        const creator = createSelectorCreator({
            memoize: weakMapMemoize,
            memoizeOptions: { resultEqualityCheck: deepEqual },
        })

        const selector = creator(
            [(s: GameState) => s.locations[s.location].storage, (_s: GameState, id: string) => id],
            (storage, id) => {
                return {
                    qta: storage[id] ?? 0,
                }
            }
        )

        const planks = selector(state, 'plank')
        const logs = selector(state, 'log')

        selector(state, 'plank')
        selector(state, 'log')

        state = addItem(state, 'log', 10)
        state = addItem(state, 'log', -10)

        const planks2 = selector(state, 'plank')
        const logs2 = selector(state, 'log')

        expect(planks).toBe(planks2)
        expect(logs).toBe(logs2)
    })
})
