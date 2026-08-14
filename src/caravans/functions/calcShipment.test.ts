import { describe, expect, it } from 'vitest'
import { InitialState } from '@/entityAdapter/InitialState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Icons } from '../../icons/Icons'
import { Item, ItemTypes } from '../../items/Item'
import { ItemAdapter } from '../../storage/ItemAdapter'
import { StorageState } from '../../storage/storageTypes'
import { CaravanTier, CaravanTierId, RouteConfig, VOLUME_REF } from '../CaravanConst'
import { calcCargoValue, calcCost, calcDuration, calcTotalVolume } from './calcShipment'
import { getTier } from './getRoute'

function makeItem(id: string, volume: number, value: number): Item {
    return { id, nameId: 'Log', icon: Icons.Log, type: ItemTypes.Log, value, volume }
}

function makeCraftedItems(items: Item[]): InitialState<Item> {
    const state = ItemAdapter.getInitialState()
    for (const item of items) ItemAdapter.create(state, item)
    return state
}

const nearbyRoute: RouteConfig = {
    fromId: GameLocations.StartVillage,
    toId: GameLocations.WoodVillage,
    baseMinutes: 20,
}

const getTierEx = (id: CaravanTierId): CaravanTier => {
    const tier = getTier(id)
    if (!tier) throw new Error(`tier ${id} not found`)
    return tier
}

describe('calcTotalVolume / calcCargoValue', () => {
    const craftedItems = makeCraftedItems([makeItem('C_Raw', 1.0, 5), makeItem('C_Refined', 0.3, 10)])
    const cargo: StorageState[] = [
        { itemId: 'C_Raw', quantity: 100 },
        { itemId: 'C_Refined', quantity: 50 },
    ]

    it('sums the volume of a mixed cargo', () => {
        expect(calcTotalVolume(cargo, craftedItems)).toBeCloseTo(100 * 1.0 + 50 * 0.3)
    })

    it('sums the economic value of a mixed cargo', () => {
        expect(calcCargoValue(cargo, craftedItems)).toBeCloseTo(100 * 5 + 50 * 10)
    })
})

describe('calcDuration', () => {
    const tier = getTierEx(CaravanTierId.Standard)

    it('below VOLUME_REF the duration stays at the base time (max(1, ...) floor)', () => {
        expect(calcDuration(nearbyRoute, tier, VOLUME_REF / 2)).toBeCloseTo(nearbyRoute.baseMinutes / tier.speed)
    })

    it('10x the reference load roughly doubles the duration', () => {
        const base = calcDuration(nearbyRoute, tier, VOLUME_REF)
        const tenX = calcDuration(nearbyRoute, tier, VOLUME_REF * 10)
        expect(tenX / base).toBeCloseTo(2, 1)
    })

    it('50x the reference load brings the duration to about 3.3x', () => {
        const base = calcDuration(nearbyRoute, tier, VOLUME_REF)
        const fiftyX = calcDuration(nearbyRoute, tier, VOLUME_REF * 50)
        const ratio = fiftyX / base
        expect(ratio).toBeGreaterThan(3.1)
        expect(ratio).toBeLessThan(3.4)
    })

    it('spec sanity check: standard, nearby route, 50000 volume -> ~66 minutes (exact calc ~64.7)', () => {
        const duration = calcDuration(nearbyRoute, tier, 50_000)
        expect(duration).toBeGreaterThan(60)
        expect(duration).toBeLessThan(70)
    })

    it('spec sanity check: heavy_cart, nearby route, 50000 volume -> ~200 minutes (exact calc ~196)', () => {
        const heavy = getTierEx(CaravanTierId.HeavyCart)
        const duration = calcDuration(nearbyRoute, heavy, 50_000)
        expect(duration).toBeGreaterThan(190)
        expect(duration).toBeLessThan(210)
    })
})

describe('scaling across tiers', () => {
    const heavy = getTierEx(CaravanTierId.HeavyCart)
    const standard = getTierEx(CaravanTierId.Standard)
    const fast = getTierEx(CaravanTierId.FastCourier)
    const totalVolume = 50_000
    const cargoValue = 1_000

    it('duration scales with the speed ratio between tiers (~3x heavy->standard, ~3x standard->fast)', () => {
        const heavyDuration = calcDuration(nearbyRoute, heavy, totalVolume)
        const standardDuration = calcDuration(nearbyRoute, standard, totalVolume)
        const fastDuration = calcDuration(nearbyRoute, fast, totalVolume)

        expect(heavyDuration / standardDuration).toBeCloseTo(standard.speed / heavy.speed, 5)
        expect(standardDuration / fastDuration).toBeCloseTo(fast.speed / standard.speed, 5)
    })

    it('spec sanity check: heavy_cart costs a quarter of standard on a low-value cargo', () => {
        const cheapCargoValue = 1
        const heavyCost = calcCost(nearbyRoute, heavy, totalVolume, cheapCargoValue)
        const standardCost = calcCost(nearbyRoute, standard, totalVolume, cheapCargoValue)
        expect(heavyCost / standardCost).toBeCloseTo(0.25, 1)
    })

    it("cost scales according to the tiers' tariffFlat/tariffPct (not necessarily an exact 4x on every jump)", () => {
        const heavyCost = calcCost(nearbyRoute, heavy, totalVolume, cargoValue)
        const standardCost = calcCost(nearbyRoute, standard, totalVolume, cargoValue)
        const fastCost = calcCost(nearbyRoute, fast, totalVolume, cargoValue)
        expect(standardCost).toBeGreaterThan(heavyCost)
        expect(fastCost).toBeGreaterThan(standardCost)
    })
})

describe('calcCost', () => {
    it('distance scales cost linearly (double route -> double cost)', () => {
        const tier = getTierEx(CaravanTierId.Standard)
        const farRoute: RouteConfig = { ...nearbyRoute, baseMinutes: nearbyRoute.baseMinutes * 2 }
        const nearCost = calcCost(nearbyRoute, tier, 1000, 100)
        const farCost = calcCost(farRoute, tier, 1000, 100)
        expect(farCost).toBeCloseTo(nearCost * 2)
    })
})
