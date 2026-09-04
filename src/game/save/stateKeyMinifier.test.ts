// oxlint-disable typescript/no-unsafe-type-assertion
import { describe, expect, it } from 'vitest'
import { minifyStateKeys, restoreStateKeys } from './stateKeyMinifier'

describe('stateKeyMinifier', () => {
    it('minifies only mapped GameState and LocationState keys', () => {
        const input = {
            gameId: 'g1',
            pageUnlockProgressionEnabled: true,
            isTimer: true,
            customFutureKey: 'keep-me',
            locations: {
                ids: ['village'],
                entries: {
                    village: {
                        id: 'village',
                        storage: { ids: [], entities: {} },
                        forests: { trees: [] },
                        unlockedGatheringZones: [],
                        futureLocationField: 42,
                    },
                },
            },
        }

        const minified = minifyStateKeys(input) as Record<string, unknown>

        expect(minified.gi).toBe('g1')
        expect(minified.pu).toBe(true)
        expect(minified.it).toBe(true)
        expect(minified.customFutureKey).toBe('keep-me')
        expect(minified.gameId).toBeUndefined()

        const locations = minified.ls as { entries: Record<string, Record<string, unknown>> }
        expect(locations.entries.village?.id).toBe('village')
        expect(locations.entries.village?.st).toEqual({ ids: [], entities: {} })
        expect(locations.entries.village?.fo).toEqual({ trees: [] })
        expect(locations.entries.village?.ug).toEqual([])
        expect(locations.entries.village?.futureLocationField).toBe(42)
        expect(locations.entries.village?.storage).toBeUndefined()
    })

    it('restores minified keys and preserves unknown keys', () => {
        const input = {
            gi: 'g1',
            pu: true,
            it: false,
            someNewTopLevelKey: 'safe',
            ls: {
                ids: ['village'],
                entries: {
                    village: {
                        id: 'village',
                        st: { ids: ['a'], entities: { a: { id: 'a' } } },
                        ug: ['forest'],
                        someNewLocationKey: 'safe-loc',
                    },
                },
            },
        }

        const restored = restoreStateKeys(input) as Record<string, unknown>

        expect(restored.gameId).toBe('g1')
        expect(restored.pageUnlockProgressionEnabled).toBe(true)
        expect(restored.isTimer).toBe(false)
        expect(restored.someNewTopLevelKey).toBe('safe')
        expect(restored.gi).toBeUndefined()

        const locations = restored.locations as { entries: Record<string, Record<string, unknown>> }
        expect(locations.entries.village?.id).toBe('village')
        expect(locations.entries.village?.storage).toEqual({ ids: ['a'], entities: { a: { id: 'a' } } })
        expect(locations.entries.village?.unlockedGatheringZones).toEqual(['forest'])
        expect(locations.entries.village?.someNewLocationKey).toBe('safe-loc')
        expect(locations.entries.village?.st).toBeUndefined()
    })

    it('does not throw when locations has non-object entries', () => {
        const input = {
            gi: 'g1',
            ls: {
                village: null,
                cave: 12,
            },
        }

        expect(() => restoreStateKeys(input)).not.toThrow()
    })

    it('round-trips adapter-shaped locations without changing their structure', () => {
        const input = {
            locations: {
                ids: ['village'],
                entries: {
                    village: {
                        id: 'village',
                        caravanSlots: 2,
                        storage: { ids: ['log'], entries: { log: { itemId: 'OakLog', quantity: 3 } } },
                        forests: { Oak: { qta: 2, hp: 100 } },
                        oreVeins: { Copper: [] },
                    },
                },
            },
        }

        expect(restoreStateKeys(minifyStateKeys(input))).toEqual(input)
    })
})
