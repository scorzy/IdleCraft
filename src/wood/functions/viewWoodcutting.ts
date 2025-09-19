import { ActivityState } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { UiPages } from '../../ui/state/UiPages'
import { isWoodcutting } from '../Woodcutting'

export const viewWoodcutting = (state: GameState, activity: ActivityState) => {
    if (!isWoodcutting(activity)) return

    state.ui.page = UiPages.Woodcutting
    state.ui.woodType = activity.woodType
}
