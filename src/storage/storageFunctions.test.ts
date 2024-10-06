import { test, describe, expect } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { Icons } from '../icons/Icons'
import { ItemTypes } from '../items/Item'
import { GameLocations } from '../gameLocations/GameLocations'
import { CRAFTED_ITEM_PREFIX } from '../const'
import { addItem, hasItem, removeItem } from './storageFunctions'

describe('Storage Functions', () => {
    test('Add Item', () => {
        let state = GetInitialGameState()
        state = addItem(state, 'OakLog', 1)
        expect(state.locations.StartVillage.storage).toEqual({
            OakLog: 1,
        })
    })
    test('Add Item craft', () => {
        let state = GetInitialGameState()
        state = addItem(state, `${CRAFTED_ITEM_PREFIX}craft`, 3)
        expect(state.locations.StartVillage.storage).toEqual({
            [`${CRAFTED_ITEM_PREFIX}craft`]: 3,
        })
    })
    test('Add Item craft 2', () => {
        let state = GetInitialGameState()
        state.locations.StartVillage.storage = { OakLog: 1, std: 1, [`${CRAFTED_ITEM_PREFIX}craft`]: 2 }
        state = addItem(state, `${CRAFTED_ITEM_PREFIX}craft`, 3)
        expect(state.locations.StartVillage.storage).toEqual({
            OakLog: 1,
            std: 1,
            [`${CRAFTED_ITEM_PREFIX}craft`]: 5,
        })
    })
    test('Remove Item 1', () => {
        let state = GetInitialGameState()
        state.locations.StartVillage.storage = { OakLog: 1 }
        state = removeItem(state, 'OakLog', 1)
        expect(state.locations.StartVillage.storage).toEqual({})
    })
    test('Remove Item 2', () => {
        let state = GetInitialGameState()
        state.locations.StartVillage.storage = { OakLog: 10 }
        state = removeItem(state, 'OakLog', 2)
        expect(state.locations.StartVillage.storage).toEqual({
            OakLog: 8,
        })
    })
    test('Remove Item 1 craft', () => {
        let state = GetInitialGameState()
        const craftedId = `${CRAFTED_ITEM_PREFIX}craft2`
        state.locations.StartVillage.storage = { [craftedId]: 1 }
        state.craftedItems = {
            ids: [craftedId],
            entries: {
                [craftedId]: {
                    id: craftedId,
                    icon: Icons.Axe,
                    nameId: 'Craft',
                    type: ItemTypes.Bar,
                    value: 1,
                },
            },
        }
        state = removeItem(state, craftedId, 1, GameLocations.StartVillage)
        expect(state.locations.StartVillage.storage).toEqual({})
        expect(state.locations.Test.storage).toEqual({})
        expect(state.craftedItems).toEqual({
            ids: [],
            entries: {},
        })
    })
    test('Remove Item 2 craft', () => {
        let state = GetInitialGameState()
        state.locations.StartVillage.storage = { [`${CRAFTED_ITEM_PREFIX}craft`]: 10 }
        state = removeItem(state, `${CRAFTED_ITEM_PREFIX}craft`, 2)
        expect(state.locations.StartVillage.storage).toEqual({
            [`${CRAFTED_ITEM_PREFIX}craft`]: 8,
        })
    })

    test('Has Item No', () => {
        const state = GetInitialGameState()
        expect(hasItem(state, 'DeadTreePlank', 1)).toBe(false)
    })
    test('Has Item Yes', () => {
        const state = GetInitialGameState()
        state.locations.StartVillage.storage = { [`${CRAFTED_ITEM_PREFIX}craft`]: 1 }
        expect(hasItem(state, `${CRAFTED_ITEM_PREFIX}craft`, 1)).toBe(true)
    })
})
