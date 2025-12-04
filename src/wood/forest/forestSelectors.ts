import { memoize as microMemoize } from 'micro-memoize'
import { memoize } from 'proxy-memoize'
import { ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { WoodData } from '../WoodData'
import { WoodTypes } from '../WoodTypes'
import { GameLocations } from '../../gameLocations/GameLocations'
import { TreeGrowthAdapter } from './forestGrowth'

export const selectDefaultForest = (_s: GameState, woodType: WoodTypes) => {
    const data = WoodData[woodType]
    return {
        hp: data.maxHp,
        qta: data.maxQta,
    }
}

export const selectForest = (state: GameState, woodType: WoodTypes) => {
    const forest = state.locations[state.location].forests[woodType]
    if (forest) return forest
    return selectDefaultForest(state, woodType)
}

export const selectTreeGrowthTime = () => 3 * 60e3
export const selectForestQta = (state: GameState, woodType: WoodTypes) => selectForest(state, woodType).qta

export const selectGrowingTrees = (s: GameState, woodType: WoodTypes) => {
    const ret: string[] = []
    for (const timerId of s.timers.ids) {
        const timer = s.timers.entries[timerId]
        if (timer && timer.type === ActivityTypes.Tree && timer.actId) {
            const tree = TreeGrowthAdapter.select(s.treeGrowth, timer.actId)
            if (tree && tree.location === s.location && tree.woodType === woodType) ret.push(timer.id)
        }
    }
    return ret
}

export const selectGrowingTreesMemo = (woodType: WoodTypes) =>
    microMemoize(
        memoize((s: GameState) => selectGrowingTrees(s, woodType)),
        { maxSize: 10 }
    )

export const selectGrowTreeNumber = (state: GameState, woodType: WoodTypes, location: GameLocations) =>
    TreeGrowthAdapter.count(state.treeGrowth, (t) => t.woodType === woodType && t.location === location)
