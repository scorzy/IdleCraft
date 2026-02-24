import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { GatheringSubZone } from '../gatheringZones'

export const makeGathering = (zone: GatheringSubZone) => makeAddActivity(ActivityTypes.Gathering, { zone })
