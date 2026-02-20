import { getUniqueId } from '../utils/getUniqueId'
import { getRandomNum } from '../utils/getRandomNum'
import { GameState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { OreData } from './OreData'
import { OreState, OreType, OreVeinState } from './OreState'
import { OreTypes, OreTypesKeys } from './OreTypes'
import { selectDefaultMine } from './miningSelectors'

export const MAX_ORE_VEINS = 10

export function hasOre(state: GameState, oreType: OreTypes, location?: GameLocations): boolean {
    return (state.locations[location ?? state.location].ores[oreType]?.qta ?? 1) > 0
}
export function resetOre(state: GameState, oreType: OreTypes, location: GameLocations): void {
    const def = selectDefaultMine(state, oreType)

    state.locations[location].ores[oreType] = structuredClone(def)
}

export function getCurrentOreVein(state: GameState, location: GameLocations): OreVeinState | undefined {
    return state.locations[location].oreVeins[0]
}

export function getCurrentOreVeinByType(
    state: GameState,
    location: GameLocations,
    oreType: OreTypes
): OreVeinState | undefined {
    return state.locations[location].oreVeins.find((w) => w.oreType === oreType)
}

export function removeOreVein(state: GameState, location: GameLocations, veinId: string): void {
    const veins = state.locations[location].oreVeins
    const index = veins.findIndex((w) => w.id === veinId)
    if (index >= 0) veins.splice(index, 1)
}

export function canSearchOreVein(state: GameState, location: GameLocations): boolean {
    return state.locations[location].oreVeins.length < MAX_ORE_VEINS
}

export function searchOreVein(state: GameState, location: GameLocations): OreVeinState | undefined {
    const veins = state.locations[location].oreVeins
    if (veins.length >= MAX_ORE_VEINS) return

    const oreType = getRandomNum(0, 1) ? OreTypes.Copper : OreTypes.Tin
    const oreData = OreData[oreType]

    const qta = Math.max(1, Math.floor((oreData.qta * getRandomNum(70, 130)) / 100))
    const hp = Math.max(10, Math.floor((oreData.hp * getRandomNum(70, 130)) / 100))
    const armour = Math.max(0, Math.floor((oreData.armour * getRandomNum(70, 130)) / 100))
    const gemChance = getRandomNum(3, 20) / 100

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
    veinId: string,
    damage: number
): {
    mined: boolean
    completed: boolean
    oreType?: OreTypes
    gemDropped: boolean
} {
    const vein = state.locations[location].oreVeins.find((w) => w.id === veinId)
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
            removeOreVein(state, location, veinId)
        }
    }

    if (!completed) vein.hp = hp

    return { mined, completed, oreType: vein.oreType, gemDropped }
}

export function loadOre(data: unknown): OreType {
    const res: OreType = {}
    if (!data) return res
    if (typeof data !== 'object') return res
    const dataFix = data as Record<string, unknown>
    Object.entries(dataFix).forEach((e) => {
        const oreType = e[0]
        if (typeof oreType === 'string' && OreTypesKeys.find((w) => w === oreType)) {
            const forestDataState = e[1]
            if (
                forestDataState &&
                typeof forestDataState === 'object' &&
                'qta' in forestDataState &&
                'hp' in forestDataState &&
                typeof forestDataState.qta === 'number' &&
                typeof forestDataState.hp === 'number'
            ) {
                const oreState: OreState = { qta: forestDataState.qta, hp: forestDataState.hp }
                res[oreType as OreTypes] = oreState
            }
        }
    })

    return res
}
