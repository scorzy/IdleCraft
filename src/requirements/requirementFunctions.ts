import { GameState } from '../game/GameState'
import { GatheringZone } from '../gathering/gatheringZones'
import { Requirement, RequirementType } from './RequirementTypes'

export function getRequirementProgress(state: GameState, req: Requirement): number {
    if (req.type === RequirementType.KillMonster) return state.requirementProgress.kills[req.targetId] ?? 0
    if (req.type === RequirementType.ConsumeResource) return state.requirementProgress.consumed[req.targetId] ?? 0
    if (req.type === RequirementType.DeliverResource) return state.requirementProgress.delivered[req.targetId] ?? 0
    if (req.type === RequirementType.ReachZoneLevel) {
        if (!req.zoneId) return 0
        return state.gatheringZones[req.zoneId as GatheringZone]?.level ?? 0
    }
    return 0
}

export function isRequirementCompleted(state: GameState, req: Requirement): boolean {
    return getRequirementProgress(state, req) >= req.quantity
}

export function areRequirementsCompleted(state: GameState, reqs: Requirement[]): boolean {
    return reqs.every((req) => isRequirementCompleted(state, req))
}

export function addRequirementProgress(
    value: Record<string, number>,
    targetId: string,
    quantity: number
): Record<string, number> {
    value[targetId] = (value[targetId] ?? 0) + quantity
    return value
}
