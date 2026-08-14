import { describe, expect, test } from 'vitest'
import { GameLocations } from '../../gameLocations/GameLocations'
import { CaravanTierId } from '../CaravanConst'
import { getReachableDestinations, getRoute, getTier } from './getRoute'

describe('getRoute', () => {
    test('finds the route regardless of direction', () => {
        const forward = getRoute(GameLocations.StartVillage, GameLocations.WoodVillage)
        const backward = getRoute(GameLocations.WoodVillage, GameLocations.StartVillage)
        expect(forward).toBeDefined()
        expect(backward).toBeDefined()
        expect(forward).toEqual(backward)
    })

    test('no route for an unconfigured pair', () => {
        expect(getRoute(GameLocations.StartVillage, GameLocations.Test)).toBeUndefined()
    })
})

describe('getTier', () => {
    test('finds an existing tier', () => {
        expect(getTier(CaravanTierId.Standard)?.id).toBe(CaravanTierId.Standard)
    })
})

describe('getReachableDestinations', () => {
    test('lists the destinations reachable from a location on a route', () => {
        expect(getReachableDestinations(GameLocations.StartVillage)).toEqual([GameLocations.WoodVillage])
        expect(getReachableDestinations(GameLocations.WoodVillage)).toEqual([GameLocations.StartVillage])
    })

    test('no destinations for a location without configured routes', () => {
        expect(getReachableDestinations(GameLocations.Test)).toEqual([])
    })
})
