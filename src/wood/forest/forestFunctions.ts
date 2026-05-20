import { GameState } from '../../game/GameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { WoodTypes } from '../WoodTypes'
import { selectDefaultForest } from './forestSelectors'

export function addTree(state: GameState, woodType: WoodTypes, qta: number, location: GameLocations): void {
    const def = selectDefaultForest(state, woodType)

    const forests = GameLocationAdapter.selectEx(state.locations, location).forests
    const cur = forests[woodType]
    if (cur === undefined) return

    qta = Math.max(0, Math.min(cur.qta + qta, def.qta))

    if (qta >= def.qta) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete forests[woodType]
        return
    }
    cur.qta = qta
}
export function hasTrees(state: GameState, woodType: WoodTypes, location?: GameLocations): boolean {
    return (GameLocationAdapter.selectEx(state.locations, location ?? state.location).forests[woodType]?.qta ?? 1) > 0
}
