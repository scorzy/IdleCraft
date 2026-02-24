import { removeItem } from '../storage/storageFunctions'
import { GameState } from '../game/GameState'
import { areRequirementsCompleted } from '../requirements/requirementFunctions'
import { RequirementType } from '../requirements/RequirementTypes'
import { setState } from '../game/setState'
import { GatheringSubZone, GatheringZone } from './gatheringZones'
import { GatheringMainZoneData, GatheringSubZoneData, ZoneImprovementsData } from './gatheringData'
import { addZoneExp, getZoneCurrentLevelExp, getZoneNextLevelExp } from './zoneExperience'

export function getSubZoneMainZone(subZone: GatheringSubZone): GatheringZone {
    return GatheringSubZoneData[subZone].zone
}

export function isSubZoneUnlocked(state: GameState, subZone: GatheringSubZone): boolean {
    return areRequirementsCompleted(state, GatheringSubZoneData[subZone].unlockRequirements)
}

export function selectMainZoneName(zone: GatheringZone) {
    return GatheringMainZoneData[zone].nameId
}

export function selectZoneProgress(state: GameState, zone: GatheringZone) {
    const progress = state.gatheringZones[zone]
    const current = getZoneCurrentLevelExp(progress.exp, progress.level)
    const next = getZoneNextLevelExp(progress.level)
    return { ...progress, currentLevelExp: current, nextLevelExp: next }
}

export function completeZoneImprovement(zone: GatheringZone, improvementId: string) {
    setState((state) => {
        const improvement = ZoneImprovementsData[zone].find((i) => i.id === improvementId)
        if (!improvement) return

        const progress = state.gatheringZones[zone]
        if (progress.completedImprovements[improvementId]) return
        if (!areRequirementsCompleted(state, improvement.requirements)) return

        for (const req of improvement.requirements) {
            if (req.type !== RequirementType.DeliverResource) continue
            removeItem(state, req.targetId, req.quantity)
            state.requirementProgress.delivered[req.targetId] =
                (state.requirementProgress.delivered[req.targetId] ?? 0) + req.quantity
        }

        progress.completedImprovements[improvementId] = true
        addZoneExp(state, zone, improvement.rewardZoneExp)
    })
}
