import { describe, expect, test } from 'vitest'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { CaravanTierId } from '../CaravanConst'
import { getReachableDestinations, getRoute, getTier } from './getRoute'

describe('getRoute', () => {
    test('finds the route configured for the current location', () => {
        const state = GetInitialGameState()
        const forward = getRoute(state, GameLocations.WoodVillage)
        state.location = GameLocations.WoodVillage
        const backward = getRoute(state, GameLocations.StartVillage)
        expect(forward).toBeDefined()
        expect(backward).toBeDefined()
        expect(forward?.toId).toBe(GameLocations.WoodVillage)
        expect(backward?.toId).toBe(GameLocations.StartVillage)
        expect(forward?.baseMinutes).toBe(backward?.baseMinutes)
    })

    test('no route for an unconfigured pair', () => {
        expect(getRoute(GetInitialGameState(), GameLocations.Test)).toBeUndefined()
    })
})

describe('getTier', () => {
    test('finds an existing tier', () => {
        expect(getTier(CaravanTierId.Standard)?.id).toBe(CaravanTierId.Standard)
    })
})

describe('getReachableDestinations', () => {
    test('lists the destinations reachable from a location on a route', () => {
        const state = GetInitialGameState()
        expect(getReachableDestinations(state)).toEqual([GameLocations.WoodVillage])
        state.location = GameLocations.WoodVillage
        expect(getReachableDestinations(state)).toEqual([GameLocations.StartVillage])
    })

    test('no destinations for a location without configured routes', () => {
        const state = GetInitialGameState()
        state.location = GameLocations.Test
        expect(getReachableDestinations(state)).toEqual([])
    })
})
