import { GameState } from '../../game/GameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { CARAVAN_TIERS, CaravanTier, CaravanTierId, RouteConfig } from '../CaravanConst'

export function getRoute(state: GameState, toId: GameLocations): RouteConfig | undefined {
    return GameLocationAdapter.selectEx(state.locations, state.location).caravanRoutes.find(
        (route) => route.toId === toId
    )
}

export function getTier(tierId: CaravanTierId): CaravanTier | undefined {
    return CARAVAN_TIERS.find((tier) => tier.id === tierId)
}

export function getReachableDestinations(state: GameState): GameLocations[] {
    return GameLocationAdapter.selectEx(state.locations, state.location).caravanRoutes.map((route) => route.toId)
}
