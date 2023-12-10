import { GameState } from '../../game/GameState'
import { TreeGrowthAdapter } from './forestGrowth'
import { addTree } from './forestFunctions'

export function growTree(state: GameState, id: string): GameState {
    const data = TreeGrowthAdapter.select(state.treeGrowth, id)
    if (data === undefined) return state
    state = { ...state, treeGrowth: TreeGrowthAdapter.remove(state.treeGrowth, id) }
    return addTree(state, data.woodType, 1, data.location)
}
