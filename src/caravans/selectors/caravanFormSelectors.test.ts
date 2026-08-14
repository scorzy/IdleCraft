import { describe, expect, test } from 'vitest'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { addItem } from '../../storage/storageFunctions'
import { CaravanTierId } from '../CaravanConst'
import { calcCargoValue, calcCost, calcDuration, calcTotalVolume } from '../functions/calcShipment'
import { setCaravanDestination, setCaravanTier, setCargoLineQty } from '../functions/caravanFormFunctions'
import { getRoute, getTier } from '../functions/getRoute'
import {
    canDispatch,
    selectDispatchCargoQuantity,
    selectDispatchCargoValue,
    selectDispatchCost,
    selectDispatchDurationMs,
    selectDispatchHasCargo,
    selectDispatchHasEnoughCargo,
    selectDispatchHasEnoughGold,
    selectDispatchHasFreeSlot,
    selectDispatchIsTierUnlocked,
    selectDispatchRoute,
    selectDispatchTier,
    selectDispatchTotalVolume,
} from './caravanFormSelectors'

function stateReady() {
    const state = GetInitialGameState()
    state.gold = 1_000_000
    addItem(state, 'OakLog', 500, GameLocations.StartVillage)
    return state
}

describe('senza selezioni', () => {
    test('nessuna rotta/tier, costo e durata a zero, non spedibile', () => {
        const state = stateReady()

        expect(selectDispatchRoute(state)).toBeUndefined()
        expect(selectDispatchTier(state)).toBeUndefined()
        expect(selectDispatchCost(state)).toBe(0)
        expect(selectDispatchDurationMs(state)).toBe(0)
        expect(selectDispatchHasCargo(state)).toBe(false)
        expect(canDispatch(state)).toBe(false)
    })
})

describe('selectDispatchTotalVolume / selectDispatchCargoValue', () => {
    test('sommano i valori del cargo selezionato', () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 100)

        const totalVolume = calcTotalVolume(state.caravanDispatchForm.cargo, state.craftedItems)
        const cargoValue = calcCargoValue(state.caravanDispatchForm.cargo, state.craftedItems)

        expect(selectDispatchTotalVolume(state)).toBeCloseTo(totalVolume)
        expect(selectDispatchCargoValue(state)).toBeCloseTo(cargoValue)
    })
})

describe('selectDispatchDurationMs / selectDispatchCost', () => {
    test('coerenti con le formule pure quando rotta e tier sono selezionati', () => {
        const state = stateReady()
        setCaravanDestination(state, GameLocations.WoodVillage)
        setCaravanTier(state, CaravanTierId.Standard)
        setCargoLineQty(state, 'OakLog', 100)

        const route = getRoute(GameLocations.StartVillage, GameLocations.WoodVillage)!
        const tier = getTier(CaravanTierId.Standard)!
        const totalVolume = calcTotalVolume(state.caravanDispatchForm.cargo, state.craftedItems)
        const cargoValue = selectDispatchCargoValue(state)

        expect(selectDispatchDurationMs(state)).toBeCloseTo(calcDuration(route, tier, totalVolume) * 60_000)
        expect(selectDispatchCost(state)).toBeCloseTo(calcCost(route, tier, totalVolume, cargoValue))
    })
})

describe('selectDispatchCargoQuantity', () => {
    test("restituisce 0 se l'item non è nel cargo", () => {
        const state = stateReady()
        expect(selectDispatchCargoQuantity(state, 'OakLog')).toBe(0)
    })

    test("restituisce la quantità già presente nel cargo per quell'item", () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 150)
        expect(selectDispatchCargoQuantity(state, 'OakLog')).toBe(150)
        expect(selectDispatchCargoQuantity(state, 'CopperOre')).toBe(0)
    })
})

describe('canDispatch', () => {
    test('form completo e valido -> true', () => {
        const state = stateReady()
        setCaravanDestination(state, GameLocations.WoodVillage)
        setCaravanTier(state, CaravanTierId.Standard)
        setCargoLineQty(state, 'OakLog', 100)

        expect(canDispatch(state)).toBe(true)
    })

    test('cargo superiore allo storage disponibile -> false', () => {
        const state = stateReady()
        setCaravanDestination(state, GameLocations.WoodVillage)
        setCaravanTier(state, CaravanTierId.Standard)
        setCargoLineQty(state, 'OakLog', 10_000)

        expect(selectDispatchHasEnoughCargo(state)).toBe(false)
        expect(canDispatch(state)).toBe(false)
    })

    test('oro insufficiente -> false', () => {
        const state = stateReady()
        state.gold = 0
        setCaravanDestination(state, GameLocations.WoodVillage)
        setCaravanTier(state, CaravanTierId.Standard)
        setCargoLineQty(state, 'OakLog', 100)

        expect(selectDispatchHasEnoughGold(state)).toBe(false)
        expect(canDispatch(state)).toBe(false)
    })

    test('nessuno slot libero -> false', () => {
        const state = stateReady()
        state.caravanSlots = 0
        setCaravanDestination(state, GameLocations.WoodVillage)
        setCaravanTier(state, CaravanTierId.Standard)
        setCargoLineQty(state, 'OakLog', 100)

        expect(selectDispatchHasFreeSlot(state)).toBe(false)
        expect(canDispatch(state)).toBe(false)
    })

    test('tier non sbloccato -> false', () => {
        const state = stateReady()
        setCaravanDestination(state, GameLocations.WoodVillage)
        setCaravanTier(state, CaravanTierId.FastCourier)
        setCargoLineQty(state, 'OakLog', 100)

        expect(selectDispatchIsTierUnlocked(state)).toBe(false)
        expect(canDispatch(state)).toBe(false)
    })
})
