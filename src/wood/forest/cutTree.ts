import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { WoodTypes } from '../WoodTypes'
import { getUniqueId } from '../../utils/getUniqueId'
import { startTimer } from '../../timers/startTimer'
import { ActivityTypes } from '../../activities/ActivityState'
import { selectDefaultForest, selectTreeGrowthTime } from './forestSelectors'
import { TreeGrowth, TreeGrowthAdapter } from './forestGrowth'

export function cutTree(
    state: GameState,
    woodType: WoodTypes,
    damage: number,
    location: GameLocations
): {
    cut: boolean
} {
    const forest = state.locations[location].forests[woodType]

    let qta: number
    let curHp: number

    const def = selectDefaultForest(state, woodType)
    if (forest) {
        qta = forest.qta
        curHp = forest.hp
    } else {
        qta = def.qta
        curHp = def.hp
    }

    let hp = curHp - damage
    let cut = false

    if (hp <= 0) {
        hp = def.hp
        qta = Math.max(0, qta - 1)
        cut = true

        const growthTime = selectTreeGrowthTime()
        const treeData: TreeGrowth = {
            id: getUniqueId(),
            location,
            woodType,
        }
        TreeGrowthAdapter.create(state.treeGrowth, treeData)
        startTimer(state, growthTime, ActivityTypes.Tree, treeData.id)
    }

    state.locations[location].forests[woodType] = {
        hp,
        qta,
    }

    return { cut }
}
