import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'

export const makeMiningVeinSearch = makeAddActivity(ActivityTypes.MiningVeinSearch)
