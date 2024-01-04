import { GameState } from '../../game/GameState'
import { WoodData } from '../WoodData'
import { WoodcuttingAdapter } from '../WoodcuttingAdapter'

export function getWoodcuttingIcon(state: GameState, id: string) {
    const data = WoodcuttingAdapter.selectEx(state.woodcutting, id)
    return WoodData[data.woodType].iconId
}
