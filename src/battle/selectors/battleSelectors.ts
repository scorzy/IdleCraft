import { ActivityAdapter } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { isBattle } from '../BattleTypes'

export const getBattleActivity = (state: GameState, id: string) => {
    const data = ActivityAdapter.selectEx(state.activities, id)
    if (!isBattle(data)) throw new Error(`Activity ${id} is not a battle`)
    return data
}
