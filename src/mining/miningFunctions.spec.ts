import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { GameLocations } from '../gameLocations/GameLocations'
import { GameState } from '../game/GameState'
import { GetInitialGameState } from '../game/InitialGameState'
import { OreVeinState } from './OreState'
import { OreTypes } from './OreTypes'
import {
    canSearchOreVein,
    getCurrentOreVeinByType,
    getOreVeinsByType,
    hasOre,
    MAX_ORE_VEINS,
    mineOre,
    mineOreVein,
    moveOreVeinNext,
    moveOreVeinPrev,
    removeOreVein,
    resetOre,
    searchOreVein,
} from './miningFunctions'

const LOC = GameLocations.StartVillage

const makeVein = (overrides: Partial<OreVeinState> = {}): OreVeinState => ({
    id: 'v1',
    oreType: OreTypes.Copper,
    qta: 3,
    maxQta: 3,
    hp: 50,
    maxHp: 50,
    armour: 0,
    gemChance: 0,
    ...overrides,
})

describe('miningFunctions', () => {
    let state: GameState

    beforeEach(() => {
        state = GetInitialGameState()
    })

    describe('getOreVeinsByType', () => {
        it('creates and returns an empty array when none exist yet', () => {
            const veins = getOreVeinsByType(state, LOC, OreTypes.Copper)
            expect(veins).toEqual([])
            expect(GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper]).toBe(veins)
        })

        it('returns the existing array for the ore type', () => {
            const existing = [makeVein()]
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = existing
            expect(getOreVeinsByType(state, LOC, OreTypes.Copper)).toBe(existing)
        })
    })

    describe('hasOre', () => {
        it('is true by default (no ore state recorded yet)', () => {
            expect(hasOre(state, OreTypes.Copper)).toBe(true)
        })

        it('is false once the ore quantity reaches zero', () => {
            GameLocationAdapter.selectEx(state.locations, LOC).ores[OreTypes.Copper] = { qta: 0, hp: 100 }
            expect(hasOre(state, OreTypes.Copper, LOC)).toBe(false)
        })
    })

    describe('resetOre', () => {
        it('resets the ore back to its default quantity and hp', () => {
            GameLocationAdapter.selectEx(state.locations, LOC).ores[OreTypes.Copper] = { qta: 0, hp: 0 }
            resetOre(state, OreTypes.Copper, LOC)
            const ore = GameLocationAdapter.selectEx(state.locations, LOC).ores[OreTypes.Copper]
            expect(ore).toEqual({ qta: 20, hp: 100 })
        })
    })

    describe('getCurrentOreVeinByType', () => {
        it('returns undefined when there are no veins', () => {
            expect(getCurrentOreVeinByType(state, LOC, OreTypes.Copper)).toBeUndefined()
        })

        it('returns the first vein', () => {
            const veins = [makeVein({ id: 'a' }), makeVein({ id: 'b' })]
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = veins
            expect(getCurrentOreVeinByType(state, LOC, OreTypes.Copper)?.id).toBe('a')
        })
    })

    describe('moveOreVeinPrev / moveOreVeinNext', () => {
        it('swaps a vein with its predecessor', () => {
            const veins = [makeVein({ id: 'a' }), makeVein({ id: 'b' }), makeVein({ id: 'c' })]
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = veins

            moveOreVeinPrev(state, LOC, OreTypes.Copper, 'b')

            expect(veins.map((v) => v.id)).toEqual(['b', 'a', 'c'])
        })

        it('does nothing when moving the first vein backward', () => {
            const veins = [makeVein({ id: 'a' }), makeVein({ id: 'b' })]
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = veins

            moveOreVeinPrev(state, LOC, OreTypes.Copper, 'a')

            expect(veins.map((v) => v.id)).toEqual(['a', 'b'])
        })

        it('swaps a vein with its successor', () => {
            const veins = [makeVein({ id: 'a' }), makeVein({ id: 'b' }), makeVein({ id: 'c' })]
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = veins

            moveOreVeinNext(state, LOC, OreTypes.Copper, 'a')

            expect(veins.map((v) => v.id)).toEqual(['b', 'a', 'c'])
        })

        it('does nothing when moving the last vein forward', () => {
            const veins = [makeVein({ id: 'a' }), makeVein({ id: 'b' })]
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = veins

            moveOreVeinNext(state, LOC, OreTypes.Copper, 'b')

            expect(veins.map((v) => v.id)).toEqual(['a', 'b'])
        })
    })

    describe('removeOreVein', () => {
        it('removes the vein with the matching id', () => {
            const veins = [makeVein({ id: 'a' }), makeVein({ id: 'b' })]
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = veins

            removeOreVein(state, LOC, OreTypes.Copper, 'a')

            expect(veins.map((v) => v.id)).toEqual(['b'])
        })

        it('does nothing when the id does not match any vein', () => {
            const veins = [makeVein({ id: 'a' })]
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = veins

            removeOreVein(state, LOC, OreTypes.Copper, 'missing')

            expect(veins).toHaveLength(1)
        })
    })

    describe('canSearchOreVein', () => {
        it('is true below the max vein count', () => {
            expect(canSearchOreVein(state, LOC, OreTypes.Copper)).toBe(true)
        })

        it('is false at the max vein count', () => {
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = Array.from(
                { length: MAX_ORE_VEINS },
                (_, i) => makeVein({ id: `v${i}` })
            )
            expect(canSearchOreVein(state, LOC, OreTypes.Copper)).toBe(false)
        })
    })

    describe('searchOreVein', () => {
        it('adds a new vein derived from the ore base stats', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0.5)

            const vein = searchOreVein(state, LOC, OreTypes.Copper)

            expect(vein).toBeDefined()
            expect(vein!.oreType).toBe(OreTypes.Copper)
            expect(vein!.qta).toBeGreaterThan(0)
            expect(vein!.hp).toBeGreaterThanOrEqual(10)
            expect(getOreVeinsByType(state, LOC, OreTypes.Copper)).toContain(vein)

            vi.restoreAllMocks()
        })

        it('returns undefined once the max vein count is reached', () => {
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = Array.from(
                { length: MAX_ORE_VEINS },
                (_, i) => makeVein({ id: `v${i}` })
            )

            expect(searchOreVein(state, LOC, OreTypes.Copper)).toBeUndefined()
        })
    })

    describe('mineOre', () => {
        it('reduces hp by damage minus armour without depleting the node', () => {
            const result = mineOre(state, OreTypes.Copper, 10, LOC)

            expect(result.mined).toBe(false)
            const ore = GameLocationAdapter.selectEx(state.locations, LOC).ores[OreTypes.Copper]!
            expect(ore.hp).toBe(100 - (10 - 1))
            expect(ore.qta).toBe(20)
        })

        it('ignores damage below the node armour', () => {
            const result = mineOre(state, OreTypes.Copper, 0, LOC)
            expect(result.mined).toBe(false)
            const ore = GameLocationAdapter.selectEx(state.locations, LOC).ores[OreTypes.Copper]!
            expect(ore.hp).toBe(100)
        })

        it('mines the ore and resets hp once it reaches zero', () => {
            GameLocationAdapter.selectEx(state.locations, LOC).ores[OreTypes.Copper] = { hp: 5, qta: 3 }

            const result = mineOre(state, OreTypes.Copper, 100, LOC)

            expect(result.mined).toBe(true)
            const ore = GameLocationAdapter.selectEx(state.locations, LOC).ores[OreTypes.Copper]!
            expect(ore.hp).toBe(100)
            expect(ore.qta).toBe(2)
        })

        it('never drops quantity below zero', () => {
            GameLocationAdapter.selectEx(state.locations, LOC).ores[OreTypes.Copper] = { hp: 1, qta: 0 }

            const result = mineOre(state, OreTypes.Copper, 100, LOC)

            expect(result.mined).toBe(true)
            expect(GameLocationAdapter.selectEx(state.locations, LOC).ores[OreTypes.Copper]!.qta).toBe(0)
        })
    })

    describe('mineOreVein', () => {
        it('returns completed when the vein no longer exists', () => {
            const result = mineOreVein(state, LOC, OreTypes.Copper, 'missing', 10)
            expect(result).toEqual({ mined: false, completed: true, gemDropped: false })
        })

        it('reduces vein hp without mining when damage is below full hp', () => {
            const vein = makeVein({ hp: 50, armour: 0 })
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = [vein]

            const result = mineOreVein(state, LOC, OreTypes.Copper, vein.id, 10)

            expect(result.mined).toBe(false)
            expect(result.completed).toBe(false)
            expect(vein.hp).toBe(40)
        })

        it('mines the vein and resets hp when damage depletes it, decrementing quantity', () => {
            const vein = makeVein({ hp: 10, qta: 2, maxHp: 50, armour: 0, gemChance: 0 })
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = [vein]

            const result = mineOreVein(state, LOC, OreTypes.Copper, vein.id, 100)

            expect(result.mined).toBe(true)
            expect(result.completed).toBe(false)
            expect(result.oreType).toBe(OreTypes.Copper)
            expect(vein.hp).toBe(50)
            expect(vein.qta).toBe(1)
        })

        it('completes and removes the vein once its quantity reaches zero', () => {
            const vein = makeVein({ hp: 10, qta: 1, armour: 0 })
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = [vein]

            const result = mineOreVein(state, LOC, OreTypes.Copper, vein.id, 100)

            expect(result.completed).toBe(true)
            expect(result.mined).toBe(true)
            expect(getOreVeinsByType(state, LOC, OreTypes.Copper)).toHaveLength(0)
        })

        it('drops a gem when the random roll is within the gem chance', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0)
            const vein = makeVein({ hp: 10, qta: 3, gemChance: 0.5, armour: 0 })
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = [vein]

            const result = mineOreVein(state, LOC, OreTypes.Copper, vein.id, 100)

            expect(result.gemDropped).toBe(true)
            vi.restoreAllMocks()
        })

        it('does not drop a gem when the random roll is outside the gem chance', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0.99)
            const vein = makeVein({ hp: 10, qta: 3, gemChance: 0.5, armour: 0 })
            GameLocationAdapter.selectEx(state.locations, LOC).oreVeins[OreTypes.Copper] = [vein]

            const result = mineOreVein(state, LOC, OreTypes.Copper, vein.id, 100)

            expect(result.gemDropped).toBe(false)
            vi.restoreAllMocks()
        })
    })
})
