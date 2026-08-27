import { memo, useCallback } from 'react'
import { GiRock } from 'react-icons/gi'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { ComboBoxItem, ComboBoxResponsive } from '../../components/ui/comboBox'
import { Input } from '../../components/ui/input'
import { Slider } from '../../components/ui/slider'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { Item } from '../../items/Item'
import { useTranslations } from '../../msg/useTranslations'
import { selectGameItem, selectItemQta } from '../../storage/StorageSelectors'

export const QuickSlotPotionSelector = memo(function QuickSlotPotionSelector({
    itemId,
    potionIds,
    selectedPotion,
    onSelect,
}: {
    itemId: string | null
    potionIds: string[]
    selectedPotion?: Item
    onSelect: (itemId: string) => void
}) {
    const { t } = useTranslations()
    const selectedName = selectedPotion ? t[selectedPotion.nameId] : t.None
    const selectedIcon = selectedPotion ? IconsData[selectedPotion.icon] : <GiRock />

    return (
        <ComboBoxResponsive
            selectedId={itemId}
            triggerContent={
                <span className="select-trigger">
                    {selectedIcon}
                    {selectedName}
                </span>
            }
        >
            <ComboBoxItem value="-" icon={<GiRock />} onSelect={() => onSelect('-')}>
                {t.None}
            </ComboBoxItem>
            {potionIds.map((potionId) => (
                <PotionOption itemId={potionId} key={potionId} onSelect={onSelect} />
            ))}
        </ComboBoxResponsive>
    )
})

export const QuickSlotQuantity = memo(function QuickSlotQuantity({
    itemId,
    quantity,
    available,
    onChange,
}: {
    itemId: string | null
    quantity: number
    available: number
    onChange: (value: number) => void
}) {
    const { t } = useTranslations()
    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => onChange(parseInt(event.target.value, 10)),
        [onChange]
    )

    if (!itemId) return null

    return (
        <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">{t.Quantity}</span>
            <Slider
                value={Math.min(quantity, available)}
                onValueChange={onChange}
                min={1}
                max={Math.max(1, available)}
                step={1}
                className="flex-1"
            />
            <Input
                type="number"
                value={Math.min(quantity, available)}
                onChange={onInputChange}
                min={1}
                max={available}
                className="w-24"
            />
        </div>
    )
})

export const QuickSlotActions = memo(function QuickSlotActions({
    itemId,
    quantity,
    available,
    equipped,
    onEquip,
    onClear,
}: {
    itemId: string | null
    quantity: number
    available: number
    equipped: boolean
    onEquip: () => void
    onClear: () => void
}) {
    const { t } = useTranslations()

    return (
        <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={onEquip} disabled={!itemId || quantity > available}>
                {t.Equip}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onClear} disabled={!equipped}>
                {t.Remove}
            </Button>
        </div>
    )
})

const PotionOption = memo(function PotionOption({
    itemId,
    onSelect,
}: {
    itemId: string
    onSelect: (itemId: string) => void
}) {
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const item = useGameStore(useCallback((state: GameState) => selectGameItem(itemId)(state), [itemId]))
    const quantity = useGameStore(selectItemQta(null, itemId))

    if (!item) return null

    return (
        <ComboBoxItem
            value={itemId}
            icon={<span className="text-2xl">{IconsData[item.icon]}</span>}
            rightSlot={<Badge variant="secondary">{f(quantity)}</Badge>}
            onSelect={() => onSelect(itemId)}
        >
            <span className="leading-none font-medium">{t[item.nameId]}</span>
        </ComboBoxItem>
    )
})
