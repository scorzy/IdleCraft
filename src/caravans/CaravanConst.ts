import { GameLocations } from '../gameLocations/GameLocations'

export const VOLUME_REF = 1000
export const TIME_EXPONENT = 0.3

export const RAW_VOLUME = 1.0
export const REFINED_VOLUME = 0.3
export const FINISHED_VOLUME = 0.1

export enum CaravanTierId {
    HeavyCart = 'heavy_cart',
    Standard = 'standard',
    FastCourier = 'fast_courier',
}

export interface CaravanTier {
    id: CaravanTierId
    speed: number
    tariffFlat: number
    tariffPct: number
}

export const CARAVAN_TIERS: CaravanTier[] = [
    { id: CaravanTierId.HeavyCart, speed: 0.33, tariffFlat: 0.5, tariffPct: 0.002 },
    { id: CaravanTierId.Standard, speed: 1.0, tariffFlat: 2, tariffPct: 0.005 },
    { id: CaravanTierId.FastCourier, speed: 3.0, tariffFlat: 8, tariffPct: 0.02 },
]

export enum RouteCategory {
    Nearby = 'Nearby',
    Medium = 'Medium',
    Far = 'Far',
}

export const ROUTE_CATEGORY_MINUTES: Record<RouteCategory, number> = {
    [RouteCategory.Nearby]: 20,
    [RouteCategory.Medium]: 40,
    [RouteCategory.Far]: 80,
}

export interface RouteConfig {
    toId: GameLocations
    baseMinutes: number
}

export const DEFAULT_CARAVAN_SLOTS = 2
