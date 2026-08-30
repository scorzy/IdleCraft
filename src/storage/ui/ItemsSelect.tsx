import { memo, ReactElement, useCallback, useMemo } from 'react'
import { useItemName } from '@/items/selectors/useItemName'
import { Badge } from '../../components/ui/badge'
import { ComboBoxItem, ComboBoxResponsive } from '../../components/ui/comboBox'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { ItemFilter } from '../../items/Item'
import { ItemIcon } from '../../items/ui/ItemIcon'
import { ItemIconName } from '../../items/ui/ItemIconName'
import { useTranslations } from '../../msg/useTranslations'
import { getVendorPurchaseOption } from '../../vendors/VendorData'
import { selectFilteredItems, selectGameItem, selectItemQta } from '../StorageSelectors'
import { memoize } from 'proxy-memoize'

export const ItemsSelect = memo(function ItemsSelect({
    itemFilter,
    onValueChange,
    selectedValue,
    placeholderText,
    label,
    includePurchasableItems = false,
}: {
    itemFilter: ItemFilter
    placeholderText?: string
    onValueChange: (value: string) => void
    selectedValue: string | undefined
    label?: ReactElement | ReactElement[] | string
    includePurchasableItems?: boolean
}) {
    const selectItemsId = useMemo(
        () => memoize((s: GameState) => selectFilteredItems(s, itemFilter, includePurchasableItems)),
        [includePurchasableItems, itemFilter]
    )
    const itemsId = useGameStore(selectItemsId)

    return (
        <ComboBoxResponsive
            label={label}
            selectedId={selectedValue ?? null}
            triggerContent={
                selectedValue ? (
                    <span className="select-trigger">
                        <ItemIconName itemId={selectedValue} />
                    </span>
                ) : placeholderText ? (
                    <span className="text-muted-foreground">{placeholderText}</span>
                ) : null
            }
        >
            {itemsId.map((t) => {
                return (
                    <ItemComboBoxItem
                        itemId={t}
                        key={t}
                        selected={selectedValue === t}
                        onValueChange={onValueChange}
                        showAutoBuy={includePurchasableItems}
                    />
                )
            })}
        </ComboBoxResponsive>
    )
})

const ItemComboBoxItem = memo(function ItemComboBoxItem({
    itemId,
    selected,
    onValueChange,
    showAutoBuy,
}: {
    itemId: string
    selected: boolean
    onValueChange: (value: string) => void
    showAutoBuy: boolean
}) {
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    const itemObj = useGameStore(selectGameItem(itemId))
    const qta = useGameStore(selectItemQta(null, itemId))
    const purchasable = useGameStore(
        useCallback((state) => showAutoBuy && !!getVendorPurchaseOption(state.location, itemId), [itemId, showAutoBuy])
    )

    const itemName = useItemName(itemObj)

    const text = itemObj ? itemName : t.None

    const handleSelect = useCallback(() => onValueChange(itemId), [onValueChange, itemId])

    return (
        <ComboBoxItem
            value={itemId}
            icon={itemObj && <ItemIcon itemId={itemId} />}
            rightSlot={
                <span className="flex items-center gap-1">
                    {purchasable && <Badge variant="outline">{t.AutoBuy}</Badge>}
                    <Badge variant="secondary">{f(qta)}</Badge>
                </span>
            }
            onSelect={handleSelect}
            selected={selected}
        >
            {text}
        </ComboBoxItem>
    )
})
