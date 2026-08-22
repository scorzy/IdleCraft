import { GameState } from '../game/GameState'
import { setState } from '../game/setState'
import { addItem, hasGold, spendGold } from '../storage/storageFunctions'
import { getVendorOffer } from './VendorData'
import { VendorTypes } from './VendorTypes'

export enum VendorPurchaseResult {
    Success = 'Success',
    InvalidQuantity = 'InvalidQuantity',
    ItemNotSold = 'ItemNotSold',
    InsufficientGold = 'InsufficientGold',
}

export function purchaseVendorItem(
    state: GameState,
    vendorType: VendorTypes,
    itemId: string,
    quantity: number
): VendorPurchaseResult {
    if (!Number.isSafeInteger(quantity) || quantity <= 0) return VendorPurchaseResult.InvalidQuantity

    const offer = getVendorOffer(state.location, vendorType, itemId)
    if (!offer) return VendorPurchaseResult.ItemNotSold

    const totalPrice = offer.unitPrice * quantity
    if (!Number.isSafeInteger(totalPrice) || !hasGold(state, totalPrice)) return VendorPurchaseResult.InsufficientGold

    spendGold(state, totalPrice)
    addItem(state, itemId, quantity)
    return VendorPurchaseResult.Success
}

export function buyVendorItem(vendorType: VendorTypes, itemId: string, quantity: number): VendorPurchaseResult {
    let result = VendorPurchaseResult.ItemNotSold
    setState((state) => {
        result = purchaseVendorItem(state, vendorType, itemId, quantity)
    })
    return result
}
