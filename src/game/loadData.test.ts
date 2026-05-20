import { describe, expect, it } from 'vitest'
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
})
