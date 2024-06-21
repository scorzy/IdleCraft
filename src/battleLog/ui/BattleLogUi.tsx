import { memo } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { TbList } from 'react-icons/tb'
import { Card, CardContent } from '../../components/ui/card'
import { useGameStore } from '../../game/state'
import { selectBattleLog, selectBattleLogsIds } from '../battleLogSelectors'
import { IconsData } from '../../icons/Icons'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { useTranslations } from '../../msg/useTranslations'

const LIST_ICON = <TbList />
export const BattleLogUi = memo(function BattleLogUi() {
    const { t } = useTranslations()
    return (
        <Card>
            <MyCardHeaderTitle title={t.Log} icon={LIST_ICON} />
            <CardContent>
                <BattleLogs />
            </CardContent>
        </Card>
    )
})
const BattleLogs = memo(function BattleLogs() {
    const ids = useGameStore(selectBattleLogsIds)

    return (
        <div className="h-60 overflow-auto text-sm">
            <ScrollableFeed>
                {ids.map((id) => (
                    <LogUi id={id} key={id} />
                ))}
            </ScrollableFeed>
        </div>
    )
})
const LogUi = memo(function LogUi(props: { id: string }) {
    const { id } = props
    const log = useGameStore(selectBattleLog(id))
    const { t } = useTranslations()

    const date = new Date(log.date).toLocaleTimeString()

    return (
        <div className="grid grid-flow-col items-center justify-start gap-2">
            <span className="text-muted-foreground">{date}</span>
            {log.source}
            {IconsData[log.iconId]}
            {t[log.abilityId]}
            {' => '}
            {log.targets}
        </div>
    )
})
