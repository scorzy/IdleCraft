import { InitialState } from '@/entityAdapter/InitialState'
import { Item } from '../../items/Item'
import { selectGameItemFromCraft } from '../../storage/StorageSelectors'
import { StorageState } from '../../storage/storageTypes'
import { CaravanTier, RouteConfig, TIME_EXPONENT, VOLUME_REF } from '../CaravanConst'

export function calcTotalVolume(cargo: StorageState[], craftedItems: InitialState<Item>): number {
    let total = 0
    for (const line of cargo) total += (selectGameItemFromCraft(line.itemId, craftedItems)?.volume ?? 0) * line.quantity
    return total
}

export function calcCargoValue(cargo: StorageState[], craftedItems: InitialState<Item>): number {
    let total = 0
    for (const line of cargo) total += (selectGameItemFromCraft(line.itemId, craftedItems)?.value ?? 0) * line.quantity
    return total
}

export function calcDuration(route: RouteConfig, tier: CaravanTier, totalVolume: number): number {
    const loadFactor = Math.max(1, (totalVolume / VOLUME_REF) ** TIME_EXPONENT)
    return (route.baseMinutes / tier.speed) * loadFactor
}

export function calcCost(route: RouteConfig, tier: CaravanTier, totalVolume: number, cargoValue: number): number {
    const distanceFactor = route.baseMinutes / 20
    return distanceFactor * (totalVolume * tier.tariffFlat + cargoValue * tier.tariffPct)
}
