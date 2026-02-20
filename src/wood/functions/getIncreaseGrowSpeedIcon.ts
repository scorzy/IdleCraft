import { ActivityAdapter } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { isIncreaseGrowSpeed } from '../IncreaseGrowSpeed'

export function getIncreaseGrowSpeedIcon(state: GameState, id: string) {
    const data = ActivityAdapter.selectEx(state.activities, id)
    if (!isIncreaseGrowSpeed(data)) throw new Error('[getIncreaseGrowSpeedIcon] Activity is not IncreaseGrowSpeed')
    return Icons.Forest
}
