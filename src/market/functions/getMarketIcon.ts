import { ActivityAdapter } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { selectGameItem } from '../../storage/StorageSelectors'
import { isMarket } from '../Market'

export function getMarketIcon(state: GameState, id: string) {
    const data = ActivityAdapter.selectEx(state.activities, id)
    if (!isMarket(data)) throw new Error('[getMarketIcon] Activity is not market')
    return selectGameItem(data.itemId)(state)?.icon ?? Icons.Market
}
