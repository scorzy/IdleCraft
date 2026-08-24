import { describe, expect, it } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { GameLocations } from '../gameLocations/GameLocations'
import { ItemTypes } from '../items/Item'
import { addItem } from './storageFunctions'
import { selectFilteredItems, selectItemLocationQuantities, selectItemTotalQta } from './StorageSelectors'

describe('item location quantity selectors', () => {
    it('returns every location and the total quantity', () => {
        const state = GetInitialGameState()
        addItem(state, 'CopperOre', 2, GameLocations.StartVillage)
        addItem(state, 'CopperOre', 3, GameLocations.MountainVillage)

        const quantities = selectItemLocationQuantities('CopperOre')(state)

        expect(quantities).toHaveLength(Object.values(GameLocations).length)
        expect(quantities).toContainEqual({ location: GameLocations.StartVillage, quantity: 2 })
        expect(quantities).toContainEqual({ location: GameLocations.MountainVillage, quantity: 3 })
        expect(quantities).toContainEqual({ location: GameLocations.CapitalCity, quantity: 0 })
        expect(selectItemTotalQta('CopperOre')(state)).toBe(5)
    })

    it('only reads locations that exist in the game state', () => {
        const state = GetInitialGameState()
        GameLocationAdapter.remove(state.locations, GameLocations.Test)
        addItem(state, 'CopperOre', 2, GameLocations.StartVillage)

        const quantities = selectItemLocationQuantities('CopperOre')(state)

        expect(quantities).toHaveLength(GameLocationAdapter.getIds(state.locations).length)
        expect(quantities).not.toContainEqual({ location: GameLocations.Test, quantity: 0 })
        expect(selectItemTotalQta('CopperOre')(state)).toBe(2)
    })

    it('optionally includes matching vendor items that are not owned', () => {
        const state = GetInitialGameState()
        const filter = { itemType: ItemTypes.Ore }

        expect(selectFilteredItems(state, filter)).not.toContain('CopperOre')
        expect(selectFilteredItems(state, filter, true)).toContain('CopperOre')
    })
})
