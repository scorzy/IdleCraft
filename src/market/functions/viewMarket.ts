import { ActivityState } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { UiPages } from '../../ui/state/UiPages'
import { isMarket } from '../Market'

export const viewMarket = (state: GameState, activity: ActivityState) => {
    if (!isMarket(activity)) return

    state.ui.page = UiPages.Market
    state.ui.marketItemId = activity.itemId
}
