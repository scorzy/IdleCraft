import { GameState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { OreData } from './OreData'
import { OreTypes } from './OreTypes'
import { selectDefaultMine } from './miningSelectors'

export function hasOre(state: GameState, oreType: OreTypes, location?: GameLocations): boolean {
    return (state.locations[location ?? state.location].ores[oreType]?.qta ?? 1) > 0
}
export function resetOre(state: GameState, oreType: OreTypes, location: GameLocations): GameState {
    const def = selectDefaultMine(oreType)

    state = {
        ...state,
        locations: {
            ...state.locations,
            [location]: {
                ...state.locations[location],
                ores: {
                    ...state.locations[location].ores,
                    [oreType]: {
                        ...def,
                    },
                },
            },
        },
    }

    return state
}
export function mineOre(
    state: GameState,
    oreType: OreTypes,
    damage: number,
    location: GameLocations
): {
    state: GameState
    mined: boolean
} {
    const mine = state.locations[location].ores[oreType]

    let qta: number
    let curHp: number

    const def = selectDefaultMine(oreType)
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

    state = {
        ...state,
        locations: {
            ...state.locations,
            [location]: {
                ...state.locations[location],
                ores: {
                    ...state.locations[location].ores,
                    [oreType]: {
                        hp,
                        qta,
                    },
                },
            },
        },
    }

    return {
        state,
        mined,
    }
}
