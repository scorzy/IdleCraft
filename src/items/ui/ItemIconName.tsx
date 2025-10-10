import { useCallback } from 'react'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { selectGameItem } from '../../storage/StorageSelectors'
import { useItemName } from '../useItemName'

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

    const icon = IconsData[item.icon]

    return (
        <span className="flex items-center gap-1">
            <span className="text-lg">{icon}</span>
            {name}
        </span>
    )
}
