import { GameState } from '../../game/GameState'
import { selectItemQta } from '../../storage/StorageSelectors'
import { getVendorPurchaseOption } from '../../vendors/VendorData'
import { purchaseVendorItems, VendorPurchaseResult } from '../../vendors/vendorFunctions'
import { RecipeResult } from '../RecipeInterfaces'

export interface CraftingPurchaseLine {
    itemId: string
    quantity: number
    unitPrice: number
    cost: number
}

export interface CraftingPurchasePlan {
    lines: CraftingPurchaseLine[]
    totalCost: number
    missingItemIds: string[]
    hasEnoughGold: boolean
    canCraft: boolean
}

export function getCraftingPurchasePlan(
    state: GameState,
    craftResult: RecipeResult | undefined,
    autoBuy: Record<string, boolean>
): CraftingPurchasePlan {
    if (!craftResult) return { lines: [], totalCost: 0, missingItemIds: [], hasEnoughGold: false, canCraft: false }

    const requiredByItem = new Map<string, number>()
    for (const requirement of craftResult.requirements)
        requiredByItem.set(requirement.itemId, (requiredByItem.get(requirement.itemId) ?? 0) + requirement.qta)

    const lines: CraftingPurchaseLine[] = []
    const missingItemIds: string[] = []
    let totalCost = 0
    let canCraft = true

    for (const [itemId, required] of requiredByItem) {
        const owned = selectItemQta(state.location, itemId)(state)
        const quantity = Math.max(0, required - owned)
        if (quantity === 0) continue

        const option = autoBuy[itemId] ? getVendorPurchaseOption(state.location, itemId) : undefined
        const cost = option ? option.unitPrice * quantity : 0
        if (!option || !Number.isSafeInteger(quantity) || !Number.isSafeInteger(cost)) {
            missingItemIds.push(itemId)
            canCraft = false
            continue
        }

        lines.push({ itemId, quantity, unitPrice: option.unitPrice, cost })
        if (!Number.isSafeInteger(totalCost + cost)) canCraft = false
        else totalCost += cost
    }

    const hasEnoughGold = totalCost <= state.gold
    if (!hasEnoughGold) canCraft = false
    return { lines, totalCost, missingItemIds, hasEnoughGold, canCraft }
}

export function purchaseCraftingRequirements(
    state: GameState,
    craftResult: RecipeResult,
    autoBuy: Record<string, boolean>
): boolean {
    const plan = getCraftingPurchasePlan(state, craftResult, autoBuy)
    if (!plan.canCraft) return false

    const purchases = plan.lines.map((line) => {
        const option = getVendorPurchaseOption(state.location, line.itemId)
        if (!option) throw new Error(`Vendor offer disappeared for ${line.itemId}`)
        return { vendorType: option.vendorType, itemId: line.itemId, quantity: line.quantity }
    })

    return purchases.length === 0 || purchaseVendorItems(state, purchases) === VendorPurchaseResult.Success
}
