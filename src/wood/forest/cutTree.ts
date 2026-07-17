import { GameState } from '../../game/GameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { WoodTypes } from '../WoodTypes'
import { checkGrowTrees } from './checkGrowTrees'
import { selectDefaultForest } from './forestSelectors'

export function cutTree(
    state: GameState,
    woodType: WoodTypes,
    damage: number,
    location: GameLocations
): {
    cut: boolean
} {
    const forests = GameLocationAdapter.selectEx(state.locations, location).forests
    const forest = forests[woodType]

    let qta: number
    let curHp: number

    const def = selectDefaultForest(state, woodType, location)
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
    }

    forests[woodType] = {
        hp,
        qta,
    }

    if (cut) checkGrowTrees(state, woodType, location)

    return { cut }
}
