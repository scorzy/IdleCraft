import { ActivityState } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { UiPages } from '../../ui/state/UiPages'
import { isIncreaseGrowSpeed } from '../IncreaseGrowSpeed'

export const viewIncreaseGrowSpeed = (state: GameState, activity: ActivityState) => {
    if (!isIncreaseGrowSpeed(activity)) return

    state.ui.page = UiPages.Woodcutting
    state.ui.woodType = activity.woodType
}
