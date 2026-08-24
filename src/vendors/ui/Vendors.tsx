import { memo, useCallback, useId, useMemo, useState } from 'react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { ButtonGroup } from '../../components/ui/button-group'
import { Card, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { GameLocationDataMap } from '../../gameLocations/GameLocations'
import { Icons, IconsData } from '../../icons/Icons'
import { GetItemNameParamsMemoized } from '../../items/GetItemNameParamsMemoized'
import { getItemSubType } from '../../items/getItemSubType'
import { selectItemNameMemoized } from '../../items/selectors/itemSelectorsMemo'
import { StdItems } from '../../items/stdItems'
import { ItemIconName } from '../../items/ui/ItemIconName'
import { useTranslations } from '../../msg/useTranslations'
import { selectItemQta, selectItemTotalQta } from '../../storage/StorageSelectors'
import { ItemFilters } from '../../storage/ui/ItemFilters'
import { ItemLocationsDialog } from '../../storage/ui/ItemLocationsDialog'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { selectItemFilterSearch, selectItemFilterSubType, selectItemFilterType } from '../../ui/state/uiSelectors'
import { getVendorOffers, VendorOffer } from '../VendorData'
import { buyVendorItem } from '../vendorFunctions'
import { VendorTypes } from '../VendorTypes'
import { VendorSidebar } from './VendorSidebar'

const QUICK_BUY_QUANTITIES = [1, 10, 100, 1000] as const

export const Vendors = memo(function Vendors() {
    const location = useGameStore((state) => state.location)
    const vendorType = useGameStore((state) => state.ui.vendorType)
    const itemFilterSubType = useGameStore(selectItemFilterSubType)
    const itemFilterType = useGameStore(selectItemFilterType)
    const itemFilterSearch = useGameStore(selectItemFilterSearch)
    const translations = useTranslations()
    const offers = useMemo(() => {
        const search = itemFilterSearch.trim().toLocaleLowerCase()
        const useTypeFilter =
            itemFilterType && itemFilterSubType && getItemSubType(itemFilterType) === itemFilterSubType

        return getVendorOffers(location, vendorType).filter((offer) => {
            const item = StdItems[offer.itemId]
            if (!item) return false
            if (itemFilterSubType && getItemSubType(item.type) !== itemFilterSubType) return false
            if (useTypeFilter && item.type !== itemFilterType) return false
            if (!search) return true

            const name = selectItemNameMemoized(
                item.nameFunc,
                GetItemNameParamsMemoized(item.nameId, item.materials),
                translations
            )
            return name.toLocaleLowerCase().includes(search)
        })
    }, [itemFilterSearch, itemFilterSubType, itemFilterType, location, translations, vendorType])

    return (
        <MyPageAll sidebar={<VendorSidebar />} header={<VendorHeader />}>
            <MyPage className="page__main" key={`${location}-${vendorType}`}>
                <div className="col-span-full">
                    <ItemFilters />
                </div>
                {offers.map((offer) => (
                    <VendorOfferCard key={offer.itemId} offer={offer} vendorType={vendorType} />
                ))}
            </MyPage>
        </MyPageAll>
    )
})

const VendorHeader = memo(function VendorHeader() {
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const gold = useGameStore((state) => state.gold)
    const location = useGameStore((state) => state.location)

    return (
        <div className="page__info">
            <Card>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                        {IconsData[GameLocationDataMap[location].icon]}
                        {t[GameLocationDataMap[location].name]}
                    </span>
                    <Badge variant="secondary" className="gap-1 text-base">
                        {IconsData[Icons.Coins]}
                        {f(gold)} {t.Gold}
                    </Badge>
                </CardContent>
            </Card>
        </div>
    )
})

const VendorOfferCard = memo(function VendorOfferCard({
    offer,
    vendorType,
}: {
    offer: VendorOffer
    vendorType: VendorTypes
}) {
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const inputId = useId()
    const [quantityInput, setQuantityInput] = useState('1')
    const gold = useGameStore((state) => state.gold)
    const owned = useGameStore(useCallback((state) => selectItemQta(null, offer.itemId)(state), [offer.itemId]))
    const totalOwned = useGameStore(useCallback((state) => selectItemTotalQta(offer.itemId)(state), [offer.itemId]))

    const quantity = Number(quantityInput)
    const isValidQuantity = Number.isSafeInteger(quantity) && quantity > 0
    const totalPrice = isValidQuantity ? offer.unitPrice * quantity : 0
    const canAfford = isValidQuantity && totalPrice <= gold

    const buy = useCallback(() => {
        if (isValidQuantity) buyVendorItem(vendorType, offer.itemId, quantity)
    }, [isValidQuantity, offer.itemId, quantity, vendorType])

    const normalizeQuantity = useCallback(() => {
        if (!isValidQuantity) setQuantityInput('1')
    }, [isValidQuantity])

    const quickBuy = useCallback(
        (quantityToBuy: number) => buyVendorItem(vendorType, offer.itemId, quantityToBuy),
        [offer.itemId, vendorType]
    )

    return (
        <Card className="gap-2 py-3">
            <CardContent className="grid gap-2">
                <div className="flex min-w-0 items-center justify-between gap-3">
                    <div className="truncate font-semibold">
                        <ItemIconName itemId={offer.itemId} />
                    </div>
                    <span className="flex shrink-0 items-center gap-1 font-medium">
                        {IconsData[Icons.Coins]} {f(offer.unitPrice)}
                    </span>
                </div>
                <div className="text-muted-foreground flex flex-wrap gap-x-3 text-xs">
                    <span>{t.UnlimitedStock}</span>
                    <span>
                        {t.CurrentLocation}: {f(owned)}
                    </span>
                    <span className="flex items-center gap-1">
                        {t.Total}: {f(totalOwned)}
                        <ItemLocationsDialog itemId={offer.itemId} />
                    </span>
                </div>
                <ButtonGroup className="flex-wrap">
                    {QUICK_BUY_QUANTITIES.map((quickQuantity) => (
                        <Button
                            key={quickQuantity}
                            size="sm"
                            variant="outline"
                            onClick={() => quickBuy(quickQuantity)}
                            disabled={offer.unitPrice * quickQuantity > gold}
                        >
                            {t.Buy} {f(quickQuantity)}
                        </Button>
                    ))}
                </ButtonGroup>
                <div className="grid grid-cols-[minmax(5rem,1fr)_auto] items-end gap-2">
                    <label htmlFor={inputId} className="grid gap-1">
                        <Input
                            id={inputId}
                            className="h-8"
                            type="number"
                            min={1}
                            step={1}
                            inputMode="numeric"
                            value={quantityInput}
                            onChange={(event) => setQuantityInput(event.target.value)}
                            onBlur={normalizeQuantity}
                            aria-invalid={!isValidQuantity}
                        />
                    </label>
                    <Button size="sm" onClick={buy} disabled={!canAfford} className="gap-1">
                        {t.Buy} / {IconsData[Icons.Coins]} {f(totalPrice)}
                    </Button>
                </div>
                {isValidQuantity && !canAfford && <span className="text-destructive text-xs">{t.NotEnoughGold}</span>}
            </CardContent>
        </Card>
    )
})
