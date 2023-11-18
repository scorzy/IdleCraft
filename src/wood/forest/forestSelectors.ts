import { InitialState } from '../../entityAdapter/entityAdapter'
import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Timer, TimerTypes } from '../../timers/Timer'
import { memoize } from '../../utils/memoize'
import { memoizeOne } from '../../utils/memoizeOne'
import { ForestsState } from '../ForestsState'
import { WoodData } from '../WoodData'
import { WoodTypes } from '../WoodTypes'
import { WoodcuttingAdapter } from '../WoodcuttingAdapter'
import { TreeGrowth, TreeGrowthAdapter } from './forestGrowth'

export const selectDefaultForest = memoize(function selectDefaultForest(woodType: WoodTypes): ForestsState {
    const data = WoodData[woodType]
    return {
        hp: data.maxHp,
        qta: data.maxQta,
    }
})

export const selectForest = memoize((woodType: WoodTypes) => (state: GameState) => {
    const forest = state.locations[state.location].forests[woodType]
    if (forest) return forest
    return selectDefaultForest(woodType)
})

export const selectTreeGrowthTime = () => 60e3
export const selectForestQta = memoize((woodType: WoodTypes) => (state: GameState) => selectForest(woodType)(state).qta)

const selectGrowingTreesInt = (
    woodType: WoodTypes,
    location: GameLocations,
    treeGrowth: InitialState<TreeGrowth>,
    timers: InitialState<Timer>
) => {
    const ret: string[] = []
    for (const timerId of timers.ids) {
        const timer = timers.entries[timerId]
        if (timer && timer.type === TimerTypes.Tree && timer.actId) {
            const tree = TreeGrowthAdapter.select(treeGrowth, timer.actId)
            if (tree && tree.location === location && tree.woodType === woodType) ret.push(timer.id)
        }
    }
    return ret
}

export const selectGrowingTrees = memoize((woodType: WoodTypes) => {
    const memo = memoizeOne(selectGrowingTreesInt)
    return (state: GameState) => memo(woodType, state.location, state.treeGrowth, state.timers)
})

export const woodCuttingActId = memoize(
    (woodType: WoodTypes) => (state: GameState) =>
        WoodcuttingAdapter.find(state.woodcutting, (e) => e.woodType === woodType)
)
