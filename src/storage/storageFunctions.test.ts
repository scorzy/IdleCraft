import { describe, expect, test } from 'vitest'
import { CaravanTierId } from '../caravans/CaravanConst'
import { ShipmentStatus } from '../caravans/ShipmentState'
import { CRAFTED_ITEM_PREFIX } from '../const'
import { GetInitialGameState } from '../game/InitialGameState'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { GameLocations } from '../gameLocations/GameLocations'
import { Icons } from '../icons/Icons'
import { ItemTypes } from '../items/Item'
import { addItem, hasGold, hasItem, removeItem, spendGold } from './storageFunctions'

const getLocation = (state: ReturnType<typeof GetInitialGameState>, location = GameLocations.StartVillage) =>
    GameLocationAdapter.selectEx(state.locations, location)

describe('Storage Functions', () => {
    test('Add Item', () => {
        const state = GetInitialGameState()
        addItem(state, 'OakLog', 1)
        expect(getLocation(state).storage).toEqual({
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
        expect(getLocation(state).storage).toEqual({
            ids: [id],
            entries: {
                [id]: { itemId: id, quantity: 3 },
            },
        })
    })
    test('Add Item craft 2', () => {
        const state = GetInitialGameState()
        getLocation(state).storage = {
            ids: ['OakLog', 'std', `${CRAFTED_ITEM_PREFIX}craft`],
            entries: {
                ['OakLog']: { itemId: 'OakLog', quantity: 1 },
                ['std']: { itemId: 'std', quantity: 1 },
                [`${CRAFTED_ITEM_PREFIX}craft`]: { itemId: `${CRAFTED_ITEM_PREFIX}craft`, quantity: 2 },
            },
        }
        addItem(state, `${CRAFTED_ITEM_PREFIX}craft`, 3)
        expect(getLocation(state).storage).toEqual({
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
        getLocation(state).storage = {
            ids: ['OakLog'],
            entries: {
                OakLog: { itemId: 'OakLog', quantity: 1 },
            },
        }
        removeItem(state, 'OakLog', 1)
        expect(getLocation(state).storage).toEqual({
            ids: [],
            entries: {},
        })
    })
    test('Remove Item 2', () => {
        const state = GetInitialGameState()
        getLocation(state).storage = {
            ids: ['OakLog'],
            entries: {
                OakLog: { itemId: 'OakLog', quantity: 10 },
            },
        }
        removeItem(state, 'OakLog', 2)
        expect(getLocation(state).storage).toEqual({
            ids: ['OakLog'],
            entries: {
                OakLog: { itemId: 'OakLog', quantity: 8 },
            },
        })
    })
    test('Remove Item 1 craft', () => {
        const state = GetInitialGameState()
        const craftedId = `${CRAFTED_ITEM_PREFIX}craft2`
        getLocation(state).storage = {
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
                    volume: 0.001,
                },
            },
        }
        removeItem(state, craftedId, 1, GameLocations.StartVillage)
        expect(getLocation(state).storage).toEqual({ ids: [], entries: {} })
        expect(getLocation(state, GameLocations.Test).storage).toEqual({ ids: [], entries: {} })
        expect(state.craftedItems).toEqual({ ids: [], entries: {} })
    })
    test('Remove Item 2 craft', () => {
        const state = GetInitialGameState()
        getLocation(state).storage = {
            ids: [`${CRAFTED_ITEM_PREFIX}craft`],
            entries: {
                [`${CRAFTED_ITEM_PREFIX}craft`]: { itemId: `${CRAFTED_ITEM_PREFIX}craft`, quantity: 10 },
            },
        }

        removeItem(state, `${CRAFTED_ITEM_PREFIX}craft`, 2)
        expect(getLocation(state).storage).toEqual({
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
        getLocation(state).storage = {
            ids: [`${CRAFTED_ITEM_PREFIX}craft`],
            entries: {
                [`${CRAFTED_ITEM_PREFIX}craft`]: { itemId: `${CRAFTED_ITEM_PREFIX}craft`, quantity: 1 },
            },
        }
        expect(hasItem(state, `${CRAFTED_ITEM_PREFIX}craft`, 1)).toBe(true)
    })

    test('Has Gold', () => {
        const state = GetInitialGameState()
        state.gold = 10
        expect(hasGold(state, 10)).toBe(true)
        expect(hasGold(state, 11)).toBe(false)
    })

    test('Spend Gold', () => {
        const state = GetInitialGameState()
        state.gold = 10
        spendGold(state, 4)
        expect(state.gold).toBe(6)
    })

    test('Spend Gold clamps at 0', () => {
        const state = GetInitialGameState()
        state.gold = 3
        spendGold(state, 10)
        expect(state.gold).toBe(0)
    })

    test('Remove Item craft survives while in an active shipment cargo', () => {
        const state = GetInitialGameState()
        const craftedId = `${CRAFTED_ITEM_PREFIX}inTransit`
        getLocation(state).storage = {
            ids: [craftedId],
            entries: { [craftedId]: { itemId: craftedId, quantity: 1 } },
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
                    volume: 0.001,
                },
            },
        }
        state.shipments = {
            ids: ['shipment1'],
            entries: {
                shipment1: {
                    id: 'shipment1',
                    tierId: CaravanTierId.Standard,
                    fromId: GameLocations.StartVillage,
                    toId: GameLocations.WoodVillage,
                    cargo: [{ itemId: craftedId, quantity: 1 }],
                    totalVolume: 0.001,
                    cargoValue: 1,
                    departAtMs: 0,
                    arriveAtMs: 1000,
                    costPaid: 1,
                    status: ShipmentStatus.InTransit,
                },
            },
        }

        removeItem(state, craftedId, 1, GameLocations.StartVillage)
        expect(getLocation(state).storage).toEqual({ ids: [], entries: {} })
        expect(state.craftedItems.ids).toContain(craftedId)
    })

    test('Remove Item craft survives while sitting in a dock', () => {
        const state = GetInitialGameState()
        const craftedId = `${CRAFTED_ITEM_PREFIX}inDock`
        getLocation(state).storage = {
            ids: [craftedId],
            entries: { [craftedId]: { itemId: craftedId, quantity: 1 } },
        }
        getLocation(state, GameLocations.WoodVillage).dock = {
            ids: [craftedId],
            entries: { [craftedId]: { itemId: craftedId, quantity: 1 } },
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
                    volume: 0.001,
                },
            },
        }

        removeItem(state, craftedId, 1, GameLocations.StartVillage)
        expect(getLocation(state).storage).toEqual({ ids: [], entries: {} })
        expect(state.craftedItems.ids).toContain(craftedId)
    })
})
