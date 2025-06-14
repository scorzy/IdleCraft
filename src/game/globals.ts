import { ActivityTypes } from '../activities/ActivityState'
import { Timer } from '../timers/Timer'
import { ActivityStartResult } from '../activities/activityInterfaces'
import { MapEx } from '../utils/MapEx'
import { Icons } from '../icons/Icons'
import { GameState } from './GameState'

export const activityExecutors = new MapEx<ActivityTypes, (state: GameState, timer: Timer) => GameState>()
export const activityRemovers = new MapEx<ActivityTypes, (state: GameState, activityId: string) => GameState>()
export const activityStarters = new MapEx<
    ActivityTypes,
    (state: GameState, activityId: string) => { state: GameState; result: ActivityStartResult }
>()
export const activityTitles = new MapEx<ActivityTypes, (state: GameState, activityId: string) => string>()
export const activityIcons = new MapEx<ActivityTypes, (state: GameState, activityId: string) => Icons>()
