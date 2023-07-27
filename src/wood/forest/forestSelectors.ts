import { GameState } from '../../game/GameState'
import { WoodTypes } from '../WoodTypes'
import { selectDefaultForest } from './forestFunctions'
export const selectForest = (woodType: WoodTypes) => (state: GameState) => {
    const forest = state.locations[state.location].forests[woodType]
    if (forest) return forest
    return selectDefaultForest(woodType)
}
export const selectTreeGrowthTime = () => 10e3
export const selectForestQta = (woodType: WoodTypes) => (state: GameState) => selectForest(woodType)(state).qta
