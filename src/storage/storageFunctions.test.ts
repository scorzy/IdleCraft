import { test, describe, expect } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { Icons } from '../icons/Icons'
import { ItemTypes } from '../items/Item'
import { GameLocations } from '../gameLocations/GameLocations'
import { CRAFTED_ITEM_PREFIX } from '../const'
import { addItem, hasItem, removeItem } from './storageFunctions'

describe('Storage Functions', () => {
    test('Add Item', () => {
        const state = GetInitialGameState()
        addItem(state, 'OakLog', 1)
        expect(state.locations.StartVillage.storage).toEqual({
            ids: ['OakLog'],
            entries: {
                OakLog: { itemId: 'OakLog', quantity: 1 },
            },
        })
    })
    test('Add Item craft', () => {
        const state = GetInitialGameState()
        const id = `${CRAFTED_ITEM_PREFIX}craft`
        addItem(state, id, 3)
        expect(state.locations.StartVillage.storage).toEqual({
            ids: [id],
            entries: {
                [id]: { itemId: id, quantity: 3 },
            },
        })
    })
    test('Add Item craft 2', () => {
        const state = GetInitialGameState()
        state.locations.StartVillage.storage = {
            ids: ['OakLog', 'std', `${CRAFTED_ITEM_PREFIX}craft`],
            entries: {
                ['OakLog']: { itemId: 'OakLog', quantity: 1 },
                ['std']: { itemId: 'std', quantity: 1 },
                [`${CRAFTED_ITEM_PREFIX}craft`]: { itemId: `${CRAFTED_ITEM_PREFIX}craft`, quantity: 2 },
            },
        }
        addItem(state, `${CRAFTED_ITEM_PREFIX}craft`, 3)
        expect(state.locations.StartVillage.storage).toEqual({
            ids: ['OakLog', 'std', `${CRAFTED_ITEM_PREFIX}craft`],
            entries: {
                ['OakLog']: { itemId: 'OakLog', quantity: 1 },
                ['std']: { itemId: 'std', quantity: 1 },
                [`${CRAFTED_ITEM_PREFIX}craft`]: { itemId: `${CRAFTED_ITEM_PREFIX}craft`, quantity: 5 },
            },
        })
    })
    test('Remove Item 1', () => {
        const state = GetInitialGameState()
        state.locations.StartVillage.storage = {
            ids: ['OakLog'],
            entries: {
                OakLog: { itemId: 'OakLog', quantity: 1 },
            },
        }
        removeItem(state, 'OakLog', 1)
        expect(state.locations.StartVillage.storage).toEqual({
            ids: [],
            entries: {},
        })
    })
    test('Remove Item 2', () => {
        const state = GetInitialGameState()
        state.locations.StartVillage.storage = {
            ids: ['OakLog'],
            entries: {
                OakLog: { itemId: 'OakLog', quantity: 10 },
            },
        }
        removeItem(state, 'OakLog', 2)
        expect(state.locations.StartVillage.storage).toEqual({
            ids: ['OakLog'],
            entries: {
                OakLog: { itemId: 'OakLog', quantity: 8 },
            },
        })
    })
    test('Remove Item 1 craft', () => {
        const state = GetInitialGameState()
        const craftedId = `${CRAFTED_ITEM_PREFIX}craft2`
        state.locations.StartVillage.storage = {
            ids: [craftedId],
            entries: {
                [craftedId]: { itemId: craftedId, quantity: 1 },
            },
        }
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
        removeItem(state, craftedId, 1, GameLocations.StartVillage)
        expect(state.locations.StartVillage.storage).toEqual({ ids: [], entries: {} })
        expect(state.locations.Test.storage).toEqual({ ids: [], entries: {} })
        expect(state.craftedItems).toEqual({ ids: [], entries: {} })
    })
    test('Remove Item 2 craft', () => {
        const state = GetInitialGameState()
        state.locations.StartVillage.storage = {
            ids: [`${CRAFTED_ITEM_PREFIX}craft`],
            entries: {
                [`${CRAFTED_ITEM_PREFIX}craft`]: { itemId: `${CRAFTED_ITEM_PREFIX}craft`, quantity: 10 },
            },
        }

        removeItem(state, `${CRAFTED_ITEM_PREFIX}craft`, 2)
        expect(state.locations.StartVillage.storage).toEqual({
            ids: [`${CRAFTED_ITEM_PREFIX}craft`],
            entries: {
                [`${CRAFTED_ITEM_PREFIX}craft`]: { itemId: `${CRAFTED_ITEM_PREFIX}craft`, quantity: 8 },
            },
        })
    })

    test('Has Item No', () => {
        const state = GetInitialGameState()
        expect(hasItem(state, 'DeadTreePlank', 1)).toBe(false)
    })
    test('Has Item Yes', () => {
        const state = GetInitialGameState()
        state.locations.StartVillage.storage = {
            ids: [`${CRAFTED_ITEM_PREFIX}craft`],
            entries: {
                [`${CRAFTED_ITEM_PREFIX}craft`]: { itemId: `${CRAFTED_ITEM_PREFIX}craft`, quantity: 1 },
            },
        }
        expect(hasItem(state, `${CRAFTED_ITEM_PREFIX}craft`, 1)).toBe(true)
    })
})
