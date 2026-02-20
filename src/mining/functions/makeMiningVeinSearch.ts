import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { OreTypes } from '../OreTypes'

export const makeMiningVeinSearch = (oreType: OreTypes) => makeAddActivity(ActivityTypes.MiningVeinSearch, { oreType })
