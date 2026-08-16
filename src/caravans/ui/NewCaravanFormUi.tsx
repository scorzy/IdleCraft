import { memo, useCallback } from 'react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { ComboBoxItem, ComboBoxResponsive, ComboBoxTrigger } from '../../components/ui/comboBox'
import { Input } from '../../components/ui/input'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocationDataMap } from '../../gameLocations/GameLocations'
import { Icons, IconsData } from '../../icons/Icons'
import { Coins, TrashIcon } from '../../icons/IconsMemo'
import { ItemIconName } from '../../items/ui/ItemIconName'
import { useTranslations } from '../../msg/useTranslations'
import { ItemsSelect } from '../../storage/ui/ItemsSelect'
import { selectItemQta } from '../../storage/StorageSelectors'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { CARAVAN_TIERS } from '../CaravanConst'
import { CaravanTierData } from '../CaravanUiData'
import {
    addCargoItemUi,
    confirmDispatchUi,
    loadAllStorageAsCargoUi,
    removeCargoLineUi,
    setCaravanDestinationUi,
    setCaravanTierUi,
    setCargoLineQtyUi,
} from '../functions/caravanFormFunctions'
import {
    canDispatch,
    selectDispatchCost,
    selectDispatchDurationMs,
    selectDispatchHasCargo,
    selectDispatchHasEnoughCargo,
    selectDispatchHasEnoughGold,
    selectDispatchHasFreeSlot,
    selectDispatchRoute,
    selectDispatchTier,
    selectDispatchTotalVolume,
} from '../selectors/caravanFormSelectors'
import { MyLabel } from '../../ui/myCard/MyLabel'
import classes from './newCaravanForm.module.css'

export const NewCaravanFormUi = memo(function NewCaravanFormUi() {
    const { t } = useTranslations()

    return (
        <Card>
            <MyCardHeaderTitle title={t.NewCaravan} icon={IconsData[Icons.HeavyCart]} />
            <CardContent className="flex flex-col gap-4">
                <DestinationSelectUi />
                <TierSelectUi />
                <CargoBuilderUi />
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-3">
                <DispatchPreviewUi />
                <ConfirmDispatchButton />
            </CardFooter>
        </Card>
    )
})

const DestinationSelectUi = memo(function DestinationSelectUi() {
    const { t } = useTranslations()
    const caravanRoutes = useGameStore(
        (s: GameState) => GameLocationAdapter.selectEx(s.locations, s.location).caravanRoutes
    )
    const toId = useGameStore((s: GameState) => s.caravanDispatchForm.toId)
    const destinations = caravanRoutes.map((route) => route.toId)

    if (destinations.length === 0) return <p className="text-muted-foreground text-sm">{t.NoDestinations}</p>

    return (
        <ComboBoxResponsive
            filter={false}
            label={t.Destination}
            selectedId={toId ?? null}
            triggerContent={
                toId ? (
                    <ComboBoxTrigger value={toId} icon={IconsData[GameLocationDataMap[toId].icon]} selected={false}>
                        {t[GameLocationDataMap[toId].name]}
                    </ComboBoxTrigger>
                ) : (
                    <span className="text-muted-foreground">{t.SelectDestination}</span>
                )
            }
        >
            {destinations.map((destId) => {
                const data = GameLocationDataMap[destId]
                return (
                    <ComboBoxItem
                        key={destId}
                        value={destId}
                        icon={IconsData[data.icon]}
                        selected={toId === destId}
                        onSelect={() => setCaravanDestinationUi(destId)}
                    >
                        {t[data.name]}
                    </ComboBoxItem>
                )
            })}
        </ComboBoxResponsive>
    )
})

const TierSelectUi = memo(function TierSelectUi() {
    const { t } = useTranslations()
    const tierId = useGameStore((s: GameState) => s.caravanDispatchForm.tierId)

    return (
        <ComboBoxResponsive
            filter={false}
            label={t.CaravanTier}
            selectedId={tierId ?? null}
            triggerContent={
                tierId ? (
                    <ComboBoxTrigger value={tierId} icon={IconsData[CaravanTierData[tierId].icon]} selected={false}>
                        {t[CaravanTierData[tierId].nameId]}
                    </ComboBoxTrigger>
                ) : (
                    <span className="text-muted-foreground">{t.SelectTier}</span>
                )
            }
        >
            {CARAVAN_TIERS.map((tier) => {
                const data = CaravanTierData[tier.id]
                return (
                    <ComboBoxItem
                        key={tier.id}
                        value={tier.id}
                        icon={IconsData[data.icon]}
                        selected={tierId === tier.id}
                        onSelect={() => setCaravanTierUi(tier.id)}
                    >
                        {t[data.nameId]}
                    </ComboBoxItem>
                )
            })}
        </ComboBoxResponsive>
    )
})

const FILTER_CARGO_ITEMS = { unlimitedItems: false }

const CargoBuilderUi = memo(function CargoBuilderUi() {
    const { t } = useTranslations()
    const cargo = useGameStore((s: GameState) => s.caravanDispatchForm.cargo)
    const onAddAll = useCallback(() => loadAllStorageAsCargoUi(), [])
    const onItemSelected = useCallback((itemId: string) => addCargoItemUi(itemId), [])

    return (
        <div className="flex flex-col gap-2">
            <MyLabel>{t.Cargo}</MyLabel>
            <div className={classes.cargoAddRow}>
                <div className={classes.cargoAddRowInner}>
                    <ItemsSelect
                        itemFilter={FILTER_CARGO_ITEMS}
                        selectedValue={undefined}
                        onValueChange={onItemSelected}
                        placeholderText={t.Add}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onAddAll}
                        className={classes.cargoAddButton}
                    >
                        {t.LoadAllStorage}
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {cargo.map((line) => (
                    <CargoLineUi key={line.itemId} itemId={line.itemId} quantity={line.quantity} />
                ))}
            </div>
        </div>
    )
})

const CargoLineUi = memo(function CargoLineUi({ itemId, quantity }: { itemId: string; quantity: number }) {
    const { t } = useTranslations()
    const available = useGameStore(selectItemQta(null, itemId))
    const onRemove = useCallback(() => removeCargoLineUi(itemId), [itemId])
    const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const val = parseInt(event.target.value)
            if (!isNaN(val) && val >= 0 && val <= available) setCargoLineQtyUi(itemId, val)
        },
        [itemId, available]
    )

    return (
        <div className={classes.cargoLine}>
            <div className={classes.cargoLineInner}>
                <span className={classes.cargoLineName}>
                    <ItemIconName itemId={itemId} />
                </span>
                <div className={classes.cargoLineActions}>
                    <Input
                        type="number"
                        value={quantity}
                        onChange={onChange}
                        min={0}
                        max={available}
                        className="w-24"
                    />
                    <Button type="button" variant="ghost" aria-label={t.Remove} onClick={onRemove}>
                        {TrashIcon}
                    </Button>
                </div>
            </div>
        </div>
    )
})

const DispatchPreviewUi = memo(function DispatchPreviewUi() {
    const { t, fun } = useTranslations()
    const { f } = useNumberFormatter()
    const route = useGameStore(selectDispatchRoute)
    const tier = useGameStore(selectDispatchTier)
    const totalVolume = useGameStore(selectDispatchTotalVolume)
    const durationMs = useGameStore(selectDispatchDurationMs)
    const cost = useGameStore(selectDispatchCost)
    const hasCargo = useGameStore(selectDispatchHasCargo)
    const hasEnoughCargo = useGameStore(selectDispatchHasEnoughCargo)
    const hasEnoughGold = useGameStore(selectDispatchHasEnoughGold)
    const hasFreeSlot = useGameStore(selectDispatchHasFreeSlot)

    return (
        <div className="flex flex-col gap-2 text-sm">
            <div className="flex flex-wrap gap-3">
                <span>
                    {t.TotalVolume}: {fun.formatVolume(totalVolume)}
                </span>
                <span>
                    {t.Duration}: {route && tier ? fun.formatTime(durationMs) : '-'}
                </span>
                <span className="flex items-center gap-1">
                    {t.TotalCost}: {Coins} {f(cost)}
                </span>
            </div>
            <div className="flex flex-wrap gap-2">
                {hasCargo && !hasEnoughCargo && <Badge variant="destructive">{t.NotEnoughCargo}</Badge>}
                {!hasEnoughGold && <Badge variant="destructive">{t.NotEnoughGold}</Badge>}
                {!hasFreeSlot && <Badge variant="destructive">{t.NoFreeSlots}</Badge>}
            </div>
        </div>
    )
})

const ConfirmDispatchButton = memo(function ConfirmDispatchButton() {
    const { t } = useTranslations()
    const enabled = useGameStore(canDispatch)

    return (
        <Button type="button" onClick={confirmDispatchUi} disabled={!enabled} className="self-start">
            {t.Dispatch}
        </Button>
    )
})
