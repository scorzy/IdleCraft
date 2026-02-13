import { clsx } from 'clsx'
import { useCallback } from 'react'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { GameIcon } from '../../icons/GameIcon'
import { selectGameItem } from '../../storage/StorageSelectors'
import { selectPrimaryMaterial } from '../selectPrimaryMaterial'
import { Item } from '../Item'

export const ItemIcon = ({ itemId, className }: { itemId: string | Item; className?: string }) => {
    const item = useGameStore(
        useCallback(
            (s: GameState) => {
                if (typeof itemId !== 'string') return itemId
                if (!itemId) return null
                return selectGameItem(itemId)(s)
            },
            [itemId]
        )
    )

    if (!item) return <></>

    const color = item.color ?? selectPrimaryMaterial(item)?.color

    return <GameIcon icon={item.icon} className={clsx('text-lg', color, className)} />
}
