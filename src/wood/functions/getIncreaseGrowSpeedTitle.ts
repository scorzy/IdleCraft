import { ActivityAdapter } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'
import { isIncreaseGrowSpeed } from '../IncreaseGrowSpeed'

export function getIncreaseGrowSpeedTitle(state: GameState, id: string) {
    const data = ActivityAdapter.selectEx(state.activities, id)
    if (!isIncreaseGrowSpeed(data)) throw new Error('[getIncreaseGrowSpeedTitle] Activity is not IncreaseGrowSpeed')

    const tr = selectTranslations(state)
    return `${tr.t.IncreaseGrowSpeed} ${data.woodType}`
}
