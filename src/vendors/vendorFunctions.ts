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

export interface VendorPurchase {
    vendorType: VendorTypes
    itemId: string
    quantity: number
}

export function purchaseVendorItems(state: GameState, purchases: VendorPurchase[]): VendorPurchaseResult {
    let totalPrice = 0

    for (const purchase of purchases) {
        if (!Number.isSafeInteger(purchase.quantity) || purchase.quantity <= 0)
            return VendorPurchaseResult.InvalidQuantity

        const offer = getVendorOffer(state.location, purchase.vendorType, purchase.itemId)
        if (!offer) return VendorPurchaseResult.ItemNotSold

        const price = offer.unitPrice * purchase.quantity
        if (!Number.isSafeInteger(price) || !Number.isSafeInteger(totalPrice + price))
            return VendorPurchaseResult.InsufficientGold
        totalPrice += price
    }

    if (!hasGold(state, totalPrice)) return VendorPurchaseResult.InsufficientGold

    spendGold(state, totalPrice)
    for (const purchase of purchases) addItem(state, purchase.itemId, purchase.quantity)
    return VendorPurchaseResult.Success
}

export function purchaseVendorItem(
    state: GameState,
    vendorType: VendorTypes,
    itemId: string,
    quantity: number
): VendorPurchaseResult {
    return purchaseVendorItems(state, [{ vendorType, itemId, quantity }])
}

export function buyVendorItem(vendorType: VendorTypes, itemId: string, quantity: number): VendorPurchaseResult {
    let result = VendorPurchaseResult.ItemNotSold
    setState((state) => {
        result = purchaseVendorItem(state, vendorType, itemId, quantity)
    })
    return result
}
