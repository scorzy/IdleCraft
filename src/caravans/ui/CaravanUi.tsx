import { memo, useCallback } from 'react'
import { LuPlus } from 'react-icons/lu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../components/ui/alert-dialog'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { GameLocationDataMap } from '../../gameLocations/GameLocations'
import { Icons, IconsData } from '../../icons/Icons'
import { Coins } from '../../icons/IconsMemo'
import { ItemIconName } from '../../items/ui/ItemIconName'
import { useTranslations } from '../../msg/useTranslations'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { MyLabel, MyLabelContainer } from '../../ui/myCard/MyLabel'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { CaravanTierData } from '../CaravanUiData'
import { recallShipmentUi, selectShipmentUi } from '../functions/caravanFormFunctions'
import { selectSelectedShipmentId, selectShipment } from '../selectors/caravanSelectors'
import { ShipmentStatus } from '../ShipmentState'
import { NewCaravanFormUi } from './NewCaravanFormUi'
import { TimeRemainingUi } from './TimeRemainingUi'

export const CaravanUi = memo(function CaravanUi() {
    return (
        <MyPageAll sidebar={<CaravanSidebar />}>
            <MyPage className="mx-auto max-w-2xl">
                <CaravanMainDetail />
            </MyPage>
        </MyPageAll>
    )
})

const CaravanSidebar = memo(function CaravanSidebar() {
    const ids = useGameStore((s: GameState) => s.shipments.ids)

    return (
        <SidebarContainer collapsedId={CollapsedEnum.Caravans}>
            <NewCaravanLink />
            {ids.map((id) => (
                <ShipmentLink key={id} shipmentId={id} />
            ))}
        </SidebarContainer>
    )
})

const NewCaravanLink = memo(function NewCaravanLink() {
    const { t } = useTranslations()
    const selectedShipmentId = useGameStore(selectSelectedShipmentId)
    const onClick = useCallback(() => selectShipmentUi(null), [])

    return (
        <MyListItem
            text={t.NewCaravan}
            icon={<LuPlus />}
            active={selectedShipmentId === null}
            onClick={onClick}
            collapsedId={CollapsedEnum.Caravans}
        />
    )
})

const ShipmentLink = memo(function ShipmentLink({ shipmentId }: { shipmentId: string }) {
    const { t } = useTranslations()
    const selectedShipmentId = useGameStore(selectSelectedShipmentId)
    const shipment = useGameStore(useCallback((s: GameState) => selectShipment(s, shipmentId), [shipmentId]))
    const onClick = useCallback(() => selectShipmentUi(shipmentId), [shipmentId])

    if (!shipment) return null

    const fromData = GameLocationDataMap[shipment.fromId]
    const toData = GameLocationDataMap[shipment.toId]

    return (
        <MyListItem
            text={`${t[fromData.name]} → ${t[toData.name]}`}
            icon={IconsData[Icons.HeavyCart]}
            active={selectedShipmentId === shipmentId}
            onClick={onClick}
            collapsedId={CollapsedEnum.Caravans}
            right={
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    {shipment.status === ShipmentStatus.Returning && <Badge variant="secondary">{t.Returning}</Badge>}
                    <TimeRemainingUi arriveAtMs={shipment.arriveAtMs} />
                </div>
            }
        />
    )
})

const CaravanMainDetail = memo(function CaravanMainDetail() {
    const selectedShipmentId = useGameStore(selectSelectedShipmentId)
    const shipment = useGameStore(
        useCallback(
            (s: GameState) => (selectedShipmentId ? selectShipment(s, selectedShipmentId) : undefined),
            [selectedShipmentId]
        )
    )

    if (shipment) return <ShipmentDetailUi shipmentId={shipment.id} />
    return <NewCaravanFormUi />
})

const ShipmentDetailUi = memo(function ShipmentDetailUi({ shipmentId }: { shipmentId: string }) {
    const { t, fun } = useTranslations()
    const { f } = useNumberFormatter()
    const shipment = useGameStore(useCallback((s: GameState) => selectShipment(s, shipmentId), [shipmentId]))
    const onRecall = useCallback(() => recallShipmentUi(shipmentId), [shipmentId])

    if (!shipment) return null

    const fromData = GameLocationDataMap[shipment.fromId]
    const toData = GameLocationDataMap[shipment.toId]
    const tierData = CaravanTierData[shipment.tierId]
    const returning = shipment.status === ShipmentStatus.Returning

    return (
        <Card>
            <MyCardHeaderTitle
                title={`${t[fromData.name]} → ${t[toData.name]}`}
                icon={IconsData[Icons.HeavyCart]}
                rightSlot={
                    <Badge variant={returning ? 'secondary' : 'default'}>{returning ? t.Returning : t.InTransit}</Badge>
                }
            />
            <CardContent className="flex flex-col gap-3">
                <MyLabelContainer>
                    <MyLabel>
                        {IconsData[tierData.icon]} {t[tierData.nameId]}
                    </MyLabel>
                    <MyLabel>
                        {Coins} {f(shipment.costPaid)}
                    </MyLabel>
                    <MyLabel>{fun.formatVolume(shipment.totalVolume)}</MyLabel>
                    <MyLabel>
                        {t.Duration} {fun.formatTime(shipment.arriveAtMs - shipment.departAtMs)}
                    </MyLabel>
                    <MyLabel>
                        {t.TimeRemaining} <TimeRemainingUi arriveAtMs={shipment.arriveAtMs} />
                    </MyLabel>
                </MyLabelContainer>

                <div className="flex flex-col gap-1">
                    {shipment.cargo.map((line) => (
                        <div key={line.itemId} className="flex items-center gap-2">
                            <ItemIconName itemId={line.itemId} /> <Badge variant="secondary">{f(line.quantity)}</Badge>
                        </div>
                    ))}
                </div>

                <GameTimerProgress actionId={shipment.id} color="primary" />
            </CardContent>
            {!returning && (
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger render={<Button variant="destructive">{t.Recall}</Button>} />
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t.recallConfirmTitle}</AlertDialogTitle>
                                <AlertDialogDescription>{t.recallConfirmDesc}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={onRecall}>{t.Recall}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            )}
        </Card>
    )
})
