import { useCallback } from 'react'
import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { Item } from './Item'
import { selectItemName } from './selectItemName'

export const useItemName = (item: Item | undefined | string | null) => {
    return useGameStore(useCallback((state: GameState) => selectItemName(state, item), [item]))
}
