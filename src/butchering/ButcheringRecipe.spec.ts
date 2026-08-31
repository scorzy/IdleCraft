import { describe, expect, it } from 'vitest'
import { initialize } from '../game/functions/initialize'
import { GetInitialGameState } from '../game/InitialGameState'
import { butcheringRecipe } from './ButcheringRecipe'

describe('butcheringRecipe', () => {
    it('uses corpse data registered from the owning enemy', () => {
        initialize()

        expect(
            butcheringRecipe.getResult(GetInitialGameState(), [{ id: 'corpse', itemId: 'BoarDeadBoar' }])
        ).toMatchObject({
            requirements: [{ itemId: 'BoarDeadBoar', qta: 1 }],
            results: [{ id: 'RedMeat', stdItemId: 'RedMeat', qta: 2 }],
        })
    })

    it('butchers spider corpses into alchemy ingredients', () => {
        initialize()

        expect(
            butcheringRecipe.getResult(GetInitialGameState(), [{ id: 'corpse', itemId: 'SpiderDeadSpider' }])
        ).toMatchObject({
            requirements: [{ itemId: 'SpiderDeadSpider', qta: 1 }],
            results: [
                { id: 'VenomGland', stdItemId: 'VenomGland', qta: 1 },
                { id: 'SpiderEggSac', stdItemId: 'SpiderEggSac', qta: 1 },
            ],
        })
    })
})
