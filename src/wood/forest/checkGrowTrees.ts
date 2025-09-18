import { ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { startTimer } from '../../timers/startTimer'
import { getUniqueId } from '../../utils/getUniqueId'
import { MAX_GROWING_TREES } from '../WoodConst'
import { WoodTypes } from '../WoodTypes'
import { TreeGrowth, TreeGrowthAdapter } from './forestGrowth'
import { selectGrowTreeNumber, selectTreeGrowthTime } from './forestSelectors'

export const checkGrowTrees = (state: GameState, woodType: WoodTypes, location: GameLocations) => {
    if (selectGrowTreeNumber(state, woodType, location) >= MAX_GROWING_TREES) return

    const growthTime = selectTreeGrowthTime()
    const treeData: TreeGrowth = { id: getUniqueId(), location, woodType }
    TreeGrowthAdapter.create(state.treeGrowth, treeData)
    startTimer(state, growthTime, ActivityTypes.Tree, treeData.id)
}
