import { ActivityAdapter } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { selectItemName } from '../../items/selectors/selectItemName'
import { selectTranslations } from '../../msg/useTranslations'
import { isMarket } from '../Market'

export function getMarketTitle(state: GameState, id: string) {
    const data = ActivityAdapter.selectEx(state.activities, id)
    if (!isMarket(data)) throw new Error('[getMarketTitle] Activity is not market')
    const t = selectTranslations(state)
    const name = selectItemName(state, data.itemId)
    return name ? t.fun.selling(name) : t.t.MarketUnknownItem
}
