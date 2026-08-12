import { describe, expect, test } from 'vitest'
import { CRAFTED_ITEM_PREFIX } from '../../const'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Icons } from '../../icons/Icons'
import { ItemTypes } from '../../items/Item'
import { addToDock, unloadAllDock, unloadDockItem } from './dockFunctions'

const getLocation = (state: ReturnType<typeof GetInitialGameState>, location = GameLocations.StartVillage) =>
    GameLocationAdapter.selectEx(state.locations, location)

describe('dockFunctions', () => {
    test('addToDock crea la entry se assente', () => {
        const state = GetInitialGameState()
        addToDock(state, GameLocations.StartVillage, 'OakLog', 5)
        expect(getLocation(state).dock).toEqual({
            ids: ['OakLog'],
            entries: { OakLog: { itemId: 'OakLog', quantity: 5 } },
        })
    })

    test('addToDock accumula su una entry esistente', () => {
        const state = GetInitialGameState()
        addToDock(state, GameLocations.StartVillage, 'OakLog', 5)
        addToDock(state, GameLocations.StartVillage, 'OakLog', 3)
        expect(getLocation(state).dock.entries.OakLog?.quantity).toBe(8)
    })

    test('addToDock non aggiunge quantità non positive', () => {
        const state = GetInitialGameState()
        addToDock(state, GameLocations.StartVillage, 'OakLog', 0)
        expect(getLocation(state).dock).toEqual({ ids: [], entries: {} })
    })

    test('unloadDockItem sposta la merce dal dock allo storage', () => {
        const state = GetInitialGameState()
        addToDock(state, GameLocations.StartVillage, 'OakLog', 5)
        unloadDockItem(state, GameLocations.StartVillage, 'OakLog')
        expect(getLocation(state).dock).toEqual({ ids: [], entries: {} })
        expect(getLocation(state).storage.entries.OakLog?.quantity).toBe(5)
    })

    test('unloadDockItem su item assente non fa nulla', () => {
        const state = GetInitialGameState()
        unloadDockItem(state, GameLocations.StartVillage, 'OakLog')
        expect(getLocation(state).storage).toEqual({ ids: [], entries: {} })
    })

    test('unloadAllDock scarica tutte le entry del dock', () => {
        const state = GetInitialGameState()
        addToDock(state, GameLocations.StartVillage, 'OakLog', 5)
        addToDock(state, GameLocations.StartVillage, 'CopperOre', 2)
        unloadAllDock(state, GameLocations.StartVillage)
        expect(getLocation(state).dock).toEqual({ ids: [], entries: {} })
        expect(getLocation(state).storage.entries.OakLog?.quantity).toBe(5)
        expect(getLocation(state).storage.entries.CopperOre?.quantity).toBe(2)
    })

    test('unloadDockItem con item craftato lo riporta correttamente in storage senza perdere la definizione', () => {
        const state = GetInitialGameState()
        const craftedId = `${CRAFTED_ITEM_PREFIX}craft`
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
        addToDock(state, GameLocations.StartVillage, craftedId, 1)
        unloadDockItem(state, GameLocations.StartVillage, craftedId)
        expect(getLocation(state).storage.entries[craftedId]?.quantity).toBe(1)
        expect(state.craftedItems.ids).toContain(craftedId)
    })
})
