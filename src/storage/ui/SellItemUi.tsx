import { memo, useCallback, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Slider } from '../../components/ui/slider'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { Icons, IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { getSelectedItem, getSelectedItemQta, isSelectedItemCurrentLocation } from '../StorageSelectors'
import { sellItemClick } from '../function/sellItem'

export const SellItemUi = memo(function SellItemUi() {
    const qta = useGameStore(getSelectedItemQta)
    const item = useGameStore(getSelectedItem)
    const isCurrentLocation = useGameStore(isSelectedItemCurrentLocation)

    if (qta <= 0) return null
    if (!item) return null
    if (!isCurrentLocation) return null
    if (item.unlimited) return null

    return <SellItemUiInt itemId={item.id} available={qta} value={item.value} />
})

const SellItemUiInt = memo(function SellItemUiInt({
    itemId,
    available,
    value,
}: {
    itemId: string
    available: number
    value: number
}) {
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const [qty, setQty] = useState(0)

    const onSliderChange = useCallback((v: number) => setQty(v), [])
    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const val = parseInt(event.target.value)
            if (!isNaN(val) && val >= 0 && val <= available) setQty(val)
        },
        [available]
    )
    const onSellAll = useCallback(() => setQty(available), [available])
    const onSell = useCallback(() => {
        sellItemClick(itemId, qty)
        setQty(0)
    }, [itemId, qty])

    return (
        <Card>
            <MyCardHeaderTitle title={t.QuickSell} icon={IconsData[Icons.Coins]} />
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <Slider
                        value={qty}
                        onValueChange={onSliderChange}
                        min={0}
                        max={available}
                        step={1}
                        className="flex-1"
                    />
                    <Input
                        type="number"
                        value={qty}
                        onChange={onInputChange}
                        min={0}
                        max={available}
                        className="w-24"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={onSellAll}>
                        {t.SellAll}
                    </Button>
                    <Button type="button" size="sm" onClick={onSell} disabled={qty <= 0}>
                        {t.Sell}
                    </Button>
                    <span className="text-muted-foreground ml-auto flex items-center gap-1">
                        {IconsData[Icons.Coins]} {f(qty * value)}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
})
