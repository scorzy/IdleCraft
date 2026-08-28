import { describe, expect, it } from 'vitest'
import { PLAYER_ID } from '../characters/charactersConst'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { ActivityTypes } from '../activities/ActivityState'
import { selectQuickSlots } from '../characters/selectors/quickSlotSelectors'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { GameLocations } from '../gameLocations/GameLocations'
import { loadData } from './loadData'

describe('loadData', () => {
    it('normalizes legacy location records into adapter state', () => {
        const state = loadData({
            locations: {
                [GameLocations.StartVillage]: {
                    storage: {
                        ids: ['OakLog'],
                        entries: {
                            OakLog: { itemId: 'OakLog', quantity: 2 },
                        },
                    },
                },
            },
        })

        const location = GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage)
        expect(state.locations.ids).toContain(GameLocations.StartVillage)
        expect(location.id).toBe(GameLocations.StartVillage)
        expect(location.forests).toEqual({})
        expect(location.storage.entries.OakLog?.quantity).toBe(2)
    })

    it('recreates the player when a save has no player character entry', () => {
        const state = loadData({ characters: { ids: [], entries: {} } })

        expect(state.characters.ids).toContain(PLAYER_ID)
        expect(state.characters.entries[PLAYER_ID]?.id).toBe(PLAYER_ID)
        expect(state.characters.entries[PLAYER_ID]?.inventory).toBeDefined()
    })

    it('removes cached crafting results from legacy saves', () => {
        const state = loadData({
            craftingForm: {
                recipeGroup: undefined,
                params: [],
                paramsValue: [],
                autoBuy: {},
                result: { time: 1000, requirements: [], results: [] },
            },
            activities: {
                ids: ['legacy-crafting'],
                entries: {
                    'legacy-crafting': {
                        id: 'legacy-crafting',
                        type: ActivityTypes.Crafting,
                        recipeId: 'BarRecipe',
                        paramsValue: [{ id: 'ore', itemId: 'CopperOre' }],
                        max: 1,
                        result: { time: 1000, requirements: [], results: [] },
                    },
                },
            },
        })

        expect(state.craftingForm).not.toHaveProperty('result')
        expect(state.activities.entries['legacy-crafting']).not.toHaveProperty('result')
        expect(state.activities.entries['legacy-crafting']).toMatchObject({
            recipeId: 'BarRecipe',
            paramsValue: [{ id: 'ore', itemId: 'CopperOre' }],
        })
    })
})
