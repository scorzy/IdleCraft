import { GameState } from '../../game/GameState'
import { TreeGrowthAdapter } from './forestGrowth'
import { addTree } from './forestFunctions'
import { checkGrowTrees } from './checkGrowTrees'

export function growTree(state: GameState, id: string): void {
    const data = TreeGrowthAdapter.select(state.treeGrowth, id)
    if (data === undefined) return
    TreeGrowthAdapter.remove(state.treeGrowth, id)
    addTree(state, data.woodType, 1, data.location)
    checkGrowTrees(state, data.woodType, data.location)
}
