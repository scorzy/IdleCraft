import { memo, useCallback } from 'react'
import { LuArrowDown, LuArrowUp, LuInfo } from 'react-icons/lu'
import { useGameStore } from '../../game/state'
import {
    selectActivityCanView,
    selectActivityIcon,
    selectActivityIds,
    selectActivityMax,
    selectActivityTitle,
} from '../ActivitySelectors'
import { moveActivityNext, moveActivityPrev } from '../activityFunctions'
import { useTranslations } from '../../msg/useTranslations'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { Alert, AlertTitle } from '../../components/ui/alert'
import { MyPage } from '../../ui/pages/MyPage'
import { removeActivity } from '../functions/removeActivity'
import { IconsData } from '../../icons/Icons'
import { Input } from '../../components/ui/input'
import { setActivityNum } from '../functions/setActivityNum'
import { Eye, TrashIcon } from '../../icons/IconsMemo'
import { Card, CardContent } from '../../components/ui/card'
import { GameState } from '../../game/GameState'
import { viewActivity } from '../functions/viewActivity'
import classes from './activities.module.css'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const InfoIcon = <LuInfo className="h-4 w-4" />

export const Activities = memo(function Activities() {
    const ids = useGameStore(selectActivityIds)

    return (
        <MyPage>
            <ActivitiesList ids={ids} filtered={false} />
        </MyPage>
    )
})

export const ActivitiesList = memo(function ActivitiesList({ filtered, ids }: { filtered: boolean; ids: string[] }) {
    const max = ids.length - 1
    const { t } = useTranslations()

    if (ids.length === 0)
        return (
            <Alert variant="warning" className="max-w-md">
                {InfoIcon}
                <AlertTitle>{t.NoActivities}</AlertTitle>
            </Alert>
        )

    return (
        <Card className="max-w-lg">
            <CardContent>
                {ids.map((i, index) => (
                    <ActivityCard id={i} key={i} isFirst={index === 0} isLast={index >= max} filtered={filtered} />
                ))}
            </CardContent>
        </Card>
    )
})

const ArrowUp = <LuArrowUp className="text-lg" />
const ArrowDown = <LuArrowDown className="text-lg" />

export const ActivityCard = memo(function ActivityCard({
    id,
    isFirst,
    isLast,
    filtered,
}: {
    id: string
    isFirst: boolean
    isLast: boolean
    filtered: boolean
}) {
    const { t } = useTranslations()

    const title = useGameStore(useCallback((s: GameState) => selectActivityTitle(id)(s), [id]))
    const icon = useGameStore(useCallback((s: GameState) => selectActivityIcon(id)(s), [id]))
    const max = useGameStore(useCallback((s: GameState) => selectActivityMax(id)(s), [id]))
    const view = useGameStore(useCallback((s: GameState) => selectActivityCanView(id)(s), [id]))

    const onClickPrev = useCallback(() => moveActivityPrev(id), [id])
    const onClickNext = useCallback(() => moveActivityNext(id), [id])
    const onClickRemove = useCallback(() => removeActivity(id), [id])
    const onClickView = useCallback(() => viewActivity(id), [id])

    const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const val = parseInt(event.target.value)
            if (val && !isNaN(val) && val > 0 && val < 100) setActivityNum(id, val)
        },
        [id]
    )

    return (
        <div className={classes.container}>
            <div className={classes.icon}>{IconsData[icon]}</div>
            <div className={classes.title}>
                <div className="text-md leading-none font-medium">{title}</div>
                <ActivityCardBadge id={id} />
            </div>

            <div className={classes.actions}>
                {!filtered && !isFirst && (
                    <Button onClick={onClickPrev} variant="ghost">
                        {ArrowUp}
                    </Button>
                )}
                {!filtered && !isLast && (
                    <Button aria-label={t.MoveDown} onClick={onClickNext} variant="ghost">
                        {ArrowDown}
                    </Button>
                )}
                {view && (
                    <Button
                        aria-label={t.Remove}
                        color="error"
                        onClick={onClickView}
                        variant="ghost"
                        className="text-muted-foreground"
                    >
                        {Eye}
                    </Button>
                )}
                <Input
                    type="number"
                    value={max}
                    className={classes.num}
                    onChange={onChange}
                    max={99}
                    min={1}
                    step={1}
                />
                <Button
                    aria-label={t.Remove}
                    color="error"
                    onClick={onClickRemove}
                    variant="ghost"
                    className="text-muted-foreground"
                >
                    {TrashIcon}
                </Button>
            </div>
        </div>
    )
})

export const ActivityCardBadge = memo(function ActivityCardBadge({ id }: { id: string }) {
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    const max = useGameStore(selectActivityMax(id))
    const active = useGameStore((s) => s.activityId === id)
    const cur = useGameStore((s) => (active ? s.activityDone + 1 : 0))

    return (
        <Badge variant={active ? 'default' : 'secondary'}>
            {active ? t.Active : t.InQueue} {f(cur)}/{f(max)}
        </Badge>
    )
})
