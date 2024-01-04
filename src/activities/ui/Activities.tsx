import { memo, useCallback } from 'react'
import { LuArrowDown, LuArrowUp, LuInfo, LuTrash2 } from 'react-icons/lu'
import { useGameStore } from '../../game/state'
import { selectActivityIcon, selectActivityId, selectActivityTitle } from '../ActivitySelectors'
import { moveActivityNext, moveActivityPrev } from '../activityFunctions'
import { useTranslations } from '../../msg/useTranslations'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { MyCard } from '../../ui/myCard/myCard'
import { Alert, AlertTitle } from '../../components/ui/alert'
import { MyPage } from '../../ui/pages/MyPage'
import { removeActivity } from '../functions/removeActivity'
import { IconsData } from '../../icons/Icons'
import classes from './activities.module.css'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const Activities = memo(function Activities() {
    const ids = useGameStore(selectActivityId)
    const max = ids.length - 1
    const { t } = useTranslations()

    if (ids.length === 0)
        return (
            <MyPage>
                <Alert variant="primary" className="max-w-md">
                    <LuInfo />
                    <AlertTitle>{t.NoActivities}</AlertTitle>
                </Alert>
            </MyPage>
        )

    return (
        <MyPage>
            <MyCard className="max-w-lg">
                {ids.map((i, index) => (
                    <ActivityCard id={i} key={i} isFirst={index === 0} isLast={index >= max} />
                ))}
            </MyCard>
        </MyPage>
    )
})

const ActivityCard = memo(function ActivityCard(props: { id: string; isFirst: boolean; isLast: boolean }) {
    const { id, isFirst, isLast } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    const act = useGameStore((s) => s.activities.entries[id])
    const title = useGameStore(selectActivityTitle(id))
    const icon = useGameStore(selectActivityIcon(id))
    const active = useGameStore((s) => s.activityId === id)
    const cur = useGameStore((s) => (active ? s.activityDone + 1 : 0))

    const onClickPrev = useCallback(() => moveActivityPrev(id), [id])
    const onClickNext = useCallback(() => moveActivityNext(id), [id])
    const onClickRemove = useCallback(() => removeActivity(id), [id])

    if (act === undefined) return <></>

    return (
        <div className={classes.container}>
            <div className={classes.icon}>{IconsData[icon]}</div>
            <div className={classes.title}>
                <div>{title}</div>
                <Badge variant={active ? 'default' : 'secondary'}>
                    {active ? 'Active' : 'In Queue'} {f(cur)}/{f(act.max)}
                </Badge>
            </div>
            <div className={classes.actions}>
                <>
                    {!isFirst && (
                        <Button onClick={onClickPrev} variant="ghost">
                            <LuArrowUp className="text-lg" />
                        </Button>
                    )}
                    {!isLast && (
                        <Button aria-label={t.MoveDown} onClick={onClickNext} variant="ghost">
                            <LuArrowDown className="text-lg" />
                        </Button>
                    )}
                    <Button aria-label={t.Remove} color="error" onClick={onClickRemove} variant="ghost">
                        <LuTrash2 className="text-lg" />
                    </Button>
                </>
            </div>
        </div>
    )
})
