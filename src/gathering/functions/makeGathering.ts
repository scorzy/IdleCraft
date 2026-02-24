import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { GatheringZone } from '../gatheringZones'

export const makeGathering = (zone: GatheringZone) => makeAddActivity(ActivityTypes.Gathering, { zone })
