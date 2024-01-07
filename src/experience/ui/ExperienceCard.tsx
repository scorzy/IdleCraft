import { memo } from 'react'
import { ExpData, ExpEnum } from '../expEnum'
import { useGameStore } from '../../game/state'
import { selectExp, selectLevel, selectLevelExp, selectNextExp } from '../expSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { Badge } from '../../components/ui/badge'
import { useTranslations } from '../../msg/useTranslations'
import { Card, CardContent, CardDescription } from '../../components/ui/card'
import styles from './ExperienceCard.module.css'

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
        <Card className={styles.container}>
            <CardContent>
                <span className="font-medium text-sm">
                    {t[expData.nameId]}
                    <Badge className="w-min font-medium text-sm">{f(level)}</Badge>
                </span>
                <CardDescription className="text-sm">
                    {t.XP}
                    <Badge variant="secondary" className="text-sm">
                        {f(xp)}/{f(nextLevelXp)}
                    </Badge>
                </CardDescription>
                <ProgressBar value={percent} key={expType} color="primary" />
            </CardContent>
        </Card>
    )
})
