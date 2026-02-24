import { GameState } from '../game/GameState'
import { EXP_BASE_PRICE, EXP_GROW_RATE } from '../experience/expConst'
import { GatheringZone } from './gatheringZones'

export const GatheringZoneExpConfig = {
    rarity: {
        Common: 4,
        Uncommon: 8,
        Rare: 18,
    },
    monsterLevelMultiplier: 7,
} as const

export function getZoneLevelFromExp(exp: number): number {
    if (exp < EXP_BASE_PRICE) return 0
    return Math.floor(Math.log10((exp * (EXP_GROW_RATE - 1)) / EXP_BASE_PRICE + 1) / Math.log10(EXP_GROW_RATE))
}

export function getZoneExpForLevel(level: number): number {
    if (level <= 0) return 0
    return Math.floor((EXP_BASE_PRICE * (EXP_GROW_RATE ** level - 1)) / (EXP_GROW_RATE - 1))
}

export function addZoneExp(state: GameState, zone: GatheringZone, expQta: number) {
    const zoneProgress = state.gatheringZones[zone]
    zoneProgress.exp = Math.floor(zoneProgress.exp + expQta)
    zoneProgress.level = getZoneLevelFromExp(zoneProgress.exp)
}

export function getZoneCurrentLevelExp(exp: number, level: number): number {
    return exp - getZoneExpForLevel(level)
}

export function getZoneNextLevelExp(level: number): number {
    return getZoneExpForLevel(level + 1) - getZoneExpForLevel(level)
}
