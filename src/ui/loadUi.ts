import { GameState } from '../game/GameState'
import { copyValues } from '../utils/copyValues'
import { CollapsedEnum } from './sidebar/CollapsedEnum'

export function loadUi(data: object, state: GameState): void {
    if (!('ui' in data && data.ui)) return

    copyValues(state.ui, data.ui)

    if (
        typeof data.ui === 'object' &&
        'collapsed' in data.ui &&
        typeof data.ui.collapsed === 'object' &&
        data.ui.collapsed
    ) {
        Object.entries(data.ui.collapsed).forEach((kv) => {
            const key = kv[0]
            if (key in CollapsedEnum) state.ui.collapsed[key as CollapsedEnum] = !!kv[1]
        })
    }
}
