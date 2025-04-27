import React, { memo, useEffect, useState } from 'react'
import { TbList } from 'react-icons/tb'
import { Card, CardContent } from '../../components/ui/card'
import { useGameStore } from '../../game/state'
import { selectBattleLog, selectBattleLogsIds } from '../battleLogSelectors'
import { IconsData } from '../../icons/Icons'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { useTranslations } from '../../msg/useTranslations'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import classes from './battleLogUi.module.css'

const LIST_ICON = <TbList />
export const BattleLogUi = memo(function BattleLogUi(props: { className?: string }) {
    const { className } = props
    const { t } = useTranslations()
    return (
        <Card className={className}>
            <MyCardHeaderTitle title={t.Log} icon={LIST_ICON} />
            <CardContent>
                <BattleLogs />
            </CardContent>
        </Card>
    )
})
const BattleLogs = memo(function BattleLogs() {
    const ids = useGameStore(selectBattleLogsIds)
    const lastRef = React.useRef<HTMLSpanElement>(null)
    const [lastVisible, setLastVisible] = useState<boolean>(true)

    useEffect(() => {
        if (!lastRef.current) return
        if (lastVisible) lastRef.current.scrollIntoView({ behavior: 'smooth' })
    }, [ids, lastVisible, lastRef])

    useEffect(() => {
        if (!lastRef.current) return

        console.log('lastRef.current', lastRef.current)

        const observer = new IntersectionObserver((entries) => {
            let newLastVisible = false
            entries.forEach((entry) => {
                newLastVisible = entry.isIntersecting
            })
            setLastVisible(newLastVisible)
        })
        observer.observe(lastRef.current)

        return () => {
            observer.disconnect()
        }
    }, [lastRef, lastVisible])

    return (
        <div className="text-sm">
            {ids.map((id) => (
                <LogUi id={id} key={id} />
            ))}
            <span ref={lastRef} className={classes.lastSpan}>
                &nbsp;
            </span>
        </div>
    )
})
const LogUi = memo(function LogUi(props: { id: string }) {
    const { id } = props
    const log = useGameStore(selectBattleLog(id))
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    const date = new Date(log.date).toLocaleTimeString()

    return (
        <div className="grid grid-flow-col items-center justify-start gap-2">
            <span className="text-muted-foreground">{date}</span>
            {log.source}
            {IconsData[log.iconId]}
            {t[log.abilityId]}
            <span className="text-muted-foreground">{' => '}</span>
            {log.targets}{' '}
            {log.damageDone !== undefined && (
                <>
                    <span className="text-muted-foreground">{t.Damage}</span>
                    {f(log.damageDone)}
                </>
            )}
        </div>
    )
})
