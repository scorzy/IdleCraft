import { getUniqueId } from '../utils/getUniqueId'
import { getRandomNum } from '../utils/getRandomNum'
import { GameState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { hasPerk } from '../perks/PerksSelectors'
import { PerksEnum } from '../perks/perksEnum'
import { OreData } from './OreData'
import {
    VEIN_MASTERY_ARMOUR_REDUCE,
    VEIN_MASTERY_GEM_BONUS,
    VEIN_MASTERY_HP_REDUCE,
    VEIN_MASTERY_QTA_BONUS,
} from './MiningCost'
import { OreVeinState } from './OreState'
import { OreTypes } from './OreTypes'
import { selectDefaultMine } from './miningSelectors'

export const MAX_ORE_VEINS = 10

export function getOreVeinsByType(state: GameState, location: GameLocations, oreType: OreTypes): OreVeinState[] {
    const veinsMap = state.locations[location].oreVeins
    const veins = veinsMap[oreType]
    if (veins) return veins

    const ret: OreVeinState[] = []
    veinsMap[oreType] = ret
    return ret
}

export function hasOre(state: GameState, oreType: OreTypes, location?: GameLocations): boolean {
    return (state.locations[location ?? state.location].ores[oreType]?.qta ?? 1) > 0
}
export function resetOre(state: GameState, oreType: OreTypes, location: GameLocations): void {
    const def = selectDefaultMine(state, oreType)

    state.locations[location].ores[oreType] = structuredClone(def)
}

export function getCurrentOreVeinByType(
    state: GameState,
    location: GameLocations,
    oreType: OreTypes
): OreVeinState | undefined {
    return getOreVeinsByType(state, location, oreType)[0]
}

export function moveOreVeinPrev(state: GameState, location: GameLocations, oreType: OreTypes, veinId: string): void {
    const veins = getOreVeinsByType(state, location, oreType)
    const index = veins.findIndex((w) => w.id === veinId)
    if (index <= 0) return

    const tmp = veins[index - 1]
    if (!tmp) return
    veins[index - 1] = veins[index] as OreVeinState
    veins[index] = tmp
}

export function moveOreVeinNext(state: GameState, location: GameLocations, oreType: OreTypes, veinId: string): void {
    const veins = getOreVeinsByType(state, location, oreType)
    const index = veins.findIndex((w) => w.id === veinId)
    if (index < 0 || index >= veins.length - 1) return

    const tmp = veins[index + 1]
    if (!tmp) return
    veins[index + 1] = veins[index] as OreVeinState
    veins[index] = tmp
}

export function removeOreVein(state: GameState, location: GameLocations, oreType: OreTypes, veinId: string): void {
    const veins = getOreVeinsByType(state, location, oreType)
    const index = veins.findIndex((w) => w.id === veinId)
    if (index >= 0) veins.splice(index, 1)
}

export function canSearchOreVein(state: GameState, location: GameLocations, oreType: OreTypes): boolean {
    return getOreVeinsByType(state, location, oreType).length < MAX_ORE_VEINS
}

export function searchOreVein(state: GameState, location: GameLocations, oreType: OreTypes): OreVeinState | undefined {
    const veins = getOreVeinsByType(state, location, oreType)
    if (veins.length >= MAX_ORE_VEINS) return

    const oreData = OreData[oreType]
    const veinMastery = hasPerk(PerksEnum.VEIN_MASTERY)(state)

    const qtaRaw = Math.max(1, Math.floor((oreData.qta * getRandomNum(70, 130)) / 100))
    const hpRaw = Math.max(10, Math.floor((oreData.hp * getRandomNum(70, 130)) / 100))
    const armourRaw = Math.max(0, Math.floor((oreData.armour * getRandomNum(70, 130)) / 100))
    const gemChanceRaw = getRandomNum(3, 20) / 100

    const qta = veinMastery ? Math.max(1, Math.floor((qtaRaw * (100 + VEIN_MASTERY_QTA_BONUS)) / 100)) : qtaRaw
    const hp = veinMastery ? Math.max(1, Math.floor((hpRaw * (100 - VEIN_MASTERY_HP_REDUCE)) / 100)) : hpRaw
    const armour = veinMastery
        ? Math.max(0, Math.floor((armourRaw * (100 - VEIN_MASTERY_ARMOUR_REDUCE)) / 100))
        : armourRaw
    const gemChance = veinMastery ? Math.min(0.9, (gemChanceRaw * (100 + VEIN_MASTERY_GEM_BONUS)) / 100) : gemChanceRaw

    const vein: OreVeinState = {
        id: getUniqueId(),
        oreType,
        qta,
        maxQta: qta,
        hp,
        maxHp: hp,
        armour,
        gemChance,
    }

    veins.push(vein)

    return vein
}

export function mineOre(
    state: GameState,
    oreType: OreTypes,
    damage: number,
    location: GameLocations
): {
    mined: boolean
} {
    const mine = state.locations[location].ores[oreType]

    let qta: number
    let curHp: number

    const def = selectDefaultMine(state, oreType)
    if (mine) {
        qta = mine.qta
        curHp = mine.hp
    } else {
        qta = def.qta
        curHp = def.hp
    }

    const data = OreData[oreType]
    let hp = curHp - Math.max(0, damage - data.armour)
    let mined = false

    if (hp <= 0) {
        hp = def.hp
        qta = Math.max(0, qta - 1)
        mined = true
        if (hp <= 0) hp = 0
    }

    state.locations[location].ores[oreType] = {
        hp,
        qta,
    }

    return { mined }
}

export function mineOreVein(
    state: GameState,
    location: GameLocations,
    oreType: OreTypes,
    veinId: string,
    damage: number
): {
    mined: boolean
    completed: boolean
    oreType?: OreTypes
    gemDropped: boolean
} {
    const vein = getOreVeinsByType(state, location, oreType).find((w) => w.id === veinId)
    if (!vein) return { mined: false, completed: true, gemDropped: false }

    let hp = vein.hp - Math.max(0, damage - vein.armour)
    let mined = false
    let completed = false
    let gemDropped = false

    if (hp <= 0) {
        mined = true
        hp = vein.maxHp
        vein.qta = Math.max(0, vein.qta - 1)
        gemDropped = Math.random() < vein.gemChance

        if (vein.qta <= 0) {
            completed = true
            removeOreVein(state, location, oreType, veinId)
        }
    }

    if (!completed) vein.hp = hp

    return { mined, completed, oreType: vein.oreType, gemDropped }
}
