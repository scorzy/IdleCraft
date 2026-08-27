import { useCallback } from 'react'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { selectGameItem } from '../../storage/StorageSelectors'
import { Item } from '../Item'
import { useItemName } from '../selectors/useItemName'
import { ItemIcon } from './ItemIcon'
import { twMerge } from 'tailwind-merge'

export const ItemIconName = (props: { itemId: string | Item; className?: string }) => {
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
        <span className={twMerge(props.className, 'flex items-center gap-1')}>
            <ItemIcon itemId={item.id} className="mr-2" /> {name}
        </span>
    )
}
