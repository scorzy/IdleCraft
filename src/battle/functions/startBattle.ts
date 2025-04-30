import { ActivityStartResult } from '../../activities/activityInterfaces'
import { ActivityTypes } from '../../activities/ActivityState'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'

export const startBattle = makeStartActivity((state: GameState, id: string) => {
    state = startTimer(state, 3e3, ActivityTypes.StartBattle, id)

    return { state, result: ActivityStartResult.Started }
})
