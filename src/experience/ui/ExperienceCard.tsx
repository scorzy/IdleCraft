import { memo } from 'react'
import { ExpData, ExpEnum } from '../expEnum'
import { useGameStore } from '../../game/state'
import { selectExp, selectLevel, selectLevelExp, selectNextExp } from '../expSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { Badge } from '../../components/ui/badge'
import { useTranslations } from '../../msg/useTranslations'
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
        <div>
            <div className={`font-medium text-sm ${styles.title}`}>
                {t[expData.nameId]}
                <Badge className="w-min font-medium text-sm">{f(level)}</Badge>
            </div>
            <div>
                {t.XP} {f(xp)}/{f(nextLevelXp)}
            </div>
            <ProgressBar value={percent} key={expType} color="primary" />
        </div>
        // <Card className={styles.container}>
        //     <CardContent>
        //         <div className={`font-medium text-sm ${styles.title}`}>
        //             {t[expData.nameId]}
        //             <Badge className="w-min font-medium text-sm">{f(level)}</Badge>
        //         </div>
        //         <CardDescription className={`text-sm ${styles.title}`}>
        //             {t.XP} {f(xp)}/{f(nextLevelXp)}
        //         </CardDescription>
        //         <ProgressBar value={percent} key={expType} color="primary" />
        //     </CardContent>
        // </Card>
    )
})
