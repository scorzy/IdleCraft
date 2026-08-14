import { memo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { MyLabel, MyLabelContainer } from '@/ui/myCard/MyLabel'
import { removeActivity } from '../../activities/functions/removeActivity'
import { ActivitiesList } from '../../activities/ui/Activities'
import { AddActivityDialog } from '../../activities/ui/AddActivityDialog'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { PLAYER_ID } from '../../characters/charactersConst'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { ExpEnum } from '../../experience/ExpEnum'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { Icons, IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { selectItemQta } from '../../storage/StorageSelectors'
import { ItemsSelect } from '../../storage/ui/ItemsSelect'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { selectMarketItemId } from '../../ui/state/uiSelectors'
import { setMarketItem } from '../../ui/state/uiFunctions'
import { addMarket } from '../functions/addMarket'
import { selectMarketId, selectMarketIds } from '../selectors/MarketSelectors'
import { selectMarketTime, selectMarketTimeAll } from '../selectors/marketTime'
import { selectSaleValue, selectSaleValueAll } from '../selectors/saleValue'

export const Market = memo(function Market() {
    return (
        <MyPageAll
            header={
                <div className="page__info">
                    <ExperienceCard expType={ExpEnum.Persuasion} charId={PLAYER_ID} />
                </div>
            }
        >
            <MyPage className="page__main">
                <MarketPicker />
                <MarketQueue />
            </MyPage>
        </MyPageAll>
    )
})

const MarketPicker = memo(function MarketPicker() {
    const { t } = useTranslations()
    const itemId = useGameStore(selectMarketItemId)

    const onValueChange = useCallback((value: string) => setMarketItem(value), [])

    return (
        <Card>
            <MyCardHeaderTitle title={t.Market} icon={IconsData[Icons.Market]} />
            <CardContent className="flex flex-col gap-3">
                <ItemsSelect
                    itemFilter={{ unlimitedItems: false }}
                    selectedValue={itemId ?? undefined}
                    onValueChange={onValueChange}
                    placeholderText={t.SelectItem}
                    label={t.SelectItem}
                />
                {itemId && <MarketItemDetails itemId={itemId} />}
            </CardContent>
        </Card>
    )
})

const MarketItemDetails = memo(function MarketItemDetails({ itemId }: { itemId: string }) {
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()

    const act = useGameStore(useCallback((s) => selectMarketId(s, itemId), [itemId]))
    const qta = useGameStore(useCallback((s) => selectItemQta(null, itemId)(s), [itemId]))
    const saleValue = useGameStore(useCallback((s) => selectSaleValue(itemId)(s), [itemId]))
    const time = useGameStore(selectMarketTime)

    const onClickStart = useCallback(() => addMarket(itemId), [itemId])
    const onClickRemove = useCallback(() => removeActivity(act), [act])

    return (
        <>
            <MyLabelContainer>
                <MyLabel>
                    {t.Quantity} {f(qta)}
                </MyLabel>
                <MyLabel>
                    {t.SaleValue} {f(saleValue)}
                    <BonusDialog title={t.SaleValue} selectBonusResult={selectSaleValueAll(itemId)} />
                </MyLabel>
                <MyLabel>
                    {t.MarketTime} {fun.formatTime(time)}
                    <BonusDialog title={t.MarketTime} selectBonusResult={selectMarketTimeAll} isTime={true} />
                </MyLabel>
            </MyLabelContainer>
            <GameTimerProgress actionId={act} color="primary" className="mb-2" />
            <CardFooter className="flex gap-2 px-0">
                {act ? (
                    <Button onClick={onClickRemove} variant="destructive">
                        {t.Stop}
                    </Button>
                ) : (
                    <AddActivityDialog
                        addBtn={<Button onClick={onClickStart}>{t.Sell}</Button>}
                        title={
                            <>
                                {IconsData[Icons.Market]} {t.Market}
                            </>
                        }
                        openBtn={<Button>{t.Sell}</Button>}
                    />
                )}
            </CardFooter>
        </>
    )
})

const MarketQueue = memo(function MarketQueue() {
    const ids = useGameStore(selectMarketIds)

    return <ActivitiesList ids={ids} filtered={true} />
})
