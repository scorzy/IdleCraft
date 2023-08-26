import { memo, useCallback } from 'react'
import { useGameStore } from '../../game/state'
import { selectActivityIcon, selectActivityId, selectActivityTitle } from '../ActivitySelectors'
import { Page } from '../../ui/shell/AppShell'
import { moveActivityNext, moveActivityPrev, removeActivity } from '../activityFunctions'
import classes from './activities.module.css'
import { useTranslations } from '../../msg/useTranslations'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { MyCard } from '../../ui/myCard/myCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LuArrowDown, LuArrowUp, LuInfo, LuTrash2 } from 'react-icons/lu'
import { Alert, AlertTitle } from '../../components/ui/alert'

export const Activities = memo(function Activities() {
    const ids = useGameStore(selectActivityId)
    const max = ids.length - 1
    const { t } = useTranslations()

    if (ids.length === 0)
        return (
            <Page>
                <Alert variant="primary" className="max-w-md">
                    <LuInfo />
                    <AlertTitle>{t.NoActivities}</AlertTitle>
                </Alert>
            </Page>
        )

    return (
        <Page>
            <div className="my-container">
                <MyCard>
                    {ids.map((i, index) => (
                        <ActivityCard id={i} key={i} isFirst={index === 0} isLast={index >= max} />
                    ))}
                </MyCard>
            </div>
        </Page>
    )
})

export const ActivityCard = memo(function ActivityCard(props: { id: string; isFirst: boolean; isLast: boolean }) {
    const { id, isFirst, isLast } = props
    const act = useGameStore((s) => s.activities.entries[id])
    const title = useGameStore(selectActivityTitle(id))
    const icon = useGameStore(selectActivityIcon(id))
    const active = useGameStore((s) => s.activityId === id)
    const { t } = useTranslations()
    const cur = useGameStore((s) => (active ? s.activityDone + 1 : 0))
    const { f } = useNumberFormatter()

    const onClickPrev = useCallback(() => moveActivityPrev(id), [id])
    const onClickNext = useCallback(() => moveActivityNext(id), [id])
    const onClickRemove = useCallback(() => removeActivity(id), [id])

    if (act === undefined) return <></>

    return (
        <div className={classes.container}>
            <div className={classes.icon}>{icon}</div>
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
