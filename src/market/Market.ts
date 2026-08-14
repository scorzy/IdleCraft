import { ActivityState, ActivityTypes } from '../activities/ActivityState'

export interface Market extends ActivityState {
    itemId: string
}
export function isMarket(act: ActivityState | Market): act is Market {
    return act.type === ActivityTypes.Market
}
