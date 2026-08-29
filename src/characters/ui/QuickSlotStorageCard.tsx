import { memo, useCallback, useState } from 'react'
import { GiRock } from 'react-icons/gi'
import { useShallow } from 'zustand/react/shallow'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent } from '../../components/ui/card'
import { ComboBoxItem, ComboBoxResponsive } from '../../components/ui/comboBox'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { Item, ItemTypes } from '../../items/Item'
import { useTranslations } from '../../msg/useTranslations'
import { selectGameItem, selectItemQta, selectItemsByType } from '../../storage/StorageSelectors'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { equipQuickSlotClick } from '../quickSlotFunctions'
import { Inventory } from '../inventory'
import { selectQuickSlot, selectQuickSlots } from '../selectors/quickSlotSelectors'
import { QuickSlotActions, QuickSlotPotionSelector, QuickSlotQuantity } from './QuickSlotComponents'

export type QuickSlotStorageCardProps = {
    charId: string
    item?: Item
    index?: number
}

/** Shared quickSlot editor used by Storage and Character > Equipments. */
export const QuickSlotStorageCard = memo(function QuickSlotStorageCard({
    charId,
    item,
    index,
}: QuickSlotStorageCardProps) {
    if (item === undefined && index === undefined) return null
    return <QuickSlotStorageEditor key={`${item?.id ?? ''}:${index ?? ''}`} charId={charId} item={item} index={index} />
})

type QuickSlotStorageEditorProps = {
    charId: string
    item?: Item
    index?: number
}

const QuickSlotStorageEditor = memo(function QuickSlotStorageEditor({
    charId,
    item,
    index,
}: QuickSlotStorageEditorProps) {
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const quickSlots = useGameStore(useShallow(selectQuickSlots(charId)))
    const [slotIndexState, setSlotIndex] = useState(() => {
        if (index !== undefined) return index
        const equippedIndex = item ? quickSlots.findIndex((slot) => slot?.itemId === item.id) : -1
        return equippedIndex >= 0 ? equippedIndex : 0
    })
    const slotIndex = Math.min(slotIndexState, Math.max(quickSlots.length - 1, 0))
    const equipped = useGameStore(
        useCallback((state: GameState) => selectQuickSlot(slotIndex, charId)(state), [charId, slotIndex])
    )
    const equippedItem = useGameStore(
        useCallback((state: GameState) => (equipped ? selectGameItem(equipped.itemId)(state) : undefined), [equipped])
    )
    const potionIds = useGameStore(
        useShallow(
            useCallback(
                (state: GameState) => {
                    const ids = selectItemsByType(ItemTypes.Potion)(state)
                    if (!equipped) return ids

                    const equippedPotion = selectGameItem(equipped.itemId)(state)
                    if (equippedPotion?.type !== ItemTypes.Potion || ids.includes(equipped.itemId)) return ids
                    return [...ids, equipped.itemId]
                },
                [equipped]
            )
        )
    )
    const initialItemId = item?.id ?? equipped?.itemId ?? null
    const [itemId, setItemId] = useState<string | null>(initialItemId)
    const [quantity, setQuantity] = useState(item && equipped?.itemId !== item.id ? 1 : (equipped?.quantity ?? 1))

    const selectedPotion = useGameStore(
        useCallback((state: GameState) => (itemId ? selectGameItem(itemId)(state) : undefined), [itemId])
    )
    const storageQuantity = useGameStore(
        useCallback((state: GameState) => (itemId ? selectItemQta(null, itemId)(state) : 0), [itemId])
    )
    const available = storageQuantity + (equipped?.itemId === itemId ? (equipped.quantity ?? 1) : 0)

    const onSlotSelect = useCallback(
        (value: string) => {
            const nextSlotIndex = Number(value)
            const nextEquipped = quickSlots[nextSlotIndex]
            setSlotIndex(nextSlotIndex)
            setItemId(item?.id ?? nextEquipped?.itemId ?? null)
            setQuantity(item && nextEquipped?.itemId !== item.id ? 1 : (nextEquipped?.quantity ?? 1))
        },
        [item, quickSlots]
    )
    const onPotionSelect = useCallback((nextItemId: string) => {
        if (nextItemId === '-') {
            setItemId(null)
            setQuantity(1)
            return
        }

        setItemId(nextItemId)
        setQuantity(1)
    }, [])
    const onQuantityChange = useCallback(
        (value: number) => {
            if (Number.isSafeInteger(value) && value >= 1 && value <= available) setQuantity(value)
        },
        [available]
    )
    const onEquip = useCallback(() => {
        if (itemId) equipQuickSlotClick(charId, slotIndex, itemId, quantity)
    }, [charId, itemId, quantity, slotIndex])
    const onClear = useCallback(() => {
        equipQuickSlotClick(charId, slotIndex, null)
        setItemId(null)
        setQuantity(1)
    }, [charId, slotIndex])

    if (quickSlots.length === 0 || (item && (item.type !== ItemTypes.Potion || !item.potionData))) return null

    const isFixedSlot = index !== undefined
    const equippedName = equippedItem ? t[equippedItem.nameId] : t.None
    const equippedIcon = equippedItem ? IconsData[equippedItem.icon] : <GiRock />
    const title = isFixedSlot ? `${t.QuickSlot} ${slotIndex + 1}` : `${t.Equip} ${t.QuickSlot}`

    return (
        <Card>
            <MyCardHeaderTitle
                title={title}
                rightSlot={equipped ? <Badge variant="secondary">{f(equipped.quantity ?? 1)}</Badge> : undefined}
            />
            <CardContent className="flex flex-col gap-3">
                {!isFixedSlot && (
                    <ComboBoxResponsive
                        selectedId={String(slotIndex)}
                        triggerContent={
                            <span className="select-trigger">
                                {equippedIcon}
                                {t.QuickSlot} {slotIndex + 1}: {equippedName}
                                {equipped && <Badge variant="secondary">{f(equipped.quantity ?? 1)}</Badge>}
                            </span>
                        }
                    >
                        {quickSlots.map((slot, slotIndexOption) => (
                            <QuickSlotStorageOption
                                key={slotIndexOption}
                                index={slotIndexOption}
                                slot={slot}
                                onSelect={onSlotSelect}
                            />
                        ))}
                    </ComboBoxResponsive>
                )}

                {isFixedSlot && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">{t.QuickSlot}</span>
                        {equippedIcon}
                        <span className="flex-1 truncate">{equippedName}</span>
                        {equipped && <Badge variant="secondary">{f(equipped.quantity ?? 1)}</Badge>}
                    </div>
                )}

                {item ? (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">{t.Potion}</span>
                        {IconsData[item.icon]}
                        <span className="flex-1 truncate">{t[item.nameId]}</span>
                        <Badge variant="secondary">{f(storageQuantity)}</Badge>
                    </div>
                ) : (
                    <QuickSlotPotionSelector
                        itemId={itemId}
                        potionIds={potionIds}
                        selectedPotion={selectedPotion}
                        onSelect={onPotionSelect}
                    />
                )}

                <QuickSlotQuantity
                    itemId={itemId}
                    quantity={quantity}
                    available={available}
                    onChange={onQuantityChange}
                />
                <QuickSlotActions
                    itemId={itemId}
                    quantity={quantity}
                    available={available}
                    equipped={Boolean(equipped)}
                    onEquip={onEquip}
                    onClear={onClear}
                />
            </CardContent>
        </Card>
    )
})

const QuickSlotStorageOption = memo(function QuickSlotStorageOption({
    index,
    slot,
    onSelect,
}: {
    index: number
    slot: Inventory | null
    onSelect: (value: string) => void
}) {
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const equippedItem = useGameStore(
        useCallback((state: GameState) => (slot ? selectGameItem(slot.itemId)(state) : undefined), [slot])
    )
    const label = equippedItem ? t[equippedItem.nameId] : t.None
    const icon = equippedItem ? IconsData[equippedItem.icon] : <GiRock />

    return (
        <ComboBoxItem
            value={String(index)}
            icon={icon}
            rightSlot={slot ? <Badge variant="secondary">{f(slot.quantity ?? 1)}</Badge> : undefined}
            onSelect={() => onSelect(String(index))}
        >
            {t.QuickSlot} {index + 1}: {label}
        </ComboBoxItem>
    )
})
