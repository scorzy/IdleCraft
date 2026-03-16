import { GameState } from '../../game/GameState'
import { checkGrowTrees } from './checkGrowTrees'
import { addTree } from './forestFunctions'
import { TreeGrowthAdapter } from './forestGrowth'

export function growTree(state: GameState, id: string): void {
    const data = TreeGrowthAdapter.select(state.treeGrowth, id)
    if (data === undefined) return
    TreeGrowthAdapter.remove(state.treeGrowth, id)
    addTree(state, data.woodType, 1, data.location)
    checkGrowTrees(state, data.woodType, data.location)
}
