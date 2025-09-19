import { ActivityState } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { UiPages } from '../../ui/state/UiPages'
import { isMining } from '../Mining'

export const viewMining = (state: GameState, activity: ActivityState) => {
    if (!isMining(activity)) return

    state.ui.page = UiPages.Mining
    state.ui.oreType = activity.oreType
}
