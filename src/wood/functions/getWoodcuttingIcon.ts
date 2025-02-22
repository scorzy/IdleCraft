import { ActivityAdapter } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { isWoodcutting } from '../Woodcutting'
import { WoodData } from '../WoodData'

export function getWoodcuttingIcon(state: GameState, id: string) {
    const data = ActivityAdapter.selectEx(state.activities, id)
    if (!isWoodcutting(data)) throw new Error('[getWoodcuttingIcon] Activity is not woodcutting')
    return WoodData[data.woodType].iconId
}
