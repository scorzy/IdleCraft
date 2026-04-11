import { describe, expect, it } from 'vitest'
import { minifyStateKeys, restoreStateKeys } from './stateKeyMinifier'

describe('stateKeyMinifier', () => {
    it('minifies only mapped GameState and LocationState keys', () => {
        const input = {
            gameId: 'g1',
            isTimer: true,
            customFutureKey: 'keep-me',
            locations: {
                village: {
                    storage: { ids: [], entities: {} },
                    forests: { trees: [] },
                    unlockedGatheringZones: [],
                    futureLocationField: 42,
                },
            },
        }

        const minified = minifyStateKeys(input) as Record<string, unknown>

        expect(minified.gi).toBe('g1')
        expect(minified.it).toBe(true)
        expect(minified.customFutureKey).toBe('keep-me')
        expect(minified.gameId).toBeUndefined()

        const locations = minified.ls as Record<string, Record<string, unknown>>
        expect(locations.village.st).toEqual({ ids: [], entities: {} })
        expect(locations.village.fo).toEqual({ trees: [] })
        expect(locations.village.ug).toEqual([])
        expect(locations.village.futureLocationField).toBe(42)
        expect(locations.village.storage).toBeUndefined()
    })

    it('restores minified keys and preserves unknown keys', () => {
        const input = {
            gi: 'g1',
            it: false,
            someNewTopLevelKey: 'safe',
            ls: {
                village: {
                    st: { ids: ['a'], entities: { a: { id: 'a' } } },
                    ug: ['forest'],
                    someNewLocationKey: 'safe-loc',
                },
            },
        }

        const restored = restoreStateKeys(input) as Record<string, unknown>

        expect(restored.gameId).toBe('g1')
        expect(restored.isTimer).toBe(false)
        expect(restored.someNewTopLevelKey).toBe('safe')
        expect(restored.gi).toBeUndefined()

        const locations = restored.locations as Record<string, Record<string, unknown>>
        expect(locations.village.storage).toEqual({ ids: ['a'], entities: { a: { id: 'a' } } })
        expect(locations.village.unlockedGatheringZones).toEqual(['forest'])
        expect(locations.village.someNewLocationKey).toBe('safe-loc')
        expect(locations.village.st).toBeUndefined()
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
})
