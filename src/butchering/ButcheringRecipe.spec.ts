import { describe, expect, it } from 'vitest'
import { initialize } from '../game/functions/initialize'
import { GetInitialGameState } from '../game/InitialGameState'
import { butcheringRecipe } from './ButcheringRecipe'

describe('butcheringRecipe', () => {
    it('uses corpse data registered from the owning enemy', () => {
        initialize()

        expect(butcheringRecipe.getResult(GetInitialGameState(), [{ id: 'corpse', itemId: 'DeadBoar' }])).toMatchObject(
            {
                requirements: [{ itemId: 'DeadBoar', qta: 1 }],
                results: [{ id: 'RedMeat', stdItemId: 'RedMeat', qta: 2 }],
            }
        )
    })
})
