import { getRandomNum } from '../utils/getRandomNum'
import { GatheringZoneConfig, RandomFn, Rarity, Resource, RarityRoll } from './gatheringTypes'

function pickRandomResource(resources: Resource[], rarity: Rarity): Resource {
    const rarityResources = resources.filter((resource) => resource.rarity === rarity)
    if (rarityResources.length < 1) {
        throw new Error(`[gathering] Missing resources for rarity ${rarity}`)
    }

    const index = getRandomNum(0, rarityResources.length - 1)
    const selected = rarityResources[index]
    if (!selected) {
        throw new Error(`[gathering] Invalid resource index for rarity ${rarity}`)
    }

    return selected
}

function rollRarity(rolls: RarityRoll[], random: RandomFn): Rarity {
    const value = random() * 100
    let cumulative = 0

    for (const roll of rolls) {
        cumulative += roll.chance
        if (value < cumulative) return roll.rarity
    }

    const lastRoll = rolls[rolls.length - 1]
    if (!lastRoll) throw new Error('[gathering] No rarity rolls configured')
    return lastRoll.rarity
}

export function gatherResources(zone: GatheringZoneConfig, random: RandomFn = Math.random): Resource[] {
    const guaranteed = pickRandomResource(zone.resources, zone.guaranteedRarity)
    const bonusRarity = rollRarity(zone.bonusRolls, random)
    const bonus = pickRandomResource(zone.resources, bonusRarity)

    return [guaranteed, bonus]
}
