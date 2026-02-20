import { ActivityState } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { UiPages } from '../../ui/state/UiPages'

export const viewMiningVeinSearch = (state: GameState, _activity: ActivityState) => {
    state.ui.page = UiPages.Mining
}
