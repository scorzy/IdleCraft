import { setState } from '../../game/setState'
import { GatheringSubZone } from '../gatheringZones'
import { makeGathering } from './makeGathering'

export const addGathering = (zone: GatheringSubZone) => setState((s) => makeGathering(zone)(s))
