import { useCallback } from 'react'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { selectGameItem } from '../../storage/StorageSelectors'
import { useTranslations } from '../../msg/useTranslations'

export const ItemIconName = (props: { itemId: string }) => {
    const { itemId } = props
    const { t } = useTranslations()

    const item = useGameStore(
        useCallback(
            (s: GameState) => {
                if (!itemId) return null
                return selectGameItem(itemId)(s)
            },
            [itemId]
        )
    )
    if (!item) return <></>

    const name = t[item.nameId]
    const icon = IconsData[item.icon]

    return (
        <span className="flex items-center gap-1">
            <span className="text-lg">{icon}</span>
            {name}
        </span>
    )
}
