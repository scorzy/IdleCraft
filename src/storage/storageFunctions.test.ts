import { test, describe, expect } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { addItem, hasItem, removeItem } from './storageFunctions'

describe('Storage Functions', () => {
    test('Add Item', () => {
        let state = GetInitialGameState()
        state = addItem(state, 'std', null, 1)
        expect(state.locations.StartVillage.storage).toEqual({
            StdItems: { std: 1 },
            CraftedItems: {},
        })
    })
    test('Add Item craft', () => {
        let state = GetInitialGameState()
        state = addItem(state, null, 'craft', 3)
        expect(state.locations.StartVillage.storage).toEqual({
            StdItems: {},
            CraftedItems: { craft: 3 },
        })
    })
    test('Add Item craft 2', () => {
        let state = GetInitialGameState()
        state.locations.StartVillage.storage.StdItems = { std: 1 }
        state.locations.StartVillage.storage.CraftedItems = { std: 1, craft: 2 }
        state = addItem(state, null, 'craft', 3)
        expect(state.locations.StartVillage.storage).toEqual({
            StdItems: { std: 1 },
            CraftedItems: { std: 1, craft: 5 },
        })
    })
    test('Remove Item 1', () => {
        let state = GetInitialGameState()
        state.locations.StartVillage.storage.StdItems = { std: 1 }
        state = removeItem(state, 'std', null, 1)
        expect(state.locations.StartVillage.storage).toEqual({
            StdItems: {},
            CraftedItems: {},
        })
    })
    test('Remove Item 2', () => {
        let state = GetInitialGameState()
        state.locations.StartVillage.storage.StdItems = { std: 10 }
        state = removeItem(state, 'std', null, 2)
        expect(state.locations.StartVillage.storage).toEqual({
            StdItems: { std: 8 },
            CraftedItems: {},
        })
    })
    test('Remove Item 1 craft', () => {
        let state = GetInitialGameState()
        state.locations.StartVillage.storage.CraftedItems = { craft: 1 }
        state = removeItem(state, null, 'craft', 1)
        expect(state.locations.StartVillage.storage).toEqual({
            StdItems: {},
            CraftedItems: {},
        })
    })
    test('Remove Item 2 craft', () => {
        let state = GetInitialGameState()
        state.locations.StartVillage.storage.CraftedItems = { craft: 10 }
        state = removeItem(state, null, 'craft', 2)
        expect(state.locations.StartVillage.storage).toEqual({
            StdItems: {},
            CraftedItems: { craft: 8 },
        })
    })
    test('Add Item Error', () => {
        const state = GetInitialGameState()
        expect(() => addItem(state, null, null, 1)).toThrowError('[addItem] stdItemId and craftItemId null')
    })
    test('Has Item Error', () => {
        const state = GetInitialGameState()
        expect(() => hasItem(state, null, null, 1)).toThrowError('[hasItem] stdItemId and craftItemId null')
    })
    test('Has Item No', () => {
        const state = GetInitialGameState()
        expect(hasItem(state, 'a', null, 1)).toBe(false)
    })
    test('Has Item Yes', () => {
        const state = GetInitialGameState()
        state.locations.StartVillage.storage.CraftedItems = { craft: 1 }
        expect(hasItem(state, null, 'craft', 1)).toBe(true)
    })
})
