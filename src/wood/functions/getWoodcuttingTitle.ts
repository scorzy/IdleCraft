import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'
import { WoodcuttingAdapter } from '../WoodcuttingAdapter'

export function getWoodcuttingTitle(state: GameState, id: string) {
    const data = WoodcuttingAdapter.selectEx(state.woodcutting, id)
    const t = selectTranslations(state)
    return t.fun.cutting(data.woodType)
}
