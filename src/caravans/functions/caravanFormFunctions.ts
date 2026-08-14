import { GameState } from '../../game/GameState'
import { setState } from '../../game/setState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { StorageAdapter } from '../../storage/storageAdapter'
import { StorageState } from '../../storage/storageTypes'
import { CaravanTierId } from '../CaravanConst'
import { dispatch, DispatchResult } from './dispatch'
import { recall } from './recall'

export function resetCaravanForm(state: GameState): void {
    state.caravanDispatchForm = { toId: undefined, tierId: undefined, cargo: [] }
}

export function setCaravanDestination(state: GameState, toId: GameLocations): void {
    state.caravanDispatchForm.toId = toId
}
export const setCaravanDestinationUi = (toId: GameLocations) => setState((state) => setCaravanDestination(state, toId))

export function setCaravanTier(state: GameState, tierId: CaravanTierId): void {
    state.caravanDispatchForm.tierId = tierId
}
export const setCaravanTierUi = (tierId: CaravanTierId) => setState((state) => setCaravanTier(state, tierId))

export function setCargoLineQty(state: GameState, itemId: string, quantity: number): void {
    const cargo = state.caravanDispatchForm.cargo
    const idx = cargo.findIndex((line) => line.itemId === itemId)

    if (quantity <= 0) {
        if (idx >= 0) cargo.splice(idx, 1)
        return
    }

    const existing = idx >= 0 ? cargo[idx] : undefined
    if (existing) existing.quantity = quantity
    else cargo.push({ itemId, quantity })
}
export const setCargoLineQtyUi = (itemId: string, quantity: number) =>
    setState((state) => setCargoLineQty(state, itemId, quantity))

export function addCargoItem(state: GameState, itemId: string): void {
    const storage = GameLocationAdapter.selectEx(state.locations, state.location).storage
    const available = StorageAdapter.select(storage, itemId)?.quantity ?? 0
    if (available <= 0) return
    setCargoLineQty(state, itemId, available)
}
export const addCargoItemUi = (itemId: string) => setState((state) => addCargoItem(state, itemId))

export function removeCargoLine(state: GameState, itemId: string): void {
    state.caravanDispatchForm.cargo = state.caravanDispatchForm.cargo.filter((line) => line.itemId !== itemId)
}
export const removeCargoLineUi = (itemId: string) => setState((state) => removeCargoLine(state, itemId))

export function loadAllStorageAsCargo(state: GameState): void {
    const storage = GameLocationAdapter.selectEx(state.locations, state.location).storage
    const cargo: StorageState[] = []
    StorageAdapter.forEach(storage, (entry) => cargo.push({ itemId: entry.itemId, quantity: entry.quantity }))
    state.caravanDispatchForm.cargo = cargo
}
export const loadAllStorageAsCargoUi = () => setState(loadAllStorageAsCargo)

export function selectShipmentInUi(state: GameState, shipmentId: string | null): void {
    state.ui.selectedShipmentId = shipmentId
}
export const selectShipmentUi = (shipmentId: string | null) =>
    setState((state) => selectShipmentInUi(state, shipmentId))

export function confirmDispatch(state: GameState): DispatchResult {
    const form = state.caravanDispatchForm
    if (!form.toId || !form.tierId) return DispatchResult.InvalidRoute

    const { result, shipmentId } = dispatch(state, { toId: form.toId, tierId: form.tierId, cargo: [...form.cargo] })
    if (result === DispatchResult.Dispatched) {
        resetCaravanForm(state)
        state.ui.selectedShipmentId = shipmentId ?? null
    }
    return result
}
// setState's mutative recipe must mutate-and-return-nothing OR return-without-mutating, never both, so these wrappers discard the result enum that confirmDispatch/recall return for direct callers (e.g. tests).
export const confirmDispatchUi = () =>
    setState((state) => {
        confirmDispatch(state)
    })

export const recallShipmentUi = (shipmentId: string) =>
    setState((state) => {
        recall(state, shipmentId)
    })

export const caravanOnItemDecrease = (
    state: GameState,
    itemId: string,
    location: GameLocations,
    newQuantity: number
): void => {
    if (location !== state.location) return

    const line = state.caravanDispatchForm.cargo.find((l) => l.itemId === itemId)
    if (!line || line.quantity <= newQuantity) return

    setCargoLineQty(state, itemId, newQuantity)
}

export const caravanOnItemRemove = (state: GameState, itemId: string, location: GameLocations): void => {
    if (location !== state.location) return

    removeCargoLine(state, itemId)
}
