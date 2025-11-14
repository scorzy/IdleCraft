import { useCallback } from 'react'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { selectGameItem } from '../../storage/StorageSelectors'
import { useItemName } from '../useItemName'
import { ItemIcon } from './ItemIcon'

export const ItemIconName = (props: { itemId: string }) => {
    const { itemId } = props

    const item = useGameStore(
        useCallback(
            (s: GameState) => {
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
            <ItemIcon itemId={item.id} />

            {name}
        </span>
    )
}
