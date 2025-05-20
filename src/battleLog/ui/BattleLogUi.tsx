import { memo } from 'react'
import { TbList } from 'react-icons/tb'
import { Card, CardContent } from '../../components/ui/card'
import { useGameStore } from '../../game/state'
import { selectBattleLog, selectBattleLogsIds } from '../battleLogSelectors'
import { IconsData } from '../../icons/Icons'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { useTranslations } from '../../msg/useTranslations'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { AutoScroll } from '../../components/ui/autoScroll'

const LIST_ICON = <TbList />
export const BattleLogUi = memo(function BattleLogUi(props: { className?: string }) {
    const { className } = props
    const { t } = useTranslations()
    return (
        <Card className={className}>
            <MyCardHeaderTitle title={t.Log} icon={LIST_ICON} />
            <CardContent style={{ height: '100%' }}>
                <BattleLogs />
            </CardContent>
        </Card>
    )
})
const BattleLogs = memo(function BattleLogs() {
    const ids = useGameStore(selectBattleLogsIds)

    return (
        <AutoScroll
            className="text-sm"
            totalCount={ids.length}
            itemContent={(index: number) => {
                const id = ids[index]
                if (!id) return null
                return <LogUi id={id} />
            }}
        />
    )
})
const LogUi = memo(function LogUi(props: { id: string }) {
    const { id } = props

    const log = useGameStore(selectBattleLog(id))
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    if (!log) {
        //console.warn('LogUi: log not found', id)
        return null
    }

    const date = new Date(log.date).toLocaleTimeString()
    let content = <></>
    if (log.type === 'kill')
        content = (
            <>
                {IconsData[log.iconId]}
                {log.targets}
                <span className="text-muted-foreground">{t.Killed}</span>
            </>
        )
    else if (log.abilityId !== undefined)
        content = (
            <>
                {t[log.abilityId]}
                <span className="text-muted-foreground">{' => '}</span>
                {log.targets}{' '}
                {log.damageDone !== undefined && (
                    <>
                        <span className="text-muted-foreground">{t.Damage}</span>
                        {f(log.damageDone)}
                    </>
                )}
            </>
        )
    else
        content = (
            <>
                {log.source}
                {IconsData[log.iconId]}
                {log.text !== undefined && t[log.text]}
            </>
        )

    return (
        <div className="grid grid-flow-col items-center justify-start gap-2">
            <span className="text-muted-foreground">{date}</span>
            {content}
        </div>
    )
})
