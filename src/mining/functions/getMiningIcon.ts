import { GameState } from '../../game/GameState'
import { MiningAdapter } from '../MiningAdapter'
import { OreData } from '../OreData'

export function getMiningIcon(state: GameState, id: string) {
    const data = MiningAdapter.selectEx(state.mining, id)
    return OreData[data.oreType].icon
}
