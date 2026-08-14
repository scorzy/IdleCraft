import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { setState } from '../../game/setState'

const makeMarket = (itemId: string) => makeAddActivity(ActivityTypes.Market, { itemId })

export const addMarket = (itemId: string) => setState((s) => makeMarket(itemId)(s))
