import { createSelector } from 'reselect'
import { ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Timer } from '../../timers/Timer'
import { WoodData } from '../WoodData'
import { WoodTypes } from '../WoodTypes'
import { createDeepEqualSelector } from '../../utils/createDeepEqualSelector'
import { TreeGrowth, TreeGrowthAdapter } from './forestGrowth'
import { InitialState } from '@/entityAdapter/InitialState'

export const selectDefaultForest = createSelector([(_s: GameState, woodType: WoodTypes) => woodType], (woodType) => {
    const data = WoodData[woodType]
    return {
        hp: data.maxHp,
        qta: data.maxQta,
    }
})

export const selectForest = (state: GameState, woodType: WoodTypes) => {
    const forest = state.locations[state.location].forests[woodType]
    if (forest) return forest
    return selectDefaultForest(state, woodType)
}

export const selectTreeGrowthTime = () => 60e3
export const selectForestQta = (state: GameState, woodType: WoodTypes) => selectForest(state, woodType).qta

const selectGrowingTreesInt = (
    woodType: WoodTypes,
    location: GameLocations,
    treeGrowth: InitialState<TreeGrowth>,
    timers: InitialState<Timer>
) => {
    const ret: string[] = []
    for (const timerId of timers.ids) {
        const timer = timers.entries[timerId]
        if (timer && timer.type === ActivityTypes.Tree && timer.actId) {
            const tree = TreeGrowthAdapter.select(treeGrowth, timer.actId)
            if (tree && tree.location === location && tree.woodType === woodType) ret.push(timer.id)
        }
    }
    return ret
}

export const selectGrowingTrees = createDeepEqualSelector(
    [
        (s: GameState) => s.location,
        (s: GameState) => s.treeGrowth,
        (s: GameState) => s.timers,
        (_s: GameState, woodType: WoodTypes) => woodType,
    ],
    (location, treeGrowth, timers, woodType) => selectGrowingTreesInt(woodType, location, treeGrowth, timers)
)
