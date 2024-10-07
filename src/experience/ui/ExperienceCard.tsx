import { memo } from 'react'
import { ExpData, ExpEnum } from '../expEnum'
import { useGameStore } from '../../game/state'
import { selectExp, selectLevel, selectLevelExp, selectNextExp } from '../expSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { Badge } from '../../components/ui/badge'
import { useTranslations } from '../../msg/useTranslations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

export const ExperienceCard = memo(function ExperienceCard(props: { expType: ExpEnum; charId: string }) {
    const { expType, charId } = props
    const { t } = useTranslations()

    const level = useGameStore(selectLevel(expType, charId))
    const xp = useGameStore(selectExp(expType, charId))
    const levelXp = useGameStore(selectLevelExp(expType, charId))
    const nextLevelXp = useGameStore(selectNextExp(expType, charId))

    const expData = ExpData[expType]

    return (
        <ExperienceCardUi title={t[expData.nameId]} level={level} xp={xp} levelXp={levelXp} nextLevelXp={nextLevelXp} />
    )
})
export const ExperienceCardUi = memo(function ExperienceCardUi(props: {
    title: string
    level: number
    xp: number
    levelXp: number
    nextLevelXp: number
}) {
    const { title, level, xp, nextLevelXp, levelXp } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const percent = Math.floor((100 * (xp - levelXp)) / (nextLevelXp - levelXp))

    return (
        <Card>
            <CardHeader>
                <CardTitle className="gap-y-0">
                    {title}
                    <Badge className="w-min text-sm font-medium" size={'xs'}>
                        {f(level)}
                    </Badge>
                </CardTitle>
                <CardDescription>
                    {t.XP} {f(xp)} / {f(nextLevelXp)}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
                <ProgressBar value={percent} key={title} color="primary" />
            </CardContent>
        </Card>
    )
})
