import { Requirement } from '../requirements/RequirementTypes'
import { GatheringSubZone, GatheringZone } from './gatheringZones'

export interface ZoneImprovement {
    id: string
    name: string
    description: string
    requirements: Requirement[]
    rewardZoneExp: number
}

export interface GatheringZoneProgress {
    exp: number
    level: number
    completedImprovements: Record<string, boolean>
}

export type GatheringZoneProgressState = Record<GatheringZone, GatheringZoneProgress>

export interface SubZoneConfig {
    id: GatheringSubZone
    zone: GatheringZone
    name: string
    gatheringTime: number
    config: import('./gatheringTypes').GatheringZoneConfig
    unlockRequirements: Requirement[]
}
