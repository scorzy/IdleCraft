import { memo, useCallback } from 'react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Slider } from '../../components/ui/slider'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { Icons, IconsData } from '../../icons/Icons'
import { TrashIcon } from '../../icons/IconsMemo'
import { useTranslations } from '../../msg/useTranslations'
import { getSelectedItem, getSelectedItemQta, isSelectedItemCurrentLocation } from '../../storage/StorageSelectors'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { removeCargoLineUi, setCargoLineQtyUi } from '../functions/caravanFormFunctions'
import { selectDispatchCargoQuantity } from '../selectors/caravanFormSelectors'

export const AddToCaravanUi = memo(function AddToCaravanUi() {
    const qta = useGameStore(getSelectedItemQta)
    const item = useGameStore(getSelectedItem)
    const isCurrentLocation = useGameStore(isSelectedItemCurrentLocation)

    if (qta <= 0) return null
    if (!item) return null
    if (!isCurrentLocation) return null

    return <AddToCaravanUiInt itemId={item.id} available={qta} />
})

const AddToCaravanUiInt = memo(function AddToCaravanUiInt({
    itemId,
    available,
}: {
    itemId: string
    available: number
}) {
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const inCargo = useGameStore(useCallback((s: GameState) => selectDispatchCargoQuantity(s, itemId), [itemId]))

    const onSliderChange = useCallback((value: number) => setCargoLineQtyUi(itemId, value), [itemId])
    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const val = parseInt(event.target.value)
            if (!isNaN(val) && val >= 0 && val <= available) setCargoLineQtyUi(itemId, val)
        },
        [itemId, available]
    )
    const onAddAll = useCallback(() => setCargoLineQtyUi(itemId, available), [itemId, available])
    const onRemove = useCallback(() => removeCargoLineUi(itemId), [itemId])

    return (
        <Card>
            <MyCardHeaderTitle
                title={t.AddToCaravan}
                icon={IconsData[Icons.Caravan]}
                rightSlot={
                    inCargo > 0 ? (
                        <Badge variant="secondary">
                            {t.AlreadyInCargo} {f(inCargo)}
                        </Badge>
                    ) : undefined
                }
            />
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <Slider
                        value={inCargo}
                        onValueChange={onSliderChange}
                        min={0}
                        max={available}
                        step={1}
                        className="flex-1"
                    />
                    <Input
                        type="number"
                        value={inCargo}
                        onChange={onInputChange}
                        min={0}
                        max={available}
                        className="w-24"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={onAddAll}>
                        {t.AddAll}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={t.Remove}
                        onClick={onRemove}
                        disabled={inCargo <= 0}
                    >
                        {TrashIcon} {t.Remove}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
})
