import { ActivityAdapter } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'
import { isWoodcutting } from '../Woodcutting'

export function getWoodcuttingTitle(state: GameState, id: string) {
    const data = ActivityAdapter.selectEx(state.activities, id)
    if (!isWoodcutting(data)) throw new Error('[getWoodcuttingIcon] Activity is not woodcutting')
    const t = selectTranslations(state)
    return t.fun.cutting(data.woodType)
}
