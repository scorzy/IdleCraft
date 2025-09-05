import { createSelector } from 'reselect'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Timer } from '../../timers/Timer'
import { myMemoize } from '../../utils/myMemoize'
import { WoodData } from '../WoodData'
import { WoodTypes } from '../WoodTypes'
import { isWoodcutting } from '../Woodcutting'
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

export const selectForest = myMemoize((woodType: WoodTypes) => (state: GameState) => {
    const forest = state.locations[state.location].forests[woodType]
    if (forest) return forest
    return selectDefaultForest(state, woodType)
})

export const selectTreeGrowthTime = () => 60e3
export const selectForestQta = myMemoize(
    (woodType: WoodTypes) => (state: GameState) => selectForest(woodType)(state).qta
)

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

export const woodCuttingActId = myMemoize(
    (woodType: WoodTypes) => (state: GameState) =>
        ActivityAdapter.find(state.activities, (e) => isWoodcutting(e) && e.woodType === woodType)
)
