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
import { ComboBoxResponsive, ComboBoxItem } from '../../components/ui/comboBox'

export const ItemsSelect = memo(function ItemsSelect({
    itemFilter,
    onValueChange,
    selectedValue,
    placeholderText,
    label,
}: {
    itemFilter: ItemFilter
    placeholderText?: string
    onValueChange: (value: string) => void
    selectedValue: string | undefined
    label?: string
}) {
    const { t } = useTranslations()
    const selectedItem = useGameStore((s: GameState) => {
        if (!selectedValue) return null
        return selectGameItem(selectedValue)(s)
    })

    const itemsId = useGameStore(
        useShallow(useCallback((s: GameState) => selectFilteredItems(s, itemFilter), [itemFilter]))
    )

    return (
        <ComboBoxResponsive
            label={label}
            selectedId={selectedValue ?? null}
            triggerContent={
                selectedItem ? (
                    <span className="select-trigger">
                        {IconsData[selectedItem.icon]} {t[selectedItem.nameId]}
                    </span>
                ) : placeholderText ? (
                    <span className="text-muted-foreground">{placeholderText}</span>
                ) : null
            }
        >
            {itemsId.map((t) => {
                return (
                    <ItemComboBoxItem itemId={t} key={t} selected={selectedValue === t} onValueChange={onValueChange} />
                )
            })}
        </ComboBoxResponsive>
    )
})

const ItemComboBoxItem = memo(function ItemComboBoxItem({
    itemId,
    selected,
    onValueChange,
}: {
    itemId: string
    selected: boolean
    onValueChange: (value: string) => void
}) {
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    const itemObj = useGameStore(selectGameItem(itemId))
    const qta = useGameStore(selectItemQta(null, itemId))
    const text = itemObj ? t[itemObj.nameId] : t.None

    const handleSelect = useCallback(() => onValueChange(itemId), [onValueChange, itemId])

    return (
        <ComboBoxItem
            value={itemId}
            icon={itemObj && IconsData[itemObj.icon]}
            rightSlot={<Badge variant="secondary">{f(qta)}</Badge>}
            onSelect={handleSelect}
            selected={selected}
        >
            {text}
        </ComboBoxItem>
    )
})
