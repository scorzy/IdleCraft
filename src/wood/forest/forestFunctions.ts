import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { WoodTypes, WoodTypesString } from '../WoodTypes'
import { ForestsType, ForestsState } from '../ForestsState'
import { selectDefaultForest } from './forestSelectors'

export function addTree(state: GameState, woodType: WoodTypes, qta: number, location: GameLocations): void {
    const def = selectDefaultForest(state, woodType)

    const cur = state.locations[location].forests[woodType]
    if (cur === undefined) return

    qta = Math.max(0, Math.min(cur.qta + qta, def.qta))

    if (qta >= def.qta) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete state.locations[location].forests[woodType]
        return
    }
    cur.qta = qta
}
export function hasTrees(state: GameState, woodType: WoodTypes, location?: GameLocations): boolean {
    return (state.locations[location ?? state.location].forests[woodType]?.qta ?? 1) > 0
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
