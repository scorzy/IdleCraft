import { memo, useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { selectGameItem, selectItemQta, selectFilteredItems } from '../StorageSelectors'
import { ItemFilter } from '../../items/Item'
import { Badge } from '../../components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export const ItemsSelect = memo(function ItemsSelect(props: {
    itemFilter: ItemFilter
    placeholderText?: string
    onValueChange: (value: string) => void
    selectedValue: string | undefined
}) {
    const { itemFilter, onValueChange, selectedValue, placeholderText } = props
    const { t } = useTranslations()
    const selectedItem = useGameStore((s: GameState) => {
        if (!selectedValue) return null
        return selectGameItem(selectedValue)(s)
    })

    const itemsId = useGameStore(
        useShallow(useCallback((s: GameState) => selectFilteredItems(s, itemFilter), [itemFilter]))
    )

    return (
        <Select value={selectedValue ?? ''} onValueChange={onValueChange}>
            <SelectTrigger>
                <SelectValue placeholder={placeholderText ?? t.selectPlaceholder}>
                    {selectedItem && (
                        <span className="select-trigger">
                            {IconsData[selectedItem.icon]} {t[selectedItem.nameId]}
                        </span>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {itemsId.map((t) => {
                    return <ParamItem itemId={t.id} key={t.id} />
                })}
            </SelectContent>
        </Select>
    )
})
export const ParamItem = memo(function ParamItem(props: { itemId: string }) {
    const { itemId } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    const itemObj = useGameStore(selectGameItem(itemId))
    const qta = useGameStore(selectItemQta(null, itemId))
    const text = itemObj ? t[itemObj.nameId] : t.None

    return (
        <SelectItem
            value={itemId}
            icon={itemObj && IconsData[itemObj.icon]}
            rightSlot={<Badge variant="secondary">{f(qta)}</Badge>}
        >
            {text}
        </SelectItem>
    )
})
