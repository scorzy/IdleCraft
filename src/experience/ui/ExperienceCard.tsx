import { memo } from 'react'
import { ExpData, ExpEnum } from '../expEnum'
import { Card } from '../../components/ui/card'
import { useGameStore } from '../../game/state'
import { selectExp, selectLevel, selectLevelExp, selectNextExp } from '../expSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { Badge } from '../../components/ui/badge'

import styles from './ExperienceCard.module.css'
import { useTranslations } from '../../msg/useTranslations'

export const ExperienceCard = memo(function ExperienceCard(props: { expType: ExpEnum }) {
    const { expType } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()

    const level = useGameStore(selectLevel(expType))
    const xp = useGameStore(selectExp(expType))
    const levelXp = useGameStore(selectLevelExp(expType))
    const nextLevelXp = useGameStore(selectNextExp(expType))

    const percent = Math.floor((100 * (xp - levelXp)) / (nextLevelXp - levelXp))
    const expData = ExpData[expType]

    return (
        <Card className={`text-sm ${styles.info}`}>
            <div>
                {t[expData.nameId]} <Badge>{f(level)}</Badge>
            </div>
            <div>
                {t.XP}
                <Badge variant={'secondary'}>
                    {f(xp)}/{f(nextLevelXp)}
                </Badge>
            </div>
            <ProgressBar className={styles.progress} value={percent} color={'info'} />
        </Card>
    )
})
