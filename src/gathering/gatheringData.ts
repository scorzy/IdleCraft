import { Item } from '../items/Item'
import { RequirementType } from '../requirements/RequirementTypes'
import { GatheringZoneConfig, Rarity, ZoneImprovementConfig } from './gatheringTypes'
import { forestGatheringConfig } from './forestGathering'
import { GatheringSubZone, GatheringZone } from './gatheringZones'
import { GatheringZoneProgressState, SubZoneConfig } from './zoneProgressionTypes'

const spiderNestConfig: GatheringZoneConfig = {
    ...forestGatheringConfig,
    bonusRolls: [
        { rarity: Rarity.Common, chance: 45 },
        { rarity: Rarity.Uncommon, chance: 35 },
        { rarity: Rarity.Rare, chance: 20 },
    ],
}

export const GatheringSubZoneData: Record<GatheringSubZone, SubZoneConfig> = {
    [GatheringSubZone.ForestNormal]: {
        id: GatheringSubZone.ForestNormal,
        zone: GatheringZone.Forest,
        name: 'Normal',
        gatheringTime: 3000,
        config: forestGatheringConfig,
        unlockRequirements: [],
    },
    [GatheringSubZone.ForestSpiderNest]: {
        id: GatheringSubZone.ForestSpiderNest,
        zone: GatheringZone.Forest,
        name: 'Spider Nest',
        gatheringTime: 3000,
        config: spiderNestConfig,
        unlockRequirements: [
            { id: 'forest_spider_wolf', type: RequirementType.KillMonster, targetId: 'Wolf', quantity: 10 },
        ],
    },
}

export const GatheringZoneSubZones: Record<GatheringZone, GatheringSubZone[]> = {
    [GatheringZone.Forest]: [GatheringSubZone.ForestNormal, GatheringSubZone.ForestSpiderNest],
}

export const ZoneImprovementsData: Record<GatheringZone, ZoneImprovementConfig[]> = {
    [GatheringZone.Forest]: [
        {
            id: 'forest_build_fence',
            name: 'Build a Fence',
            description: 'Deliver planks to secure gathering routes.',
            requirements: [
                {
                    id: 'forest_build_fence_planks',
                    type: RequirementType.DeliverResource,
                    targetId: 'DeadTreePlank',
                    quantity: 20,
                },
            ],
            rewardZoneExp: 150,
        },
    ],
}

export const InitialGatheringZoneProgress: GatheringZoneProgressState = {
    [GatheringZone.Forest]: {
        exp: 0,
        level: 0,
        completedImprovements: {},
    },
}

export const GatheringMainZoneData: Record<GatheringZone, { nameId: 'Forest' }> = {
    [GatheringZone.Forest]: { nameId: 'Forest' },
}

export const RarityLabel: Record<Rarity, string> = {
    [Rarity.Common]: 'Common',
    [Rarity.Uncommon]: 'Uncommon',
    [Rarity.Rare]: 'Rare',
}

export function selectSubZoneLootTable(subZone: GatheringSubZone): { rarity: Rarity; items: Item['id'][] }[] {
    const resources = GatheringSubZoneData[subZone].config.resources
    return [Rarity.Common, Rarity.Uncommon, Rarity.Rare].map((rarity) => ({
        rarity,
        items: resources.filter((resource) => resource.rarity === rarity).map((resource) => resource.id),
    }))
}
