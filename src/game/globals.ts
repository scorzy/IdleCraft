import { ActivityState, ActivityTypes } from '../activities/ActivityState'
import { ActivityStartResult } from '../activities/activityInterfaces'
import { Icons } from '../icons/Icons'
import { Timer } from '../timers/Timer'
import { MapEx } from '../utils/MapEx'
import { GameState } from './GameState'

export const activityExecutors = new MapEx<ActivityTypes, (state: GameState, timer: Timer) => void>()
export const activityRemovers = new MapEx<ActivityTypes, (state: GameState, activityId: string) => void>()
export const activityStarters = new MapEx<
    ActivityTypes,
    (state: GameState, activityId: string) => ActivityStartResult
>()
export const activityTitles = new MapEx<ActivityTypes, (state: GameState, activityId: string) => string>()
export const activityIcons = new MapEx<ActivityTypes, (state: GameState, activityId: string) => Icons>()
export const activityViewers = new MapEx<ActivityTypes, (state: GameState, activity: ActivityState) => void>()
