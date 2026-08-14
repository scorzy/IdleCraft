import { describe, expect, test } from 'vitest'
import { GameLocations } from '../../gameLocations/GameLocations'
import { CaravanTierId } from '../CaravanConst'
import { getReachableDestinations, getRoute, getTier } from './getRoute'

describe('getRoute', () => {
    test('trova la rotta indipendentemente dalla direzione', () => {
        const forward = getRoute(GameLocations.StartVillage, GameLocations.WoodVillage)
        const backward = getRoute(GameLocations.WoodVillage, GameLocations.StartVillage)
        expect(forward).toBeDefined()
        expect(backward).toBeDefined()
        expect(forward).toEqual(backward)
    })

    test('nessuna rotta per una coppia non configurata', () => {
        expect(getRoute(GameLocations.StartVillage, GameLocations.Test)).toBeUndefined()
    })
})

describe('getTier', () => {
    test('trova un tier esistente', () => {
        expect(getTier(CaravanTierId.Standard)?.id).toBe(CaravanTierId.Standard)
    })
})

describe('getReachableDestinations', () => {
    test('elenca le destinazioni raggiungibili da un luogo su una rotta', () => {
        expect(getReachableDestinations(GameLocations.StartVillage)).toEqual([GameLocations.WoodVillage])
        expect(getReachableDestinations(GameLocations.WoodVillage)).toEqual([GameLocations.StartVillage])
    })

    test('nessuna destinazione per un luogo senza rotte configurate', () => {
        expect(getReachableDestinations(GameLocations.Test)).toEqual([])
    })
})
