import { GameState } from '../game/GameState'
import { GetItemNameParams } from '../msg/GetItemNameParams'
import { selectTranslations } from '../msg/useTranslations'
import { selectGameItem } from '../storage/StorageSelectors'
import { Item } from './Item'
import { selectItemNameMemoized } from './itemSelectors'
import { GetItemNameParamsMemoized } from './GetItemNameParamsMemoized'

export const selectItemName = (state: GameState, item: Item | string | undefined | null) => {
    if (!item) return ''
    if (typeof item === 'string') item = selectGameItem(item)(state)
    if (!item) return ''

    const params: GetItemNameParams = GetItemNameParamsMemoized(item.nameId, item.materials)

    return selectItemNameMemoized(item.nameFunc, params, selectTranslations(state))
}
