import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'
import { MiningAdapter } from '../MiningAdapter'
import { OreData } from '../OreData'

export function getMiningTitle(state: GameState, id: string) {
    const data = MiningAdapter.selectEx(state.mining, id)
    const t = selectTranslations(state)
    return t.fun.mining(OreData[data.oreType].nameId)
}
