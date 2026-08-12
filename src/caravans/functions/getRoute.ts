import { GameLocations } from '../../gameLocations/GameLocations'
import { CARAVAN_ROUTES, CARAVAN_TIERS, CaravanTier, CaravanTierId, RouteConfig } from '../CaravanConst'

export function getRoute(fromId: GameLocations, toId: GameLocations): RouteConfig | undefined {
    return CARAVAN_ROUTES.find(
        (route) => (route.fromId === fromId && route.toId === toId) || (route.fromId === toId && route.toId === fromId)
    )
}

export function getTier(tierId: CaravanTierId): CaravanTier | undefined {
    return CARAVAN_TIERS.find((tier) => tier.id === tierId)
}
