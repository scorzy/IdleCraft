import { useCallback } from 'react'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { selectGameItem } from '../../storage/StorageSelectors'
import { useItemName } from '../useItemName'
import { Item } from '../Item'
import { ItemIcon } from './ItemIcon'

export const ItemIconName = (props: { itemId: string | Item }) => {
    const { itemId } = props

    const item = useGameStore(
        useCallback(
            (s: GameState) => {
                if (typeof itemId === 'object') return itemId
                if (!itemId) return null
                return selectGameItem(itemId)(s)
            },
            [itemId]
        )
    )

    const name = useItemName(item)

    if (!item) return <></>

    return (
        <span className="flex items-center gap-1">
            <ItemIcon itemId={item.id} className="mr-2" /> {name}
        </span>
    )
}
