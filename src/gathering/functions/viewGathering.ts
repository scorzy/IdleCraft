import { ActivityState } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { UiPages } from '../../ui/state/UiPages'
import { isGathering } from '../Gathering'

export const viewGathering = (state: GameState, activity: ActivityState) => {
    if (!isGathering(activity)) return

    state.ui.page = UiPages.Gathering
    state.ui.gatheringZone = activity.zone
}
