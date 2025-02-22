import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { OreTypes } from '../OreTypes'

export const makeMining = (oreType: OreTypes) => makeAddActivity(ActivityTypes.Mining, { oreType, isMining: true })
