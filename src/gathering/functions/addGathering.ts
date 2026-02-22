import { setState } from '../../game/setState'
import { GatheringZone } from '../gatheringZones'
import { makeGathering } from './makeGathering'

export const addGathering = (zone: GatheringZone) => setState((s) => makeGathering(zone)(s))
