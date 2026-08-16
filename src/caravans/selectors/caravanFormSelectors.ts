import { GameState } from '../../game/GameState'
import { hasGold, hasItem } from '../../storage/storageFunctions'
import { CaravanTier, RouteConfig } from '../CaravanConst'
import { calcCargoValue, calcCost, calcDuration, calcTotalVolume } from '../functions/calcShipment'
import { getRoute, getTier } from '../functions/getRoute'
import { selectAvailableCaravanSlots } from './caravanSelectors'

const MS_PER_MINUTE = 60 * 1000

export function selectDispatchRoute(state: GameState): RouteConfig | undefined {
    const toId = state.caravanDispatchForm.toId
    return toId ? getRoute(state, toId) : undefined
}

export function selectDispatchTier(state: GameState): CaravanTier | undefined {
    const tierId = state.caravanDispatchForm.tierId
    return tierId ? getTier(tierId) : undefined
}

export function selectDispatchTotalVolume(state: GameState): number {
    return calcTotalVolume(state.caravanDispatchForm.cargo, state.craftedItems)
}

export function selectDispatchCargoValue(state: GameState): number {
    return calcCargoValue(state.caravanDispatchForm.cargo, state.craftedItems)
}

export function selectDispatchDurationMs(state: GameState): number {
    const route = selectDispatchRoute(state)
    const tier = selectDispatchTier(state)
    if (!route || !tier) return 0

    return calcDuration(route, tier, selectDispatchTotalVolume(state)) * MS_PER_MINUTE
}

export function selectDispatchCost(state: GameState): number {
    const route = selectDispatchRoute(state)
    const tier = selectDispatchTier(state)
    if (!route || !tier) return 0

    return calcCost(route, tier, selectDispatchTotalVolume(state), selectDispatchCargoValue(state))
}

export function selectDispatchHasCargo(state: GameState): boolean {
    return state.caravanDispatchForm.cargo.length > 0
}

export function selectDispatchHasEnoughCargo(state: GameState): boolean {
    if (!selectDispatchHasCargo(state)) return false

    return state.caravanDispatchForm.cargo.every((line) => hasItem(state, line.itemId, line.quantity, state.location))
}

export function selectDispatchHasEnoughGold(state: GameState): boolean {
    return hasGold(state, selectDispatchCost(state))
}

export function selectDispatchHasFreeSlot(state: GameState): boolean {
    return selectAvailableCaravanSlots(state) > 0
}

export function selectDispatchCargoQuantity(state: GameState, itemId: string): number {
    return state.caravanDispatchForm.cargo.find((line) => line.itemId === itemId)?.quantity ?? 0
}

export function canDispatch(state: GameState): boolean {
    return (
        !!selectDispatchRoute(state) &&
        !!selectDispatchTier(state) &&
        selectDispatchHasEnoughCargo(state) &&
        selectDispatchHasEnoughGold(state) &&
        selectDispatchHasFreeSlot(state)
    )
}
