import { memo, type RefObject, useCallback } from 'react'
import { LuArrowDown, LuArrowUp } from 'react-icons/lu'
import { ActivityAdapter, ActivityTypes } from '@/activities/ActivityState'
import { setState } from '@/game/setState'
import { TrashIcon } from '@/icons/IconsMemo'
import { cn } from '@/lib/utils'
import { MyLabel } from '@/ui/myCard/MyLabel'
import { removeActivity } from '../../activities/functions/removeActivity'
import { AddActivityDialog } from '../../activities/ui/AddActivityDialog'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { Icons, IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { selectOreType } from '../../ui/state/uiSelectors'
import { addMiningVeinSearch } from '../functions/addMiningVeinSearch'
import { selectOreVeinSearchTime } from '../functions/startMiningVeinSearch'
import { moveOreVeinNext, moveOreVeinPrev, removeOreVein, selectMaxOreVeins } from '../miningFunctions'
import { OreVeinState } from '../OreState'
import { OreTypes } from '../OreTypes'
import classes from './miningVeins.module.css'

const ArrowUp = <LuArrowUp className="text-lg" />
const ArrowDown = <LuArrowDown className="text-lg" />

export const OreVeinsUi = memo(function OreVeinsUi({
    containerRef,
    isScrollable,
    maxHeight,
}: {
    containerRef: RefObject<HTMLDivElement | null>
    isScrollable: boolean
    maxHeight?: number
}) {
    const { t, fun } = useTranslations()
    const oreType = useGameStore(selectOreType)
    const veins = useGameStore((s) => GameLocationAdapter.selectEx(s.locations, s.location).oreVeins[oreType])
    const maxVeins = useGameStore((s) => selectMaxOreVeins(s, s.location))
    const searchTime = useGameStore(selectOreVeinSearchTime)
    const searchActId = useGameStore(
        (s) =>
            ActivityAdapter.find(
                s.activities,
                (w) => w.type === ActivityTypes.MiningVeinSearch && 'oreType' in w && w.oreType === oreType
            )?.id
    )

    const onSearch = useCallback(() => addMiningVeinSearch(oreType), [oreType])
    const onStopSearch = useCallback(() => removeActivity(searchActId), [searchActId])

    return (
        <div ref={containerRef}>
            <Card>
                <MyCardHeaderTitle title={t.OreVeins} icon={IconsData[Icons.Ore]} />
                <CardContent
                    className={cn(isScrollable && 'overflow-y-auto pr-1')}
                    style={isScrollable && maxHeight ? { maxHeight } : undefined}
                >
                    <div className="mb-2">
                        {searchActId ? (
                            <Button variant="destructive" onClick={onStopSearch}>
                                {t.Stop}
                            </Button>
                        ) : (
                            <AddActivityDialog
                                title={
                                    <>
                                        {IconsData.Pickaxe} {t.SearchOreVein}
                                    </>
                                }
                                openBtn={<Button>{t.SearchOreVein}</Button>}
                                addBtn={<Button onClick={onSearch}>{t.Add}</Button>}
                            />
                        )}
                    </div>
                    <MyLabel>
                        {t.Time} {fun.formatTime(searchTime)}
                    </MyLabel>
                    <GameTimerProgress actionId={searchActId} color="primary" className="mb-2" />
                    {veins && (
                        <>
                            <MyLabel>
                                {veins.length}/{maxVeins}
                            </MyLabel>
                            {veins.map((vein, index) => (
                                <VeinCard
                                    key={vein.id}
                                    vein={vein}
                                    oreType={oreType}
                                    isFirst={index === 0}
                                    isLast={index === veins.length - 1}
                                />
                            ))}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
})

const VeinCard = memo(function VeinCard({
    vein,
    oreType,
    isFirst,
    isLast,
}: {
    vein: OreVeinState
    oreType: OreTypes
    isFirst: boolean
    isLast: boolean
}) {
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    const onClickPrev = useCallback(() => {
        setState((s) => moveOreVeinPrev(s, s.location, oreType, vein.id))
    }, [oreType, vein.id])
    const onClickNext = useCallback(() => {
        setState((s) => moveOreVeinNext(s, s.location, oreType, vein.id))
    }, [oreType, vein.id])
    const onRemoveVein = useCallback(() => {
        setState((s) => removeOreVein(s, s.location, oreType, vein.id))
    }, [oreType, vein.id])

    return (
        <div className={classes.container}>
            <div>
                <MyLabel>
                    {vein.oreType} - {t.OreQta}: {f(vein.qta)}
                </MyLabel>
                <MyLabel>
                    {t.OreHp}: {f(vein.hp)} / {f(vein.maxHp)}
                </MyLabel>
                <MyLabel>
                    {t.VeinArmour}: {f(vein.armour)} - {t.VeinGemChance}: {f(vein.gemChance * 100)}%
                </MyLabel>
            </div>
            <div className={cn(classes.actions, 'text-muted-foreground')}>
                {!isFirst && (
                    <Button onClick={onClickPrev} variant="ghost" aria-label={t.MoveUp}>
                        {ArrowUp}
                    </Button>
                )}
                {!isLast && (
                    <Button onClick={onClickNext} variant="ghost" aria-label={t.MoveDown}>
                        {ArrowDown}
                    </Button>
                )}
                <Button variant="ghost" onClick={onRemoveVein} aria-label={t.Remove}>
                    {TrashIcon}
                </Button>
            </div>
        </div>
    )
})
