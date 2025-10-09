import { GameState } from '../game/GameState'
import { selectTranslations } from '../msg/useTranslations'
import { selectGameItem } from '../storage/StorageSelectors'
import { Item } from './Item'
import { selectItemNameMemoized } from './itemSelectors'

export const selectItemName = (state: GameState, item: Item | string | undefined | null) => {
    if (!item) return ''
    if (typeof item === 'string') item = selectGameItem(item)(state)
    if (!item) return ''

    return selectItemNameMemoized(item.nameFunc, item.nameId, item.nameParams, selectTranslations(state))
}
