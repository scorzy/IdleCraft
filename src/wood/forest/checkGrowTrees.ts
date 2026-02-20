import { ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { startTimer } from '../../timers/startTimer'
import { getUniqueId } from '../../utils/getUniqueId'
import { MAX_GROWING_TREES } from '../WoodConst'
import { WoodTypes } from '../WoodTypes'
import { TreeGrowth, TreeGrowthAdapter } from './forestGrowth'
import { selectDefaultForest, selectGrowTreeNumber, selectTreeGrowthTime } from './forestSelectors'
import { selectGrowSpeedBonusMultiplier } from './growSpeedSelectors'

export const checkGrowTrees = (state: GameState, woodType: WoodTypes, location: GameLocations) => {
    const number = selectGrowTreeNumber(state, woodType, location)
    if (number >= MAX_GROWING_TREES) return

    const forest = state.locations[state.location].forests[woodType]
    if (!forest) return

    const def = selectDefaultForest(state, woodType)
    if (forest.qta + number >= def.qta) return

    const growthTime = Math.round(selectTreeGrowthTime() / selectGrowSpeedBonusMultiplier(state, woodType, location))
    const treeData: TreeGrowth = { id: getUniqueId(), location, woodType }
    TreeGrowthAdapter.create(state.treeGrowth, treeData)
    startTimer(state, growthTime, ActivityTypes.Tree, treeData.id)
}
