import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { WoodTypes, WoodTypesString } from '../WoodTypes'
import { selectDefaultForest, selectTreeGrowthTime } from './forestSelectors'
import { startTimer } from '@/timers/startTimer'
import { TimerTypes } from '../../timers/Timer'
import { getUniqueId } from '../../utils/getUniqueId'
import { TreeGrowth, TreeGrowthAdapter } from './forestGrowth'
import { ForestsType, ForestsState } from '../ForestsState'

export function addTree(state: GameState, woodType: WoodTypes, qta: number, location: GameLocations): GameState {
    const def = selectDefaultForest(woodType)

    const cur = state.locations[location].forests[woodType]
    if (cur === undefined) return state

    qta = Math.max(0, Math.min(cur.qta + qta, def.qta))

    if (qta >= def.qta) {
        const { [woodType]: value, ...newForests } = state.locations[location].forests
        state = {
            ...state,
            locations: {
                ...state.locations,
                [location]: { ...state.locations[location], forests: newForests },
            },
        }
        return state
    }

    state = {
        ...state,
        locations: {
            ...state.locations,
            [location]: {
                ...state.locations[location],
                forests: {
                    ...state.locations[location].forests,
                    [woodType]: {
                        hp: cur.hp,
                        qta,
                    },
                },
            },
        },
    }

    return state
}
export function cutTree(
    state: GameState,
    woodType: WoodTypes,
    damage: number,
    location: GameLocations
): {
    state: GameState
    cut: boolean
} {
    const forest = state.locations[location].forests[woodType]

    let qta: number
    let curHp: number

    const def = selectDefaultForest(woodType)
    if (forest) {
        qta = forest.qta
        curHp = forest.hp
    } else {
        qta = def.qta
        curHp = def.hp
    }

    let hp = curHp - damage
    let cut = false

    if (hp <= 0) {
        hp = def.hp
        qta = Math.max(0, qta - 1)
        cut = true

        const growthTime = selectTreeGrowthTime()
        const treeData: TreeGrowth = {
            id: getUniqueId(),
            location,
            woodType,
        }
        state = { ...state, treeGrowth: TreeGrowthAdapter.create(state.treeGrowth, treeData) }
        state = startTimer(state, growthTime, TimerTypes.Tree, treeData.id)
    }

    state = {
        ...state,
        locations: {
            ...state.locations,
            [location]: {
                ...state.locations[location],
                forests: {
                    ...state.locations[location].forests,
                    [woodType]: {
                        hp,
                        qta,
                    },
                },
            },
        },
    }

    return {
        state,
        cut,
    }
}
export function hasTrees(state: GameState, woodType: WoodTypes, location?: GameLocations): boolean {
    return (state.locations[location ?? state.location].forests[woodType]?.qta ?? 1) > 0
}

export function growTree(state: GameState, id: string): GameState {
    const data = TreeGrowthAdapter.select(state.treeGrowth, id)
    if (data === undefined) return state
    state = { ...state, treeGrowth: TreeGrowthAdapter.remove(state.treeGrowth, id) }
    return addTree(state, data.woodType, 1, data.location)
}
export function loadForest(data: unknown): ForestsType {
    const res: ForestsType = {}
    if (!data) return res
    if (typeof data !== 'object') return res
    const dataFix = data as Record<string, unknown>
    Object.entries(dataFix).forEach((e) => {
        const woodType = e[0] as WoodTypes
        if (typeof woodType === 'string' && WoodTypesString.find((w) => w === woodType)) {
            const forestDataState = e[1]
            if (
                forestDataState &&
                typeof forestDataState === 'object' &&
                'qta' in forestDataState &&
                'hp' in forestDataState &&
                typeof forestDataState.qta === 'number' &&
                typeof forestDataState.hp === 'number'
            ) {
                const forestsState: ForestsState = { qta: forestDataState.qta, hp: forestDataState.hp }
                res[woodType] = forestsState
            }
        }
    })

    return res
}
