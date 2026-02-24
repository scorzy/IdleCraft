export enum RequirementType {
    KillMonster = 'KillMonster',
    ConsumeResource = 'ConsumeResource',
    DeliverResource = 'DeliverResource',
    ReachZoneLevel = 'ReachZoneLevel',
}

export interface Requirement {
    id: string
    type: RequirementType
    targetId: string
    quantity: number
    zoneId?: string
}

export interface RequirementProgress {
    kills: Record<string, number>
    consumed: Record<string, number>
    delivered: Record<string, number>
}
